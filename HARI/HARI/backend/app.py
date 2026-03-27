from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import os
from datetime import datetime
import joblib

# Optional Twilio integration for SMS/WhatsApp notifications (buyer/seller)
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_FROM_PHONE = os.getenv("TWILIO_FROM_PHONE")
TWILIO_WHATSAPP_FROM = os.getenv("TWILIO_WHATSAPP_FROM")  # e.g. whatsapp:+14155238886
if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    try:
        from twilio.rest import Client
        twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    except Exception:
        twilio_client = None
else:
    twilio_client = None

app = Flask(__name__)
CORS(app)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URI)
db = client["car_price_db"]
users_col = db["users"]
predictions_col = db["predictions"]
listings_col = db["listings"]
sell_cars_col = db["sell_cars"]
buy_requests_col = db["buy_requests"]

MODEL_PATH = os.path.join(os.path.dirname(__file__), "car_price_model.pkl")

BRANDS = ["Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Toyota", "Honda", "Kia", "Volkswagen", "Ford"]
MODELS = ["Swift", "Brezza", "Creta", "Nexon", "Innova", "City", "Ertiga", "Grand i10", "Polo", "Figo"]
CONDITIONS = ["excellent", "good", "average", "poor"]
FUELS = ["Petrol", "Diesel", "CNG", "Electric"]


def create_training_data(n=400):
    rows = []
    for i in range(n):
        brand = BRANDS[i % len(BRANDS)]
        model = MODELS[i % len(MODELS)]
        year = 2010 + (i % 13)
        mileage = 5000 + ((i * 17) % 180000)
        condition = CONDITIONS[(i // 5) % len(CONDITIONS)]
        fuel = FUELS[(i // 4) % len(FUELS)]

        base = 300000
        age = 2026 - year
        age_factor = max(0.4, 1 - age * 0.05)

        condition_factor = {
            "excellent": 1.15,
            "good": 1.0,
            "average": 0.85,
            "poor": 0.7
        }[condition]

        fuel_factor = {
            "Petrol": 1.0,
            "Diesel": 1.05,
            "CNG": 0.95,
            "Electric": 1.2
        }[fuel]

        brand_factor = {
            "Maruti Suzuki": 1.0,
            "Hyundai": 1.02,
            "Tata": 0.93,
            "Mahindra": 0.98,
            "Toyota": 1.12,
            "Honda": 1.08,
            "Kia": 1.1,
            "Volkswagen": 1.05,
            "Ford": 0.97
        }[brand]

        model_premium = {
            "Swift": 1.0,
            "Brezza": 1.12,
            "Creta": 1.18,
            "Nexon": 1.03,
            "Innova": 1.35,
            "City": 1.15,
            "Ertiga": 1.02,
            "Grand i10": 0.96,
            "Polo": 0.98,
            "Figo": 0.94
        }[model]

        price = base * age_factor * condition_factor * fuel_factor * brand_factor * model_premium
        price -= (mileage / 1000) * 450
        price = max(price, 50000)
        noise = ((i % 7) - 3) * 1100
        price = max(50000, int(price + noise))

        rows.append({
            "brand": brand,
            "model": model,
            "year": year,
            "mileage": mileage,
            "condition": condition,
            "fuelType": fuel,
            "price": price,
        })

    return pd.DataFrame(rows)


def train_model():
    data = create_training_data()

    X = data[["brand", "model", "year", "mileage", "condition", "fuelType"]]
    y = data["price"]

    categorical_features = ["brand", "model", "condition", "fuelType"]
    numeric_features = ["year", "mileage"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(sparse_output=False, handle_unknown="ignore"), categorical_features),
        ],
        remainder="passthrough",
    )

    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("model", RandomForestRegressor(n_estimators=150, random_state=42, n_jobs=-1)),
    ])

    pipeline.fit(X, y)
    joblib.dump(pipeline, MODEL_PATH)
    return pipeline


