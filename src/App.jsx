import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchBornOnDate } from './api/wikipedia';
import { analyzePersonality } from './utils/personality';

/* ═══════════════════════════════════════════════
   STYLES — all inline, no Tailwind dependency
   ═══════════════════════════════════════════════ */
const s = {
  page: { minHeight:'100vh', background:'#020308', overflow:'hidden', position:'relative' },
  glass: { background:'rgba(10,16,36,0.75)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', border:'1px solid rgba(212,168,83,0.12)', borderRadius:16 },
  glassLight: { background:'rgba(16,24,48,0.5)', backdropFilter:'blur(12px)', border:'1px solid rgba(212,168,83,0.08)', borderRadius:12 },
  goldText: { background:'linear-gradient(135deg, #d4a853, #f0d878, #d4a853)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' },
  gold: '#d4a853', goldBright: '#f0d878', blue: '#4a9eff', cyan: '#00e5ff',
  white: '#fff', gray: '#8899aa', dim: '#445566', void: '#020308', deep: '#060e1a',
  input: { width:'100%', background:'transparent', border:'none', borderBottom:'2px solid rgba(255,255,255,0.1)', color:'#fff', fontSize:28, textAlign:'center', padding:'10px 0', outline:'none', fontFamily:'Georgia,serif' },
  btn: { width:'100%', padding:'14px 0', background:'linear-gradient(90deg, rgba(212,168,83,0.2), rgba(212,168,83,0.08))', border:'1px solid rgba(212,168,83,0.25)', color:'#d4a853', fontSize:18, fontFamily:'Georgia,serif', cursor:'pointer', letterSpacing:4, transition:'all 0.3s' },
  corner: { position:'fixed', width:32, height:32, zIndex:40, pointerEvents:'none' },
  hud: { position:'fixed', top:0, left:0, right:0, zIndex:50, pointerEvents:'none', display:'flex', justifyContent:'space-between', padding:'12px 24px', fontSize:10, color:'rgba(255,255,255,0.15)', fontFamily:'Consolas,monospace', letterSpacing:3 },
  card: { background:'rgba(16,24,48,0.55)', backdropFilter:'blur(12px)', border:'1px solid rgba(212,168,83,0.1)', borderRadius:12, padding:18, marginBottom:12, display:'flex', alignItems:'flex-start', gap:14, cursor:'pointer', transition:'all 0.3s' },
  avatar: { width:44, height:44, borderRadius:'50%', background:'rgba(212,168,83,0.1)', border:'1px solid rgba(212,168,83,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' },
  tag: { padding:'6px 16px', border:'1px solid rgba(212,168,83,0.18)', color:'rgba(212,168,83,0.8)', fontSize:13, fontFamily:'Georgia,serif' },
  scanBar: { width:320, height:3, background:'rgba(255,255,255,0.04)', borderRadius:2, overflow:'hidden' },
  scanFill: (p) => ({ width:`${p}%`, height:'100%', background:'linear-gradient(90deg, #4a9eff, #d4a853, #00e5ff)', borderRadius:2, transition:'width 0.3s' }),
  timelineDot: { position:'absolute', left:'50%', transform:'translateX(-50%)', width:12, height:12, borderRadius:'50%', border:'2px solid rgba(212,168,83,0.5)', background:'#020308', zIndex:10 },
  timelineLine: { position:'absolute', left:'50%', top:0, bottom:0, width:1, background:'linear-gradient(180deg, rgba(212,168,83,0.3), rgba(74,158,255,0.15), transparent)' },
};

/* ═══════════════════════════════════════════════
   STAR CANVAS
   ═══════════════════════════════════════════════ */
function StarCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const cvs = ref.current; if(!cvs) return;
    const ctx = cvs.getContext('2d'); let id, gradBg;
    let tid;

    const buildBg = () => {
      cvs.width = window.innerWidth; cvs.height = window.innerHeight;
      gradBg = ctx.createRadialGradient(cvs.width/2, cvs.height/3, 0, cvs.width/2, cvs.height/3, cvs.width*0.8);
      gradBg.addColorStop(0,'rgba(6,14,30,1)'); gradBg.addColorStop(0.5,'rgba(4,8,20,1)'); gradBg.addColorStop(1,'rgba(2,3,8,1)');
    };
    buildBg();

    const onResize = () => { clearTimeout(tid); tid = setTimeout(buildBg, 100); };
    window.addEventListener('resize', onResize);

    const stars = Array.from({length:180}, () => ({ x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight, r:Math.random()*1.8+0.3, sp:Math.random()*0.12+0.02, ph:Math.random()*6.28 }));

    const draw = () => {
      ctx.fillStyle=gradBg; ctx.fillRect(0,0,cvs.width,cvs.height);
      for(const st of stars){ st.y+=st.sp; if(st.y>cvs.height+10){st.y=-10; st.x=Math.random()*cvs.width;} st.ph+=0.01;
        const a=0.3+Math.sin(st.ph)*0.2; ctx.beginPath(); ctx.arc(st.x,st.y,st.r,0,6.28); ctx.fillStyle=`rgba(200,210,230,${Math.max(0,Math.min(1,a))})`; ctx.fill();
        if(st.r>1){ctx.beginPath(); ctx.arc(st.x,st.y,st.r*2.5,0,6.28); ctx.fillStyle=`rgba(180,200,240,${a*0.06})`; ctx.fill();}
      }
      id=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize',onResize); clearTimeout(tid); };
  },[]);
  return <canvas ref={ref} style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none'}} />;
}

/* ═══════════════════════════════════════════════
   PARTICLES
   ═══════════════════════════════════════════════ */
function Particles({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    const cvs = ref.current; if(!cvs) return;
    const ctx = cvs.getContext('2d'); let id, tid;
    const resize = () => {
      clearTimeout(tid);
      tid = setTimeout(() => { cvs.width = window.innerWidth; cvs.height = window.innerHeight; }, 100);
    };
    setTimeout(() => { cvs.width = window.innerWidth; cvs.height = window.innerHeight; }, 0);
    window.addEventListener('resize', resize);
    const pts = Array.from({length: active?55:12}, () => ({ x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight, r:Math.random()*1.4+0.3, vx:(Math.random()-0.5)*0.25, vy:-Math.random()*0.5-0.08, life:Math.random(), gold:Math.random()>0.65 }));
    const draw = () => {
      ctx.clearRect(0,0,cvs.width,cvs.height);
      for(const p of pts){ p.x+=p.vx; p.y+=p.vy; p.life-=0.0008; if(p.life<=0||p.y<-20||p.y>cvs.height+20){p.x=Math.random()*cvs.width; p.y=cvs.height+20; p.life=1;}
        const a=Math.max(0,p.life*0.55); ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.28);
        ctx.fillStyle=p.gold?`rgba(240,216,120,${a})`:`rgba(74,158,255,${a})`; ctx.fill(); }
      id=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize',resize); clearTimeout(tid); };
  },[active]);
  return <canvas ref={ref} style={{position:'fixed',inset:0,zIndex:10,pointerEvents:'none'}} />;
}

