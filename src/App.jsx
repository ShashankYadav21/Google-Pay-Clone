import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ── MOCK DATA ──────────────────────────────────────────────────────────────
const CONTACTS = [
  { id:"c1", name:"Rahul Sharma",   upiId:"rahul@okaxis",   phone:"+91 98765 43210", initials:"RS", color:"#EA4335", bankName:"Axis Bank" },
  { id:"c2", name:"Priya Singh",    upiId:"priya@oksbi",    phone:"+91 98456 12378", initials:"PS", color:"#1A73E8", bankName:"SBI" },
  { id:"c3", name:"Amit Kumar",     upiId:"amit@okhdfc",    phone:"+91 97654 32109", initials:"AK", color:"#34A853", bankName:"HDFC Bank" },
  { id:"c4", name:"Sneha Patel",    upiId:"sneha@okicici",  phone:"+91 96543 21098", initials:"SP", color:"#FBBC04", bankName:"ICICI Bank" },
  { id:"c5", name:"Vikram Mehta",   upiId:"vikram@ybl",     phone:"+91 95432 10987", initials:"VM", color:"#9C27B0", bankName:"Yes Bank" },
  { id:"c6", name:"Ananya Rao",     upiId:"ananya@okaxis",  phone:"+91 94321 09876", initials:"AR", color:"#FF5722", bankName:"Axis Bank" },
  { id:"c7", name:"Karan Joshi",    upiId:"karan@oksbi",    phone:"+91 93210 98765", initials:"KJ", color:"#00BCD4", bankName:"SBI" },
  { id:"c8", name:"Deepika Nair",   upiId:"deepika@okhdfc", phone:"+91 92109 87654", initials:"DN", color:"#E91E63", bankName:"HDFC Bank" },
  { id:"c9", name:"Rohan Gupta",    upiId:"rohan@ybl",      phone:"+91 91098 76543", initials:"RG", color:"#FF9800", bankName:"Yes Bank" },
  { id:"c10",name:"Pooja Verma",    upiId:"pooja@okicici",  phone:"+91 89987 65432", initials:"PV", color:"#4CAF50", bankName:"ICICI Bank" },
  { id:"c11",name:"Suresh Iyer",    upiId:"suresh@okaxis",  phone:"+91 88876 54321", initials:"SI", color:"#2196F3", bankName:"Axis Bank" },
  { id:"c12",name:"Meera Krishnan", upiId:"meera@oksbi",    phone:"+91 87765 43210", initials:"MK", color:"#673AB7", bankName:"SBI" },
];

const BANKS_DATA = [
  { id:"b1", name:"HDFC Bank",  acno:"XXXX5602", type:"Savings", upi:"alex@hdfc",  primary:true  },
  { id:"b2", name:"ICICI Bank", acno:"XXXX2020", type:"Savings", upi:"alex@icici", primary:false },
  { id:"b3", name:"Axis Bank",  acno:"XXXX4066", type:"Savings", upi:"alex@axis",  primary:false },
];

const INIT_TRANSACTIONS = [
  { id:"t1",  name:"Rahul Sharma",   amount:-500,   date:"15 May",  type:"debit",  initials:"RS", color:"#EA4335" },
  { id:"t2",  name:"Salary Credit",  amount:45000,  date:"1 May",   type:"credit", initials:"SC", color:"#34A853" },
  { id:"t3",  name:"Airtel Recharge",amount:-299,   date:"10 May",  type:"debit",  initials:"AR", color:"#EA4335" },
  { id:"t4",  name:"Priya Singh",    amount:-1200,  date:"8 May",   type:"debit",  initials:"PS", color:"#1A73E8" },
  { id:"t5",  name:"Amazon",         amount:-2499,  date:"5 May",   type:"debit",  initials:"AZ", color:"#FF9900" },
  { id:"t6",  name:"Zomato",         amount:-350,   date:"3 May",   type:"debit",  initials:"ZO", color:"#D32F2F" },
  { id:"t7",  name:"Amit Kumar",     amount:2000,   date:"28 Apr",  type:"credit", initials:"AK", color:"#34A853" },
  { id:"t8",  name:"Electricity Bill",amount:-1240, date:"25 Apr",  type:"debit",  initials:"EB", color:"#FBBC04" },
];

// ── HELPERS ────────────────────────────────────────────────────────────────
const PALETTE = ["#EA4335","#1A73E8","#34A853","#FBBC04","#9C27B0","#FF5722","#00BCD4","#E91E63","#FF9800"];
const randColor = () => PALETTE[Math.floor(Math.random()*PALETTE.length)];

function getBankFromUPI(u) {
  if (u.includes("okhdfc")||u.includes("hdfc")) return "HDFC Bank";
  if (u.includes("oksbi")||u.includes("sbi"))   return "State Bank of India";
  if (u.includes("okicici")||u.includes("icici"))return "ICICI Bank";
  if (u.includes("okaxis")||u.includes("axis"))  return "Axis Bank";
  if (u.includes("ybl"))  return "Yes Bank";
  if (u.includes("paytm"))return "Paytm Payments Bank";
  return "HDFC Bank";
}

function makeRecipient(input) {
  const s = input.trim();
  if (/^[6-9]\d{9}$/.test(s)) {
    return { name:"Mobile Transfer", upiId:`${s}@ybl`, phone:`+91 ${s.slice(0,5)} ${s.slice(5)}`, initials:s.slice(0,2), color:"#1A73E8", bankName:"Yes Bank" };
  }
  if (s.includes("@")) {
    const nm = s.split("@")[0];
    const cap = nm.charAt(0).toUpperCase()+nm.slice(1);
    return { name:cap, upiId:s, phone:`+91 80876 52723`, initials:nm.slice(0,2).toUpperCase(), color:randColor(), bankName:getBankFromUPI(s) };
  }
  const words = s.split(" ");
  const init = words.length>1 ? words[0][0].toUpperCase()+words[1][0].toUpperCase() : s.slice(0,2).toUpperCase();
  return { name:s, upiId:`${s.toLowerCase().replace(/\s+/g,".")}@okaxis`, phone:`+91 80876 52723`, initials:init, color:randColor(), bankName:"Axis Bank" };
}

function playSuccess() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    [[523.25,0],[659.25,0.12],[783.99,0.24],[1046.50,0.36]].forEach(([f,t]) => {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.frequency.value = f; osc.type = "sine";
      const s = ctx.currentTime + t;
      g.gain.setValueAtTime(0,s);
      g.gain.linearRampToValueAtTime(0.3, s+0.02);
      g.gain.exponentialRampToValueAtTime(0.001, s+0.45);
      osc.start(s); osc.stop(s+0.45);
    });
  } catch(_) {}
}