if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    model = train_model()


@app.route("/api/predict", methods=["POST"])
def api_predict():
    body = request.get_json(force=True)
    required = ["brand", "model", "year", "mileage", "condition", "fuelType"]
    for key in required:
        if key not in body:
            return jsonify({"error": f"Missing {key}"}), 400

    try:
        input_df = pd.DataFrame([{key: body[key] for key in required}])
        prediction = float(model.predict(input_df)[0])
        prediction = round(max(50000, prediction))

        predictions_col.insert_one({
            "brand": body.get("brand"),
            "model": body.get("model"),
            "year": int(body.get("year")),
            "mileage": int(body.get("mileage")),
            "condition": body.get("condition"),
            "fuelType": body.get("fuelType"),
            "predicted_price": prediction,
            "input_data": body,
            "timestamp": datetime.utcnow(),
            "user_agent": request.headers.get("User-Agent", ""),
            "ip_address": request.remote_addr,
            "model_version": "1.0",  # Can be updated when model changes
        })

        return jsonify({"predicted_price": prediction})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/listings", methods=["GET"])
def get_listings():
    try:
        # load from both listings and sell_cars for compatibility
        listings_raw = list(listings_col.find({}))
        sell_raw = list(sell_cars_col.find({}))
        all_raw = listings_raw + sell_raw

        listings = []
        for l in all_raw:
            item = {
                "id": str(l.get("_id")),
                "brand": l.get("brand"),
                "model": l.get("model"),
                "year": l.get("year"),
                "mileage": l.get("mileage"),
                "condition": l.get("condition"),
                "fuelType": l.get("fuelType"),
                "price": l.get("price"),
                "description": l.get("description"),
                "features": l.get("features", []),
                "name": l.get("name"),
                "phone": l.get("phone"),
                "location": l.get("location"),
            }
            listings.append(item)
        return jsonify({"listings": listings})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/listings", methods=["POST"])
def api_listings():
    body = request.get_json(force=True)
    if not body.get("brand") or not body.get("model") or not body.get("price"):
        return jsonify({"error": "brand, model and price are required"}), 400

    listing = {
        "brand": body.get("brand"),
        "model": body.get("model"),
        "year": int(body.get("year", 0)) if body.get("year") is not None else None,
        "mileage": int(body.get("mileage", 0)) if body.get("mileage") is not None else None,
        "condition": body.get("condition"),
        "fuelType": body.get("fuelType"),
        "price": body.get("price"),
        "description": body.get("description", ""),
        "features": body.get("features", []),
        "name": body.get("name"),
        "phone": body.get("phone"),
        "location": body.get("location"),
    }
    result = listings_col.insert_one(listing)

    # Also keep sell car collection in sync for your Compass view
    sell_cars_col.insert_one(listing)

    listing["_id"] = str(result.inserted_id)  # Convert ObjectId to string
    return jsonify({"status": "OK", "listing": listing})


@app.route("/api/sell_cars", methods=["GET"])
def api_sell_cars():
    try:
        sell_raw = list(sell_cars_col.find({}))
        sell_list = [{
            "id": str(s.get("_id")),
            "brand": s.get("brand"),
            "model": s.get("model"),
            "year": s.get("year"),
            "mileage": s.get("mileage"),
            "condition": s.get("condition"),
            "fuelType": s.get("fuelType"),
            "price": s.get("price"),
            "description": s.get("description"),
            "features": s.get("features", []),
            "name": s.get("name"),
            "phone": s.get("phone"),
            "location": s.get("location"),
        } for s in sell_raw]
        return jsonify({"sell_cars": sell_list})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


def send_sms(to_phone, message):
    if not twilio_client or not TWILIO_FROM_PHONE:
        print(f"[SMS] Twilio not configured. Would send to {to_phone}: {message}")
        return False
    try:
        twilio_client.messages.create(
            body=message,
            from_=TWILIO_FROM_PHONE,
            to=to_phone,
        )
        return True
    except Exception as exc:
        print(f"[SMS] Failed to send to {to_phone}: {exc}")
        return False