/* ═══════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════ */
export default function App() {
  const [wide, setWide] = useState(window.innerWidth > 640);
  useEffect(() => {
    const onR = () => setWide(window.innerWidth > 640);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);

  const [stage, setStage] = useState('input');
  const [bd, setBd] = useState(null);
  const [figs, setFigs] = useState([]);
  const [rpt, setRpt] = useState(null);
  const [prog, setProg] = useState(0);
  const [err, setErr] = useState(null);
  const [exp, setExp] = useState(null);
  const [copied, setCopied] = useState(false);
  const figRef = useRef([]);

  const submit = async (e) => {
    e.preventDefault();
    const y = parseInt(e.target.year.value)||2000, m = parseInt(e.target.month.value), d = parseInt(e.target.day.value);
    if(!m||!d||m<1||m>12||d<1||d>31) return;
    const date = new Date(y,m-1,d); setBd(date); setStage('scanning'); setErr(null); setProg(0);

    // Progress animation — capped at 90% until API finishes
    const timer = setInterval(() => setProg(p => Math.min(p+Math.random()*8, 90)), 300);

    // Safety timeout: force finish after 8s even if API hangs
    const safety = setTimeout(() => {
      clearInterval(timer);
      setProg(100);
      if (!figRef.current.length) {
        setErr('查询超时，已使用本地数据库结果');
        setRpt(analyzePersonality([]));
      }
      setStage('result');
    }, 10000);

    try {
      const data = await fetchBornOnDate(m,d);
      clearTimeout(safety);
      clearInterval(timer);
      setProg(100);
      setFigs(data); figRef.current = data;
      setRpt(analyzePersonality(data));
    } catch(ex) {
      clearTimeout(safety);
      clearInterval(timer);
      setProg(100);
      setErr(ex.message);
      setFigs([]); figRef.current = [];
      setRpt(analyzePersonality([]));
    }
    setTimeout(() => setStage('result'), 800);
  };

  const reset = () => { setStage('input'); setFigs([]); setRpt(null); setProg(0); setErr(null); };

  const share = async () => {
    const name = rpt?.mostLike?.name || '传奇人物';
    try { await navigator.clipboard.writeText(`我与 ${name} 同一天生日 🎂`); } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const r = rpt || { era:'时间迷雾', keywords:['神秘','独特'], essence:'你的故事正在书写。', prefix:'时间的长河静静流淌——', suffix:'也许，你将成为被历史铭记的名字。', mostLike:null };
  const safe = Array.isArray(figs) ? figs : [];

  /* ── INPUT ── */
  if (stage === 'input') return (
    <div style={s.page}>
      <StarCanvas />
      <div style={{position:'relative',zIndex:20,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',padding:20}}>
        {/* Rotating rings */}
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none'}}>
          <motion.div animate={{rotate:360}} transition={{duration:100,repeat:Infinity,ease:'linear'}} style={{width:520,height:520,borderRadius:'50%',border:'1px solid rgba(212,168,83,0.04)',position:'absolute',top:-260,left:-260}} />
          <motion.div animate={{rotate:-360}} transition={{duration:70,repeat:Infinity,ease:'linear'}} style={{width:400,height:400,borderRadius:'50%',border:'1px solid rgba(212,168,83,0.06)',position:'absolute',top:-200,left:-200}} />
          <motion.div animate={{rotate:360}} transition={{duration:50,repeat:Infinity,ease:'linear'}} style={{width:300,height:300,borderRadius:'50%',border:'1px solid rgba(74,158,255,0.06)',position:'absolute',top:-150,left:-150}} />
        </div>

        <div style={{textAlign:'center',marginBottom:48}}>
          <p style={{fontSize:11,color:'rgba(212,168,83,0.4)',letterSpacing:5,marginBottom:12,fontFamily:'Consolas,monospace'}}>HISTORICAL RESONANCE ARCHIVE</p>
          <h1 style={{...s.goldText,fontSize:wide?52:32,margin:'0 0 8px'}}>历史人格档案</h1>
          <p style={{fontSize:wide?14:12,color:s.dim,maxWidth:wide?380:280,margin:'0 auto',lineHeight:1.6,padding:'0 16px'}}>输入你的出生日期，探寻时间长河中与你的灵魂共享同一天降临的传奇人物</p>
        </div>

        <form onSubmit={submit} style={{...s.glass,padding:wide?'40px 36px':'28px 20px',width:wide?380:'min(380px, 88vw)',maxWidth:'100%'}}>
          <p style={{fontSize:10,color:'rgba(255,255,255,0.2)',letterSpacing:3,marginBottom:20,fontFamily:'Consolas,monospace'}}>ENTER_BIRTH_DATE <span style={{color:'rgba(212,168,83,0.5)',marginLeft:8}}>■</span></p>
          <div style={{display:'flex',gap:12,marginBottom:28}}>
            {['year','month','day'].map((n,i) => (
              <div key={n} style={{flex:1}}>
                <label style={{display:'block',fontSize:10,color:'rgba(255,255,255,0.2)',marginBottom:6,letterSpacing:2,fontFamily:'Consolas,monospace'}}>{['YYYY','MM','DD'][i]}</label>
                <input name={n} placeholder={['2000','01','01'][i]} style={s.input} />
              </div>
            ))}
          </div>
          <button type="submit" style={s.btn}>⚡ 扫描时间长河</button>
        </form>

        <p style={{fontSize:11,color:'rgba(255,255,255,0.08)',marginTop:32,fontStyle:'italic'}}>"在无限的时间线中，每一个日期都是一道门。"</p>
      </div>

      {/* HUD */}
      <div style={s.hud}><span>HISTORICAL_ARCHIVE_v2.4</span><span>{new Date().toLocaleTimeString()}</span></div>
      <div style={{...s.corner,top:16,left:16,borderTop:'1px solid rgba(212,168,83,0.15)',borderLeft:'1px solid rgba(212,168,83,0.15)'}} />
      <div style={{...s.corner,top:16,right:16,borderTop:'1px solid rgba(212,168,83,0.15)',borderRight:'1px solid rgba(212,168,83,0.15)'}} />
      <div style={{...s.corner,bottom:16,left:16,borderBottom:'1px solid rgba(212,168,83,0.15)',borderLeft:'1px solid rgba(212,168,83,0.15)'}} />
      <div style={{...s.corner,bottom:16,right:16,borderBottom:'1px solid rgba(212,168,83,0.15)',borderRight:'1px solid rgba(212,168,83,0.15)'}} />
    </div>
  );

  /* ── SCANNING ── */
  if (stage === 'scanning') return (
    <div style={s.page}>
      <StarCanvas />
      <Particles active />
      <div style={{position:'relative',zIndex:20,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',padding:20}}>
        <motion.div animate={{scale:[1,1.15,1],rotate:[0,180,360]}} transition={{duration:4,repeat:Infinity,ease:'linear'}} style={{width:200,height:200,borderRadius:'50%',border:'1px solid rgba(212,168,83,0.1)',position:'absolute'}} />
        <motion.div animate={{scale:[1.15,1,1.15],rotate:[360,180,0]}} transition={{duration:3,repeat:Infinity,ease:'linear'}} style={{width:150,height:150,borderRadius:'50%',border:'1px solid rgba(74,158,255,0.1)',position:'absolute'}} />
        <motion.div animate={{scale:[1,1.08,1],opacity:[0.5,1,0.5]}} transition={{duration:2,repeat:Infinity}}>
          <div style={{width:60,height:60,borderRadius:'50%',border:'2px solid rgba(212,168,83,0.3)',marginBottom:28}} />
        </motion.div>
        <h2 style={{...s.goldText,fontSize:24,marginBottom:6}}>正在扫描时间长河...</h2>
        <p style={{fontSize:11,color:s.dim,marginBottom:24,fontFamily:'Consolas,monospace'}}>TARGET: {bd?`${bd.getFullYear()}-${String(bd.getMonth()+1).padStart(2,'0')}-${String(bd.getDate()).padStart(2,'0')}`:'----'}</p>
        <div style={s.scanBar}><div style={s.scanFill(prog)} /></div>
        <p style={{fontSize:11,color:'rgba(255,255,255,0.2)',marginTop:8,fontFamily:'Consolas,monospace'}}>{Math.round(prog)}%</p>
      </div>
    </div>
  );

  /* ── RESULT ── */
  return (
    <div style={{minHeight:'100vh',background:'#020308'}}>
      <StarCanvas />
      <div style={{position:'relative',zIndex:20,maxWidth:wide?820:'100%',margin:'0 auto',padding:wide?'48px 20px':'24px 12px'}}>
        {/* Header */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:48}}>
          <button onClick={reset} style={{background:'none',border:'none',color:'rgba(255,255,255,0.3)',cursor:'pointer',fontSize:13,fontFamily:'Georgia,serif'}}>← 重新搜索</button>
          <button onClick={share} style={{padding:'8px 20px',background:'rgba(212,168,83,0.08)',border:'1px solid rgba(212,168,83,0.2)',color:s.gold,cursor:'pointer',fontSize:13,fontFamily:'Georgia,serif'}}>📋 分享档案</button>
        </div>

        {err && <div style={{padding:14,background:'rgba(255,0,0,0.06)',border:'1px solid rgba(255,0,0,0.2)',color:'#f88',fontSize:13,textAlign:'center',marginBottom:32}}>⚠ {err} — 已生成模拟报告</div>}

        {/* Report */}
        <motion.div initial={{y:30,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.2,duration:0.7}} style={{...s.glass,padding:'52px 40px',textAlign:'center',marginBottom:48,position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',left:0,right:0,top:'50%',height:1,background:'linear-gradient(90deg,transparent,rgba(212,168,83,0.15),transparent)'}} />
          <p style={{fontSize:11,color:'rgba(212,168,83,0.35)',letterSpacing:5,marginBottom:16,fontFamily:'Consolas,monospace'}}>HISTORICAL RESONANCE REPORT</p>
          <p style={{fontSize:14,color:s.dim,fontStyle:'italic',marginBottom:12}}>{r.prefix}</p>
          <h2 style={{...s.goldText,fontSize:42,marginBottom:12}}>{r.era}</h2>
          {r.mostLike && <p style={{fontSize:16,color:'rgba(255,255,255,0.5)',marginBottom:12}}>你与 <b style={{color:s.gold,fontSize:20}}>{r.mostLike.name}</b> 共享了同一天的灵魂印记</p>}
          {r.topCiv && <p style={{fontSize:13,color:s.blue,marginBottom:12,fontFamily:'Consolas,monospace'}}>⌘ {r.topCiv} · {r.topCat||''}{r.topIdeo?' · '+r.topIdeo:''}</p>}
          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:10,marginBottom:12}}>
            {(r.civilizationTags||[]).slice(0,3).map(c => <span key={c} style={{...s.tag,borderColor:'rgba(74,158,255,0.25)',color:'rgba(74,158,255,0.8)',fontSize:11}}>{c}</span>)}
          </div>
          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:10,marginBottom:20}}>
            {(r.keywords||[]).map(k => <span key={k} style={s.tag}>{k}</span>)}
          </div>
          <p style={{fontSize:14,color:'rgba(255,255,255,0.35)',fontStyle:'italic',maxWidth:500,margin:'0 auto',lineHeight:1.6}}>"{r.essence}"</p>
          <p style={{fontSize:12,color:'rgba(255,255,255,0.2)',marginTop:20,fontStyle:'italic'}}>{r.suffix}</p>
        </motion.div>

        {/* Date & count */}
        <div style={{textAlign:'center',marginBottom:40}}>
          <span style={{fontSize:13,color:s.dim,fontFamily:'Consolas,monospace'}}>
            {bd?`${bd.getFullYear()}年${bd.getMonth()+1}月${bd.getDate()}日`:'——'}  ·  {safe.length} 位历史共鸣者
          </span>
        </div>

        {/* Timeline */}
        {safe.length > 0 && (
          <div style={{position:'relative',marginBottom:60}}>
            <p style={{fontSize:11,color:'rgba(212,168,83,0.3)',letterSpacing:5,textAlign:'center',marginBottom:36,fontFamily:'Consolas,monospace'}}>HISTORICAL TIMELINE</p>
            <div style={s.timelineLine} />

            {safe.slice(0,20).map((f,i) => {
              const isLeft = wide ? i%2===0 : true;
              const isOpen = exp===i;
              return (
                <motion.div key={f.name+i} initial={{opacity:0,x:isLeft?-20:20}} whileInView={{opacity:1,x:0}} viewport={{once:true,margin:'-40px'}} transition={{delay:i*0.04}} style={{position:'relative',display:'flex',alignItems:'flex-start',gap:wide?20:8,marginBottom:wide?24:14,...(isLeft||!wide?{}:{flexDirection:'row-reverse'})}}>
                  {wide && <div style={s.timelineDot} />}
                  <div style={{width:wide?'44%':'100%',marginLeft:wide?0:20}}>
                    <div style={{...s.card,border:isOpen?`1px solid rgba(212,168,83,0.35)`:s.card.border}} onClick={() => setExp(isOpen?null:i)}>
                      <div style={s.avatar}>
                        {f.thumbnail ? <img src={f.thumbnail} alt="" style={{width:36,height:36,borderRadius:'50%',objectFit:'cover'}} onError={e=>{e.target.style.display='none'}} /> : <span style={{color:'rgba(212,168,83,0.4)',fontSize:16}}>?</span>}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
                          <p style={{fontWeight:'bold',margin:0,fontSize:wide?15:13,color:'#fff'}}>{f.name}</p>
                          {f.legend >= 95 && <span style={{fontSize:10,color:s.gold}}>★</span>}
                          {f.legend >= 98 && <span style={{fontSize:10,color:s.gold}}>★</span>}
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',marginTop:2}}>
                          <p style={{color:s.gold,fontSize:11,margin:0,fontFamily:'Consolas,monospace'}}>{f.year}</p>
                          {(f.dynasty || f.civilization) && (
                            <span style={{
                              fontSize:9,padding:'1px 6px',borderRadius:3,fontFamily:'Consolas,monospace',
                              ...(f.visual==='chinese'||f.visual==='japanese'||f.visual==='korean'
                                ? {background:'rgba(212,168,83,0.1)',border:'1px solid rgba(212,168,83,0.25)',color:s.gold}
                                : {background:'rgba(74,158,255,0.08)',border:'1px solid rgba(74,158,255,0.2)',color:s.blue})
                            }}>{f.dynasty || f.civilization}</span>
                          )}
                          {f.era && <span style={{fontSize:9,color:s.dim}}>{f.era}</span>}
                        </div>
                        <p style={{color:s.dim,fontSize:12,marginTop:4,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{typeof f.description==='string'?f.description.slice(0,80):''}</p>
                      </div>
                    </div>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.3}} style={{overflow:'hidden',padding:'12px 18px',background:'rgba(16,24,48,0.3)',borderRadius:8,marginTop:4}}>
                          <p style={{color:'rgba(255,255,255,0.5)',fontSize:13,lineHeight:1.6,margin:0}}>{typeof f.description==='string'?f.description.slice(0,350):'暂无详细信息'}</p>
                          {f.achievements && <p style={{color:'rgba(212,168,83,0.4)',fontSize:11,lineHeight:1.5,margin:'8px 0 0',fontStyle:'italic'}}>✦ {f.achievements}</p>}
                          {f.source && <span style={{fontSize:9,color:s.dim,fontFamily:'Consolas,monospace',marginRight:8}}>来源: {f.source==='local'?'文明记忆库':'Wikipedia'}</span>}
                          {f.wikiUrl && <a href={f.wikiUrl} target="_blank" rel="noopener noreferrer" style={{color:s.blue,fontSize:11,marginTop:8,display:'inline-block'}}>Wikipedia →</a>}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {wide && <div style={{width:'44%'}} />}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty */}
        {safe.length===0 && (
          <div style={{...s.glass,padding:60,textAlign:'center'}}>
            <p style={{fontSize:48,margin:'0 0 16px'}}>🌌</p>
            <p style={{fontSize:18,color:'rgba(255,255,255,0.5)',marginBottom:8}}>没有任何历史人物与你同一天生日</p>
            <p style={{fontSize:13,color:s.dim}}>也许，你注定要成为那个被历史记住的名字。</p>
          </div>
        )}

        {/* Footer */}
        <div style={{textAlign:'center',marginTop:60,paddingBottom:40}}>
          <p style={{fontSize:10,color:'rgba(255,255,255,0.08)',fontFamily:'Consolas,monospace'}}>DATA: WIKIPEDIA · WIKIDATA  |  HISTORICAL ARCHIVE v2.4</p>
          <p style={{fontSize:10,color:'rgba(255,255,255,0.04)',marginTop:4,fontStyle:'italic'}}>在时间的长河中，寻找你的共鸣</p>
        </div>
      </div>

      {/* HUD */}
      <div style={s.hud}><span>HISTORICAL_ARCHIVE_v2.4</span><span>{new Date().toLocaleTimeString()}</span></div>
      <div style={{...s.corner,top:16,left:16,borderTop:'1px solid rgba(212,168,83,0.15)',borderLeft:'1px solid rgba(212,168,83,0.15)'}} />
      <div style={{...s.corner,top:16,right:16,borderTop:'1px solid rgba(212,168,83,0.15)',borderRight:'1px solid rgba(212,168,83,0.15)'}} />
      <div style={{...s.corner,bottom:16,left:16,borderBottom:'1px solid rgba(212,168,83,0.15)',borderLeft:'1px solid rgba(212,168,83,0.15)'}} />
      <div style={{...s.corner,bottom:16,right:16,borderBottom:'1px solid rgba(212,168,83,0.15)',borderRight:'1px solid rgba(212,168,83,0.15)'}} />

      {/* Share toast */}
      <AnimatePresence>
        {copied && <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}} style={{position:'fixed',bottom:32,left:'50%',transform:'translateX(-50%)',padding:'12px 24px',background:'rgba(212,168,83,0.15)',border:'1px solid rgba(212,168,83,0.3)',color:s.gold,fontSize:13,zIndex:100}}>✓ 已复制分享文案</motion.div>}
      </AnimatePresence>
    </div>
  );
}
