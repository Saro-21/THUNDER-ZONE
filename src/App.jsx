import React, { useState, useEffect, useReducer } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  ShoppingBag, ShoppingCart, User, TrendingUp, BarChart3, 
  PieChart as PieIcon, DollarSign, AlertCircle, Trash2, Plus, 
  Minus, Search, LogOut, MapPin, Phone, CreditCard, 
  ArrowRight, ArrowLeft, CheckCircle2, Sun, Moon, Star, 
  ShieldAlert, Smartphone, Laptop, ChevronRight, Sparkles, 
  Package, Box, Eye, Send, Percent, Tag, EyeOff, Volume2, VolumeX, Edit, Trash, Settings
} from 'lucide-react';

const COLORS = {
  primary: '#FFB800',
  primaryDark: '#FFA500',
  bg: '#06080c',
  surface: '#11141b',
  border: 'rgba(255,255,255,0.06)',
  emerald: '#00E676',
  rose: '#FF1744',
  sky: '#00E5FF',
  white: '#FFFFFF',
  warning: '#FFC400',
  textMuted: '#9CA3AF'
};

const API_URL = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? 'http://localhost:5000/api'
  : `${window.location.origin}/api`;

// ═════════════════════════════════════════════════════════════════
// USER DATABASE
// ═════════════════════════════════════════════════════════════════
const USERS_DB = [
  {id:1, email:'admin@thunderzone.in', password:'admin123', role:'admin', name:'Admin Thunder', avatar:'⚡'},
  {id:2, email:'user@thunderzone.in', password:'user123', role:'user', name:'Priya Sharma', avatar:'👩'},
  {id:3, email:'customer@thunderzone.in', password:'cust123', role:'user', name:'Rahul Gupta', avatar:'👨'},
];

// ═════════════════════════════════════════════════════════════════
// PRODUCTS DATABASE (Stateful default values)
// ═════════════════════════════════════════════════════════════════
const PRODUCTS_DB = [
  {id:1, name:'Gaming Laptop VICTUS 13"', brand:'HP', cat:'Electronics', price:89999, orig:129999, img:'💻', color:'rgba(212, 175, 55, 0.15)', stock:5, desc:'Intel i7, RTX 4060, 16GB RAM, 512GB SSD. Perfect for casual and hardcore gaming with sleek cooling.', rating:4.8, reviews:245},
  {id:2, name:'Realme P4R 8000mAh', brand:'Realme', cat:'Mobiles', price:24999, orig:34999, img:'📱', color:'rgba(0, 229, 255, 0.15)', stock:15, desc:'256GB, 6.67" AMOLED, Fast charging. Huge battery capacity to keep you connected all day.', rating:4.6, reviews:1230},
  {id:3, name:'Premium Sunglasses UV400', brand:'Ray-Ban', cat:'Fashion', price:8999, orig:12999, img:'🕶️', color:'rgba(245, 222, 179, 0.15)', stock:20, desc:'Classic frames, 100% UV protection. Made with polarized lenses and premium acetate frames.', rating:4.7, reviews:567},
  {id:4, name:'ASUS Aspire 7 Gaming', brand:'ASUS', cat:'Electronics', price:79999, orig:119999, img:'💻', color:'rgba(255, 184, 0, 0.15)', stock:3, desc:'Ryzen 7, RTX 3050, 16GB, 512GB SSD. Lightning-fast response rate with narrow-bezel display.', rating:4.9, reviews:892},
  {id:5, name:'iPhone 15 Pro Max', brand:'Apple', cat:'Mobiles', price:119999, orig:139999, img:'📱', color:'rgba(0, 229, 255, 0.15)', stock:8, desc:'256GB, A17 Pro, Titanium design. Features the advanced 5x Telephoto camera and Action button.', rating:4.9, reviews:5420},
  {id:6, name:'Sony WH-1000XM5', brand:'Sony', cat:'Electronics', price:24999, orig:34999, img:'🎧', color:'rgba(255, 23, 68, 0.15)', stock:12, desc:'Industry leading noise cancellation, 30hr battery. Equipped with two processors controlling 8 microphones.', rating:4.8, reviews:3210},
  {id:7, name:'Nike Air Max 90', brand:'Nike', cat:'Fashion', price:7999, orig:12999, img:'👟', color:'rgba(255, 255, 255, 0.15)', stock:25, desc:'White/Black, All sizes available. Iconic Max Air cushioning in the heel for comfort.', rating:4.7, reviews:2134},
  {id:8, name:'Samsung Galaxy S25', brand:'Samsung', cat:'Mobiles', price:99999, orig:124999, img:'📱', color:'rgba(0, 229, 255, 0.15)', stock:10, desc:'256GB, Snapdragon 8, Dynamic AMOLED. Galaxy AI powered photography and supreme multitasking.', rating:4.8, reviews:4560},
];

// ═════════════════════════════════════════════════════════════════
// ORDERS DATABASE (Enriched with historical records for analytics)
// ═════════════════════════════════════════════════════════════════
const ORDERS_DB = [
  {id:'TZ001', userId:2, date:'2026-06-01', status:'Delivered', total:89999, items:[{pid:1, name:'Gaming Laptop VICTUS 13"', qty:1, price:89999}], address:'HSR Layout, Bangalore', phone:'9876543210', payment:'upi', tracking:'TRK-123456'},
  {id:'TZ002', userId:2, date:'2026-06-05', status:'Shipped', total:7999, items:[{pid:7, name:'Nike Air Max 90', qty:1, price:7999}], address:'HSR Layout, Bangalore', phone:'9876543210', payment:'card', tracking:'TRK-789012'},
  {id:'TZ003', userId:3, date:'2026-06-08', status:'Processing', total:24999, items:[{pid:6, name:'Sony WH-1000XM5', qty:1, price:24999}], address:'Powai, Mumbai', phone:'9123456789', payment:'upi', tracking:'TRK-345678'},
  {id:'TZ004', userId:2, date:'2026-06-10', status:'Delivered', total:24999, items:[{pid:2, name:'Realme P4R 8000mAh', qty:1, price:24999}], address:'HSR Layout, Bangalore', phone:'9876543210', payment:'cod', tracking:'TRK-987654'},
  {id:'TZ005', userId:3, date:'2026-06-12', status:'Delivered', total:119999, items:[{pid:5, name:'iPhone 15 Pro Max', qty:1, price:119999}], address:'Powai, Mumbai', phone:'9123456789', payment:'card', tracking:'TRK-654321'},
  {id:'TZ006', userId:2, date:'2026-06-13', status:'Delivered', total:8999, items:[{pid:3, name:'Premium Sunglasses UV400', qty:1, price:8999}], address:'HSR Layout, Bangalore', phone:'9876543210', payment:'netbanking', tracking:'TRK-456123'}
];

// WEB AUDIO SYNTHESIZER (SFX Module)
let audioCtx = null;
function playSFX(type, isMuted) {
  if (isMuted) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    
    if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'cart') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(330, now + 0.08);
      osc.frequency.setValueAtTime(440, now + 0.16);
      osc.frequency.setValueAtTime(660, now + 0.24);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.linearRampToValueAtTime(0.005, now + 0.32);
      osc.start(now);
      osc.stop(now + 0.32);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'thunder') {
      // Noise wave simulation for crackling lightning sound
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(800, now + 0.15);
      osc.frequency.linearRampToValueAtTime(150, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch (e) {
    console.warn("Audio Context init error or sound trigger skipped:", e);
  }
}

// ═════════════════════════════════════════════════════════════════
// CART REDUCER
// ═════════════════════════════════════════════════════════════════
function cartReducer(state, action) {
  switch(action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.product.id);
      return existing 
        ? state.map(i => i.id === action.product.id ? {...i, qty: Math.min(i.qty + (action.qty || 1), i.stock)} : i) 
        : [...state, {...action.product, qty: action.qty || 1}];
    }
    case 'REMOVE': return state.filter(i => i.id !== action.id);
    case 'QTY': return state.map(i => i.id === action.id ? {...i, qty: action.qty} : i).filter(i => i.qty > 0);
    case 'CLEAR': return [];
    default: return state;
  }
}