def send_whatsapp(to_phone, message):
    if not twilio_client or not TWILIO_WHATSAPP_FROM:
        print(f"[WhatsApp] Twilio not configured. Would send to {to_phone}: {message}")
        return False
    try:
        twilio_client.messages.create(
            body=message,
            from_=TWILIO_WHATSAPP_FROM,
            to=f"whatsapp:{to_phone.lstrip('+')}"
        )
        return True
    except Exception as exc:
        print(f"[WhatsApp] Failed to send to {to_phone}: {exc}")
        return False


@app.route("/api/buy_requests", methods=["POST"])
def api_buy_requests():
    body = request.get_json(force=True)
    if not body.get("listing_id") or not body.get("name") or not body.get("email") or not body.get("phone"):
        return jsonify({"error": "listing_id, name, email, and phone are required"}), 400

    buy_request = {
        "listing_id": body.get("listing_id"),
        "listing": body.get("listing", {}),
        "name": body.get("name"),
        "email": body.get("email"),
        "phone": body.get("phone"),
        "message": body.get("message", ""),
        "requested_at": datetime.utcnow(),
    }
    buy_requests_col.insert_one(buy_request)

    seller_phone = buy_request.get("listing", {}).get("phone")
    buyer_phone = buy_request.get("phone")
    car_info = f"{buy_request.get('listing', {}).get('brand', '')} {buy_request.get('listing', {}).get('model', '')}"
    seller_msg = f"New buy request for {car_info} from {buy_request['name']} ({buy_request['phone']}). Message: {buy_request['message']}."
    buyer_msg = f"Your request for {car_info} has been sent to the seller. Seller will contact you soon."

    seller_sms_sent = False
    buyer_sms_sent = False
    seller_whatsapp_sent = False
    buyer_whatsapp_sent = False

    if seller_phone:
        seller_sms_sent = send_sms(seller_phone, seller_msg)
        seller_whatsapp_sent = send_whatsapp(seller_phone, seller_msg)
    if buyer_phone:
        buyer_sms_sent = send_sms(buyer_phone, buyer_msg)
        buyer_whatsapp_sent = send_whatsapp(buyer_phone, buyer_msg)

    return jsonify({
        "status": "buy request saved",
        "seller_sms_sent": seller_sms_sent,
        "buyer_sms_sent": buyer_sms_sent,
        "seller_whatsapp_sent": seller_whatsapp_sent,
        "buyer_whatsapp_sent": buyer_whatsapp_sent,
        "message": "Use TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN/TWILIO_FROM_PHONE/TWILIO_WHATSAPP_FROM env vars to enable real SMS/WhatsApp delivery."
    }), 201


@app.route("/api/buy_requests", methods=["GET"])
def api_get_buy_requests():
    try:
        requests_list = list(buy_requests_col.find({}, {"_id": 0}))
        return jsonify({"buy_requests": requests_list})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/contact", methods=["POST"])
def api_contact():
    body = request.get_json(force=True)
    if not body.get("name") or not body.get("email") or not body.get("message"):
        return jsonify({"error": "name, email, and message are required"}), 400

    db["contacts"].insert_one({
        "name": body.get("name"),
        "email": body.get("email"),
        "phone": body.get("phone", ""),
        "message": body.get("message"),
    })

    return jsonify({"status": "OK"})


