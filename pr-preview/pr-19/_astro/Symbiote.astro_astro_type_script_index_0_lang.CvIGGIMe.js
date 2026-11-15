import{n as e,t}from"./motion.C94dpMQs.js";var n=`
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`,r=`
precision highp float;
uniform vec2  uRes;
uniform vec2  uCenter;   // object centre in canvas UV (0..1)
uniform float uTime;
uniform mat3  uRot;      // camera orbit
uniform vec3  uPtr;      // pointer direction in world space
uniform float uPtrAmt;   // 0..1 how strongly tendrils reach for it
uniform vec3  uAccent;

#define MAX_STEPS 80
#define BOUND 2.6

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i),                  hash(i + vec3(1,0,0)), f.x),
                 mix(hash(i + vec3(0,1,0)),    hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)),    hash(i + vec3(1,0,1)), f.x),
                 mix(hash(i + vec3(0,1,1)),    hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 3; i++) { s += a * noise(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; }
  return s;
}
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
// Capsule that tapers toward its tip — reads as a tendril.
float sdTendril(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r * (1.0 - 0.8 * h);
}

float map(vec3 p) {
  float t = uTime;
  // Core mass: a sphere boiled by animated noise.
  float d = length(p) - 0.9;
  d += (fbm(p * 1.8 + vec3(0.0, t * 0.18, t * 0.25)) - 0.5) * 0.42;

  // Tendrils: wander on their own; the first three reach for the pointer.
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    vec3 dir = normalize(vec3(sin(fi * 2.4 + t * 0.31), cos(fi * 1.7 - t * 0.23), sin(fi * 3.1 + t * 0.17)));
    float reach = uPtrAmt * step(fi, 2.0) * (0.55 - 0.12 * fi);
    dir = normalize(mix(dir, uPtr, reach));
    float len = 1.25 + 0.3 * sin(t * 0.7 + fi * 1.3) + reach * 0.6;
    vec3 wob = 0.16 * vec3(sin(t * 1.1 + fi), cos(t * 1.3 + fi), sin(t * 0.8 + fi * 2.0));
    d = smin(d, sdTendril(p, dir * 0.35, dir * len + wob, 0.2), 0.38);
  }
  return d * 0.55; // noise breaks the distance bound; step conservatively
}

vec3 calcNormal(vec3 p) {
  const vec2 k = vec2(1.0, -1.0);
  const float e = 0.0025;
  return normalize(k.xyy * map(p + k.xyy * e) + k.yyx * map(p + k.yyx * e) +
                   k.yxy * map(p + k.yxy * e) + k.xxx * map(p + k.xxx * e));
}

void main() {
  float s = min(uRes.x, uRes.y);
  vec2 uv = (gl_FragCoord.xy - uCenter * uRes) / s;

  vec3 ro = uRot * vec3(0.0, 0.0, 6.6);
  vec3 rd = uRot * normalize(vec3(uv, -1.75));

  // Bounding sphere: skip every pixel whose ray can't reach the creature.
  float b = dot(ro, rd);
  float c = dot(ro, ro) - BOUND * BOUND;
  float disc = b * b - c;
  if (disc < 0.0) { gl_FragColor = vec4(0.0); return; }
  float tNear = max(-b - sqrt(disc), 0.0);
  float tFar  = -b + sqrt(disc);

  float t = tNear, minD = 1e3;
  float hit = 0.0;
  int steps = 0;
  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    minD = min(minD, d);
    if (d < 0.0015 * t) { hit = 1.0; break; }
    t += d;
    steps = i;
    if (t > tFar) break;
  }

  // Aura: faint accent glow hugging the silhouette.
  float aura = exp(-max(minD, 0.0) * 9.0) * 0.28 * (1.0 - hit);
  if (hit < 0.5) { gl_FragColor = vec4(uAccent * aura, aura); return; }

  vec3 p = ro + rd * t;
  vec3 n = calcNormal(p);
  vec3 v = -rd;
  vec3 l1 = normalize(vec3(0.6, 0.8, 0.5));
  vec3 l2 = normalize(vec3(-0.7, -0.3, 0.4));

  float ndv  = max(dot(n, v), 0.0);
  float fres = pow(1.0 - ndv, 3.0);
  float spec1 = pow(max(dot(reflect(-l1, n), v), 0.0), 64.0);
  float spec2 = pow(max(dot(reflect(-l2, n), v), 0.0), 20.0);

  // Thin-film iridescence on the glancing edges — oil-slick alien skin.
  vec3 irid = 0.5 + 0.5 * cos(6.2831 * (fres * 1.3 + n.y * 0.25 + uTime * 0.04 + vec3(0.0, 0.33, 0.67)));

  vec3 col = vec3(0.010, 0.010, 0.014);             // wet black body
  col += uAccent * fres * 0.85;                       // hazard-orange rim
  col += irid * fres * 0.30;
  col += vec3(1.0) * spec1 * 0.85;                    // key glint
  col += uAccent * spec2 * 0.35;                      // warm fill glint
  col *= 1.0 - float(steps) / float(MAX_STEPS) * 0.55; // cheap cavity occlusion

  gl_FragColor = vec4(col, 1.0);
}`,i=e=>(e.replace(`#`,``).match(/.{2}/g)??[`ff`,`6b`,`1a`]).map(e=>parseInt(e,16)/255),a=(e,t)=>{let n=Math.cos(e),r=Math.sin(e),i=Math.cos(t),a=Math.sin(t);return new Float32Array([n,0,-r,r*a,i,n*a,r*i,-a,n*i])},o=class extends HTMLElement{#e=[];#t=!1;connectedCallback(){let e=[`pointermove`,`pointerdown`,`touchstart`,`keydown`,`scroll`,`wheel`],t=()=>{e.forEach(e=>removeEventListener(e,t)),!this.#t&&this.isConnected&&(this.#t=!0,this.#n())};e.forEach(e=>addEventListener(e,t,{passive:!0})),this.#e.push(()=>e.forEach(e=>removeEventListener(e,t)))}#n(){let n=this.querySelector(`canvas`),r=n.getContext(`webgl`,{premultipliedAlpha:!0,antialias:!1,alpha:!0,powerPreference:`low-power`});if(!r)return;let o=this.#r(r);if(!o)return;let s=Object.fromEntries([`uRes`,`uCenter`,`uTime`,`uRot`,`uPtr`,`uPtrAmt`,`uAccent`].map(e=>[e,r.getUniformLocation(o,e)])),c=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,c),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),r.STATIC_DRAW);let l=r.getAttribLocation(o,`aPos`);r.enableVertexAttribArray(l),r.vertexAttribPointer(l,2,r.FLOAT,!1,0,0),r.uniform3fv(s.uAccent,i(this.dataset.accent??`#ff6b1a`));let u=matchMedia(`(prefers-reduced-motion: reduce)`),d=()=>u.matches||t(),f=this.closest(`.tone-band`)??this.parentElement;f.style.touchAction=`pan-y pinch-zoom`;let p=.7,m=.4,h=-.15,g=0,_=0,v=0,y=0,b=[0,0,1],x=0,S=0,C=!1,w=0,T=0,E=0,D=0,O=!0,k=0,A=performance.now(),j=0,M=0,N=0,P=f.querySelector(`[data-symbiote-anchor]`),F=[.6,.47],I=()=>{if(innerWidth>=1024||!P){F=[.6,.47];return}let e=this.getBoundingClientRect(),t=P.getBoundingClientRect();if(!e.height)return;let n=(t.left+t.width/2-e.left)/e.width,r=1-(t.top+t.height/2-e.top)/e.height;F=[Math.min(.9,Math.max(.1,n)),Math.min(.95,Math.max(.05,r))]},L=()=>F,R=()=>{let e=Math.min(devicePixelRatio||1,1.5),t=Math.max(1,Math.round(this.clientWidth*e*p)),i=Math.max(1,Math.round(this.clientHeight*e*p));(n.width!==t||n.height!==i)&&(n.width=t,n.height=i,r.viewport(0,0,t,i)),r.uniform2f(s.uRes,t,i),I(),r.uniform2fv(s.uCenter,L())},z=e=>{k=0;let t=Math.min((e-A)/1e3,.05);A=e;let n=+!d();j+=t*(n?1:.15),C||(g+=_*t,_*=.04**t,g+=.06*t*n);let i=1-.002**t;m+=(g+v-m)*i,h+=(y-.12-h)*i,x+=(S-x)*(1-.05**t),r.uniform1f(s.uTime,j),r.uniformMatrix3fv(s.uRot,!1,a(m,h));let o=a(m,h),[c,l,u]=b;r.uniform3f(s.uPtr,o[0]*c+o[3]*l+o[6]*u,o[1]*c+o[4]*l+o[7]*u,o[2]*c+o[5]*l+o[8]*u),r.uniform1f(s.uPtrAmt,x),r.drawArrays(r.TRIANGLES,0,3);let f=t*1e3;f>28?M++:M=0,f<14?N++:N=0,M>20&&p>.35&&(p-=.1,M=0,R()),N>120&&p<.9&&(p+=.05,N=0,R()),this.dataset.ready=``;let w=!d()||C||Math.abs(_)>.01||e-D<1500;O&&w&&(k=requestAnimationFrame(z))},B=()=>{!k&&O&&(A=performance.now(),k=requestAnimationFrame(z))},V=e=>{let t=this.getBoundingClientRect(),[n,r]=L(),i=Math.min(t.width,t.height);return[(e.clientX-t.left-n*t.width)/i,-(e.clientY-t.top-(1-r)*t.height)/i]},H=e=>{if(e.target.closest?.(`header, [role="dialog"]`))return!1;let t=this.getBoundingClientRect();return e.clientX>=t.left&&e.clientX<=t.right&&e.clientY>=t.top&&e.clientY<=t.bottom},U=!1,W=e=>{if(!H(e)&&!C){U&&e.pointerType===`mouse`&&(S=0,v=0,y=0,B()),U=!1;return}U=!0;let[t,n]=V(e),r=[t*1.6,n*1.6,.9],i=Math.hypot(r[0],r[1],r[2]);if(b=r.map(e=>e/i),S=1,D=performance.now(),e.pointerType===`mouse`&&!C&&(v=Math.max(-.6,Math.min(.6,t*.5)),y=Math.max(-.4,Math.min(.4,n*.35))),C){let t=e.clientX-w,n=e.clientY-T,r=Math.max(e.timeStamp-E,8);g+=t*.008,y=Math.max(-.7,Math.min(.7,y+n*.004)),_=Math.max(-12,Math.min(12,t*.008/(r/1e3))),E=e.timeStamp,w=e.clientX,T=e.clientY}B()},G=e=>{if(!H(e))return;let t=e.target;t.closest(`a, button, input, textarea, select, [role="tab"]`)||e.pointerType===`mouse`&&t.closest(`[data-hud-panel]`)||(C=!0,_=0,w=e.clientX,T=e.clientY,E=e.timeStamp,document.documentElement.dataset.symbioteDrag=``,W(e))},K=()=>{C&&(C=!1,delete document.documentElement.dataset.symbioteDrag,B())};addEventListener(`pointermove`,W,{passive:!0}),addEventListener(`pointerdown`,G,{passive:!0}),addEventListener(`pointerup`,K,{passive:!0}),addEventListener(`pointercancel`,K,{passive:!0});let q=new ResizeObserver(()=>{R(),B()});q.observe(this),P&&q.observe(P);let J=new IntersectionObserver(([e])=>{O=e.isIntersecting,O&&B()});J.observe(this);let Y=e=>{e.preventDefault(),cancelAnimationFrame(k),k=0,delete this.dataset.ready};n.addEventListener(`webglcontextlost`,Y),u.addEventListener(`change`,B);let X=e(B);R(),B(),this.#e.push(()=>{cancelAnimationFrame(k),q.disconnect(),J.disconnect(),removeEventListener(`pointermove`,W),removeEventListener(`pointerdown`,G),removeEventListener(`pointerup`,K),removeEventListener(`pointercancel`,K),n.removeEventListener(`webglcontextlost`,Y),u.removeEventListener(`change`,B),X(),r.getExtension(`WEBGL_lose_context`)?.loseContext()})}disconnectedCallback(){this.#e.forEach(e=>e()),this.#e=[],this.#t=!1}#r(e){let t=(t,n)=>{let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.warn(`[symbiote] shader:`,e.getShaderInfoLog(r)),null)},i=t(e.VERTEX_SHADER,n),a=t(e.FRAGMENT_SHADER,r);if(!i||!a)return null;let o=e.createProgram();return e.attachShader(o,i),e.attachShader(o,a),e.linkProgram(o),e.getProgramParameter(o,e.LINK_STATUS)?(e.useProgram(o),o):(console.warn(`[symbiote] link:`,e.getProgramInfoLog(o)),null)}};customElements.get(`symbiote-canvas`)||customElements.define(`symbiote-canvas`,o);