// ═════════════════════════════════════════════════════════════════
// TOAST
// ═════════════════════════════════════════════════════════════════
function Toast({msg, onClose}) {
  useEffect(() => { 
    const t = setTimeout(onClose, 2500); 
    return () => clearTimeout(t); 
  }, [onClose]);

  return (
    <div className="glass-panel-elevated animate-slide-in-right" style={{
      position:'fixed', bottom: 90, right: 20, zIndex: 999, 
      borderLeft: '4px solid var(--accent-primary)',
      color: 'var(--text-primary)', padding: '16px 20px', borderRadius: 'var(--border-radius-sm)', 
      fontSize: 14, fontWeight: 600, boxShadow: 'var(--shadow-lg)',
      display: 'flex', alignItems: 'center', gap: 10
    }}>
      <Sparkles size={16} className="animate-thunder" style={{color: 'var(--accent-primary)'}}/>
      <span>{msg}</span>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═════════════════════════════════════════════════════════════════
function LoginPage({onLogin, isMuted}) {
  const [email, setEmail] = useState('user@thunderzone.in');
  const [pw, setPw] = useState('user123');
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState('');
  
  const handleSubmit = () => {
    if(!email || !pw) { 
      setErr('Please fill in all fields'); 
      playSFX('error', isMuted);
      return; 
    }
    fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pw })
    })
    .then(res => {
      if (!res.ok) throw new Error('Invalid credentials');
      return res.json();
    })
    .then(user => {
      playSFX('success', isMuted);
      onLogin(user);
    })
    .catch(err => {
      setErr('Invalid credentials. Try demo accounts below.');
      playSFX('error', isMuted);
    });
  };

  return (
    <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20, background: 'radial-gradient(circle at center, #11141b 0%, #06080c 100%)'}}>
      <div className="glass-panel animate-fade-in" style={{width:'100%', maxWidth:420, borderRadius:'var(--border-radius-md)', padding:'40px 30px', boxShadow: 'var(--shadow-lg)'}}>
        <div style={{textAlign:'center', marginBottom:32}}>
          <div className="animate-thunder" style={{fontSize:64, marginBottom:8, filter: 'drop-shadow(0 0 10px rgba(255, 184, 0, 0.4))'}}>⚡</div>
          <h1 style={{fontSize:30, fontWeight:900, color:'var(--accent-primary)', textShadow: '0 0 15px rgba(255, 184, 0, 0.25)', marginBottom:8}}>THUNDER ZONE</h1>
          <p style={{color:'var(--text-secondary)', fontSize:14}}>Lightning Fast Cyber Shopping</p>
        </div>

        <div style={{marginBottom:18}}>
          <label style={{fontSize:11, fontWeight:800, color:'var(--text-secondary)', display:'block', marginBottom:8, letterSpacing: '0.05em'}}>EMAIL ADDRESS</label>
          <div style={{position: 'relative'}}>
            <input value={email} onChange={e => {setEmail(e.target.value); setErr('');}} className="custom-input" style={{paddingLeft: 40}} placeholder="name@domain.com"/>
            <User size={16} style={{position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)'}}/>
          </div>
        </div>
        
        <div style={{marginBottom:24}}>
          <label style={{fontSize:11, fontWeight:800, color:'var(--text-secondary)', display:'block', marginBottom:8, letterSpacing: '0.05em'}}>PASSWORD</label>
          <div style={{position: 'relative'}}>
            <input value={pw} onChange={e => {setPw(e.target.value); setErr('');}} type={showPw ? 'text' : 'password'} onKeyDown={e => e.key==='Enter' && handleSubmit()} className="custom-input" style={{paddingLeft: 40, paddingRight: 40}} placeholder="••••••••"/>
            <ShieldAlert size={16} style={{position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)'}}/>
            <button type="button" onClick={() => setShowPw(!showPw)} style={{position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)'}}>
              {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>
        </div>

        {err && (
          <div style={{color:'var(--accent-rose)', background: 'rgba(255, 23, 68, 0.1)', border: '1px solid rgba(255, 23, 68, 0.2)', fontSize:13, padding: '10px 14px', borderRadius: 'var(--border-radius-sm)', marginBottom:16, textAlign:'center', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center'}}>
            <AlertCircle size={15}/>
            <span>{err}</span>
          </div>
        )}

        <button onClick={handleSubmit} className="btn-primary" style={{width:'100%', padding: 14, fontSize: 15}}>
          <Sparkles size={16}/>
          <span>ENTER DOCK</span>
        </button>

        <div style={{marginTop:28, paddingTop:20, borderTop:`1px solid var(--border-color)`}}>
          <div style={{fontSize:11, fontWeight:800, color:'var(--text-secondary)', textTransform:'uppercase', marginBottom:12, textAlign:'center', letterSpacing: '0.05em'}}>QUICK DEMO LOGINS</div>
          <div style={{display: 'flex', gap: 10}}>
            {[{role:'Admin', e:'admin@thunderzone.in', p:'admin123'}, {role:'User', e:'user@thunderzone.in', p:'user123'}].map(a => (
              <button key={a.role} onClick={() => {setEmail(a.e); setPw(a.p); setErr(''); playSFX('click', isMuted);}} className="btn-secondary" style={{flex: 1, padding:'10px 6px', fontSize:11, borderRadius: 'var(--border-radius-sm)'}}>
                <span>⚡ {a.role}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// HEADER
// ═════════════════════════════════════════════════════════════════
function Header({search, setSearch, user, theme, toggleTheme, isMuted, toggleMute}) {
  return (
    <header className="glass-panel" style={{position:'sticky', top:0, zIndex:100, borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0}}>
      <div className="page-container" style={{paddingTop: 12, paddingBottom: 12}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <span className="animate-thunder" style={{fontSize:26, filter: 'drop-shadow(0 0 5px rgba(255,184,0,0.5))'}}>⚡</span>
            <span style={{fontSize:18, fontWeight:900, fontFamily:'Space Grotesk', letterSpacing: '-0.03em', background: 'linear-gradient(90deg, #fff 0%, var(--accent-primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>THUNDER ZONE</span>
          </div>
          
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            {/* Audio Toggle */}
            <button onClick={() => { toggleMute(); playSFX('click', !isMuted); }} className="btn-secondary" style={{padding: 0, borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {isMuted ? <VolumeX size={16} style={{color: 'var(--text-tertiary)'}}/> : <Volume2 size={16} style={{color: 'var(--accent-primary)'}}/>}
            </button>
            {/* Theme Toggle */}
            <button onClick={() => { toggleTheme(); playSFX('click', isMuted); }} className="btn-secondary" style={{padding: 0, borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {theme === 'dark' ? <Sun size={16} style={{color: 'var(--accent-primary)'}}/> : <Moon size={16} style={{color: 'var(--text-primary)'}}/>}
            </button>
            <span style={{fontSize:11, fontWeight:800, color:'#000', background:'var(--accent-primary)', padding:'4px 10px', borderRadius:20, boxShadow: 'var(--glow-shadow)'}}>{user.role.toUpperCase()}</span>
          </div>
        </div>

        <div style={{position: 'relative'}}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search lightning products..." className="custom-input" style={{paddingLeft: 44, borderRadius: 24}}/>
          <Search size={16} style={{position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}}/>
        </div>
      </div>
    </header>
  );
}

// ═════════════════════════════════════════════════════════════════
// COUPON BANNER
// ═════════════════════════════════════════════════════════════════
function CouponBanner({isMuted}) {
  return (
    <div className="page-container" style={{paddingTop: 16, paddingBottom: 0}}>
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, rgba(255, 184, 0, 0.08) 0%, rgba(0, 229, 255, 0.05) 100%)',
        borderRadius:'var(--border-radius-md)', padding:'20px 24px', display:'flex', justifyContent: 'space-between', alignItems:'center', gap: 16,
        border: '1px dashed rgba(255, 184, 0, 0.25)', overflow: 'hidden', position: 'relative'
      }}>
        <div style={{position: 'absolute', top: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255, 184, 0, 0.05)', filter: 'blur(20px)'}}></div>
        <div style={{position: 'absolute', bottom: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(0, 229, 255, 0.05)', filter: 'blur(35px)'}}></div>

        <div style={{zIndex: 1}}>
          <div style={{fontSize: 22, fontWeight: 900, color:'var(--accent-primary)', fontFamily:'Space Grotesk'}}>Cyber Offer!</div>
          <div style={{fontSize: 13, color:'var(--text-secondary)', marginTop: 4}}>Apply voucher code <strong style={{color:'var(--text-primary)'}}>THUNDER10</strong> (10% Off) or <strong style={{color:'var(--text-primary)'}}>SUPER50</strong> (50% Off!) in checkout.</div>
        </div>

        <div className="glass-panel animate-pulse-neon" style={{
          background: 'rgba(0, 229, 255, 0.1)', color:'var(--accent-secondary)', padding:'10px 16px', borderRadius:'var(--border-radius-sm)', textAlign:'center',
          border: '1px solid rgba(0, 229, 255, 0.2)', minWidth: 120, zIndex: 1
        }}>
          <div style={{fontSize:11, fontWeight:800, textTransform: 'uppercase', letterSpacing: '0.05em'}}>Cyber Savings</div>
          <div style={{fontSize:22, fontWeight:900, margin: '2px 0'}}>Vouchers</div>
          <div style={{fontSize:10, fontWeight:700, color:'var(--text-secondary)'}}>Live Now</div>
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// PRODUCT GRID (with Filters and Sorting)
// ═════════════════════════════════════════════════════════════════
function ProductGrid({products, search, onAddCart, onViewProduct, isMuted}) {
  const [selectedCat, setSelectedCat] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const categories = ['All', 'Electronics', 'Mobiles', 'Fashion'];

  // 1. Filter
  let filtered = products;
  if(selectedCat !== 'All') {
    filtered = filtered.filter(p => p.cat === selectedCat);
  }
  if(search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));
  }

  // 2. Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured (default order)
  });

  return (
    <div className="page-container" style={{paddingBottom: 120}}>
      {/* Filters & Sorting row */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10}}>
          <h2 style={{fontSize:18, fontWeight:800, color:'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8}}>
            <Box size={20} style={{color: 'var(--accent-primary)'}}/>
            <span>Catalog Ledger ({filtered.length})</span>
          </h2>
          
          <div>
            <select value={sortBy} onChange={e => { setSortBy(e.target.value); playSFX('click', isMuted); }} className="custom-select">
              <option value="featured">⚡ Sorting: Featured</option>
              <option value="price-low">📉 Price: Low to High</option>
              <option value="price-high">📈 Price: High to Low</option>
              <option value="rating">⭐ Rating: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-filter-container">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => { setSelectedCat(cat); playSFX('click', isMuted); }} 
              className={`category-pill ${selectedCat === cat ? 'active' : ''}`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel animate-fade-in" style={{textAlign: 'center', padding: '60px 20px', borderRadius: 'var(--border-radius-md)'}}>
          <ShieldAlert size={48} style={{color: 'var(--accent-rose)', marginBottom: 16}}/>
          <h3 style={{fontSize:18, marginBottom:8}}>No matching items found</h3>
          <p style={{color: 'var(--text-secondary)', fontSize: 14}}>Check spelling or clear search filters.</p>
        </div>
      ) : (
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:16}}>
          {filtered.map(p => (
            <div key={p.id} onClick={() => { onViewProduct(p); playSFX('click', isMuted); }} className="glass-panel interactive-card animate-fade-in" style={{display: 'flex', flexDirection: 'column', height: '100%', cursor:'pointer'}}>
              <div style={{background: p.color, height:140, display:'flex', alignItems:'center', justifyContent:'center', fontSize:64, borderBottom: '1px solid var(--border-color)', transition: 'var(--transition-smooth)'}}>
                <span style={{display: 'inline-block'}}>{p.img}</span>
              </div>
              <div style={{padding:14, display: 'flex', flexDirection: 'column', flex: 1}}>
                <div style={{fontSize:10, fontWeight:800, color:'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom:4}}>{p.brand}</div>
                <div style={{fontSize:13, fontWeight:700, color:'var(--text-primary)', marginBottom:8, lineHeight:1.3, minHeight:34, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{p.name}</div>
                
                <div style={{display:'flex', alignItems: 'center', gap:4, marginBottom:12, fontSize:11, color:'var(--accent-warning)'}}>
                  <Star size={11} fill="currentColor"/>
                  <span style={{fontWeight: 700, color: 'var(--text-primary)'}}>{p.rating}</span>
                  <span style={{color: 'var(--text-tertiary)'}}>({p.reviews})</span>
                </div>

                <div style={{marginTop: 'auto'}}>
                  <div style={{display:'flex', alignItems: 'baseline', gap:6, marginBottom:12}}>
                    <span style={{fontWeight:900, fontSize:16, color:'var(--accent-primary)'}}>₹{p.price.toLocaleString()}</span>
                    {p.orig > p.price && (
                      <span style={{textDecoration:'line-through', color:'var(--text-tertiary)', fontSize:11}}>₹{p.orig.toLocaleString()}</span>
                    )}
                  </div>
                  
                  {p.stock > 0 ? (
                    <button onClick={e => { e.stopPropagation(); playSFX('cart', isMuted); onAddCart(p); }} className="btn-primary" style={{width:'100%', padding: '10px 12px', fontSize:12, gap: 4, borderRadius: 'var(--border-radius-sm)'}}>
                      <ShoppingCart size={13}/>
                      <span>ADD TO CART</span>
                    </button>
                  ) : (
                    <button disabled className="btn-primary" style={{width:'100%', padding: '10px 12px', fontSize:12, gap: 4, borderRadius: 'var(--border-radius-sm)', background: 'var(--text-tertiary)', color: 'var(--text-secondary)'}}>
                      <AlertCircle size={13}/>
                      <span>SOLD OUT</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// PRODUCT DETAIL MODAL (with Specs/Reviews tab switcher)
// ═════════════════════════════════════════════════════════════════
function ProductDetailModal({product, onClose, onAddCart, isMuted}) {
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('overview'); // overview | specs | reviews
  if(!product) return null;

  const discount = product.orig > product.price ? Math.round(((product.orig - product.price) / product.orig) * 100) : 0;

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(3, 4, 7, 0.75)', backdropFilter: 'blur(8px)', zIndex:500, display:'flex', alignItems:'flex-end', justifyContent: 'center'}} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="glass-panel-elevated animate-slide-up" style={{
        width:'100%', maxWidth:520, borderRadius:'20px 20px 0 0', padding:'24px 20px', maxHeight:'92vh', overflowY:'auto', borderBottom: 'none'
      }}>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: -10}}>
          <button onClick={() => { onClose(); playSFX('click', isMuted); }} style={{background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 24, cursor: 'pointer', padding: 4}}>×</button>
        </div>

        <div style={{textAlign:'center', marginBottom:18}}>
          <div style={{fontSize:84, background:product.color, borderRadius:'var(--border-radius-md)', padding:'24px 0', border: '1px solid var(--border-color)', display: 'inline-flex', width: '100%', justifyContent: 'center', position: 'relative'}}>
            {product.img}
            {discount > 0 && (
              <span style={{position: 'absolute', top: 12, right: 12, background: 'var(--accent-rose)', color: '#fff', fontSize: 10, fontWeight: 900, padding: '4px 8px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 3}}>
                <Percent size={10}/>
                <span>{discount}% OFF</span>
              </span>
            )}
          </div>
        </div>

        <div style={{fontSize:11, color:'var(--accent-primary)', fontWeight:800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom:4}}>{product.brand}</div>
        <h2 style={{fontSize:20, fontWeight:800, color:'var(--text-primary)', marginBottom:12}}>{product.name}</h2>
        
        {/* Navigation Tabs inside detail sheet */}
        <div style={{display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: 16}}>
          {[
            {id: 'overview', label: 'Overview'},
            {id: 'specs', label: 'Tech Specs'},
            {id: 'reviews', label: 'Reviews'}
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => { setActiveTab(tab.id); playSFX('click', isMuted); }}
              style={{
                flex: 1, padding: '10px 4px', background: 'none', border: 'none', 
                color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'var(--transition-smooth)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content renders based on selection */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in" style={{minHeight: 120}}>
            <p style={{color:'var(--text-secondary)', fontSize:13, lineHeight:1.5, marginBottom:16}}>{product.desc}</p>
            <div style={{display:'flex', alignItems: 'baseline', gap:8, marginBottom:16}}>
              <span style={{fontWeight:900, fontSize:24, color:'var(--accent-primary)'}}>₹{product.price.toLocaleString()}</span>
              {product.orig > product.price && (
                <span style={{textDecoration:'line-through', color:'var(--text-tertiary)', fontSize:14}}>₹{product.orig.toLocaleString()}</span>
              )}
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="animate-fade-in" style={{minHeight: 120, fontSize: 12, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16}}>
            <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: 6}}>
              <span style={{color: 'var(--text-secondary)'}}>Manufacturer</span>
              <strong style={{color: 'var(--text-primary)'}}>{product.brand}</strong>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: 6}}>
              <span style={{color: 'var(--text-secondary)'}}>Category Type</span>
              <strong style={{color: 'var(--text-primary)'}}>{product.cat}</strong>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: 6}}>
              <span style={{color: 'var(--text-secondary)'}}>System Core</span>
              <strong style={{color: 'var(--text-primary)'}}>{product.cat === 'Electronics' ? 'x86_64 High-Performance' : 'ARM Mobile Engine'}</strong>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span style={{color: 'var(--text-secondary)'}}>Shipment Weight</span>
              <strong style={{color: 'var(--text-primary)'}}>Express Package (Secured)</strong>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="animate-fade-in" style={{minHeight: 120, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 6}}>
              <div style={{fontSize: 20}}>⭐</div>
              <div>
                <div style={{fontSize: 12, fontWeight: 700}}>Highly Recommended!</div>
                <div style={{fontSize: 10, color: 'var(--text-secondary)'}}>Priya S. • Verified buyer</div>
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 6}}>
              <div style={{fontSize: 20}}>🚀</div>
              <div>
                <div style={{fontSize: 12, fontWeight: 700}}>Lightning fast shipping is real.</div>
                <div style={{fontSize: 10, color: 'var(--text-secondary)'}}>Rahul G. • Verified buyer</div>
              </div>
            </div>
          </div>
        )}

        <div style={{background:'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', padding:12, borderRadius:'var(--border-radius-sm)', marginBottom:16, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <div style={{fontSize:12, fontWeight:700, color:'var(--text-primary)'}}>Ledger Status</div>
            <div style={{fontSize:11, color:'var(--text-secondary)', marginTop: 2}}>Direct dispatch active</div>
          </div>
          <span style={{
            fontSize:11, fontWeight:800, padding: '4px 10px', borderRadius: 20,
            background: product.stock > 5 ? 'rgba(0, 230, 118, 0.1)' : product.stock > 0 ? 'rgba(255, 184, 0, 0.1)' : 'rgba(255, 23, 68, 0.1)',
            color: product.stock > 5 ? 'var(--accent-emerald)' : product.stock > 0 ? 'var(--accent-warning)' : 'var(--accent-rose)'
          }}>
            📦 {product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}
          </span>
        </div>

        {product.stock > 0 ? (
          <>
            <div style={{marginBottom:20}}>
              <label style={{fontSize:11, fontWeight:800, color:'var(--text-secondary)', display:'block', marginBottom:8, textTransform: 'uppercase', letterSpacing: '0.05em'}}>Purchase Quantity</label>
              <div style={{display:'flex', gap:12, alignItems: 'center'}}>
                <div style={{display:'flex', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', overflow: 'hidden'}}>
                  <button onClick={() => { setQty(Math.max(1, qty-1)); playSFX('click', isMuted); }} className="btn-secondary" style={{width:40, height:40, border:'none', borderRadius: 0, fontSize: 18}}>−</button>
                  <span style={{width: 44, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700}}>{qty}</span>
                  <button onClick={() => { setQty(Math.min(product.stock, qty+1)); playSFX('click', isMuted); }} className="btn-secondary" style={{width:40, height:40, border:'none', borderRadius: 0, fontSize: 18}}>+</button>
                </div>
                <div style={{fontSize: 11, color: 'var(--text-tertiary)'}}>
                  Purchase limit: {product.stock} items
                </div>
              </div>
            </div>

            <div style={{display: 'flex', gap: 12}}>
              <button onClick={() => { onClose(); playSFX('click', isMuted); }} className="btn-secondary" style={{flex: 1, padding: 12}}>CANCEL</button>
              <button onClick={() => { playSFX('cart', isMuted); onAddCart(product, qty); onClose(); }} className="btn-primary" style={{flex: 2, padding: 12}}>
                <ShoppingCart size={16}/>
                <span>ADD TO CART</span>
              </button>
            </div>
          </>
        ) : (
          <button onClick={onClose} className="btn-secondary" style={{width: '100%', padding: 12}}>BACK TO CATALOG</button>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// HOME PAGE
// ═════════════════════════════════════════════════════════════════
function HomePage({products, search, setSearch, user, onAddCart, onViewProduct, theme, toggleTheme, isMuted, toggleMute}) {
  return (
    <div className="cyber-grid">
      <Header search={search} setSearch={setSearch} user={user} theme={theme} toggleTheme={toggleTheme} isMuted={isMuted} toggleMute={toggleMute}/>
      <CouponBanner isMuted={isMuted}/>
      <ProductGrid products={products} search={search} onAddCart={onAddCart} onViewProduct={onViewProduct} isMuted={isMuted}/>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// CHECKOUT MODAL
// ═════════════════════════════════════════════════════════════════
function CheckoutModal({cart, total, discountPercent, onClose, onConfirm, isMuted}) {
  const [step, setStep] = useState(1);
  const [addr, setAddr] = useState('HSR Layout, Sector 3, Bangalore');
  const [phone, setPhone] = useState('9876543210');
  const [payment, setPayment] = useState('upi');

  const discountAmount = Math.round(total * (discountPercent / 100));
  const finalTotal = total - discountAmount;

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(3, 4, 7, 0.75)', backdropFilter: 'blur(8px)', zIndex:600, display:'flex', alignItems:'center', justifyContent:'center', padding:20}} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="glass-panel-elevated animate-fade-in" style={{
        borderRadius:'var(--border-radius-md)', padding:28, maxWidth:480, width:'100%', maxHeight:'90vh', overflowY:'auto', position: 'relative'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
          <h2 style={{fontSize:20, fontWeight:800, color:'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8}}>
            <Sparkles size={20} className="animate-thunder" style={{color: 'var(--accent-primary)'}}/>
            <span>Thunder Checkout</span>
          </h2>
          <div style={{fontSize:12, fontWeight:700, color: 'var(--text-secondary)'}}>
            Step {step} of 3
          </div>
        </div>

        {/* Progress bar */}
        <div style={{height: 4, background: 'var(--border-color)', borderRadius: 2, marginBottom: 24, overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${(step / 3) * 100}%`, background: 'var(--accent-primary)', transition: 'var(--transition-smooth)'}}></div>
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <div style={{marginBottom:20}}>
              <label style={{fontSize:11, fontWeight:800, color:'var(--text-secondary)', display:'block', marginBottom:8, letterSpacing: '0.05em'}}>SHIPPING ADDRESS</label>
              <div style={{position: 'relative', marginBottom: 16}}>
                <input value={addr} onChange={e => setAddr(e.target.value)} placeholder="Full street address, City, ZIP" className="custom-input" style={{paddingLeft: 40}}/>
                <MapPin size={16} style={{position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)'}}/>
              </div>
              
              <label style={{fontSize:11, fontWeight:800, color:'var(--text-secondary)', display:'block', marginBottom:8, letterSpacing: '0.05em'}}>PHONE NUMBER</label>
              <div style={{position: 'relative'}}>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit mobile number" className="custom-input" style={{paddingLeft: 40}} type="tel"/>
                <Phone size={16} style={{position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)'}}/>
              </div>
            </div>
            
            <div style={{display: 'flex', gap: 12}}>
              <button onClick={() => { onClose(); playSFX('click', isMuted); }} className="btn-secondary" style={{flex: 1}}>CANCEL</button>
              <button onClick={() => { setStep(2); playSFX('click', isMuted); }} disabled={!addr || !phone} className="btn-primary" style={{flex: 2}}>
                <span>PROCEED</span>
                <ArrowRight size={16}/>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div style={{marginBottom:24}}>
              <label style={{fontSize:11, fontWeight:800, color:'var(--text-secondary)', display:'block', marginBottom:12, letterSpacing: '0.05em'}}>PAYMENT GATEWAY</label>
              <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                {[
                  {key: 'upi', icon: <Smartphone size={18}/>, label: 'UPI / GooglePay / PhonePe'},
                  {key: 'card', icon: <CreditCard size={18}/>, label: 'Credit or Debit Card'},
                  {key: 'cod', icon: <DollarSign size={18}/>, label: 'Cash on Delivery (COD)'}
                ].map(m => (
                  <button key={m.key} onClick={() => { setPayment(m.key); playSFX('click', isMuted); }} className="glass-panel" style={{
                    width:'100%', padding:'14px 16px', display: 'flex', alignItems: 'center', gap: 12,
                    background: payment === m.key ? 'rgba(255, 184, 0, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                    borderColor: payment === m.key ? 'var(--accent-primary)' : 'var(--border-color)',
                    color: payment === m.key ? 'var(--text-primary)' : 'var(--text-secondary)',
                    borderRadius: 'var(--border-radius-sm)', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                    transition: 'var(--transition-smooth)'
                  }}>
                    <div style={{color: payment === m.key ? 'var(--accent-primary)' : 'inherit'}}>{m.icon}</div>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{display:'flex', gap:12}}>
              <button onClick={() => { setStep(1); playSFX('click', isMuted); }} className="btn-secondary" style={{flex:1}}>
                <ArrowLeft size={16}/>
                <span>BACK</span>
              </button>
              <button onClick={() => { setStep(3); playSFX('click', isMuted); }} className="btn-primary" style={{flex:2}}>
                <span>SUMMARY</span>
                <ArrowRight size={16}/>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <div className="glass-panel" style={{background: 'rgba(255,255,255,0.01)', padding:16, borderRadius:'var(--border-radius-sm)', marginBottom:20}}>
              <div style={{display: 'flex', gap: 10, marginBottom: 12}}>
                <MapPin size={16} style={{color: 'var(--accent-primary)', flexShrink: 0, marginTop: 2}}/>
                <div style={{fontSize:13}}><span style={{color: 'var(--text-secondary)'}}>Deliver to:</span><br/><strong style={{color: 'var(--text-primary)'}}>{addr}</strong></div>
              </div>
              <div style={{display: 'flex', gap: 10, marginBottom: 12}}>
                <Phone size={16} style={{color: 'var(--accent-primary)'}}/>
                <div style={{fontSize:13}}><span style={{color: 'var(--text-secondary)'}}>Phone:</span> <strong style={{color: 'var(--text-primary)'}}>{phone}</strong></div>
              </div>
              <div style={{display: 'flex', gap: 10}}>
                <CreditCard size={16} style={{color: 'var(--accent-primary)'}}/>
                <div style={{fontSize:13}}><span style={{color: 'var(--text-secondary)'}}>Method:</span> <strong style={{color: 'var(--text-primary)', textTransform: 'uppercase'}}>{payment}</strong></div>
              </div>
            </div>

            <div className="glass-panel" style={{padding: 16, borderRadius: 'var(--border-radius-sm)', marginBottom: 20}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:13, color: 'var(--text-secondary)'}}>
                <span>Cart Subtotal</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              {discountPercent > 0 && (
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:13, color: 'var(--accent-emerald)'}}>
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span>- ₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:12, fontSize:13, color: 'var(--text-secondary)'}}>
                <span>Delivery Charges</span>
                <span style={{color:'var(--accent-emerald)', fontWeight: 700}}>FREE</span>
              </div>
              <div style={{borderTop:`1px solid var(--border-color)`, paddingTop:12, display:'flex', justifyContent:'space-between', fontSize:16, fontWeight:900}}>
                <span style={{fontFamily: 'Space Grotesk'}}>Order Total</span>
                <span style={{color: 'var(--accent-primary)', fontFamily: 'Space Grotesk'}}>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <button onClick={() => { playSFX('thunder', isMuted); onConfirm(addr, phone, payment); }} className="btn-primary" style={{width:'100%', padding:16, fontSize:15, marginBottom:10}}>
              <CheckCircle2 size={18}/>
              <span>SUBMIT SECURE ORDER</span>
            </button>
            <button onClick={() => { setStep(2); playSFX('click', isMuted); }} className="btn-secondary" style={{width:'100%'}}>
              <ArrowLeft size={16}/>
              <span>BACK TO PAYMENT</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// CART PAGE
// ═════════════════════════════════════════════════════════════════
function CartPage({cart, dispatch, discountPercent, applyCoupon, onCheckout, isMuted}) {
  const [couponText, setCouponText] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponShake, setCouponShake] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const targetForFreeShipping = 100000;
  const shippingPercent = Math.min((subtotal / targetForFreeShipping) * 100, 100);
  const remainingForFreeShipping = Math.max(targetForFreeShipping - subtotal, 0);

  const handleApply = () => {
    const code = couponText.trim().toUpperCase();
    if(code === 'THUNDER10') {
      applyCoupon(10);
      setCouponError('');
      playSFX('success', isMuted);
    } else if(code === 'SUPER50') {
      applyCoupon(50);
      setCouponError('');
      playSFX('success', isMuted);
    } else {
      setCouponError('Invalid voucher code. Try THUNDER10');
      setCouponShake(true);
      playSFX('error', isMuted);
      setTimeout(() => setCouponShake(false), 500);
    }
  };

  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalTotal = subtotal - discountAmount;

  return (
    <div className="page-container animate-fade-in" style={{paddingBottom:120}}>
      {cart.length === 0 ? (
        <div className="glass-panel" style={{textAlign:'center', padding:'80px 20px', borderRadius:'var(--border-radius-md)'}}>
          <div style={{fontSize:64, marginBottom:16}} className="animate-thunder">🛒</div>
          <h2 style={{fontSize:20, fontWeight:800, marginBottom:8}}>Your cart is dry</h2>
          <p style={{color:'var(--text-secondary)', fontSize:14, marginBottom:24}}>Fill it with high-performance lightning deals!</p>
        </div>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: 24}}>
          {/* Cart Header */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 style={{fontSize:18, fontWeight:800, color:'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8}}>
              <ShoppingCart size={20} style={{color: 'var(--accent-primary)'}}/>
              <span>Your Cart ({cart.reduce((a, b) => a + b.qty, 0)} items)</span>
            </h2>
            <button onClick={() => { dispatch({type: 'CLEAR'}); playSFX('click', isMuted); }} className="btn-secondary" style={{padding: '6px 12px', fontSize: 11, color: 'var(--accent-rose)', borderColor: 'rgba(255, 23, 68, 0.15)', background: 'rgba(255, 23, 68, 0.02)'}}>
              <Trash2 size={12}/>
              <span>CLEAR ALL</span>
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="glass-panel" style={{padding: 16, borderRadius: 'var(--border-radius-sm)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8}}>
              <span style={{color: 'var(--text-secondary)'}}>
                {remainingForFreeShipping > 0 
                  ? `Add ₹${remainingForFreeShipping.toLocaleString()} more for FREE Express Shipping!` 
                  : 'Eligible for FREE Express Shipping!'}
              </span>
              <span style={{fontWeight: 700, color: 'var(--accent-primary)'}}>{Math.round(shippingPercent)}%</span>
            </div>
            <div style={{height: 6, background: 'var(--border-color)', borderRadius: 3, overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${shippingPercent}%`, background: 'linear-gradient(90deg, var(--accent-secondary) 0%, var(--accent-primary) 100%)', borderRadius: 3, transition: 'var(--transition-smooth)'}}></div>
            </div>
          </div>

          {/* Items List */}
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            {cart.map(item => (
              <div key={item.id} className="glass-panel" style={{padding: 14, borderRadius: 'var(--border-radius-sm)', display: 'flex', gap: 16, alignItems: 'center', position: 'relative'}}>
                <div style={{background: item.color, width: 64, height: 64, borderRadius: 'var(--border-radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0}}>
                  {item.img}
                </div>
                
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 10, fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase'}}>{item.brand}</div>
                  <div style={{fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>{item.name}</div>
                  <div style={{fontSize: 15, fontWeight: 900, color: 'var(--accent-primary)', marginTop: 4}}>₹{item.price.toLocaleString()}</div>
                </div>

                <div style={{display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)'}}>
                  <button onClick={() => { dispatch({type:'QTY', id:item.id, qty:item.qty-1}); playSFX('click', isMuted); }} className="btn-secondary" style={{width: 32, height: 32, border: 'none', padding: 0, borderRadius: 0}}>−</button>
                  <span style={{width: 32, textAlign: 'center', fontSize: 13, fontWeight: 700}}>{item.qty}</span>
                  <button onClick={() => { dispatch({type:'QTY', id:item.id, qty:item.qty+1}); playSFX('click', isMuted); }} className="btn-secondary" style={{width: 32, height: 32, border: 'none', padding: 0, borderRadius: 0}}>+</button>
                </div>

                <button onClick={() => { dispatch({type:'REMOVE', id:item.id}); playSFX('click', isMuted); }} className="btn-secondary" style={{
                  padding: 8, borderRadius: 'var(--border-radius-sm)', border: 'none', color: 'var(--accent-rose)', background: 'rgba(255, 23, 68, 0.05)'
                }}>
                  <Trash2 size={14}/>
                </button>
              </div>
            ))}
          </div>

          {/* Promotional Coupon Validation Panel */}
          <div className="glass-panel" style={{padding: 16, borderRadius: 'var(--border-radius-sm)'}}>
            <label style={{fontSize:11, fontWeight:800, color:'var(--text-secondary)', display:'block', marginBottom:8, textTransform: 'uppercase', letterSpacing: '0.05em'}}>Cyber Coupon Voucher</label>
            <div style={{display: 'flex', gap: 10}} className={couponShake ? 'animate-shake' : ''}>
              <input 
                value={couponText} 
                onChange={e => { setCouponText(e.target.value); setCouponError(''); }} 
                placeholder="Enter THUNDER10 or SUPER50" 
                className="custom-input" 
                style={{flex: 1}}
              />
              <button onClick={handleApply} className="btn-primary" style={{padding: '10px 18px', fontSize: 12}}>APPLY</button>
            </div>
            {couponError && <div style={{color: 'var(--accent-rose)', fontSize: 11, marginTop: 6, fontWeight: 600}}>{couponError}</div>}
            {discountPercent > 0 && <div style={{color: 'var(--accent-emerald)', fontSize: 11, marginTop: 6, fontWeight: 700}}>✓ Code Applied! {discountPercent}% discount is active.</div>}
          </div>

          {/* Pricing Card */}
          <div className="glass-panel" style={{padding: 20, borderRadius: 'var(--border-radius-md)'}}>
            <h3 style={{fontSize: 16, marginBottom: 16, fontFamily: 'Space Grotesk'}}>Summary Details</h3>
            
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13, color: 'var(--text-secondary)'}}>
              <span>Items Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            {discountPercent > 0 && (
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13, color: 'var(--accent-emerald)'}}>
                <span>Promo Discount ({discountPercent}%)</span>
                <span>- ₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13, color: 'var(--text-secondary)'}}>
              <span>Express Delivery</span>
              <span style={{color: 'var(--accent-emerald)', fontWeight: 700}}>FREE</span>
            </div>
            
            <div style={{borderTop: '1px solid var(--border-color)', padding: '16px 0', marginTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 900}}>
              <span style={{fontFamily: 'Space Grotesk'}}>Est. Total</span>
              <span style={{color: 'var(--accent-primary)', fontFamily: 'Space Grotesk'}}>₹{finalTotal.toLocaleString()}</span>
            </div>

            <button onClick={() => { onCheckout(subtotal); playSFX('click', isMuted); }} className="btn-primary" style={{width: '100%', padding: 14, fontSize: 14}}>
              <Sparkles size={16}/>
              <span>PROCEED TO SECURE CHECKOUT</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// DELIVERY TRACKER SHEET
// ═════════════════════════════════════════════════════════════════
function DeliveryTrackerModal({order, onClose, isMuted}) {
  if (!order) return null;

  const steps = [
    { label: 'Order Confirmed', desc: 'Secure payment cleared', date: order.date },
    { label: 'Dispatch Processing', desc: 'Thunder Zone warehouse inspection', date: order.date },
    { label: 'Handed over to Courier', desc: 'Logistics center transit', date: order.date },
    { label: 'Shipped', desc: 'In transit to city hub', date: order.status !== 'Processing' ? order.date : 'Pending' },
    { label: 'Out for Delivery / Delivered', desc: 'Secured drop-off complete', date: order.status === 'Delivered' ? order.date : 'Pending' }
  ];

  let currentStepIdx = 1; // Processing
  if (order.status === 'Shipped') currentStepIdx = 3;
  if (order.status === 'Delivered') currentStepIdx = 4;

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(3, 4, 7, 0.75)', backdropFilter: 'blur(8px)', zIndex:700, display:'flex', alignItems:'center', justifyContent:'center', padding:20}} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="glass-panel-elevated animate-fade-in" style={{
        borderRadius:'var(--border-radius-md)', padding:28, maxWidth:460, width:'100%', maxHeight:'85vh', overflowY:'auto'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
          <h3 style={{fontSize: 18, fontFamily: 'Space Grotesk'}}>Order Tracking: {order.id}</h3>
          <button onClick={() => { onClose(); playSFX('click', isMuted); }} style={{background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 22, cursor: 'pointer'}}>×</button>
        </div>

        <div style={{marginBottom: 20, fontSize: 12, color: 'var(--text-secondary)'}}>
          <div>📍 <span style={{fontWeight: 700, color: 'var(--text-primary)'}}>Shipping Address:</span> {order.address}</div>
          <div style={{marginTop: 6}}>📦 <span style={{fontWeight: 700, color: 'var(--text-primary)'}}>Tracking ID:</span> {order.tracking}</div>
          <div style={{marginTop: 6}}>🏷️ <span style={{fontWeight: 700, color: 'var(--text-primary)'}}>Logistics Status:</span> <strong style={{color: 'var(--accent-primary)'}}>{order.status.toUpperCase()}</strong></div>
        </div>

        {/* Stepper Timeline */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', paddingLeft: 20}}>
          {/* Connector Line */}
          <div style={{
            position: 'absolute', left: 5, top: 10, bottom: 10, width: 2, 
            background: 'var(--border-color)'
          }}/>
          
          <div style={{
            position: 'absolute', left: 5, top: 10, width: 2, 
            height: `${(currentStepIdx / 4) * 100}%`, 
            background: 'var(--accent-primary)',
            transition: 'var(--transition-smooth)'
          }}/>

          {steps.map((s, idx) => {
            const isCompleted = idx <= currentStepIdx;
            return (
              <div key={idx} style={{display: 'flex', gap: 16, position: 'relative'}}>
                {/* Step Node */}
                <div style={{
                  position: 'absolute', left: -21, top: 4, width: 12, height: 12, 
                  borderRadius: '50%', border: '2px solid var(--bg-surface-elevated)',
                  background: isCompleted ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                  boxShadow: isCompleted ? '0 0 10px var(--accent-primary)' : 'none',
                  transition: 'var(--transition-smooth)'
                }}/>
                
                <div style={{flex: 1}}>
                  <div style={{fontSize: 13, fontWeight: 700, color: isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)'}}>{s.label}</div>
                  <div style={{fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2}}>{s.desc}</div>
                </div>

                <div style={{fontSize: 11, color: isCompleted ? 'var(--accent-primary)' : 'var(--text-tertiary)', textAlign: 'right'}}>
                  {s.date}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={() => { onClose(); playSFX('click', isMuted); }} className="btn-primary" style={{width: '100%', marginTop: 24}}>CLOSE TRACKING</button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// ANALYSIS PAGE
// ═════════════════════════════════════════════════════════════════
function AnalysisPage({user, orders, isMuted}) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const userOrders = orders.filter(o => o.userId === user.id);
  const totalSpent = userOrders.reduce((s, o) => s + o.total, 0);

  // Formatting order values by date for recharts
  const salesHistory = userOrders
    .slice()
    .reverse()
    .map(o => ({
      date: o.date,
      Spent: o.total,
      Invoice: o.id
    }));

  // Group purchases by category
  const categoriesMap = {};
  userOrders.forEach(o => {
    o.items?.forEach(item => {
      // Find category of item from products database
      const prod = PRODUCTS_DB.find(p => p.id === item.pid || p.name.includes(item.name));
      const cat = prod?.cat || 'Electronics';
      categoriesMap[cat] = (categoriesMap[cat] || 0) + (item.price * (item.qty || 1));
    });
  });

  const categoryData = Object.entries(categoriesMap).map(([name, value]) => ({
    name,
    value
  }));

  const PIE_COLORS = ['#FFB800', '#00E5FF', '#FF1744', '#00E676'];

  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="recharts-custom-tooltip">
          <p className="label">{payload[0].payload.Invoice || label}</p>
          <p className="desc" style={{fontWeight: 700}}>Spent: ₹{payload[0].value.toLocaleString()}</p>
          {payload[0].payload.date && <p style={{color: 'var(--text-secondary)', fontSize: 10}}>Date: {payload[0].payload.date}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-container animate-fade-in" style={{paddingBottom: 120}}>
      {selectedOrder && (
        <DeliveryTrackerModal 
          order={orders.find(o => o.id === selectedOrder.id)} 
          onClose={() => setSelectedOrder(null)} 
          isMuted={isMuted}
        />
      )}

      <h1 style={{fontSize: 22, fontWeight: 900, marginBottom: 20, color:'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10}}>
        <BarChart3 size={24} style={{color: 'var(--accent-primary)'}}/>
        <span>Your Purchase Analytics</span>
      </h1>
      
      {/* Stats Cards */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:20}}>
        <div className="glass-panel" style={{borderRadius: 'var(--border-radius-md)', padding:20, textAlign:'center'}}>
          <div style={{fontSize:11, color:'var(--text-secondary)', fontWeight:800, marginBottom:8, textTransform: 'uppercase', letterSpacing: '0.05em'}}>Total Orders</div>
          <div style={{fontSize:32, fontWeight:900, color:'var(--accent-primary)', fontFamily: 'Space Grotesk'}}>{userOrders.length}</div>
        </div>
        <div className="glass-panel" style={{borderRadius: 'var(--border-radius-md)', padding:20, textAlign:'center'}}>
          <div style={{fontSize:11, color:'var(--text-secondary)', fontWeight:800, marginBottom:8, textTransform: 'uppercase', letterSpacing: '0.05em'}}>Total Capital Spent</div>
          <div style={{fontSize:28, fontWeight:900, color:'var(--accent-primary)', fontFamily: 'Space Grotesk'}}>₹{totalSpent.toLocaleString()}</div>
        </div>
      </div>

      {userOrders.length === 0 ? (
        <div className="glass-panel" style={{padding: 40, textAlign: 'center', borderRadius: 'var(--border-radius-md)'}}>
          <p style={{color: 'var(--text-secondary)'}}>No analytical data. Place orders to populate charts!</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
          {/* Expenditure Area Chart */}
          <div className="glass-panel" style={{borderRadius: 'var(--border-radius-md)', padding: 18}}>
            <h3 style={{fontSize: 15, fontWeight:800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6}}>
              <TrendingUp size={16} style={{color: 'var(--accent-primary)'}}/>
              <span>Spending Velocity Over Time</span>
            </h3>
            <div style={{width: '100%', height: 200}}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="userSpentGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)"/>
                  <XAxis dataKey="date" stroke="var(--text-tertiary)" style={{fontSize: 10}}/>
                  <YAxis stroke="var(--text-tertiary)" style={{fontSize: 10}}/>
                  <Tooltip content={<CustomChartTooltip/>}/>
                  <Area type="monotone" dataKey="Spent" stroke="var(--accent-primary)" strokeWidth={2} fillOpacity={1} fill="url(#userSpentGlow)"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Pie Chart */}
          {categoryData.length > 0 && (
            <div className="glass-panel" style={{borderRadius: 'var(--border-radius-md)', padding: 18}}>
              <h3 style={{fontSize: 15, fontWeight:800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6}}>
                <PieIcon size={16} style={{color: 'var(--accent-primary)'}}/>
                <span>Distribution by Category</span>
              </h3>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 16}}>
                <div style={{width: 140, height: 140}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={55}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]}/>
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value.toLocaleString()}`}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 150}}>
                  {categoryData.map((entry, index) => (
                    <div key={entry.name} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <div style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: PIE_COLORS[index % PIE_COLORS.length]}}></div>
                        <span style={{color: 'var(--text-secondary)'}}>{entry.name}</span>
                      </div>
                      <span style={{fontWeight: 700}}>₹{entry.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders log (with Shipping tracker interaction) */}
          <div className="glass-panel" style={{borderRadius: 'var(--border-radius-md)', padding:18}}>
            <h3 style={{fontSize:15, fontWeight:800, marginBottom:16, display: 'flex', alignItems: 'center', gap: 6}}>
              <Box size={16} style={{color: 'var(--accent-primary)'}}/>
              <span>Past Orders log (Click to Track)</span>
            </h3>
            {userOrders.map(o => (
              <div 
                key={o.id} 
                onClick={() => { setSelectedOrder(o); playSFX('click', isMuted); }}
                style={{
                  padding: '12px 0', borderBottom:`1px solid var(--border-color)`, 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  cursor: 'pointer', transition: 'var(--transition-smooth)'
                }}
                className="interactive-card"
              >
                <div style={{paddingLeft: 4}}>
                  <div style={{fontWeight:700, color:'var(--text-primary)', fontSize:13, display: 'flex', alignItems: 'center', gap: 6}}>
                    <span>{o.id}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 10,
                      background: o.status === 'Delivered' ? 'rgba(0, 230, 118, 0.1)' : o.status === 'Shipped' ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255, 184, 0, 0.1)',
                      color: o.status === 'Delivered' ? 'var(--accent-emerald)' : o.status === 'Shipped' ? 'var(--accent-secondary)' : 'var(--accent-primary)'
                    }}>{o.status}</span>
                  </div>
                  <div style={{color:'var(--text-secondary)', fontSize: 11, marginTop: 4}}>{o.date} • Click to open logistics map</div>
                </div>
                <div style={{textAlign: 'right', paddingRight: 4}}>
                  <div style={{fontWeight:900, color:'var(--accent-primary)', fontSize:14}}>₹{o.total.toLocaleString()}</div>
                  <div style={{color: 'var(--text-tertiary)', fontSize: 10, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end'}}>
                    <span>{o.payment}</span>
                    <ChevronRight size={12}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// ADMIN INVENTORY MANAGER MODAL (Product Add/Edit)
// ═════════════════════════════════════════════════════════════════
function ProductFormModal({product, onClose, onSave, isMuted}) {
  const [name, setName] = useState(product ? product.name : '');
  const [brand, setBrand] = useState(product ? product.brand : '');
  const [cat, setCat] = useState(product ? product.cat : 'Electronics');
  const [price, setPrice] = useState(product ? product.price : 999);
  const [orig, setOrig] = useState(product ? product.orig : 1999);
  const [stock, setStock] = useState(product ? product.stock : 10);
  const [desc, setDesc] = useState(product ? product.desc : '');
  const [img, setImg] = useState(product ? product.img : '💻');
  const [color, setColor] = useState(product ? product.color : 'rgba(255, 184, 0, 0.15)');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!name || !brand || !desc) {
      playSFX('error', isMuted);
      alert('Please fill in Name, Brand and Description');
      return;
    }
    const updated = {
      id: product ? product.id : Date.now(),
      name, brand, cat, 
      price: Number(price), 
      orig: Number(orig), 
      stock: Number(stock), 
      desc, img, color,
      rating: product ? product.rating : 4.5,
      reviews: product ? product.reviews : 1
    };
    onSave(updated);
    playSFX('success', isMuted);
  };

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(3, 4, 7, 0.75)', backdropFilter: 'blur(8px)', zIndex:700, display:'flex', alignItems:'center', justifyContent:'center', padding:20}} onClick={onClose}>
      <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()} className="glass-panel-elevated animate-fade-in" style={{
        borderRadius:'var(--border-radius-md)', padding:28, maxWidth:500, width:'100%', maxHeight:'90vh', overflowY:'auto'
      }}>
        <h3 style={{fontSize: 18, marginBottom: 20, fontFamily: 'Space Grotesk'}}>{product ? 'Edit Ledger Item' : 'Register New Ledger Item'}</h3>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24}}>
          <div>
            <label style={{fontSize:10, fontWeight:800, color:'var(--text-secondary)', display:'block', marginBottom:6}}>PRODUCT NAME</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. ASUS ROG G15" className="custom-input" required/>
          </div>

          <div style={{display: 'flex', gap: 12}}>
            <div style={{flex: 1}}>
              <label style={{fontSize:10, fontWeight:800, color:'var(--text-secondary)', display:'block', marginBottom:6}}>BRAND</label>
              <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="e.g. ASUS" className="custom-input" required/>
            </div>
            <div style={{flex: 1}}>
              <label style={{fontSize:10, fontWeight:800, color:'var(--text-secondary)', display:'block', marginBottom:6}}>CATEGORY</label>
              <select value={cat} onChange={e => setCat(e.target.value)} className="custom-input" style={{padding: '11px 12px'}}>
                <option value="Electronics">Electronics</option>
                <option value="Mobiles">Mobiles</option>
                <option value="Fashion">Fashion</option>
              </select>
            </div>
          </div>

          <div style={{display: 'flex', gap: 12}}>
            <div style={{flex: 1}}>
              <label style={{fontSize:10, fontWeight:800, color:'var(--text-secondary)', display:'block', marginBottom:6}}>DEAL PRICE (₹)</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="custom-input" required min="1"/>
            </div>
            <div style={{flex: 1}}>
              <label style={{fontSize:10, fontWeight:800, color:'var(--text-secondary)', display:'block', marginBottom:6}}>ORIGINAL PRICE (₹)</label>
              <input type="number" value={orig} onChange={e => setOrig(e.target.value)} className="custom-input" required min="1"/>
            </div>
            <div style={{flex: 1}}>
              <label style={{fontSize:10, fontWeight:800, color:'var(--text-secondary)', display:'block', marginBottom:6}}>STOCK LEDGER</label>
              <input type="number" value={stock} onChange={e => setStock(e.target.value)} className="custom-input" required min="0"/>
            </div>
          </div>

          <div style={{display: 'flex', gap: 12}}>
            <div style={{flex: 1}}>
              <label style={{fontSize:10, fontWeight:800, color:'var(--text-secondary)', display:'block', marginBottom:6}}>EMOJI IMAGE</label>
              <input value={img} onChange={e => setImg(e.target.value)} placeholder="e.g. 💻" className="custom-input" required/>
            </div>
            <div style={{flex: 2}}>
              <label style={{fontSize:10, fontWeight:800, color:'var(--text-secondary)', display:'block', marginBottom:6}}>BRAND COLOR BACKGROUND</label>
              <input value={color} onChange={e => setColor(e.target.value)} placeholder="rgba(255, 184, 0, 0.15)" className="custom-input"/>
            </div>
          </div>

          <div>
            <label style={{fontSize:10, fontWeight:800, color:'var(--text-secondary)', display:'block', marginBottom:6}}>PRODUCT DESCRIPTION</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Enter details..." className="custom-input" style={{height: 70, resize: 'none'}} required/>
          </div>
        </div>

        <div style={{display: 'flex', gap: 12}}>
          <button type="button" onClick={() => { onClose(); playSFX('click', isMuted); }} className="btn-secondary" style={{flex: 1}}>CANCEL</button>
          <button type="submit" className="btn-primary" style={{flex: 2}}>SAVE LEDGER</button>
        </div>
      </form>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ═════════════════════════════════════════════════════════════════
function AdminDashboard({orders, setOrders, products, setProducts, isMuted}) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('metrics'); // metrics | inventory | system-orders

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  // format sales by date for charts
  const rawSalesMap = {};
  orders.forEach(o => {
    rawSalesMap[o.date] = (rawSalesMap[o.date] || 0) + o.total;
  });
  const salesHistory = Object.entries(rawSalesMap)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // product stock charts data
  const stockData = products.map(p => ({
    name: p.name.split(' ')[0], // short name
    Stock: p.stock,
    fullName: p.name
  }));

  // Toggle order status sequentially
  const handleToggleOrderStatus = (orderId) => {
    fetch(`${API_URL}/orders/${orderId}/status`, { method: 'PUT' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update status');
        return res.json();
      })
      .then(updatedOrder => {
        setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? updatedOrder : o));
        playSFX('success', isMuted);
      })
      .catch(err => console.error("Error toggling order status:", err));
  };

  // Product Manager Actions
  const handleSaveProduct = (prod) => {
    const exists = products.find(p => p.id === prod.id);
    const method = exists ? 'PUT' : 'POST';
    const url = exists ? `${API_URL}/products/${prod.id}` : `${API_URL}/products`;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prod)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save product');
        return res.json();
      })
      .then(savedProd => {
        if (exists) {
          setProducts(prev => prev.map(p => p.id === prod.id ? savedProd : p));
        } else {
          setProducts(prev => [savedProd, ...prev]);
        }
        setEditingProduct(null);
        setShowAddForm(false);
      })
      .catch(err => console.error("Error saving product:", err));
  };

  const handleDeleteProduct = (productId) => {
    if (confirm("Confirm removal of product from catalog list?")) {
      fetch(`${API_URL}/products/${productId}`, { method: 'DELETE' })
        .then(res => {
          if (!res.ok) throw new Error('Failed to delete product');
          return res.json();
        })
        .then(() => {
          setProducts(prev => prev.filter(p => p.id !== productId));
          playSFX('error', isMuted);
        })
        .catch(err => console.error("Error deleting product:", err));
    }
  };

  return (
    <div className="page-container animate-fade-in" style={{paddingBottom: 120}}>
      {/* Product Form Editor sheets */}
      {(editingProduct || showAddForm) && (
        <ProductFormModal 
          product={editingProduct} 
          onClose={() => { setEditingProduct(null); setShowAddForm(false); }} 
          onSave={handleSaveProduct}
          isMuted={isMuted}
        />
      )}

      <h1 style={{fontSize: 22, fontWeight: 900, marginBottom: 20, color:'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10}}>
        <ShieldAlert size={24} style={{color: 'var(--accent-primary)'}}/>
        <span>Core Admin Cockpit</span>
      </h1>

      {/* Admin Tab Switcher */}
      <div style={{display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: 20}}>
        {[
          {id: 'metrics', label: 'Systems Status'},
          {id: 'inventory', label: 'Inventory Manager'},
          {id: 'system-orders', label: 'System Orders'}
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => { setActiveTab(tab.id); playSFX('click', isMuted); }}
            style={{
              flex: 1, padding: '12px 4px', background: 'none', border: 'none', 
              color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
              fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'var(--transition-smooth)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'metrics' && (
        <div className="animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: 20}}>
          {/* Stats Matrix */}
          <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:12}}>
            <div className="glass-panel" style={{borderRadius: 'var(--border-radius-md)', padding:16, textAlign:'center'}}>
              <div style={{fontSize:10, color:'var(--text-secondary)', fontWeight:800, marginBottom:6, textTransform: 'uppercase', letterSpacing: '0.05em'}}>System Revenue</div>
              <div style={{fontSize:20, fontWeight:900, color:'var(--accent-primary)', fontFamily: 'Space Grotesk'}}>₹{totalRevenue.toLocaleString()}</div>
            </div>
            <div className="glass-panel" style={{borderRadius: 'var(--border-radius-md)', padding:16, textAlign:'center'}}>
              <div style={{fontSize:10, color:'var(--text-secondary)', fontWeight:800, marginBottom:6, textTransform: 'uppercase', letterSpacing: '0.05em'}}>Total Orders</div>
              <div style={{fontSize:20, fontWeight:900, color:'var(--accent-primary)', fontFamily: 'Space Grotesk'}}>{orders.length}</div>
            </div>
            <div className="glass-panel" style={{borderRadius: 'var(--border-radius-md)', padding:16, textAlign:'center'}}>
              <div style={{fontSize:10, color:'var(--text-secondary)', fontWeight:800, marginBottom:6, textTransform: 'uppercase', letterSpacing: '0.05em'}}>Active Catalog</div>
              <div style={{fontSize:20, fontWeight:900, color:'var(--accent-primary)', fontFamily: 'Space Grotesk'}}>{products.length}</div>
            </div>
            <div className="glass-panel" style={{borderRadius: 'var(--border-radius-md)', padding:16, textAlign:'center'}}>
              <div style={{fontSize:10, color:'var(--text-secondary)', fontWeight:800, marginBottom:6, textTransform: 'uppercase', letterSpacing: '0.05em'}}>Critical Stock</div>
              <div style={{fontSize:20, fontWeight:900, color:'var(--accent-rose)', fontFamily: 'Space Grotesk'}}>
                {products.filter(p => p.stock <= 5).length}
              </div>
            </div>
          </div>

          {/* Revenue Velocity Chart */}
          <div className="glass-panel" style={{borderRadius: 'var(--border-radius-md)', padding: 18}}>
            <h3 style={{fontSize: 14, fontWeight:800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6}}>
              <TrendingUp size={16} style={{color: 'var(--accent-primary)'}}/>
              <span>Cumulative Revenue Stream</span>
            </h3>
            <div style={{width: '100%', height: 200}}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adminRevenueGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)"/>
                  <XAxis dataKey="date" stroke="var(--text-tertiary)" style={{fontSize: 10}}/>
                  <YAxis stroke="var(--text-tertiary)" style={{fontSize: 10}}/>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`}/>
                  <Area type="monotone" dataKey="revenue" stroke="var(--accent-primary)" strokeWidth={2} fillOpacity={1} fill="url(#adminRevenueGlow)"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stock Ledger Bar Chart */}
          <div className="glass-panel" style={{borderRadius: 'var(--border-radius-md)', padding: 18}}>
            <h3 style={{fontSize: 14, fontWeight:800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6}}>
              <Package size={16} style={{color: 'var(--accent-primary)'}}/>
              <span>Catalog Stock Ledger</span>
            </h3>
            <div style={{width: '100%', height: 200}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)"/>
                  <XAxis dataKey="name" stroke="var(--text-tertiary)" style={{fontSize: 9}}/>
                  <YAxis stroke="var(--text-tertiary)" style={{fontSize: 10}}/>
                  <Tooltip formatter={(value, name, props) => [`${value} units`, props.payload.fullName]}/>
                  <Bar dataKey="Stock" radius={[4, 4, 0, 0]}>
                    {stockData.map((entry, index) => {
                      const color = entry.Stock <= 5 ? 'var(--accent-rose)' : 'var(--accent-primary)';
                      return <Cell key={`cell-${index}`} fill={color}/>;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3 style={{fontSize: 15, fontWeight: 800}}>Store Product Ledger</h3>
            <button onClick={() => { setShowAddForm(true); playSFX('click', isMuted); }} className="btn-primary" style={{padding: '8px 16px', fontSize: 12}}>
              <Plus size={14}/>
              <span>ADD PRODUCT</span>
            </button>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            {products.map(p => (
              <div key={p.id} className="glass-panel" style={{padding: 12, borderRadius: 'var(--border-radius-sm)', display: 'flex', gap: 12, alignItems: 'center'}}>
                <div style={{fontSize: 32, width: 48, height: 48, borderRadius: 6, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {p.img}
                </div>
                
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'}}>{p.name}</div>
                  <div style={{fontSize: 11, color: 'var(--text-secondary)', marginTop: 2}}>
                    ₹{p.price.toLocaleString()} • Stock: <span style={{fontWeight: 700, color: p.stock <= 5 ? 'var(--accent-rose)' : 'var(--accent-emerald)'}}>{p.stock} units</span>
                  </div>
                </div>

                <div style={{display: 'flex', gap: 6}}>
                  <button onClick={() => { setEditingProduct(p); playSFX('click', isMuted); }} className="btn-secondary" style={{padding: 8, border: 'none', background: 'rgba(255,255,255,0.02)'}}>
                    <Edit size={14}/>
                  </button>
                  <button onClick={() => handleDeleteProduct(p.id)} className="btn-secondary" style={{padding: 8, border: 'none', color: 'var(--accent-rose)', background: 'rgba(255,23,68,0.05)'}}>
                    <Trash size={14}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'system-orders' && (
        <div className="animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          <h3 style={{fontSize: 15, fontWeight: 800}}>System Logistics Ledger</h3>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            {orders.map(o => (
              <div key={o.id} className="glass-panel" style={{padding: 14, borderRadius: 'var(--border-radius-sm)', display: 'flex', flexDirection: 'column', gap: 10}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div>
                    <div style={{fontSize: 13, fontWeight: 800, color: 'var(--text-primary)'}}>{o.id}</div>
                    <div style={{fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2}}>{o.date} • Phone: {o.phone}</div>
                  </div>
                  
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: 14, fontWeight: 900, color: 'var(--accent-primary)'}}>₹{o.total.toLocaleString()}</div>
                    <div style={{fontSize: 10, color: 'var(--text-secondary)', textTransform: 'uppercase'}}>{o.payment}</div>
                  </div>
                </div>

                <div style={{fontSize: 12, background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: 10, borderRadius: 6}}>
                  <span style={{color: 'var(--text-secondary)'}}>Delivery Address:</span><br/>
                  <strong style={{color: 'var(--text-primary)'}}>{o.address}</strong>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: 10, marginTop: 4}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                    <span style={{fontSize: 11, color: 'var(--text-secondary)'}}>Status:</span>
                    <span style={{
                      fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 12,
                      background: o.status === 'Delivered' ? 'rgba(0, 230, 118, 0.1)' : o.status === 'Shipped' ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255, 184, 0, 0.1)',
                      color: o.status === 'Delivered' ? 'var(--accent-emerald)' : o.status === 'Shipped' ? 'var(--accent-secondary)' : 'var(--accent-primary)'
                    }}>{o.status.toUpperCase()}</span>
                  </div>

                  <button 
                    onClick={() => handleToggleOrderStatus(o.id)} 
                    className="btn-primary" 
                    style={{padding: '6px 12px', fontSize: 11, background: 'none', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', boxShadow: 'none'}}
                  >
                    <span>UPGRADE STATUS</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// ACCOUNT PAGE (Profile customization enabled)
// ═════════════════════════════════════════════════════════════════
function AccountPage({user, setUser, onLogout, isMuted}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);

  const avatars = ['👨', '👩', '⚡', '🤖', '👾', '🔥', '👑', '😎'];

  const handleSave = () => {
    fetch(`${API_URL}/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, avatar })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update profile');
        return res.json();
      })
      .then(updatedUser => {
        setUser(updatedUser);
        setIsEditing(false);
        playSFX('success', isMuted);
      })
      .catch(err => console.error("Error updating profile:", err));
  };

  return (
    <div className="page-container animate-fade-in" style={{paddingBottom: 120}}>
      <div className="glass-panel" style={{borderRadius: 'var(--border-radius-md)', padding:32, marginBottom:20, textAlign:'center', position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', top: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255, 184, 0, 0.05)', filter: 'blur(30px)'}}></div>

        {isEditing ? (
          <div style={{display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 300, margin: '0 auto'}} className="animate-fade-in">
            {/* Avatar picker */}
            <div>
              <label style={{fontSize:10, fontWeight:800, color:'var(--text-secondary)', display:'block', marginBottom:8}}>SELECT AVATAR HOLOGRAPH</label>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center'}}>
                {avatars.map(av => (
                  <button 
                    key={av} 
                    type="button"
                    onClick={() => { setAvatar(av); playSFX('click', isMuted); }}
                    style={{
                      fontSize: 24, padding: 6, background: avatar === av ? 'rgba(255,184,0,0.1)' : 'none',
                      border: avatar === av ? '1px solid var(--accent-primary)' : '1px solid transparent',
                      borderRadius: 8, cursor: 'pointer'
                    }}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{fontSize:10, fontWeight:800, color:'var(--text-secondary)', display:'block', marginBottom:6}}>DISPLAY NAME</label>
              <input value={name} onChange={e => setName(e.target.value)} className="custom-input" placeholder="Display Name"/>
            </div>

            <div style={{display: 'flex', gap: 10, marginTop: 4}}>
              <button onClick={() => { setIsEditing(false); playSFX('click', isMuted); }} className="btn-secondary" style={{flex: 1, padding: '10px'}}>CANCEL</button>
              <button onClick={handleSave} className="btn-primary" style={{flex: 1, padding: '10px'}}>SAVE</button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="animate-thunder" style={{fontSize:72, marginBottom:16, display: 'inline-block', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'}}>{user.avatar}</div>
            <h2 style={{fontSize:22, fontWeight:900, color:'var(--text-primary)', marginBottom:4, fontFamily: 'Space Grotesk'}}>{user.name}</h2>
            <div style={{fontSize:13, color:'var(--text-secondary)', marginBottom:16}}>{user.email}</div>
            
            <div style={{display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: 6, background:'rgba(255, 184, 0, 0.1)', border: '1px solid rgba(255, 184, 0, 0.25)', color:'var(--accent-primary)', fontSize:11, fontWeight:800, padding:'6px 16px', borderRadius:20, textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                <ShieldAlert size={12}/>
                <span>RANK: {user.role}</span>
              </span>
              <button onClick={() => { setIsEditing(true); playSFX('click', isMuted); }} className="btn-secondary" style={{padding: '5px 12px', fontSize: 11, borderRadius: 20}}>
                <Edit size={11}/>
                <span>EDIT PROFILE</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <button onClick={() => { onLogout(); playSFX('click', isMuted); }} className="btn-primary" style={{width:'100%', padding: 14, background: 'linear-gradient(135deg, var(--accent-rose), #D50000)', color: '#fff', boxShadow: 'none'}}>
        <LogOut size={16}/>
        <span>TERMINATE DOCK SESSION</span>
      </button>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// BOTTOM NAV
// ═════════════════════════════════════════════════════════════════
function BottomNav({page, setPage, cartCount, role, isMuted}) {
  const navItems = [
    {key:'home', icon:<ShoppingBag size={20}/>, label:'Home'},
    ...(role === 'admin' 
      ? [{key:'admin', icon:<ShieldAlert size={20}/>, label:'Admin'}] 
      : [{key:'analysis', icon:<BarChart3 size={20}/>, label:'Analytics'}]),
    {key:'cart', icon:<ShoppingCart size={20}/>, label:'Cart', badge:cartCount},
    {key:'account', icon:<User size={20}/>, label:'Account'},
  ];

  return (
    <nav className="glass-panel" style={{
      position:'fixed', bottom:0, left:0, right:0, 
      borderBottom: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0,
      display:'flex', justifyContent:'space-around', padding:'10px 0 env(safe-area-inset-bottom,10px)', zIndex:100
    }}>
      {navItems.map(item => {
        const isActive = page === item.key;
        return (
          <button key={item.key} onClick={() => { setPage(item.key); playSFX('click', isMuted); }} style={{
            display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'6px 12px', border:'none', background:'none', cursor:'pointer', flex:1, position:'relative',
            color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
            transition: 'var(--transition-smooth)'
          }}>
            <div style={{transform: isActive ? 'scale(1.15)' : 'scale(1)', transition: 'var(--transition-smooth)'}}>{item.icon}</div>
            <span style={{fontWeight:800, fontSize:10, textTransform: 'uppercase', letterSpacing: '0.02em', display: 'none'}}>{item.label}</span>
            {item.badge > 0 && (
              <span className="animate-pulse-neon" style={{
                position:'absolute', top: 0, right: '28%', background:'var(--accent-rose)', color:'#fff', 
                borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center', 
                fontSize:9, fontWeight:900, boxShadow: '0 0 10px rgba(255, 23, 68, 0.4)'
              }}>{item.badge}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ═════════════════════════════════════════════════════════════════
// MAIN APP
// ═════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [search, setSearch] = useState('');
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [toast, setToast] = useState('');
  const [products, setProducts] = useState(PRODUCTS_DB);
  const [orders, setOrders] = useState(ORDERS_DB);
  const [viewProduct, setViewProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);

  // Audio system settings
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('thunderzone-audio-mute') === 'true';
  });

  const toggleMute = () => {
    setIsMuted(prev => {
      const state = !prev;
      localStorage.setItem('thunderzone-audio-mute', state ? 'true' : 'false');
      return state;
    });
  };

  // Theme support
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('thunderzone-theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    localStorage.setItem('thunderzone-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Reset state on login changes
  useEffect(() => {
    setPage('home');
    setSearch('');
    setDiscountPercent(0);

    if (user) {
      // Fetch products from backend
      fetch(`${API_URL}/products`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch products');
          return res.json();
        })
        .then(data => setProducts(data))
        .catch(err => console.error(err));

      // Fetch orders from backend
      fetch(`${API_URL}/orders`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch orders');
          return res.json();
        })
        .then(data => setOrders(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  if(!user) return <LoginPage onLogin={setUser} isMuted={isMuted}/>;

  const handleAddCart = (product, qty = 1) => {
    dispatch({type:'ADD', product, qty});
    setToast(`⚡ Added ${qty}x ${product.name} to cart!`);
  };

  const handleCheckout = (total) => {
    setCheckoutTotal(total);
    setShowCheckout(true);
  };

  const handleConfirmOrder = (addr, phone, payment) => {
    const discountAmount = Math.round(checkoutTotal * (discountPercent / 100));
    const finalTotal = checkoutTotal - discountAmount;

    const newOrderData = {
      userId: user.id,
      total: finalTotal,
      items: cart.map(item => ({
        pid: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price
      })),
      address: addr,
      phone: phone,
      payment: payment
    };

    fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrderData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to place order');
        return res.json();
      })
      .then(placedOrder => {
        // Sync products to reflect stock reduction
        fetch(`${API_URL}/products`)
          .then(res => res.json())
          .then(data => setProducts(data));

        setOrders(prevOrders => [placedOrder, ...prevOrders]);
        setToast(`✅ Order ${placedOrder.id} placed successfully!`);
        dispatch({type:'CLEAR'});
        setDiscountPercent(0);
        setShowCheckout(false);
        
        // Redirect to analytics page or admin page based on user role
        if (user.role === 'admin') {
          setPage('admin');
        } else {
          setPage('analysis');
        }
      })
      .catch(err => {
        alert(err.message);
      });
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div style={{minHeight:'100vh', display: 'flex', flexDirection: 'column'}}>
      {toast && <Toast msg={toast} onClose={() => setToast('')}/>}
      
      {viewProduct && (
        <ProductDetailModal 
          product={products.find(p => p.id === viewProduct.id)} 
          onClose={() => setViewProduct(null)} 
          onAddCart={handleAddCart}
          isMuted={isMuted}
        />
      )}
      
      {showCheckout && (
        <CheckoutModal 
          cart={cart} 
          total={checkoutTotal} 
          discountPercent={discountPercent}
          onClose={() => setShowCheckout(false)} 
          onConfirm={handleConfirmOrder}
          isMuted={isMuted}
        />
      )}

      {/* Main Content Area */}
      <main style={{flex: 1}}>
        {page === 'home' && (
          <HomePage 
            products={products} 
            search={search} 
            setSearch={setSearch} 
            user={user} 
            onAddCart={handleAddCart} 
            onViewProduct={setViewProduct}
            theme={theme}
            toggleTheme={toggleTheme}
            isMuted={isMuted}
            toggleMute={toggleMute}
          />
        )}
        
        {page === 'analysis' && <AnalysisPage user={user} orders={orders} isMuted={isMuted}/>}
        
        {page === 'admin' && (
          <AdminDashboard 
            orders={orders} 
            setOrders={setOrders} 
            products={products} 
            setProducts={setProducts}
            isMuted={isMuted}
          />
        )}
        
        {page === 'account' && (
          <AccountPage 
            user={user} 
            setUser={setUser}
            onLogout={() => setUser(null)}
            isMuted={isMuted}
          />
        )}
        
        {page === 'cart' && (
          <CartPage 
            cart={cart} 
            dispatch={dispatch} 
            discountPercent={discountPercent}
            applyCoupon={setDiscountPercent}
            onCheckout={handleCheckout}
            isMuted={isMuted}
          />
        )}
      </main>

      <BottomNav page={page} setPage={setPage} cartCount={cartCount} role={user.role} isMuted={isMuted}/>
    </div>
  );
}
