const RAB='coelho.png';
const MAP=["###########","#S..#.....#","#.#.#.###.#","#.#...#...#","#.#####.###","#...#...#.#","###.#.#.#.#","#...#.#...#","#.###.###.#","#.....#..T#","###########"];
const N=MAP.length;const find=c=>{for(let y=0;y<N;y++){const x=MAP[y].indexOf(c);if(x>-1)return{x,y}}};const START=find('S'),GOAL=find('T');let C=40,pos={...START},steps=0,won=false;
const $=id=>document.getElementById(id);
const uri=s=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);
const X='xmlns="http://www.w3.org/2000/svg"';
const tulipSVG=(a,b,c)=>`<svg ${X} viewBox="0 0 40 56"><path d="M20 30V54" stroke="#6fd3a0" stroke-width="3" stroke-linecap="round"/><path d="M20 51C10 49 7 41 8 34c8 2 12 8 12 17z" fill="#3fae82"/><path d="M20 47c8-1 12-7 12-14-8 1-12 6-12 14z" fill="#6fd3a0"/><path d="M7 11c0 13 5 21 13 21s13-8 13-21c-4 3-9 1-13-5-4 6-9 8-13 5z" fill="${a}"/><path d="M14 9c-1 9 1 17 6 23C12 32 7 24 7 11c3 1 5 0 7-2z" fill="${b}"/><path d="M26 9c1 9-1 17-6 23 8 0 13-8 13-21-3 1-5 0-7-2z" fill="${c}"/></svg>`;
const flowerSVG=(p,m)=>{let s=`<svg ${X} viewBox="0 0 48 48">`;for(let k=0;k<5;k++){const g=(k*72-90)*Math.PI/180;s+=`<circle cx="${24+Math.cos(g)*10}" cy="${24+Math.sin(g)*10}" r="9.5" fill="${p}"/>`}return s+`<circle cx="24" cy="24" r="8" fill="${m}"/><circle cx="22" cy="22" r="3" fill="#fff" opacity=".5"/></svg>`};
const sparkSVG=`<svg ${X} viewBox="0 0 40 40"><path d="M20 0c1 11 9 19 20 20-11 1-19 9-20 20-1-11-9-19-20-20C11 19 19 11 20 0z" fill="#fff6d8"/></svg>`;
const T=[['#ff7eb6','#ff4f98','#ffc0dc'],['#c9a4ff','#9d6cf0','#e6d4ff'],['#ffb085','#ff8650','#ffd9c2'],['#fff1f7','#e6c5da','#ffffff']];
const F=[['#ffb3d4','#ffd86b'],['#d8c2ff','#ffd86b'],['#fff','#ffb35c'],['#ffc2a8','#fff0a0']];
const tulipURIs=T.map(t=>uri(tulipSVG(...t))),flowerURIs=F.map(f=>uri(flowerSVG(...f)));
$('orn').src=tulipURIs[0];$('bigt').src=tulipURIs[0];
document.querySelectorAll('.corner').forEach((e,i)=>e.src=flowerURIs[i%4]);
document.querySelectorAll('.pad button').forEach(b=>b.innerHTML='<svg viewBox="0 0 24 24"><path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>');
/* baked sprites for canvas */
function bake(src,w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const i=new Image();i.onload=()=>c.getContext('2d').drawImage(i,0,0,w,h);i.src=src;return c}
const SP={tulip:tulipURIs.map(u=>bake(u,40,56)),flower:flowerURIs.map(u=>bake(u,48,48)),spark:[bake(uri(sparkSVG),40,40)],bunny:[bake(RAB,96,96)]};
const kinds=['tulip','flower','bunny','tulip','flower','spark'];
/* maze */
const maze=$('maze'),rab=document.createElement('div'),tul=document.createElement('div');
rab.id='rabbit';rab.innerHTML='<div class="sh"></div><img alt="Coelhinho" src="'+RAB+'">';
tul.id='tulip';tul.innerHTML='<img alt="Tulipa" src="'+tulipURIs[0]+'">';
function build(){
  C=Math.max(22,Math.min(48,Math.floor((Math.min(innerWidth,520)-72)/N)));
  maze.style.width=maze.style.height=C*N+'px';maze.innerHTML='';
  MAP.forEach((row,y)=>[...row].forEach((ch,x)=>{
    const d=document.createElement('div');d.className='cell '+(ch==='#'?'w'+((x*3+y*5)%3===0?' v':''):'f');
    Object.assign(d.style,{width:C+'px',height:C+'px',left:x*C+'px',top:y*C+'px'});
    if(ch==='#'&&y>0&&y<N-1&&x>0&&x<N-1&&(x*5+y*7)%4===0){const b=document.createElement('img');b.className='bl';b.alt='';b.src=flowerURIs[(x+y)%4];const s=C*.34;Object.assign(b.style,{width:s+'px',height:s+'px',left:(C*.5-s/2+((x*13)%7-3))+'px',top:(C*.5-s/2+((y*11)%7-3))+'px'});d.appendChild(b)}
    maze.appendChild(d);
  }));
  [rab,tul].forEach(e=>{e.style.width=e.style.height=C+'px';maze.appendChild(e)});
  tul.style.transform='translate('+GOAL.x*C+'px,'+GOAL.y*C+'px)';place();
}
function place(){rab.style.transform='translate('+pos.x*C+'px,'+pos.y*C+'px)'}
const V={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]};
function move(k){
  if(won)return;const v=V[k];if(!v)return;
  const nx=pos.x+v[0],ny=pos.y+v[1];
  if(v[0])rab.classList.toggle('fl',v[0]<0);
  if(MAP[ny][nx]==='#'){rab.animate([{translate:'0'},{translate:'-3px'},{translate:'3px'},{translate:'0'}],{duration:150});return}
  pos={x:nx,y:ny};steps++;$('steps').textContent=steps;place();
  rab.classList.add('hop');setTimeout(()=>rab.classList.remove('hop'),160);
  trail(nx*C,ny*C);if(MAP[ny][nx]==='T')win();
}
document.querySelectorAll('.pad button').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();b.classList.add('p');move(b.dataset.d);setTimeout(()=>b.classList.remove('p'),120)}));
addEventListener('keydown',e=>{const m={ArrowUp:'u',ArrowDown:'d',ArrowLeft:'l',ArrowRight:'r',w:'u',s:'d',a:'l',d:'r'}[e.key];if(m){e.preventDefault();move(m)}});
let t0=null;maze.addEventListener('touchstart',e=>{t0=e.touches[0]},{passive:true});
maze.addEventListener('touchend',e=>{if(!t0)return;const t=e.changedTouches[0],dx=t.clientX-t0.clientX,dy=t.clientY-t0.clientY;if(Math.max(Math.abs(dx),Math.abs(dy))>24)move(Math.abs(dx)>Math.abs(dy)?(dx>0?'r':'l'):(dy>0?'d':'u'));t0=null},{passive:true});
/* sky: static layer + light dynamic layer */
const bg=$('bg'),bx=bg.getContext('2d'),sky=$('sky'),sx=sky.getContext('2d'),fx=$('fx'),fc=fx.getContext('2d');
let W,H,D,stars=[],flies=[],shoot=null,glow;
function mkGlow(){glow=document.createElement('canvas');glow.width=glow.height=24;const g=glow.getContext('2d'),r=g.createRadialGradient(12,12,0,12,12,12);r.addColorStop(0,'rgba(255,245,170,1)');r.addColorStop(1,'rgba(255,245,170,0)');g.fillStyle=r;g.fillRect(0,0,24,24)}
function size(){
  D=Math.min(devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;
  [bg,sky,fx].forEach(c=>{c.width=W*D;c.height=H*D});
  [bx,sx,fc].forEach(c=>c.setTransform(D,0,0,D,0,0));
  const g=bx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#080520');g.addColorStop(.5,'#1b0f4a');g.addColorStop(.85,'#43206b');g.addColorStop(1,'#612c78');bx.fillStyle=g;bx.fillRect(0,0,W,H);
  const mx=W*.8,my=Math.min(H*.13,130)+20,mr=Math.min(W,H)*.06+16;
  let r=bx.createRadialGradient(mx,my,mr*.6,mx,my,mr*4.5);r.addColorStop(0,'rgba(255,240,200,.38)');r.addColorStop(1,'rgba(255,240,200,0)');bx.fillStyle=r;bx.fillRect(mx-mr*5,my-mr*5,mr*10,mr*10);
  r=bx.createRadialGradient(mx-mr*.3,my-mr*.3,mr*.1,mx,my,mr);r.addColorStop(0,'#fffaea');r.addColorStop(1,'#f0dcb0');bx.fillStyle=r;bx.beginPath();bx.arc(mx,my,mr,0,6.283);bx.fill();
  bx.fillStyle='rgba(205,180,135,.45)';[[-.35,-.2,.2],[.3,.12,.24],[-.1,.45,.13],[.35,-.45,.1]].forEach(c=>{bx.beginPath();bx.arc(mx+c[0]*mr,my+c[1]*mr,c[2]*mr,0,6.283);bx.fill()});
  [['rgba(40,20,90,.55)',60,.007,.021,22],['rgba(18,9,46,.9)',34,.0095,.033,14]].forEach(([col,b,f1,f2,a])=>{bx.fillStyle=col;bx.beginPath();bx.moveTo(0,H);for(let x=0;x<=W;x+=10)bx.lineTo(x,H-b-Math.sin(x*f1*3+b)*a-Math.sin(x*f2)*4);bx.lineTo(W,H);bx.fill()});
  stars=Array.from({length:Math.min(130,Math.floor(W*H/6500))},()=>({x:Math.random()*W,y:Math.random()*H*.8,r:Math.random()*1.3+.5,p:Math.random()*6.28,s:Math.random()*1.4+.4}));
  flies=Array.from({length:14},()=>({x:Math.random()*W,y:H*.5+Math.random()*H*.5,a:Math.random()*6.28,s:Math.random()*.35+.15,p:Math.random()*6.28}));
}
/* particles */
let parts=[],rain=false,fxBusy=false;
function trail(x,y){const r=maze.getBoundingClientRect(),px=r.left+x+C/2,py=r.top+y+C/2;for(let i=0;i<3;i++)parts.push({k:'flower',i:Math.floor(Math.random()*4),x:px,y:py,vx:(Math.random()-.5)*1.5,vy:-Math.random()*.8,g:.05,r:Math.random()*6,vr:(Math.random()-.5)*.2,z:11,l:1,d:.03})}
function burst(){const cx=W/2,cy=H/2;for(let i=0;i<64;i++){const k=kinds[i%kinds.length],a=Math.random()*6.283,s=Math.random()*9+3;parts.push({k,i:Math.floor(Math.random()*SP[k].length),x:cx,y:cy,vx:Math.cos(a)*s,vy:Math.sin(a)*s-3,g:.13,r:Math.random()*6,vr:(Math.random()-.5)*.14,z:k==='bunny'?44:k==='spark'?18:30,l:1,d:.007})}}
function frame(t){
  sx.clearRect(0,0,W,H);
  for(const s of stars){sx.globalAlpha=.3+.7*Math.abs(Math.sin(t/1000*s.s+s.p));sx.fillStyle='#fff6e6';sx.fillRect(s.x,s.y,s.r,s.r)}
  if(!shoot&&Math.random()<.003)shoot={x:Math.random()*W*.6,y:Math.random()*H*.25,l:1};
  if(shoot){sx.globalAlpha=shoot.l;sx.strokeStyle='#fff';sx.lineWidth=2;sx.beginPath();sx.moveTo(shoot.x,shoot.y);sx.lineTo(shoot.x-70,shoot.y-30);sx.stroke();shoot.x+=9;shoot.y+=4;shoot.l-=.025;if(shoot.l<=0)shoot=null}
  for(const f of flies){f.a+=(Math.random()-.5)*.2;f.x+=Math.cos(f.a)*f.s;f.y+=Math.sin(f.a)*f.s-.04;if(f.x<0)f.x=W;if(f.x>W)f.x=0;if(f.y<H*.4)f.y=H;if(f.y>H)f.y=H*.5;sx.globalAlpha=.3+.7*Math.abs(Math.sin(t/700+f.p));sx.drawImage(glow,f.x-9,f.y-9,18,18)}
  sx.globalAlpha=1;
  if(rain&&parts.length<60&&Math.random()<.2){const k=kinds[Math.floor(Math.random()*kinds.length)];parts.push({k,i:Math.floor(Math.random()*SP[k].length),x:Math.random()*W,y:-30,vx:(Math.random()-.5)*.8,vy:Math.random()*1.2+1,g:0,r:0,vr:(Math.random()-.5)*.05,z:k==='bunny'?36:k==='spark'?14:26,l:1,d:0})}
  if(parts.length||fxBusy){fc.setTransform(D,0,0,D,0,0);fc.clearRect(0,0,W,H);fxBusy=parts.length>0;
    let n=0;for(const p of parts){p.vy+=p.g;p.vx*=.995;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.l-=p.d;if(p.l<=0||p.y>H+40)continue;parts[n++]=p;
      const sp=SP[p.k][p.i],h=p.z*sp.height/sp.width,c=Math.cos(p.r)*D,s=Math.sin(p.r)*D;fc.setTransform(c,s,-s,c,p.x*D,p.y*D);fc.globalAlpha=p.l>1?1:p.l;fc.drawImage(sp,-p.z/2,-h/2,p.z,h)}
    parts.length=n;fc.setTransform(D,0,0,D,0,0);fc.globalAlpha=1}
  requestAnimationFrame(frame);
}
/* final */
const lines=["Hoje o dia foi longo, mas você chegou até aqui, assim como o coelhinho chegou até a tulipa.","Que a noite te abrace com calma, que os sonhos sejam leves como pétalas e que o amanhã floresça cheio de coisas boas.","Descanse, respire fundo e feche os olhos. Eu estarei pensando em você, sob a mesma lua."];
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function type(el,txt){el.textContent='';for(const ch of txt){el.textContent+=ch;await wait(26)}}
async function win(){
  won=true;await wait(300);burst();$('end').classList.add('on');await wait(450);burst();await wait(500);rain=true;
  for(let i=1;i<=3;i++){await type($('l'+i),lines[i-1]);await wait(300)}
  await type($('sg'),'Boa noite, doces sonhos');$('again').classList.add('on');
}
$('again').onclick=()=>{rain=false;parts=[];won=false;pos={...START};steps=0;$('steps').textContent=0;['l1','l2','l3','sg'].forEach(i=>$(i).textContent='');$('again').classList.remove('on');$('end').classList.remove('on');place()};
addEventListener('resize',()=>{size();build()});
mkGlow();size();build();requestAnimationFrame(frame);