@app.route("/api/retrain", methods=["POST"])
def api_retrain():
    try:
        # Get all listings from DB
        listings = list(listings_col.find({}, {"_id": 0}))
        
        if len(listings) < 10:
            return jsonify({"error": "Need at least 10 listings to retrain model"}), 400
        
        # Convert to training format
        train_data = []
        for listing in listings:
            # Use listing price as target, assume some reasonable features
            # In real app, you'd have more detailed data
            train_data.append({
                "brand": listing.get("brand", "Unknown"),
                "model": listing.get("model", "Unknown"),
                "year": 2020,  # Default, in real app collect this
                "mileage": 50000,  # Default
                "condition": "good",  # Default
                "fuelType": "Petrol",  # Default
                "price": listing["price"]
            })
        
        df = pd.DataFrame(train_data)
        
        X = df[["brand", "model", "year", "mileage", "condition", "fuelType"]]
        y = df["price"]
        
        # Retrain model
        global model
        model = train_model()  # Retrain with synthetic data + real listings
        
        return jsonify({"status": "Model retrained successfully", "samples": len(listings)})
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/model_stats", methods=["GET"])
def api_model_stats():
    try:
        total_listings = listings_col.count_documents({})
        total_predictions = predictions_col.count_documents({})
        return jsonify({
            "total_listings": total_listings,
            "total_predictions": total_predictions,
            "model_trained": True
        })
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/register", methods=["POST"])
def api_register():
    body = request.get_json(force=True)
    username = body.get("username")
    password = body.get("password")

    if not username or not password:
        return jsonify({"error": "username and password required"}), 400

    if users_col.find_one({"username": username}):
        return jsonify({"error": "username already exists"}), 400

    users_col.insert_one({
        "username": username,
        "password": generate_password_hash(password),
    })

    return jsonify({"status": "registered"}), 201


@app.route("/api/login", methods=["POST"])
def api_login():
    body = request.get_json(force=True)
    username = body.get("username")
    password = body.get("password")
    user = users_col.find_one({"username": username})
    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "invalid credentials"}), 401

    return jsonify({"status": "authenticated"})


@app.route("/api/predictions/stats", methods=["GET"])
def get_prediction_stats():
    try:
        predictions = list(predictions_col.find({}, {"_id": 0}))

        if not predictions:
            return jsonify({"message": "No predictions found"})

        # Calculate statistics
        total_predictions = len(predictions)
        avg_price = sum(p.get("predicted_price", 0) for p in predictions) / total_predictions

        # Brand distribution
        brand_counts = {}
        for p in predictions:
            brand = p.get("brand") or p.get("input", {}).get("brand", "Unknown")
            brand_counts[brand] = brand_counts.get(brand, 0) + 1

        # Fuel type distribution
        fuel_counts = {}
        for p in predictions:
            fuel = p.get("fuelType") or p.get("input", {}).get("fuelType", "Unknown")
            fuel_counts[fuel] = fuel_counts.get(fuel, 0) + 1

        # Condition distribution
        condition_counts = {}
        for p in predictions:
            condition = p.get("condition") or p.get("input", {}).get("condition", "Unknown")
            condition_counts[condition] = condition_counts.get(condition, 0) + 1

        # Price ranges
        price_ranges = {
            "Under ₹1L": 0,
            "₹1L - ₹5L": 0,
            "₹5L - ₹10L": 0,
            "₹10L - ₹20L": 0,
            "Above ₹20L": 0
        }

        for p in predictions:
            price = p.get("predicted_price", 0)
            if price < 100000:
                price_ranges["Under ₹1L"] += 1
            elif price < 500000:
                price_ranges["₹1L - ₹5L"] += 1
            elif price < 1000000:
                price_ranges["₹5L - ₹10L"] += 1
            elif price < 2000000:
                price_ranges["₹10L - ₹20L"] += 1
            else:
                price_ranges["Above ₹20L"] += 1

        return jsonify({
            "total_predictions": total_predictions,
            "average_predicted_price": round(avg_price, 2),
            "brand_distribution": brand_counts,
            "fuel_type_distribution": fuel_counts,
            "condition_distribution": condition_counts,
            "price_range_distribution": price_ranges,
            "most_recent_prediction": predictions[0] if predictions else None
        })
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
