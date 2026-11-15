import{n as e,t}from"./motion.C94dpMQs.js";var n=`
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`,r=`
precision highp float;
uniform vec2  uRes;
uniform vec2  uCenter;   // bird centre in canvas UV (0..1)
uniform float uTime;
uniform float uPhase;    // wingbeat phase (integrated in JS so speed can change smoothly)
uniform mat3  uRot;      // camera orbit
uniform vec3  uAccent;

#define MAX_STEPS 80
#define BOUND 3.3

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i),               hash(i + vec3(1,0,0)), f.x),
                 mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                 mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm(vec3 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 2; i++) { s += a * noise(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; }
  return s;
}
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float sdEllipsoid(vec3 p, vec3 r) {
  float k0 = length(p / r), k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / k1;
}
// Capsule that tapers toward its tip: beak and trailing wingtip tendrils.
float sdTendril(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r * (1.0 - 0.85 * h);
}
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }

float map(vec3 p) {
  float t = uTime;
  float ph = uPhase;
  float down = sin(ph);                     // +1 wings up, -1 wings down

  // Body rises on the downstroke and pitches gently with each beat.
  p.y += 0.14 * sin(ph + 1.4);
  p.yz *= rot(0.08 * cos(ph));

  // Body, chest and head, boiled very lightly by the symbiote noise.
  float d = sdEllipsoid(p - vec3(0.0, 0.0, 0.05), vec3(0.34, 0.32, 0.95));
  d = smin(d, length(p - vec3(0.0, 0.26, 0.92)) - 0.26, 0.22);
  d = smin(d, sdTendril(p, vec3(0.0, 0.24, 1.08), vec3(0.0, 0.14, 1.55), 0.09), 0.06);
  // Tail fan, flattened and fanned slightly upward.
  vec3 tp = p - vec3(0.0, 0.04, -1.05);
  tp.yz *= rot(-0.18);
  d = smin(d, sdEllipsoid(tp, vec3(0.38, 0.05, 0.5)), 0.2);
  d += (fbm(p * 2.2 + vec3(0.0, t * 0.2, t * 0.3)) - 0.5) * 0.12;

  // Wings: shoulder → elbow (inner) and elbow → tip (outer, lagging behind).
  vec3 w = p;
  w.x = abs(w.x);
  vec3 q = w - vec3(0.22, 0.12, 0.15);
  float a1 = 0.62 * down + 0.08;
  float a2 = 0.85 * sin(ph - 0.7) + 0.05;
  q.xy *= rot(-a1);
  float wing = sdEllipsoid(q - vec3(0.72, 0.0, -0.08), vec3(0.78, 0.055, 0.42));
  vec3 q2 = q - vec3(1.38, 0.0, -0.06);
  q2.xy *= rot(-(a2 - a1));
  q2.xz *= rot(0.32);                      // hand swept back
  wing = smin(wing, sdEllipsoid(q2 - vec3(0.72, 0.0, -0.1), vec3(0.82, 0.04, 0.3)), 0.16);

  // Primaries: tendrils trailing off the wingtip, wavering like the symbiote's.
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    vec3 a = vec3(1.05 + 0.18 * fi, 0.0, -0.18 - 0.06 * fi);
    vec3 wob = 0.07 * vec3(sin(t * 1.3 + fi * 2.1), cos(t * 1.1 + fi) - 1.4 * sin(ph - 1.2), sin(t * 0.9 + fi));
    vec3 b = a + vec3(0.55 - 0.08 * fi, 0.0, -0.5 - 0.12 * fi) + wob;
    wing = smin(wing, sdTendril(q2, a, b, 0.08), 0.1);
  }
  d = smin(d, wing, 0.24);
  return d * 0.6; // noise and the rotations break the distance bound; step conservatively
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

  vec3 ro = uRot * vec3(0.0, 0.0, 10.5);
  vec3 rd = uRot * normalize(vec3(uv, -1.75));

  // Bounding sphere: skip every pixel whose ray can't reach the bird.
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

  float aura = exp(-max(minD, 0.0) * 9.0) * 0.26 * (1.0 - hit);
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
  vec3 irid = 0.5 + 0.5 * cos(6.2831 * (fres * 1.3 + n.y * 0.25 + uTime * 0.04 + vec3(0.0, 0.33, 0.67)));

  vec3 col = vec3(0.010, 0.010, 0.014);
  col += uAccent * fres * 0.85;
  col += irid * fres * 0.30;
  col += vec3(1.0) * spec1 * 0.85;
  col += uAccent * spec2 * 0.35;
  col *= 1.0 - float(steps) / float(MAX_STEPS) * 0.55;

  gl_FragColor = vec4(col, 1.0);
}`,i=e=>(e.replace(`#`,``).match(/.{2}/g)??[`ff`,`6b`,`1a`]).map(e=>parseInt(e,16)/255),a=(e,t)=>{let n=Math.cos(e),r=Math.sin(e),i=Math.cos(t),a=Math.sin(t);return new Float32Array([n,0,-r,r*a,i,n*a,r*i,-a,n*i])},o=.75,s=-.32,c=5,l=class extends HTMLElement{#e=[];#t=!1;connectedCallback(){let e=[`pointermove`,`pointerdown`,`touchstart`,`keydown`,`scroll`,`wheel`],t=()=>{e.forEach(e=>removeEventListener(e,t)),!this.#t&&this.isConnected&&(this.#t=!0,this.#n())};e.forEach(e=>addEventListener(e,t,{passive:!0})),this.#e.push(()=>e.forEach(e=>removeEventListener(e,t)))}#n(){let n=this.querySelector(`canvas`),r=n.getContext(`webgl`,{premultipliedAlpha:!0,antialias:!1,alpha:!0,powerPreference:`low-power`});if(!r)return;let l=this.#r(r);if(!l)return;let u=Object.fromEntries([`uRes`,`uCenter`,`uTime`,`uPhase`,`uRot`,`uAccent`].map(e=>[e,r.getUniformLocation(l,e)])),d=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,d),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),r.STATIC_DRAW);let f=r.getAttribLocation(l,`aPos`);r.enableVertexAttribArray(f),r.vertexAttribPointer(f,2,r.FLOAT,!1,0,0),r.uniform3fv(u.uAccent,i(this.dataset.accent??`#ff6b1a`));let p=matchMedia(`(prefers-reduced-motion: reduce)`),m=()=>p.matches||t(),h=this.closest(`.tone-band`)??this.parentElement;h.style.touchAction=`pan-y pinch-zoom`;let g=.7,_=o,v=s,y=0,b=0,x=0,S=0,C=0,w=0,T=!1,E=0,D=0,O=0,k=0,A=!0,j=0,M=performance.now(),N=0,P=0,F=0,I=0,L=h.querySelector(`[data-bird-anchor]`),R=[.6,.55],z=()=>{let e=this.getBoundingClientRect();if(!e.height||!L)return;let t=L.getBoundingClientRect(),n=innerWidth>=1024?.6:(t.left+t.width/2-e.left)/e.width,r=1-(t.top+t.height*.4-e.top)/e.height;R=[Math.min(.9,Math.max(.1,n)),Math.min(.95,Math.max(.05,r))]},B=()=>{let e=Math.min(devicePixelRatio||1,1.5),t=Math.max(1,Math.round(this.clientWidth*e*g)),i=Math.max(1,Math.round(this.clientHeight*e*g));(n.width!==t||n.height!==i)&&(n.width=t,n.height=i,r.viewport(0,0,t,i)),r.uniform2f(u.uRes,t,i),z(),r.uniform2fv(u.uCenter,R)},V=e=>{j=0;let t=Math.min((e-M)/1e3,.05);M=e;let n=m()?.15:1;C+=(w-C)*(1-.05**t),N+=t*n,P+=t*n*(Math.PI*2/c)*(1+.3*C),T||(y+=b*t,b*=.04**t);let i=.35*Math.sin(N*.12),l=1-.002**t;_+=(o+i+y+x-_)*l,v+=(s+S-v)*l,r.uniform1f(u.uTime,N),r.uniform1f(u.uPhase,P),r.uniformMatrix3fv(u.uRot,!1,a(_,v)),r.drawArrays(r.TRIANGLES,0,3);let d=t*1e3;d>28?F++:F=0,d<14?I++:I=0,F>20&&g>.35&&(g-=.1,F=0,B()),I>120&&g<.9&&(g+=.05,I=0,B()),this.dataset.ready=``;let f=!m()||T||Math.abs(b)>.01||e-k<1500;A&&f&&(j=requestAnimationFrame(V))},H=()=>{!j&&A&&(M=performance.now(),j=requestAnimationFrame(V))},U=e=>{let t=this.getBoundingClientRect(),n=Math.min(t.width,t.height);return[(e.clientX-t.left-R[0]*t.width)/n,-(e.clientY-t.top-(1-R[1])*t.height)/n]},W=e=>{if(e.target.closest?.(`header, [role="dialog"]`))return!1;let t=this.getBoundingClientRect();return e.clientX>=t.left&&e.clientX<=t.right&&e.clientY>=t.top&&e.clientY<=t.bottom},G=!1,K=e=>{if(!W(e)&&!T){G&&e.pointerType===`mouse`&&(w=0,x=0,S=0,H()),G=!1;return}G=!0;let[t,n]=U(e);if(w=1,k=performance.now(),e.pointerType===`mouse`&&!T&&(x=Math.max(-.6,Math.min(.6,t*.5)),S=Math.max(-.35,Math.min(.35,n*.3))),T){let t=e.clientX-E,n=e.clientY-D,r=Math.max(e.timeStamp-O,8);y+=t*.008,S=Math.max(-.6,Math.min(.6,S+n*.004)),b=Math.max(-12,Math.min(12,t*.008/(r/1e3))),O=e.timeStamp,E=e.clientX,D=e.clientY}H()},q=e=>{if(!W(e))return;let t=e.target;t.closest(`a, button, input, textarea, select, [role="tab"]`)||e.pointerType===`mouse`&&t.closest(`[data-hud-panel]`)||(T=!0,b=0,E=e.clientX,D=e.clientY,O=e.timeStamp,document.documentElement.dataset.birdDrag=``,K(e))},J=()=>{T&&(T=!1,delete document.documentElement.dataset.birdDrag,H())};addEventListener(`pointermove`,K,{passive:!0}),addEventListener(`pointerdown`,q,{passive:!0}),addEventListener(`pointerup`,J,{passive:!0}),addEventListener(`pointercancel`,J,{passive:!0});let Y=new ResizeObserver(()=>{B(),H()});Y.observe(this),L&&Y.observe(L);let X=new IntersectionObserver(([e])=>{A=e.isIntersecting,A&&H()});X.observe(this);let Z=e=>{e.preventDefault(),cancelAnimationFrame(j),j=0,delete this.dataset.ready};n.addEventListener(`webglcontextlost`,Z),p.addEventListener(`change`,H);let Q=e(H);B(),H(),this.#e.push(()=>{cancelAnimationFrame(j),Y.disconnect(),X.disconnect(),removeEventListener(`pointermove`,K),removeEventListener(`pointerdown`,q),removeEventListener(`pointerup`,J),removeEventListener(`pointercancel`,J),n.removeEventListener(`webglcontextlost`,Z),p.removeEventListener(`change`,H),Q(),r.getExtension(`WEBGL_lose_context`)?.loseContext()})}disconnectedCallback(){this.#e.forEach(e=>e()),this.#e=[],this.#t=!1}#r(e){let t=(t,n)=>{let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.warn(`[bird] shader:`,e.getShaderInfoLog(r)),null)},i=t(e.VERTEX_SHADER,n),a=t(e.FRAGMENT_SHADER,r);if(!i||!a)return null;let o=e.createProgram();return e.attachShader(o,i),e.attachShader(o,a),e.linkProgram(o),e.getProgramParameter(o,e.LINK_STATUS)?(e.useProgram(o),o):(console.warn(`[bird] link:`,e.getProgramInfoLog(o)),null)}};customElements.get(`symbiote-bird`)||customElements.define(`symbiote-bird`,l);