function fmtINR(n) {
  return new Intl.NumberFormat("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Math.abs(n));
}

// ── CSS ────────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
body{background:#111;display:flex;justify-content:center;align-items:center;min-height:100vh;font-family:'Google Sans','Roboto',sans-serif}
.gp-phone{
  width:390px;height:844px;background:#0B0B0B;border-radius:44px;
  box-shadow:0 0 0 1.5px #2a2a2a,0 40px 120px rgba(0,0,0,0.9);
  overflow:hidden;display:flex;flex-direction:column;position:relative;
}
.gp-scroll{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.gp-scroll::-webkit-scrollbar{display:none}
input,button{font-family:inherit;border:none;outline:none;cursor:pointer;background:transparent;color:inherit}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{from{transform:scale(.7);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes slideUp{from{transform:translateY(18px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
@keyframes checkPop{0%{transform:scale(0);opacity:0}65%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes scanLine{0%{top:4%}50%{top:88%}100%{top:4%}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.anim-fadeIn{animation:fadeIn .4s ease both}
.anim-scaleIn{animation:scaleIn .55s cubic-bezier(.34,1.56,.64,1) both}
.anim-slideUp{animation:slideUp .4s ease both}
.anim-slideInRight{animation:slideInRight .22s cubic-bezier(.4,0,.2,1) both}
.anim-checkPop{animation:checkPop .5s cubic-bezier(.34,1.56,.64,1) .25s both}
.row:active{background:rgba(255,255,255,.04)}
.btn-blue{background:#1A73E8;color:#fff;border-radius:28px;padding:14px;font-size:15px;font-weight:500;width:100%;transition:opacity .15s}
.btn-blue:active{opacity:.8}
.numkey{height:62px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:400;color:#fff;border-radius:8px;cursor:pointer;transition:background .08s;user-select:none}
.numkey:active{background:#1E1E1E}
.pin-dash{width:38px;height:2px;border-radius:1px;background:#444;transition:background .15s}
.pin-dash.filled{background:#333}
.divider{height:1px;background:#1E1E1E;margin:0 16px}
.sec-title{font-size:15px;font-weight:500;color:#fff;padding:14px 16px 8px}
.tag-green{background:#34A853;color:#fff;font-size:9.5px;font-weight:500;padding:2px 6px;border-radius:10px}
.shimmer{background:linear-gradient(90deg,#1E1E1E 25%,#2a2a2a 50%,#1E1E1E 75%);background-size:400% 100%;animation:shimmer 1.4s ease infinite}
@keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}
.scan-line{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#1A73E8 40%,#1A73E8 60%,transparent);animation:scanLine 2s ease-in-out infinite;pointer-events:none}
`;

// ── STATUS BAR ─────────────────────────────────────────────────────────────
function StatusBar({ dark = true }) {
  const fg = dark ? "#fff" : "#111";
  return (
    <div style={{ height:44,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 22px",flexShrink:0 }}>
      <span style={{ fontSize:12,fontWeight:600,color:fg }}>9:41</span>
      <div style={{ display:"flex",gap:6,alignItems:"center" }}>
        {/* Signal */}
        <svg width="16" height="11" viewBox="0 0 16 11"><rect x="0" y="5" width="2.5" height="6" rx=".6" fill={fg} opacity=".4"/><rect x="4" y="3" width="2.5" height="8" rx=".6" fill={fg} opacity=".6"/><rect x="8" y="1" width="2.5" height="10" rx=".6" fill={fg} opacity=".8"/><rect x="12" y="0" width="2.5" height="11" rx=".6" fill={fg}/></svg>
        {/* WiFi */}
        <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill={fg}/><path d="M7.5 5.5c1.4 0 2.6.6 3.5 1.5l1.1-1.1C11 4.7 9.3 4 7.5 4S4 4.7 2.9 5.9L4 7c.9-.9 2.1-1.5 3.5-1.5z" fill={fg} opacity=".7"/><path d="M7.5 2.5c2.4 0 4.5 1 6 2.5l1.1-1.1C12.8 1.9 10.3 1 7.5 1S2.2 1.9.4 3.9L1.5 5c1.5-1.5 3.6-2.5 6-2.5z" fill={fg} opacity=".4"/></svg>
        {/* Battery */}
        <div style={{ width:24,height:12,border:`1.5px solid ${fg}`,borderRadius:3,position:"relative",display:"flex",alignItems:"center",padding:"0 2px",gap:1 }}>
          <div style={{ flex:1,height:7,background:fg,borderRadius:1 }}/>
          <div style={{ position:"absolute",right:-4,top:"50%",transform:"translateY(-50%)",width:2.5,height:5,background:fg,borderRadius:1 }}/>
        </div>
      </div>
    </div>
  );
}

// ── BOTTOM NAV ─────────────────────────────────────────────────────────────
function BottomNav({ active, onNav }) {
  return (
    <div style={{ height:68,background:"#0B0B0B",borderTop:"1px solid #1C1C1C",display:"flex",alignItems:"center",flexShrink:0,paddingBottom:6 }}>
      {[
        { id:"home",  label:"Home",  icon:<HomeIco  active={active==="home"}  /> },
        { id:"money", label:"Money", icon:<MoneyIco active={active==="money"} /> },
        { id:"scan",  label:"",      icon:<ScanFab /> },
        { id:"you",   label:"You",   icon:<YouIco   active={active==="you"}   /> },
      ].map(it => (
        <div key={it.id} onClick={() => onNav(it.id)} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,paddingTop:8,cursor:"pointer" }}>
          {it.icon}
          {it.label && <span style={{ fontSize:11,color:active===it.id?"#1A73E8":"#9AA0A6" }}>{it.label}</span>}
        </div>
      ))}
    </div>
  );
}
function HomeIco({active}){return <svg width="24" height="24" viewBox="0 0 24 24" fill={active?"#1A73E8":"#9AA0A6"}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>}
function MoneyIco({active}){return <svg width="24" height="24" viewBox="0 0 24 24" fill={active?"#1A73E8":"#9AA0A6"}><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>}
function YouIco({active}){return <svg width="24" height="24" viewBox="0 0 24 24" fill={active?"#1A73E8":"#9AA0A6"}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>}
function ScanFab(){
  return (
    <div style={{ width:52,height:52,background:"#1A73E8",borderRadius:26,display:"flex",alignItems:"center",justifyContent:"center",marginTop:-18,boxShadow:"0 4px 14px rgba(26,115,232,.45)" }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5zm-6 8h1.5v1.5H13V13zm1.5 1.5H16V16h-1.5v-1.5zM16 13h1.5v1.5H16V13zm-3 3h1.5v1.5H13V16zm1.5 1.5H16V19h-1.5v-1.5zM16 16h1.5v1.5H16V16zm1.5-1.5H19V16h-1.5v-1.5zm0 3H19V19h-1.5v-1.5zM22 7h-2V4h-3V2h5v5zm0 15v-5h-2v3h-3v2h5zM2 22h5v-2H4v-3H2v5zM2 2v5h2V4h3V2H2z"/></svg>
    </div>
  );
}

// ── AVATAR ─────────────────────────────────────────────────────────────────
function Av({ name="", initials, color="#1A73E8", size=40 }) {
  const ini = initials || (name ? name.slice(0,2).toUpperCase() : "?");
  return (
    <div style={{ width:size,height:size,borderRadius:size/2,background:color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:size*.36,fontWeight:500,flexShrink:0 }}>
      {ini}
    </div>
  );
}

// ── GPAY LOGO SVG ──────────────────────────────────────────────────────────
function GPLogo({ size=88 }) {
  return (
    <svg width={size} height={size*1.05} viewBox="0 0 100 105" fill="none">
      <rect x="6"  y="26" width="52" height="66" rx="13" fill="#4285F4"/>
      <rect x="28" y="6"  width="52" height="66" rx="13" fill="#34A853"/>
      <rect x="16" y="48" width="52" height="50" rx="13" fill="#FBBC04"/>
      <rect x="38" y="26" width="52" height="66" rx="13" fill="#EA4335"/>
    </svg>
  );
}

// ── VERIFIED BADGE ────────────────────────────────────────────────────────
function VBadge(){
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#34A853">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SCREENS
// ─────────────────────────────────────────────────────────────────────────

// ── SPLASH ─────────────────────────────────────────────────────────────────
function SplashScreen({ done }) {
  useEffect(() => { const t = setTimeout(done, 2300); return () => clearTimeout(t); }, [done]);
  return (
    <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#0B0B0B",height:"100%" }}>
      <div className="anim-scaleIn"><GPLogo size={88}/></div>
      <div className="anim-fadeIn" style={{ animationDelay:".45s",position:"absolute",bottom:60,fontSize:28,fontWeight:400,color:"#fff",letterSpacing:-.5 }}>Google</div>
    </div>
  );
}

// ── HOME ───────────────────────────────────────────────────────────────────
function HomeScreen({ nav, txns, contacts }) {
  return (
    <div style={{ background:"#0B0B0B",paddingBottom:16 }} className="anim-fadeIn">

      {/* Search bar */}
      <div style={{ padding:"8px 16px 0" }}>
        <div style={{ background:"#1E1E1E",borderRadius:28,display:"flex",alignItems:"center",padding:"10px 16px",gap:10,cursor:"text" }} onClick={() => nav("search")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#9AA0A6"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <span style={{ flex:1,fontSize:14,color:"#9AA0A6" }}>Pay friends and merchants</span>
          <div style={{ width:32,height:32,borderRadius:16,background:"#34A853",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <YouIco active={false}/>
          </div>
        </div>
      </div>

      {/* Promo banner */}
      <div style={{ margin:"12px 16px",background:"#0D2340",borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",overflow:"hidden" }}>
        <div>
          <div style={{ fontSize:15,fontWeight:500,color:"#fff",lineHeight:1.35 }}>Safe, simple,<br/>flexible loans</div>
          <div style={{ marginTop:10,display:"inline-flex",alignItems:"center",gap:6,background:"#1A73E8",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:500,color:"#fff",cursor:"pointer" }}>
            Apply now <span>→</span>
          </div>
        </div>
        <div style={{ fontSize:44,opacity:.85,marginRight:4 }}>💰</div>
      </div>

      {/* Quick actions */}
      <div style={{ display:"flex",gap:4,padding:"4px 16px 8px" }}>
        {[
          { l:"Scan any\nQR code", i:<QIco/>, a:"scan" },
          { l:"Pay\nanyone",       i:<PIco/>, a:"pay"  },
          { l:"Bank\ntransfer",    i:<BkIco/>,a:"pay"  },
          { l:"Mobile\nrecharge",  i:<MbIco/>,a:"bills"},
        ].map((it,i) => (
          <div key={i} onClick={() => nav(it.a)} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:7,cursor:"pointer" }}>
            <div style={{ width:52,height:52,background:"#1E1E1E",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center" }}>{it.i}</div>
            <span style={{ fontSize:11,color:"#9AA0A6",textAlign:"center",lineHeight:1.3,whiteSpace:"pre-line" }}>{it.l}</span>
          </div>
        ))}
      </div>

      {/* UPI pills */}
      <div style={{ display:"flex",gap:8,padding:"0 16px 10px" }}>
        {[["Tap & Pay","View cards"],["UPI Lite","₹200"],["Rewards","₹400"]].map(([a,b],i) => (
          <div key={i} style={{ flex:1,background:"#1E1E1E",borderRadius:10,padding:"8px 10px",cursor:"pointer" }}>
            <div style={{ fontSize:11,color:"#9AA0A6",lineHeight:1.5 }}>{a}</div>
            <div style={{ fontSize:11,color:"#9AA0A6" }}>{b}</div>
          </div>
        ))}
      </div>

      {/* People */}
      <div className="sec-title">People</div>
      <div style={{ display:"flex",overflowX:"auto",padding:"0 16px 14px",gap:4,scrollbarWidth:"none" }}>
        {/* Self transfer */}
        <PeopleChip label="Self\ntransfer" color="#1E1E1E" ini={<svg width="22" height="22" viewBox="0 0 24 24" fill="#9AA0A6"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>} onClick={() => nav("pay")} />
        {contacts.slice(0,6).map(c => (
          <PeopleChip key={c.id} label={c.name.split(" ")[0]} color={c.color} ini={c.initials} onClick={() => nav("amount",{recipient:c})} />
        ))}
        <PeopleChip label="More" color="#1E1E1E" ini={<svg width="18" height="18" viewBox="0 0 24 24" fill="#9AA0A6"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>} onClick={() => nav("pay")} />
      </div>

      {/* Bills & recharges */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px 10px" }}>
        <span className="sec-title" style={{ padding:0 }}>Bills & recharges</span>
        <span style={{ fontSize:13,color:"#1A73E8",cursor:"pointer" }} onClick={() => nav("bills")}>Manage &gt;</span>
      </div>
      <div style={{ display:"flex",flexWrap:"wrap",padding:"0 16px",gap:8 }}>
        {[
          { n:"HBO",            bg:"#1E1E1E",  txt:"#fff",  fw:700 },
          { n:"Jio",            bg:"#D32F2F",  txt:"#fff",  fw:700 },
          { n:"Netflix",        bg:"#E50914",  txt:"#fff",  fw:700 },
          { n:"Amazon",         bg:"#FF9900",  txt:"#fff",  fw:700 },
          { n:"Mobile\nrecharge", em:"📱" },
          { n:"DTH/Cable\nTV",  em:"📺" },
          { n:"Electricity",    em:"⚡" },
          { n:"Credit\ncards",  em:"💳" },
        ].map((it,i) => (
          <div key={i} onClick={() => nav("bills")} style={{ width:72,height:72,borderRadius:16,background:it.bg||"#1E1E1E",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:4,overflow:"hidden" }}>
            {it.em ? <>
              <span style={{ fontSize:22 }}>{it.em}</span>
              <span style={{ fontSize:9.5,color:"#9AA0A6",textAlign:"center",marginTop:2,lineHeight:1.2,whiteSpace:"pre-line" }}>{it.n}</span>
            </> : <span style={{ fontSize:11,fontWeight:it.fw||500,color:it.txt||"#fff",textAlign:"center" }}>{it.n}</span>}
          </div>
        ))}
      </div>

      {/* Businesses */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px 10px" }}>
        <span style={{ fontSize:15,fontWeight:500,color:"#fff" }}>Businesses</span>
        <span style={{ fontSize:13,color:"#1A73E8" }}>Manage &gt;</span>
      </div>
      <div style={{ display:"flex",padding:"0 16px 4px",gap:14 }}>
        {[["Z","#D32F2F","ZOMATO P."],["S","#FF9900","Stanton"],["F","#2979FF","Flipkart"],["","#1E1E1E","More"]].map(([l,bg,nm],i) => (
          <div key={i} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer" }}>
            <div style={{ width:52,height:52,borderRadius:26,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff" }}>
              {l || <svg width="18" height="18" viewBox="0 0 24 24" fill="#9AA0A6"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>}
            </div>
            <span style={{ fontSize:10.5,color:"#9AA0A6",maxWidth:54,textAlign:"center",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{nm}</span>
          </div>
        ))}
      </div>

      {/* Gift cards */}
      <div style={{ display:"flex",gap:10,padding:"12px 16px" }}>
        <div style={{ flex:1,background:"#1E1E1E",borderRadius:14,padding:12 }}>
          <div style={{ fontSize:10,color:"#9AA0A6",marginBottom:3 }}>Subscriptions</div>
          <div style={{ fontSize:12,color:"#fff",lineHeight:1.35 }}>Buy plans from leading OTT platforms</div>
        </div>
        <div style={{ flex:1,background:"#1E1E1E",borderRadius:14,padding:12 }}>
          <div style={{ fontSize:10,color:"#9AA0A6",marginBottom:3 }}>Gift cards</div>
          <div style={{ fontSize:12,color:"#fff",lineHeight:1.35 }}>Get 30% cashback on HBO</div>
        </div>
      </div>

      {/* Offers */}
      <div className="sec-title">Offers & rewards</div>
      <div style={{ display:"flex",gap:18,padding:"0 16px 12px" }}>
        {[["🏆","#FBBC04","Rewards"],["🎁","#EA4335","Offers"],["🤝","#1A73E8","Referrals"]].map(([e,bg,l],i) => (
          <div key={i} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer" }}>
            <div style={{ width:48,height:48,borderRadius:24,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>{e}</div>
            <span style={{ fontSize:11.5,color:"#9AA0A6" }}>{l}</span>
          </div>
        ))}
      </div>
      <div style={{ margin:"0 16px 14px",background:"#1E1E1E",borderRadius:14,padding:13 }}>
        <div style={{ fontSize:12,color:"#9AA0A6",marginBottom:4 }}>New welcome back offer</div>
        <div style={{ fontSize:13,color:"#fff" }}>Earn ₹50 when you welcome friends back to Google Pay</div>
        <div style={{ fontSize:13,color:"#1A73E8",marginTop:8,cursor:"pointer" }}>Invite & earn</div>
      </div>

      {/* Manage money */}
      <div className="sec-title">Manage your money</div>
      <div style={{ display:"flex",gap:10,padding:"0 16px 4px" }}>
        <div style={{ flex:1,background:"#1E1E1E",borderRadius:14,padding:13 }}>
          <div style={{ fontSize:18,marginBottom:5 }}>🏛️</div>
          <div style={{ fontSize:13,color:"#fff",fontWeight:500 }}>Personal loan</div>
          <div style={{ fontSize:11,color:"#9AA0A6",marginTop:2 }}>Up to 10 lakh, instant approval</div>
          <div style={{ fontSize:13,color:"#1A73E8",marginTop:8 }}>Apply now</div>
        </div>
        <div style={{ flex:1,background:"#1E1E1E",borderRadius:14,padding:13 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
            <span style={{ fontSize:18 }}>💳</span>
            <span className="tag-green">₹0 joining fee</span>
          </div>
          <div style={{ fontSize:13,color:"#fff",fontWeight:500 }}>Credit card</div>
          <div style={{ fontSize:11,color:"#9AA0A6",marginTop:2 }}>Save up to ₹12,000 yearly</div>
          <div style={{ fontSize:13,color:"#1A73E8",marginTop:8 }}>Apply now</div>
        </div>
      </div>
      {[
        ["Check your CIBIL score for free","money"],
        ["See transaction history","money"],
        ["Check bank balance","money"],
      ].map(([t,a],i) => (
        <div key={i} className="row" onClick={() => nav(a)} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",borderTop:"1px solid #1E1E1E",cursor:"pointer" }}>
          <span style={{ fontSize:13,color:"#fff" }}>{t}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#9AA0A6"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
        </div>
      ))}
    </div>
  );
}

function PeopleChip({ label, color, ini, onClick }) {
  return (
    <div onClick={onClick} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:5,minWidth:70,cursor:"pointer" }}>
      <div style={{ width:52,height:52,borderRadius:26,background:color,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:17,fontWeight:500 }}>
        {typeof ini === "string" ? ini : ini}
      </div>
      <span style={{ fontSize:11,color:"#9AA0A6",textAlign:"center",maxWidth:66,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1.3,whiteSpace:"pre-line",textAlign:"center" }}>{label}</span>
    </div>
  );
}

function QIco(){return <svg width="22" height="22" viewBox="0 0 24 24" fill="#9AA0A6"><path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5z"/></svg>}
function PIco(){return <svg width="22" height="22" viewBox="0 0 24 24" fill="#9AA0A6"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>}
function BkIco(){return <svg width="22" height="22" viewBox="0 0 24 24" fill="#9AA0A6"><path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zM11.5 1L2 6v2h19V6l-9.5-5z"/></svg>}
function MbIco(){return <svg width="22" height="22" viewBox="0 0 24 24" fill="#9AA0A6"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>}

// ── SCANNER ────────────────────────────────────────────────────────────────
function ScannerScreen({ nav }) {
  const [flash, setFlash] = useState(false);
  const [scanned, setScanned] = useState(false);

  const doScan = () => {
    setScanned(true);
    setTimeout(() => nav("pay"), 700);
  };

  const CORNER_COLORS = ["#EA4335","#FBBC04","#34A853","#1A73E8"];
  const corners = [
    { top:0,left:0,  br:"4px 0 0 0",  bw:"3px 0 0 3px" },
    { top:0,right:0, br:"0 4px 0 0",  bw:"3px 3px 0 0" },
    { bottom:0,left:0, br:"0 0 0 4px",bw:"0 0 3px 3px" },
    { bottom:0,right:0,br:"0 0 4px 0",bw:"0 3px 3px 0" },
  ];

  return (
    <div style={{ height:"100%",display:"flex",flexDirection:"column",background:"#000",position:"relative" }}>
      {/* top bar */}
      <div style={{ position:"absolute",top:0,left:0,right:0,zIndex:20,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"52px 14px 10px" }}>
        <button onClick={() => nav("home")} style={{ color:"#fff",fontSize:22,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
        <div style={{ display:"flex",gap:8 }}>
          <button onClick={() => setFlash(f=>!f)} style={{ width:36,height:36,borderRadius:18,background:flash?"#FBBC04":"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>🔦</button>
          <button style={{ width:36,height:36,borderRadius:18,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5zm-1.5 9.5v3h-3v-3h3M11 13H5v6h6v-6zm6.5-6.5v3h-3v-3h3M19 5h-6v6h6V5z"/></svg>
          </button>
          <button style={{ color:"#fff",fontSize:20,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center" }}>⋮</button>
        </div>
      </div>

      {/* camera area */}
      <div style={{ flex:1,background:"#151515",position:"relative",overflow:"hidden",cursor:"pointer" }} onClick={doScan}>
        <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,.55)" }}/>

        {/* QR frame */}
        <div style={{ position:"absolute",width:230,height:230,left:"50%",top:"48%",transform:"translate(-50%,-50%)" }}>
          {corners.map((c,i) => (
            <div key={i} style={{ position:"absolute",width:28,height:28,...c,borderStyle:"solid",borderColor:scanned?"#34A853":CORNER_COLORS[i],borderWidth:c.bw,borderRadius:c.br }}/>
          ))}
          {!scanned && <div className="scan-line" style={{ top:"10%" }}/>}
          {scanned && (
            <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <div style={{ width:52,height:52,borderRadius:26,background:"#34A853",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
            </div>
          )}
        </div>

        <div style={{ position:"absolute",bottom:14,width:"100%",textAlign:"center",fontSize:12,color:"rgba(255,255,255,.55)" }}>
          Tap to simulate QR scan
        </div>
      </div>

      {/* bottom sheet */}
      <div style={{ background:"#1A1A1A",borderRadius:"24px 24px 0 0",padding:"18px 16px 24px" }}>
        <div style={{ width:36,height:4,background:"#333",borderRadius:2,margin:"0 auto 16px" }}/>
        <div style={{ display:"flex",justifyContent:"center",marginBottom:18 }}>
          <button style={{ background:"rgba(255,255,255,.1)",color:"#fff",borderRadius:24,padding:"10px 20px",fontSize:13,display:"flex",alignItems:"center",gap:8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
            Upload from gallery
          </button>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:15,color:"#fff",fontWeight:500,marginBottom:4 }}>Scan any QR code to pay</div>
          <div style={{ fontSize:12,color:"#9AA0A6" }}>Google Pay • Phonepe • PayTM • UPI</div>
        </div>
      </div>
    </div>
  );
}

// ── PAY ANYONE ────────────────────────────────────────────────────────────
function PayAnyoneScreen({ nav, contacts }) {
  const [q, setQ] = useState("");

  const filtered = q.trim()
    ? contacts.filter(c =>
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.upiId.includes(q) ||
        c.phone.replace(/\D/g,"").includes(q.replace(/\D/g,""))
      )
    : contacts;

  return (
    <div style={{ background:"#0B0B0B",minHeight:"100%" }} className="anim-slideInRight">
      {/* header */}
      <div style={{ padding:"10px 14px 0",display:"flex",alignItems:"center",gap:10 }}>
        <button onClick={() => nav("home")} style={{ color:"#fff",fontSize:22,flexShrink:0,padding:"4px 2px" }}>←</button>
        <div style={{ flex:1,background:"#1E1E1E",borderRadius:28,padding:"11px 16px",display:"flex",alignItems:"center",gap:10 }}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Enter UPI ID or number"
            style={{ flex:1,fontSize:14,color:"#fff" }} autoFocus/>
          <div style={{ width:28,height:28,borderRadius:14,background:"#1A73E8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",fontWeight:700,flexShrink:0 }}>123</div>
        </div>
        <button style={{ color:"#9AA0A6",fontSize:20,padding:"4px 2px" }}>⋮</button>
      </div>
      <div style={{ padding:"5px 16px 6px 52px",fontSize:12,color:"#9AA0A6" }}>
        Pay any <span style={{ color:"#9AA0A6",fontStyle:"italic" }}>UPI</span> app using name, number or UPI ID
      </div>

      {/* proceed pill */}
      {q.trim().length > 0 && (
        <div style={{ padding:"4px 16px 6px" }}>
          <div className="row" onClick={() => nav("amount",{recipient:makeRecipient(q.trim())})}
            style={{ background:"#1E1E1E",borderRadius:12,padding:"11px 14px",display:"flex",alignItems:"center",gap:12,cursor:"pointer" }}>
            <div style={{ width:40,height:40,borderRadius:20,background:"#1A73E8",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:18 }}>→</div>
            <div>
              <div style={{ fontSize:14,color:"#fff" }}>Pay "{q}"</div>
              <div style={{ fontSize:12,color:"#9AA0A6" }}>Proceed with entered UPI ID</div>
            </div>
          </div>
        </div>
      )}

      <div className="sec-title">Recent</div>
      {contacts.slice(0,3).map(c => <ContactRow key={c.id} c={c} onClick={() => nav("amount",{recipient:c})}/>)}

      <div className="divider" style={{ margin:"6px 16px" }}/>

      <div className="sec-title">All people on UPI</div>
      <SpecialRow icon="🔄" title="Self transfer" sub="Transfer money between your accounts"/>
      <SpecialRow icon="👥" title="Split expense" sub="Share expenses with a group"/>
      {filtered.map(c => <ContactRow key={c.id} c={c} onClick={() => nav("amount",{recipient:c})}/>)}
      <div style={{ height:20 }}/>
    </div>
  );
}

function ContactRow({ c, onClick }) {
  return (
    <div className="row" onClick={onClick} style={{ display:"flex",alignItems:"center",padding:"12px 16px",gap:12,cursor:"pointer" }}>
      <Av name={c.name} initials={c.initials} color={c.color} size={40}/>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:14,color:"#fff" }}>{c.name}</div>
        <div style={{ fontSize:12,color:"#9AA0A6" }}>Mobile recharge</div>
      </div>
    </div>
  );
}

function SpecialRow({ icon, title, sub }) {
  return (
    <div className="row" style={{ display:"flex",alignItems:"center",padding:"12px 16px",gap:12,cursor:"pointer" }}>
      <div style={{ width:40,height:40,borderRadius:20,background:"#1A73E8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>{icon}</div>
      <div>
        <div style={{ fontSize:14,color:"#fff" }}>{title}</div>
        <div style={{ fontSize:12,color:"#9AA0A6" }}>{sub}</div>
      </div>
    </div>
  );
}

// ── SEARCH ────────────────────────────────────────────────────────────────
function SearchScreen({ nav, contacts }) {
  const [q, setQ] = useState("");
  const filtered = q ? contacts.filter(c => c.name.toLowerCase().includes(q.toLowerCase())) : contacts;

  return (
    <div style={{ background:"#0B0B0B",minHeight:"100%" }} className="anim-slideInRight">
      <div style={{ padding:"10px 14px 8px",display:"flex",alignItems:"center",gap:10 }}>
        <button onClick={() => nav("home")} style={{ color:"#fff",fontSize:22 }}>←</button>
        <div style={{ flex:1,background:"#1E1E1E",borderRadius:28,padding:"11px 16px",display:"flex",alignItems:"center",gap:10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#9AA0A6"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Pay anyone on UPI" style={{ flex:1,fontSize:14,color:"#fff" }} autoFocus/>
        </div>
        <button style={{ color:"#9AA0A6",fontSize:20 }}>⋮</button>
      </div>

      <div className="sec-title">Suggested categories</div>
      <div style={{ display:"flex",gap:12,padding:"0 16px 12px",overflowX:"auto",scrollbarWidth:"none" }}>
        {[["📱","Mobile\nrecharge"],["📺","DTH/\nCable TV"],["⚡","Electricity"],["📞","Postpaid\nmobile"],["💳","Credit\ncards"]].map(([e,l],i) => (
          <div key={i} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:5,minWidth:60,cursor:"pointer" }}>
            <div style={{ width:52,height:52,borderRadius:26,background:"#1A73E8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>{e}</div>
            <span style={{ fontSize:10.5,color:"#9AA0A6",textAlign:"center",whiteSpace:"pre-line",lineHeight:1.2 }}>{l}</span>
          </div>
        ))}
      </div>

      <div className="sec-title">Recent</div>
      {contacts.slice(0,5).map(c => <ContactRow key={c.id} c={c} onClick={() => nav("amount",{recipient:c})}/>)}

      <div className="divider" style={{ margin:"6px 16px" }}/>
      <div className="sec-title">All people on UPI</div>
      <SpecialRow icon="🔄" title="Self transfer" sub="Transfer money between your accounts"/>
      <SpecialRow icon="👥" title="Split expense" sub="Share expenses with a group"/>
      {filtered.map(c => <ContactRow key={c.id} c={c} onClick={() => nav("amount",{recipient:c})}/>)}
      <div style={{ height:20 }}/>
    </div>
  );
}

// ── AMOUNT ────────────────────────────────────────────────────────────────
function AmountScreen({ nav, recipient }) {
  const [amt, setAmt] = useState("");
  const [note, setNote] = useState("");

  const tap = k => {
    if (k === "." && amt.includes(".")) return;
    if (amt === "0" && k !== ".") { setAmt(k); return; }
    if (amt.length >= 8) return;
    setAmt(p => p + k);
  };
  const del = () => setAmt(p => p.slice(0,-1));

  return (
    <div style={{ background:"#0B0B0B",height:"100%",display:"flex",flexDirection:"column" }} className="anim-slideInRight">
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px" }}>
        <button onClick={() => nav("pay")} style={{ color:"#fff",fontSize:22,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
        <button style={{ color:"#9AA0A6",fontSize:20 }}>⋮</button>
      </div>

      {/* Recipient info */}
      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 16px 10px",gap:9 }}>
        <Av name={recipient?.name} initials={recipient?.initials} color={recipient?.color} size={58}/>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:18,color:"#fff",fontWeight:500 }}>Paying {recipient?.name}</div>
          <div style={{ display:"flex",alignItems:"center",gap:4,justifyContent:"center",marginTop:4 }}>
            <VBadge/>
            <span style={{ fontSize:12,color:"#9AA0A6" }}>Banking name: {recipient?.bankName || recipient?.name}</span>
          </div>
          <div style={{ fontSize:12,color:"#9AA0A6",marginTop:2 }}>{recipient?.phone}</div>
        </div>
      </div>

      {/* Amount display */}
      <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",paddingBottom:8 }}>
        <div style={{ display:"flex",alignItems:"baseline",gap:4 }}>
          <span style={{ fontSize:amt?30:26,color:amt?"#fff":"#333",fontWeight:400 }}>₹</span>
          <span style={{ fontSize:amt?52:40,color:amt?"#fff":"#333",fontWeight:300,letterSpacing:-2,minWidth:60,textAlign:"center" }}>{amt||"0"}</span>
        </div>
        <div style={{ marginTop:12,background:"#1E1E1E",borderRadius:20,padding:"9px 18px" }}>
          <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Add note"
            style={{ fontSize:13,color:"#9AA0A6",textAlign:"center",minWidth:100 }}/>
        </div>
      </div>

      {/* Numpad */}
      <div style={{ padding:"0 16px 16px" }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)" }}>
          {"1 2 3 4 5 6 7 8 9 . 0 ⌫".split(" ").map((k,i) => (
            <div key={i} className="numkey" onClick={() => k==="⌫"?del():tap(k)}>{k}</div>
          ))}
        </div>
        <button className="btn-blue" style={{ marginTop:6,opacity:(!amt||parseFloat(amt)<=0)?.4:1 }}
          disabled={!amt||parseFloat(amt)<=0}
          onClick={() => nav("bank",{recipient,amount:parseFloat(amt),note})}>
          Pay ₹{amt||"0"}
        </button>
      </div>
    </div>
  );
}

// ── BANK SELECT ───────────────────────────────────────────────────────────
function BankScreen({ nav, recipient, amount, note }) {
  const [sel, setSel] = useState("b1");
  const bgColors = { "HDFC Bank":"#004C8F","ICICI Bank":"#F16522","Axis Bank":"#800000" };

  return (
    <div style={{ background:"#0B0B0B",height:"100%",display:"flex",flexDirection:"column" }} className="anim-slideInRight">
      <div style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 16px 18px" }}>
        <button onClick={() => nav("amount",{recipient})} style={{ color:"#fff",fontSize:22 }}>←</button>
        <span style={{ fontSize:16,fontWeight:500,color:"#fff" }}>Select payment account</span>
      </div>
      <div style={{ padding:"0 16px 6px",fontSize:13,color:"#9AA0A6" }}>
        Pay ₹{fmtINR(amount)} to {recipient?.name}
      </div>

      <div style={{ flex:1,padding:"8px 16px" }}>
        {BANKS_DATA.map(b => (
          <div key={b.id} onClick={() => setSel(b.id)} style={{
            display:"flex",alignItems:"center",gap:14,padding:"15px",
            background:sel===b.id?"#1A2840":"#1E1E1E",
            borderRadius:14,marginBottom:10,cursor:"pointer",
            border:`1px solid ${sel===b.id?"#1A73E8":"transparent"}`,
          }}>
            <div style={{ width:44,height:44,borderRadius:22,background:bgColors[b.name]||"#333",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",textAlign:"center",lineHeight:1.2 }}>
              {b.name.split(" ")[0].slice(0,4)}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14,color:"#fff",fontWeight:500 }}>{b.name} {b.acno}</div>
              <div style={{ fontSize:12,color:"#9AA0A6" }}>{b.type} • {b.upi}</div>
            </div>
            {sel===b.id && (
              <div style={{ width:22,height:22,borderRadius:11,background:"#1A73E8",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding:"12px 16px 24px" }}>
        <button className="btn-blue" style={{ borderRadius:12 }}
          onClick={() => nav("pin",{recipient,amount,note,bank:BANKS_DATA.find(b=>b.id===sel)})}>
          Continue
        </button>
      </div>
    </div>
  );
}

// ── UPI PIN (white bg to match real GPay) ─────────────────────────────────
function PinScreen({ nav, recipient, amount, note, bank }) {
  const [pin, setPin] = useState([]);

  const tap = k => {
    if (pin.length >= 4) return;
    const np = [...pin, k];
    setPin(np);
    if (np.length === 4) setTimeout(() => nav("processing",{recipient,amount,note,bank}), 280);
  };
  const del = () => setPin(p => p.slice(0,-1));

  return (
    <div style={{ background:"#fff",height:"100%",display:"flex",flexDirection:"column" }}>
      {/* UPI header row */}
      <div style={{ background:"#F5F5F5",padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #E0E0E0" }}>
        <div>
          <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4 }}>
            <span style={{ fontSize:12,color:"#666" }}>{bank?.acno||"XXXX2020"}</span>
          </div>
          <div style={{ background:"#097939",borderRadius:4,padding:"2px 8px",display:"inline-block" }}>
            <span style={{ fontSize:11,fontWeight:700,color:"#fff",letterSpacing:.5 }}>UPI</span>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:11,color:"#666" }}>To: <strong style={{ color:"#333" }}>{recipient?.name}</strong></div>
          <div style={{ fontSize:11,color:"#666" }}>Sending: <strong>₹ {fmtINR(amount)}</strong></div>
        </div>
      </div>

      <div style={{ textAlign:"center",padding:"30px 0 20px",fontSize:13,fontWeight:500,color:"#333",letterSpacing:.5 }}>ENTER 4-DIGIT UPI PIN</div>

      {/* dashes */}
      <div style={{ display:"flex",justifyContent:"center",gap:16,marginBottom:20 }}>
        {[0,1,2,3].map(i => (
          <div key={i} className={`pin-dash${pin.length>i?" filled":""}`}/>
        ))}
      </div>

      {/* warning */}
      <div style={{ margin:"0 16px 10px",background:"#FFF8E1",border:"1px solid #FFE082",borderRadius:8,padding:"10px 12px",display:"flex",alignItems:"center",gap:8 }}>
        <span style={{ fontSize:17 }}>⚠️</span>
        <span style={{ fontSize:12,color:"#444",lineHeight:1.4 }}>You are transferring from your account to <strong>{recipient?.bankName||"Marcus Mercer"}</strong></span>
      </div>

      <div style={{ flex:1 }}/>

      {/* Numpad */}
      <div style={{ padding:"0 16px 20px" }}>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)" }}>
          {"1 2 3 4 5 6 7 8 9  0 ⌫".split(" ").map((k,i) => (
            <div key={i} onClick={() => k==="⌫"?del():k?tap(k):null}
              style={{ height:64,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"#222",cursor:k?"pointer":"default",borderRadius:8,transition:"background .08s" }}
              onMouseDown={e => k && (e.currentTarget.style.background="#F5F5F5")}
              onMouseUp={e   => (e.currentTarget.style.background="transparent")}
            >{k}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PROCESSING ────────────────────────────────────────────────────────────
function ProcessingScreen({ nav, recipient, amount, bank }) {
  useEffect(() => {
    const t = setTimeout(() => nav("success",{recipient,amount,bank}), 2400);
    return () => clearTimeout(t);
  }, [nav, recipient, amount, bank]);

  return (
    <div style={{ background:"#0B0B0B",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,position:"relative" }}>
      <Av name={recipient?.name} initials={recipient?.initials} color={recipient?.color} size={66}/>
      <div style={{ fontSize:17,color:"#fff",fontWeight:500 }}>{recipient?.name}</div>
      <div style={{ fontSize:32,color:"#fff",fontWeight:300,letterSpacing:-1 }}>₹ {fmtINR(amount)}</div>
      <div style={{ marginTop:18,width:34,height:34,border:"3px solid #1E1E1E",borderTopColor:"#1A73E8",borderRadius:17,animation:"spin .75s linear infinite" }}/>

      <div style={{ position:"absolute",bottom:0,left:0,right:0,background:"#1E1E1E",borderRadius:"24px 24px 0 0",padding:"13px 16px",display:"flex",alignItems:"center",gap:10 }}>
        <span style={{ fontSize:16 }}>🔒</span>
        <span style={{ fontSize:14,color:"#9AA0A6" }}>Transferring ₹{fmtINR(amount)}</span>
      </div>
    </div>
  );
}

// ── SUCCESS ───────────────────────────────────────────────────────────────
function SuccessScreen({ nav, recipient, amount, bank, onAddTxn }) {
  useEffect(() => {
    playSuccess();
    onAddTxn && onAddTxn({ recipient, amount, bank });
  }, []);

  const now = new Date();
  const dateStr = `${now.getDate()} ${now.toLocaleString("en-IN",{month:"long"})} ${now.getFullYear()}, ${now.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true})}`;

  return (
    <div style={{ background:"#0B0B0B",height:"100%",display:"flex",flexDirection:"column" }}>
      <div style={{ display:"flex",justifyContent:"flex-end",padding:"10px 16px" }}>
        <button style={{ color:"#9AA0A6",fontSize:20 }}>⋮</button>
      </div>

      <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px" }}>
        {/* Check */}
        <div className="anim-checkPop" style={{ width:72,height:72,borderRadius:36,background:"#1A73E8",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </div>

        {/* Amount */}
        <div className="anim-slideUp" style={{ animationDelay:".5s",textAlign:"center",marginTop:22 }}>
          <span style={{ fontSize:38,fontWeight:300,color:"#fff",letterSpacing:-1 }}>₹ {fmtINR(amount)}</span>
        </div>

        {/* Details */}
        <div className="anim-fadeIn" style={{ animationDelay:".75s",textAlign:"center",marginTop:16 }}>
          <div style={{ fontSize:14,color:"#9AA0A6",marginBottom:4 }}>Paid to</div>
          <div style={{ fontSize:22,color:"#fff",fontWeight:500 }}>{recipient?.name}</div>
          <div style={{ display:"flex",alignItems:"center",gap:4,justifyContent:"center",marginTop:7 }}>
            <VBadge/>
            <span style={{ fontSize:13,color:"#9AA0A6" }}>Banking name: {recipient?.bankName||recipient?.name}</span>
          </div>
          <div style={{ fontSize:12,color:"#9AA0A6",marginTop:4 }}>{dateStr}</div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ padding:"0 24px 14px",display:"flex",gap:10 }}>
        {[
          { l:"Share",        i:<svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>, a:null },
          { l:"Open scanner", i:<svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M9.5 6.5v3h-3v-3h3M11 5H5v6h6V5z"/></svg>, a:"scan" },
        ].map((it,i) => (
          <button key={i} onClick={() => it.a && nav(it.a)} style={{ flex:1,background:"#1E1E1E",border:"none",borderRadius:24,padding:"13px 18px",color:"#fff",fontSize:14,fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:8,cursor:"pointer" }}>
            {it.i}{it.l}
          </button>
        ))}
      </div>

      {/* BHIM UPI */}
      <div style={{ display:"flex",justifyContent:"center",alignItems:"center",gap:6,paddingBottom:22 }}>
        <span style={{ fontSize:9,color:"#9AA0A6",letterSpacing:.5 }}>POWERED BY</span>
        <div style={{ background:"#097939",borderRadius:4,padding:"2px 8px" }}>
          <span style={{ fontSize:11,fontWeight:700,color:"#fff",letterSpacing:.5 }}>UPI</span>
        </div>
      </div>
    </div>
  );
}

// ── MONEY ─────────────────────────────────────────────────────────────────
function MoneyScreen({ nav, txns }) {
  const stars = useMemo(() => Array.from({length:14}, (_,i) => ({
    l:`${5+i*6.5}%`, t:`${8+(i%5)*12}%`, s:(i%3)+1, o:.3+.5*(i%2),
  })), []);

  return (
    <div style={{ background:"#0B0B0B",minHeight:"100%" }} className="anim-fadeIn">
      {/* Banner */}
      <div style={{ height:176,background:"linear-gradient(175deg,#0D2B45 0%,#0A1825 65%,#0B0B0B 100%)",position:"relative",display:"flex",alignItems:"flex-end",padding:"0 16px 16px",flexShrink:0 }}>
        {stars.map((s,i)=><div key={i} style={{ position:"absolute",width:s.s,height:s.s,background:"#fff",borderRadius:"50%",opacity:s.o,left:s.l,top:s.t }}/>)}
        <button style={{ position:"absolute",top:10,right:14,color:"#9AA0A6",fontSize:18 }}>⋮</button>
        <span style={{ fontSize:32,fontWeight:400,color:"#fff" }}>Money</span>
      </div>

      {/* Banks */}
      {BANKS_DATA.map((b,i) => {
        const bg = b.name.includes("HDFC")?"#004C8F":b.name.includes("ICICI")?"#F16522":"#800000";
        return (
          <div key={b.id}>
            <div style={{ display:"flex",alignItems:"center",padding:"14px 16px",gap:12 }}>
              <div style={{ width:44,height:44,borderRadius:22,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",textAlign:"center" }}>
                {b.name.split(" ")[0].slice(0,4)}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14,color:"#fff" }}>{b.name} ••••{b.acno.slice(-4)}</div>
                <div style={{ fontSize:12,color:"#9AA0A6" }}>{b.type} account</div>
              </div>
              <span style={{ fontSize:13,color:"#1A73E8",cursor:"pointer" }}>Check balance</span>
            </div>
            {i < BANKS_DATA.length-1 && <div className="divider"/>}
          </div>
        );
      })}

      {/* CIBIL */}
      <div className="divider"/>
      <div style={{ display:"flex",alignItems:"center",padding:"14px 16px",gap:12 }}>
        <div style={{ width:44,height:44,borderRadius:22,background:"#1E1E1E",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>📊</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14,color:"#fff" }}>CIBIL score</div>
          <div style={{ fontSize:12,color:"#9AA0A6" }}>Tap for full report</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:20,color:"#fff",fontWeight:500 }}>791</div>
          <div style={{ fontSize:11,color:"#34A853" }}>Excellent</div>
        </div>
      </div>

      {/* Credits */}
      <div className="sec-title">Credits for you</div>
      <div style={{ display:"flex",gap:10,padding:"0 16px 10px" }}>
        <div style={{ flex:1,background:"#1E1E1E",borderRadius:14,padding:13 }}>
          <div style={{ fontSize:18,marginBottom:5 }}>💰</div>
          <div style={{ fontSize:13,color:"#fff",fontWeight:500 }}>Personal loan</div>
          <div style={{ fontSize:11,color:"#9AA0A6",marginTop:2 }}>Up to 10 lakh, instant approval</div>
          <div style={{ fontSize:13,color:"#1A73E8",marginTop:8 }}>Apply</div>
        </div>
        <div style={{ flex:1,background:"#1E1E1E",borderRadius:14,padding:13 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
            <span style={{ fontSize:18 }}>💳</span>
            <span className="tag-green">₹0 joining fee</span>
          </div>
          <div style={{ fontSize:13,color:"#fff",fontWeight:500 }}>Credit card</div>
          <div style={{ fontSize:11,color:"#9AA0A6",marginTop:2 }}>Save up to ₹12,000 yearly</div>
          <div style={{ fontSize:13,color:"#1A73E8",marginTop:8 }}>Apply</div>
        </div>
      </div>

      {/* Txn history */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 16px 6px" }}>
        <span style={{ fontSize:15,fontWeight:500,color:"#fff" }}>Transaction history</span>
        <span style={{ fontSize:13,color:"#1A73E8",cursor:"pointer" }}>See all &gt;</span>
      </div>
      {txns.map(t => (
        <div key={t.id} style={{ display:"flex",alignItems:"center",padding:"12px 16px",gap:12 }}>
          <Av name={t.name} initials={t.initials} color={t.color} size={40}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14,color:"#fff" }}>{t.name}</div>
            <div style={{ fontSize:12,color:"#9AA0A6" }}>{t.date}</div>
          </div>
          <div style={{ fontSize:15,color:t.type==="credit"?"#34A853":"#fff",fontWeight:500 }}>
            {t.type==="credit"?"+":""}₹{Math.abs(t.amount).toLocaleString("en-IN")}
          </div>
        </div>
      ))}
      <div style={{ height:20 }}/>
    </div>
  );
}

// ── YOU ───────────────────────────────────────────────────────────────────
function YouScreen({ nav }) {
  const stars = useMemo(() => Array.from({length:10},(_,i)=>({l:`${8+i*9}%`,t:`${5+i*8}%`,o:.25+.4*(i%3)})),[]);
  return (
    <div style={{ background:"#0B0B0B",minHeight:"100%" }} className="anim-fadeIn">
      {/* Profile header */}
      <div style={{ background:"linear-gradient(175deg,#1A2E1A 0%,#0D2010 65%,#0B0B0B 100%)",padding:"14px 16px 28px",position:"relative",minHeight:210 }}>
        {stars.map((s,i)=><div key={i} style={{ position:"absolute",width:2,height:2,background:"#fff",borderRadius:"50%",opacity:s.o,left:s.l,top:s.t }}/>)}
        <button style={{ position:"absolute",top:10,right:14,color:"#9AA0A6",fontSize:18 }}>⋮</button>
        <div style={{ marginTop:8 }}>
          <div style={{ fontSize:28,fontWeight:400,color:"#fff",marginBottom:7 }}>Alex Mercer</div>
          <div style={{ fontSize:11,color:"rgba(255,255,255,.55)",marginBottom:2 }}>UPI ID:</div>
          <div style={{ fontSize:13,color:"rgba(255,255,255,.8)",marginBottom:7 }}>alexmercer@okicicibank</div>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <span style={{ fontSize:13,color:"rgba(255,255,255,.65)" }}>8812198142</span>
            <div style={{ background:"#1A73E8",borderRadius:14,padding:"3px 10px",display:"flex",alignItems:"center",gap:4 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              <span style={{ fontSize:11,color:"#fff" }}>UPI number</span>
            </div>
          </div>
        </div>
        {/* Avatar */}
        <div style={{ position:"absolute",right:16,bottom:24,width:62,height:62,borderRadius:31,background:"#34A853",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#fff",fontWeight:500,border:"2px solid rgba(255,255,255,.2)" }}>AM</div>
      </div>

      {/* Rewards */}
      <div style={{ display:"flex",gap:10,padding:"0 16px",marginTop:-4 }}>
        <div style={{ flex:1,background:"#2A2000",borderRadius:22,padding:"10px 14px",display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ fontSize:16 }}>🏆</span>
          <div>
            <div style={{ fontSize:14,color:"#FBBC04",fontWeight:500 }}>₹400</div>
            <div style={{ fontSize:10,color:"#9AA0A6" }}>Rewards earned</div>
          </div>
        </div>
        <div style={{ flex:1,background:"#0D2840",borderRadius:22,padding:"10px 14px",display:"flex",alignItems:"center",gap:8 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#9AA0A6"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3z"/></svg>
          <div>
            <div style={{ fontSize:14,color:"#fff",fontWeight:500 }}>get ₹200</div>
            <div style={{ fontSize:10,color:"#9AA0A6" }}>Rewards earned</div>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div style={{ margin:"12px 16px",background:"#1E1E1E",borderRadius:16,padding:"14px 16px" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
          <span style={{ fontSize:13,color:"#fff" }}>Set up payment methods 2/3</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#9AA0A6"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
        </div>
        <div style={{ display:"flex",justifyContent:"space-around" }}>
          {[
            { e:"🏦", l:"Bank account", s:"3 accounts", active:false },
            { e:"💳", l:"RuPay credit card", s:"Pay with UPI", active:true },
            { e:"⚡", l:"UPI Lite", s:"Balance: 200", active:false },
          ].map((it,i) => (
            <div key={i} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:4,maxWidth:82 }}>
              <div style={{ width:48,height:48,borderRadius:24,background:it.active?"#1A73E8":"#2A2A2A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,border:it.active?"2px dashed rgba(255,255,255,.35)":"none",position:"relative" }}>
                {it.e}
                {it.active && <div style={{ position:"absolute",bottom:-4,right:-4,width:16,height:16,borderRadius:8,background:"#34A853",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",fontWeight:700 }}>+</div>}
              </div>
              <div style={{ fontSize:10.5,color:"#fff",textAlign:"center",lineHeight:1.25 }}>{it.l}</div>
              <div style={{ fontSize:9.5,color:"#9AA0A6",textAlign:"center" }}>{it.s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings list */}
      {[
        { e:"💳", l:"Pay with credit or debit cards", s:"Contactless payments, bills, and more", r:"Add" },
        { e:"🔲", l:"Your QR code", s:"use to receive money from any UPI app" },
        { e:"🔄", l:"Autopay", s:"No pending requests" },
        { e:"🤝", l:"UPI Circle", s:"Help people you trust make UPI payments" },
        { e:"⚙️", l:"Settings" },
        { e:"👤", l:"Manage Google account" },
        { e:"❓", l:"Get help" },
        { e:"🌐", l:"Language", s:"English" },
      ].map((it,i,arr) => (
        <div key={i}>
          <div className="row" style={{ display:"flex",alignItems:"center",padding:"14px 16px",gap:14,cursor:"pointer" }}>
            <div style={{ width:36,height:36,borderRadius:18,background:"#1E1E1E",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17 }}>{it.e}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14,color:"#fff" }}>{it.l}</div>
              {it.s && <div style={{ fontSize:12,color:"#9AA0A6",marginTop:1 }}>{it.s}</div>}
            </div>
            {it.r && <span style={{ fontSize:13,color:"#1A73E8" }}>{it.r}</span>}
          </div>
          {i < arr.length-1 && <div className="divider"/>}
        </div>
      ))}
      <div style={{ height:20 }}/>
    </div>
  );
}

// ── BILLS ─────────────────────────────────────────────────────────────────
function BillsScreen({ nav }) {
  return (
    <div style={{ background:"#0B0B0B",minHeight:"100%" }} className="anim-slideInRight">
      <div style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 16px 8px" }}>
        <button onClick={() => nav("home")} style={{ color:"#fff",fontSize:22 }}>←</button>
        <span style={{ fontSize:18,fontWeight:500,color:"#fff" }}>Bills & Recharges</span>
      </div>

      <div style={{ padding:"6px 16px 10px" }}>
        <div style={{ background:"#1E1E1E",borderRadius:26,display:"flex",alignItems:"center",padding:"10px 16px",gap:10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#9AA0A6"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input placeholder="Search bills & services" style={{ fontSize:14,color:"#9AA0A6",flex:1 }}/>
        </div>
      </div>

      <div className="sec-title">All services</div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,padding:"4px 16px 16px" }}>
        {[
          ["📱","Mobile recharge"],["📺","DTH/Cable TV"],["⚡","Electricity"],["📞","Postpaid mobile"],
          ["💳","Credit cards"],["🌐","Broadband"],["🔥","Gas"],["🛡️","Insurance"],
          ["📚","Education"],["💧","Water"],["🏠","Housing"],["❤️","Donations"],
        ].map(([e,l],i) => (
          <div key={i} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer" }}>
            <div style={{ width:56,height:56,borderRadius:28,background:"#1A73E8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>{e}</div>
            <span style={{ fontSize:10.5,color:"#9AA0A6",textAlign:"center",lineHeight:1.25 }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── APP SHELL ─────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [params, setParams] = useState({});
  const [txns, setTxns] = useState(INIT_TRANSACTIONS);

  const nav = useCallback((to, p={}) => { setScreen(to); setParams(p); }, []);

  const addTxn = useCallback(({ recipient, amount }) => {
    const now = new Date();
    const date = `${now.getDate()} ${now.toLocaleString("en-IN",{month:"short"})}`;
    setTxns(prev => [{
      id: `t${Date.now()}`,
      name: recipient?.name,
      amount: -amount,
      date,
      type: "debit",
      initials: recipient?.initials,
      color: recipient?.color,
    }, ...prev]);
  }, []);

  const navItems = { home:"home", money:"money", you:"you" };
  const showNav = screen in navItems;
  const whitePin = screen === "pin";

  const render = () => {
    const p = params;
    switch (screen) {
      case "splash":      return <SplashScreen done={() => nav("home")}/>;
      case "home":        return <HomeScreen nav={nav} txns={txns} contacts={CONTACTS}/>;
      case "scan":        return <ScannerScreen nav={nav}/>;
      case "pay":         return <PayAnyoneScreen nav={nav} contacts={CONTACTS}/>;
      case "search":      return <SearchScreen nav={nav} contacts={CONTACTS}/>;
      case "amount":      return <AmountScreen nav={nav} recipient={p.recipient}/>;
      case "bank":        return <BankScreen nav={nav} recipient={p.recipient} amount={p.amount} note={p.note}/>;
      case "pin":         return <PinScreen nav={nav} recipient={p.recipient} amount={p.amount} note={p.note} bank={p.bank}/>;
      case "processing":  return <ProcessingScreen nav={nav} recipient={p.recipient} amount={p.amount} bank={p.bank}/>;
      case "success":     return <SuccessScreen nav={nav} recipient={p.recipient} amount={p.amount} bank={p.bank} onAddTxn={addTxn}/>;
      case "money":       return <MoneyScreen nav={nav} txns={txns}/>;
      case "you":         return <YouScreen nav={nav}/>;
      case "bills":       return <BillsScreen nav={nav}/>;
      default:            return <HomeScreen nav={nav} txns={txns} contacts={CONTACTS}/>;
    }
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",background:"#111",padding:16 }}>
        <div className="gp-phone">
          {screen !== "splash" && screen !== "pin" && <StatusBar/>}
          {screen === "pin" && (
            <div style={{ height:44,background:"#F5F5F5",flexShrink:0 }}/>
          )}
          <div className="gp-scroll">{render()}</div>
          {showNav && <BottomNav active={navItems[screen]} onNav={id => id==="scan"?nav("scan"):nav(id)}/>}
        </div>
      </div>
    </>
  );
}