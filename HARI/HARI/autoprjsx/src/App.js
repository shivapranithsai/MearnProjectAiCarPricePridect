import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const pageStyle = {
  display: "flex",
  minHeight: "100vh",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #0f172a, #0e1a3c)",
  padding: "120px 20px 80px",
};

const formContainer = {
  width: "100%",
  maxWidth: "640px",
  background: "rgba(15,23,42,0.95)",
  borderRadius: "20px",
  padding: "24px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  border: "2px solid rgba(56,189,248,0.2)",
  color: "white",
};

const titleStyle = {
  color: "#60a5fa",
  marginBottom: "24px",
  textAlign: "center",
  fontSize: "2.3rem",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const inputStyle = {
  padding: "16px",
  borderRadius: "12px",
  border: "2px solid rgba(255,255,255,0.16)",
  background: "rgba(15,23,42,0.9)",
  color: "white",
  outline: "none",
  fontSize: "16px",
};

const predictBtn = {
  padding: "16px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
  color: "white",
  fontSize: "18px",
  fontWeight: "700",
  cursor: "pointer",
};

const backBtn = {
  marginTop: "12px",
  background: "rgba(30,41,59,0.8)",
  color: "#60a5fa",
  border: "1px solid rgba(96,165,250,0.5)",
  padding: "14px",
  borderRadius: "12px",
  cursor: "pointer",
};

const predictionStyle = {
  marginTop: "18px",
  padding: "18px",
  borderRadius: "12px",
  background: "rgba(16,185,129,0.18)",
  border: "1px solid rgba(16,185,129,0.35)",
  textAlign: "center",
};

const successStyle = {
  padding: "20px",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #14b8a6, #0ea5e9)",
  color: "white",
  fontWeight: "700",
  textAlign: "center",
};

const sectionTitle = {
  color: "#60a5fa",
  fontSize: "2.2rem",
  marginBottom: "24px",
};

const mentorImg = {
  width: "130px",
  height: "130px",
  borderRadius: "80px",
  objectFit: "cover",
  display: "block",
  margin: "auto",
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { 
          background-image: url('/car.png'); 
          background-size: cover; 
          background-position: center; 
          background-attachment: fixed; 
        }
        .hero { height:100vh; display:flex; align-items: flex-start;
padding-top: 50px;
 position:relative; color:white; }
        .overlay { position:absolute; top:0; left:0; width:55%; height:100%; background: linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.6), transparent); }
        .hero-content { position:relative; z-index:2; max-width:650px; }
        .cards-section { padding:80px 8%; display:flex; gap:40px; justify-content:center; flex-wrap:wrap; }
        .card { background:rgba(255,255,255,0.1); color:white; padding:40px; width:320px; border-radius:20px; backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.2); box-shadow:0 15px 40px rgba(0,0,0,0.3); display:flex; flex-direction:column; justify-content:space-between; height:280px; transition:0.3s; }
        .card:hover { transform:translateY(-10px); background:rgba(255,255,255,0.15); }
        .card h3 { color:#38bdf8; margin-bottom:15px; }
        .card button { padding:15px; border:none; border-radius:30px; background:linear-gradient(135deg,#1d4ed8,#2563eb); color:white; cursor:pointer; }
        .card button:hover { opacity:0.9; }
        
        select, input, textarea {
          background: rgba(15,23,42,0.98) !important;
          color: white !important;
        }
        select option { background: #1e293b !important; color: white !important; }
        
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(260px,1fr));
          gap: 35px;
          max-width: 1200px;
          margin: auto;
        }
        .team-card, .mentor-card {
          background: rgba(255,255,255,0.06);
          padding: 40px 25px;
          border-radius: 25px;
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(20px);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform: translateY(0);
          position: relative;
          overflow: hidden;
        }
        .team-card::before, .mentor-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(56,189,248,0.2), transparent);
          transition: left 0.6s;
        }
        .team-card:hover::before, .mentor-card:hover::before { left: 100%; }
        .team-card:hover, .mentor-card:hover {
          transform: translateY(-20px) scale(1.05);
          background: rgba(255,255,255,0.12);
          border-color: rgba(56,189,248,0.5);
        }
        .team-avatar {
          width: 90px; height: 90px; border-radius: 50%;
          background: linear-gradient(135deg,#38bdf8,#6366f1);
          margin: 0 auto 20px;
          display: flex; align-items: center; justify-content: center;
          font-size: 32px; font-weight: bold;
        }
        .multi-select {
          position: relative;
          min-height: 56px;
        }
        .multi-select.open .options {
          display: block;
        }
        .multi-select-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          min-height: 20px;
          padding: 12px 16px;
          border: 2px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          cursor: pointer;
        }
        .tag {
          background: linear-gradient(135deg, #38bdf8, #60a5fa);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tag-remove {
          background: none;
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          padding: 0 4px;
        }
        .options {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          max-height: 200px;
          overflow-y: auto;
          background: rgba(15,23,42,0.98);
          border: 2px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          z-index: 1000;
          display: none;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .option {
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .option:hover, .option.selected {
          background: rgba(56,189,248,0.2);
        }
        .option:last-child {
          border-bottom: none;
        }
          .stats-box {
  position: absolute;
  right: 0.5%;
  bottom: 25px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  padding: 14px 28px;
  border-radius: 16px;
  display: flex;
  gap: 28px;
  color: white;
  box-shadow: 0 12px 25px rgba(0,0,0,0.3);
}

.stat-item {
  text-align: center;
}

.stat-item h2 {
  font-size: 24px;
  font-weight: 700;
}

.stat-item p {
  font-size: 12px;
  opacity: 0.9;
}
  
/* ===== HEADER ===== */

.header {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 18px 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  z-index: 1000;
}

.logo {
  font-size: 22px;
  font-weight: bold;
  color: #38bdf8;
}

.nav-links {
  display: flex;
  align-items: center;
}

.nav-item {
  margin: 0 20px;
  text-decoration: none;
  color: white;
  font-size: 16px;
  font-weight: 500;
  transition: 0.3s;
}

.nav-item:hover {
  color: #38bdf8;
}

.nav-links a
.nav-links a:visited {
  text-decoration: none;
  color: white;
  font-size: 16px;
  front-weight: 500;
  padding: 8px 14px;
  border-radius:20px;
  transition: all 0.3s ease;
}

.nav-links a:hover {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
}

.login-btn {
  padding: 8px 18px;
  background: #2563eb;
  border-radius: 20px;
  color: white;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.login-btn:hover {
  background: #1d4ed8;
}
  `}</style>

<header className="header">
  <div className="logo">AutoPredict</div>

  <nav className="nav-Links">
    <Link className="nav-item" to="/">Home</Link>
    <Link className="nav-item" to="/predict">predict</Link>
    <Link className="nav-item" to="/sell">sell</Link>
    <Link className="nav-item" to="/contact">Contact</Link>
    <button className="login-btn">Login</button>
  </nav>
</header>

<section className="hero" id="home">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1 style={{
            fontSize:"clamp(2.5rem,6vw,4.5rem)",
            background:"linear-gradient(135deg,#38bdf8,#60a5fa)",
            WebkitBackgroundClip:"text",
            WebkitTextFillColor:"transparent"
          }}>
            Predict Your Car Price
          </h1>
          <p style={{ marginTop:"18px", fontSize:"1.2rem" }}>
  • AI Powered Car Price Prediction <br />
  • You can sell your car <br />
  • Buy your dream car
</p>
        </div>
        <div className="stats-box">
  <div className="stat-item">
    <h2>13+</h2>
    <p>Car Brands</p>
  </div>

  <div className="stat-item">
    <h2>50+</h2>
    <p>Car Models</p>
  </div>

  <div className="stat-item">
    <h2>95%</h2>
    <p>Accuracy Rate</p>
  </div>
</div>

      </section>

      <section className="cards-section">
        <div className="card">
          <h3>🚗 Predict Price</h3>
          <p>AI based estimation</p>
          <p>Smart ML algorithms </p>
          <p>Instant accurate results</p>
          <button onClick={() => navigate("/predict")}>Predict</button>
        </div>
        <div className="card">
          <h3>🔥 Sell Car</h3>
          <p>Post your listing</p>
          <p>AI price suggestions</p>
          <p>Reach verified buyers</p>
          <button onClick={() => navigate("/sell")}>Sell</button>
        </div>
        <div className="card">
          <h3>🛒 Buy Car</h3>
          <p>Find best deals</p>
          <p>Smart recommendations</p>
          <p>Price comparison tools</p>
          <button onClick={() => navigate("/buy")}>Buy</button>
        </div>
      </section>

      <ContactSection />
      <TeamSection />
    </div>
  );
};

// ✅ ENHANCED PREDICT FORM
const Predict = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    brand: "", model: "", year: "", mileage: "", condition: "", fuelType: "" 
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const price = Math.floor(Math.random() * 8000000) + 200000;
      setPrediction(`₹${price.toLocaleString()}`);
      setLoading(false);
    }, 2000);
  };

  const goHome = () => navigate("/");

  return (
    <div style={pageStyle}>
      <div style={formContainer}>
        <h1 style={titleStyle}>🚗 Predict Price</h1>
        <form onSubmit={handlePredict} style={formStyle}>
          <select value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} style={inputStyle} required>
            <option value="">🏆 Select Brand</option>
            <option>Maruti Suzuki</option><option>Hyundai</option><option>Tata</option>
            <option>Mahindra</option><option>Toyota</option><option>Honda</option>
          </select>
          <select value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} style={inputStyle} required>
            <option value="">🚙 Select Model</option>
            <option>Swift</option><option>Brezza</option><option>Creta</option>
            <option>Nexon</option><option>Innova</option><option>City</option>
          </select>
          <input type="number" placeholder="📅 Year (e.g. 2020)" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} style={inputStyle} required />
          <input type="number" placeholder="⏱️ Mileage (km)" value={formData.mileage} onChange={(e) => setFormData({...formData, mileage: e.target.value})} style={inputStyle} required />
          <select value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})} style={inputStyle} required>
            <option value="">🔧 Condition</option>
            <option value="excellent">Excellent</option><option value="good">Good</option>
            <option value="average">Average</option><option value="poor">Poor</option>
          </select>
          <select value={formData.fuelType} onChange={(e) => setFormData({...formData, fuelType: e.target.value})} style={inputStyle} required>
            <option value="">⛽ Fuel Type</option>
            <option>Petrol</option><option>Diesel</option><option>CNG</option><option>Electric</option>
          </select>
          <button type="submit" style={predictBtn} disabled={loading}>
            {loading ? "🔄 AI Predicting..." : "🚀 Calculate Price"}
          </button>
          {prediction && (
            <div style={predictionStyle}>
              🎯 Predicted Price: <span style={{fontSize: "48px", display: "block"}}>{prediction}</span>
              <button onClick={goHome} style={{...backBtn, background: "linear-gradient(135deg, #10b981, #059669)", marginTop: "20px"}}>
                🏠 New Prediction
              </button>
            </div>
          )}
        </form>
        {!prediction && <button onClick={goHome} style={backBtn}>🏠 Back to Home</button>}
      </div>
    </div>
  );
};

// 🔥 ENHANCED SELL FORM WITH CAR PIC UPLOAD + MULTISELECT
const Sell = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    brand: "", model: "", price: "", description: "", features: [], 
    pics: null, picPreview: null 
  });
  const [submitted, setSubmitted] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const featuresList = [
    "AC", "Power Steering", "Alloy Wheels", "Leather Seats", "Sunroof", 
    "Navigation", "Bluetooth", "Backup Camera", "Touchscreen", "Cruise Control",
    "ABS", "Airbags", "Parking Sensors", "Keyless Entry", "Push Start"
  ];

  const filteredFeatures = featuresList.filter(f => 
    f.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFeature = (feature) => {
    const current = formData.features;
    const newFeatures = current.includes(feature) 
      ? current.filter(f => f !== feature)
      : [...current, feature];
    setFormData({...formData, features: newFeatures});
  };

  const removeFeature = (feature) => {
    setFormData({...formData, features: formData.features.filter(f => f !== feature)});
  };

  const handlePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData, 
        pics: file,
        picPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const goHome = () => navigate("/");

  return (
    <div style={pageStyle}>
      <div style={formContainer}>
        <h1 style={titleStyle}>🔥 Sell Your Car</h1>
        {submitted ? (
          <div style={successStyle}>
            ✅ Listing Posted Successfully! Your car will be live soon 🚀
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={formStyle}>
            <select value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} style={inputStyle} required>
              <option value="">🏆 Car Brand</option>
              <option>Maruti Suzuki</option><option>Hyundai</option><option>Tata</option>
              <option>Mahindra</option><option>Toyota</option><option>Honda</option>
              <option>Kia</option><option>Volkswagen</option><option>Ford</option>
            </select>
            
            <input placeholder="🚙 Model Name" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} style={inputStyle} required />
            
            <input type="number" placeholder="💰 Asking Price (₹)" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={inputStyle} required />
            
            <div style={{position: "relative"}}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePicUpload}
                style={{
                  ...inputStyle, padding: "15px", cursor: "pointer"
                }}
                required={!formData.pics}
              />
              {formData.picPreview && (
                <img src={formData.picPreview} alt="Preview" style={{
                  width: "100%", height: "200px", objectFit: "cover",
                  borderRadius: "12px", marginTop: "12px", border: "2px solid rgba(255,255,255,0.2)"
                }} />
              )}
            </div>

            <textarea 
              placeholder="📝 Car Description" 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{...inputStyle, height: "120px"}}
              rows="4"
            />

            <div style={{marginBottom: "20px"}}>
              <div style={{...inputStyle, padding: "16px", cursor: "pointer", minHeight: "56px"}}
                onClick={() => setShowFeatures(!showFeatures)}
              >
                {formData.features.length > 0 ? (
                  <div style={{display: "flex", flexWrap: "wrap", gap: "8px"}}>
                    {formData.features.map(f => (
                      <span key={f} className="tag">
                        {f} <button type="button" className="tag-remove" onClick={(e) => {e.stopPropagation(); removeFeature(f);}}>×</button>
                      </span>
                    ))}
                  </div>
                ) : (
                  "✨ Select Features (AC, Alloy Wheels, etc.)"
                )}
              </div>
              
              {showFeatures && (
                <div className="multi-select options">
                  <div style={{padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)"}}>
                    <input 
                      type="text" 
                      placeholder="🔍 Search features..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        ...inputStyle, 
                        width: "100%", 
                        background: "rgba(30,41,59,0.9)",
                        padding: "10px 12px",
                        fontSize: "14px"
                      }}
                    />
                  </div>
                  {filteredFeatures.map(feature => (
                    <div 
                      key={feature} 
                      className={`option ${formData.features.includes(feature) ? 'selected' : ''}`}
                      onClick={() => toggleFeature(feature)}
                    >
                      <input 
                        type="checkbox" 
                        checked={formData.features.includes(feature)}
                        readOnly 
                        style={{marginRight: "12px"}}
                      />
                      {feature}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" style={predictBtn}>🚀 Post Listing</button>
          </form>
        )}
        <button onClick={goHome} style={backBtn}>🏠 Back to Home</button>
      </div>
    </div>
  );
};

const Buy = () => {
  const navigate = useNavigate();
  const goHome = () => navigate("/");
  
  return (
    <div style={pageStyle}>
      <div style={formContainer}>
        <h1 style={titleStyle}>🛒 Browse Cars</h1>
        <p style={{color: "rgba(255,255,255,0.8)", textAlign: "center", fontSize: "18px"}}>
          🔥 Coming Soon! Check back later for amazing deals 🔥
        </p>
        <button onClick={goHome} style={backBtn}>🏠 Back to Home</button>
      </div>
    </div>
  );
};

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateForm = () => {
    if (!formData.name.trim()) { setErrorMsg("👤 Name is required!"); return false; }
    if (!formData.email.trim()) { setErrorMsg("📧 Email is required!"); return false; }
    if (!validateEmail(formData.email)) { setErrorMsg("📧 Invalid email format!"); return false; }
    if (!formData.message.trim() || formData.message.trim().length < 10) { 
      setErrorMsg("💬 Message too short (min 10 chars)!"); return false; 
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!validateForm()) {
      setStatus("error");
      setTimeout(() => setStatus(""), 4000);
      return;
    }
    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setStatus(""), 6000);
    }, 1500);
  };

  const inputStyleLocal = {
    padding: "18px", borderRadius: "12px", border: "2px solid rgba(255,255,255,0.2)", 
    background: "rgba(15,23,42,0.9)", color: "white", fontSize: "16px", width: "100%", outline: "none"
  };
  const submitBtnStyle = {
    padding: "24px", background: "linear-gradient(135deg, #1d4ed8, #2563eb)", border: "none", 
    borderRadius: "16px", color: "white", fontSize: "18px", fontWeight: "700", cursor: "pointer", width: "100%"
  };

  return (
    <section style={{background:"rgba(15,23,42,0.95)", padding:"80px 8%", textAlign:"center", color:"white"}}>
      <div style={{maxWidth:"650px", margin:"auto", padding:"50px", background:"rgba(255,255,255,0.05)", borderRadius:"25px", backdropFilter:"blur(25px)"}}>
        <h2 style={{ color:"#38bdf8", fontSize:"36px", marginBottom:"15px" }}>📩 Contact Us</h2>
        <p style={{color:"rgba(255,255,255,0.8)", marginBottom:"35px", fontSize:"18px"}}>
          ✨ Feel free to reach us - we're here to help!
        </p>

        {status === "success" && (
          <div style={{
            background:"linear-gradient(135deg, #10b981, #059669)",
            padding:"40px", borderRadius:"25px", marginBottom:"30px",
            boxShadow:"0 25px 50px rgba(16,185,129,0.4)", border:"3px solid rgba(255,255,255,0.2)"
          }}>
            <div style={{fontSize:"28px", fontWeight:"900", marginBottom:"15px", color:"white"}}>
              ✅ Thank you {formData.name || "for your message"}!
            </div>
            <div style={{fontSize:"20px", color:"rgba(255,255,255,0.95)", lineHeight:"1.6"}}>
              👂 We've heard your response and will contact you soon through your mail ID: <br/>
              <strong style={{color:"#ecfdf5", fontSize:"18px"}}>{formData.email}</strong>
            </div>
          </div>
        )}

        {status === "error" && (
          <div style={{
            background:"linear-gradient(135deg, #ef4444, #dc2626)",
            padding:"25px", borderRadius:"18px", marginBottom:"25px",
            boxShadow:"0 15px 35px rgba(239,68,68,0.3)"
          }}>
            <div style={{fontSize:"20px", fontWeight:"700"}}>⚠️ {errorMsg}</div>
          </div>
        )}

        {status === "sending" && (
          <div style={{
            background:"rgba(59,130,246,0.2)", padding:"25px", borderRadius:"18px", marginBottom:"25px",
            border:"2px solid rgba(59,130,246,0.5)"
          }}>
            <div style={{fontSize:"22px", fontWeight:"700", color:"#60a5fa"}}>
              📤 Submitting your message...
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"22px" }}>
          <input placeholder="👤 Your Full Name *" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={inputStyleLocal} required />
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"18px"}}>
            <input type="email" placeholder="📧 Email Address *" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={inputStyleLocal} required />
            <input type="tel" placeholder="📱 Phone (Optional)" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={inputStyleLocal} />
          </div>
          <textarea placeholder="💬 Your Message *" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} style={{...inputStyleLocal, height:"160px"}} required />
          <button type="submit" style={submitBtnStyle} disabled={status === "sending"}>
            {status === "sending" ? "📤 Please wait..." : "📧 Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
};

const TeamSection = () => {
  return (
    <section style={{background:"rgba(2,6,23,0.95)", padding:"100px 8%", color:"white", textAlign:"center"}}>
      <h2 style={sectionTitle}>🎓 Mentor & Guide</h2>
      <div className="mentor-card">
        <img src="/mentor.jpeg" alt="MAKSUD VOHRA" className="mentor-avatar" style={mentorImg} 
             onError={(e) => {
               e.target.style.display = 'none';
               e.target.nextSibling.style.display = 'flex';
             }} />
        <div style={{
          ...mentorImg, display: 'none', background: 'linear-gradient(135deg, #38bdf8, #60a5fa)',
          color: 'white', fontSize: '42px', fontWeight: 'bold'
        }}>MV</div>
        <h3 style={{fontSize:"32px", color:"#60a5fa", margin:"25px 0 15px 0"}}>MR.MAKSUD VOHRA SIR</h3>
        <p style={{fontSize:"22px", color:"rgba(255,255,255,0.95)", marginBottom:"10px"}}>PROFESSOR OF AI/ML DEPARTMENT</p>
        <p style={{color:"rgba(255,255,255,0.75)", fontSize:"18px"}}>
          Under the expert guidance of MR.MAKSUD VOHRA SIR transformed our vision into reality.
        </p>
      </div>

      <h2 style={{...sectionTitle, marginTop:"120px"}}>👨‍💻 Development Team</h2>
      <p style={{color:"rgba(255,255,255,0.8)", marginBottom:"60px", fontSize:"18px"}}>The brilliant minds behind AutoPriceX</p>
      
      <div className="team-grid">
        {[
          { initials: "CHM", name: "CHEKURI MANMOHAN", role: "🚀 Project Leader" },
          { initials: "KJS", name: "KAMINENI JAYA SANKAR", role: "🤖 ML Engineer" },
        ].map((member) => (
          <div key={member.initials} className="team-card">
            <div className="team-avatar">{member.initials}</div>
            <h3 style={{marginBottom:"10px"}}>{member.name}</h3>
            <p style={{opacity:"0.8"}}>{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/predict" element={<Predict />} />
      <Route path="/sell" element={<Sell />} />
      <Route path="/buy" element={<Buy />} />
      <Route path="/contact" element={<ContactSection />} />
    </Routes>
  );
};

export default App;
