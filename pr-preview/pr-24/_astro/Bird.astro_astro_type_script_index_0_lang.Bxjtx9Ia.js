import{n as e,t}from"./motion.C94dpMQs.js";var n=matchMedia(`(max-width: 767px), (pointer: coarse) and (max-height: 500px)`),r=`
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`,i=`
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
}`,a=e=>(e.replace(`#`,``).match(/.{2}/g)??[`ff`,`6b`,`1a`]).map(e=>parseInt(e,16)/255),o=(e,t)=>{let n=Math.cos(e),r=Math.sin(e),i=Math.cos(t),a=Math.sin(t);return new Float32Array([n,0,-r,r*a,i,n*a,r*i,-a,n*i])},s=.75,c=-.32,l=5,u=class extends HTMLElement{#e=[];#t=!1;connectedCallback(){let e=[`pointermove`,`pointerdown`,`touchstart`,`keydown`,`scroll`,`wheel`],t=()=>{if(e.forEach(e=>removeEventListener(e,t)),!(this.#t||!this.isConnected)){if(n.matches){let e=()=>{n.matches||(n.removeEventListener(`change`,e),t())};n.addEventListener(`change`,e),this.#e.push(()=>n.removeEventListener(`change`,e))}else this.#t=!0,this.#n()}};e.forEach(e=>addEventListener(e,t,{passive:!0})),this.#e.push(()=>e.forEach(e=>removeEventListener(e,t)))}#n(){let n=this.querySelector(`canvas`),r=n.getContext(`webgl`,{premultipliedAlpha:!0,antialias:!1,alpha:!0,powerPreference:`low-power`});if(!r)return;let i=this.#r(r);if(!i)return;let u=Object.fromEntries([`uRes`,`uCenter`,`uTime`,`uPhase`,`uRot`,`uAccent`].map(e=>[e,r.getUniformLocation(i,e)])),d=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,d),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),r.STATIC_DRAW);let f=r.getAttribLocation(i,`aPos`);r.enableVertexAttribArray(f),r.vertexAttribPointer(f,2,r.FLOAT,!1,0,0),r.uniform3fv(u.uAccent,a(this.dataset.accent??`#ff6b1a`));let p=matchMedia(`(prefers-reduced-motion: reduce)`),m=()=>p.matches||t(),h=this.closest(`.tone-band`)??this.parentElement;h.style.touchAction=`pan-y pinch-zoom`;let g=.7,_=matchMedia(`(pointer: coarse)`).matches,ee=_?1e3/30:0,v=.9,y=s,b=c,x=0,S=0,C=0,w=0,T=0,E=0,D=!1,O=0,k=0,A=0,j=0,M=!0,N=0,P=performance.now(),F=0,I=0,L=0,R=0,z=h.querySelector(`[data-bird-anchor]`),B=[.6,.55],V=()=>{let e=this.getBoundingClientRect();if(!e.height||!z)return;let t=z.getBoundingClientRect(),n=innerWidth>=1024?.6:(t.left+t.width/2-e.left)/e.width,r=1-(t.top+t.height*.4-e.top)/e.height;B=[Math.min(.9,Math.max(.1,n)),Math.min(.95,Math.max(.05,r))]},H=()=>{let e=Math.min(devicePixelRatio||1,1.5),t=Math.max(1,Math.round(this.clientWidth*e*g)),i=Math.max(1,Math.round(this.clientHeight*e*g));(n.width!==t||n.height!==i)&&(n.width=t,n.height=i,r.viewport(0,0,t,i)),r.uniform2f(u.uRes,t,i),V(),r.uniform2fv(u.uCenter,B)},U=e=>{if(N=0,e-P<ee-4){N=requestAnimationFrame(U);return}let t=Math.min((e-P)/1e3,.05);P=e;let n=m()?.15:1;T+=(E-T)*(1-.05**t),F+=t*n,I+=t*n*(Math.PI*2/l)*(1+.3*T),D||(x+=S*t,S*=.04**t);let i=.35*Math.sin(F*.12),a=1-.002**t;y+=(s+i+x+C-y)*a,b+=(c+w-b)*a,r.uniform1f(u.uTime,F),r.uniform1f(u.uPhase,I),r.uniformMatrix3fv(u.uRot,!1,o(y,b)),r.drawArrays(r.TRIANGLES,0,3);let d=t*1e3;d>(_?45:28)?L++:L=0,d<(_?36:14)?R++:R=0,L>20&&g>.35&&(v=g-.05,g-=.1,L=0,H()),R>120&&g+.05<=v+1e-6&&(g+=.05,R=0,H()),this.dataset.ready=``;let f=!m()||D||Math.abs(S)>.01||e-j<1500;M&&f&&(N=requestAnimationFrame(U))},W=()=>{!N&&M&&(P=performance.now(),N=requestAnimationFrame(U))},G=e=>{let t=this.getBoundingClientRect(),n=Math.min(t.width,t.height);return[(e.clientX-t.left-B[0]*t.width)/n,-(e.clientY-t.top-(1-B[1])*t.height)/n]},K=e=>{if(e.target.closest?.(`header, [role="dialog"]`))return!1;let t=this.getBoundingClientRect();return e.clientX>=t.left&&e.clientX<=t.right&&e.clientY>=t.top&&e.clientY<=t.bottom},q=!1,J=e=>{if(!K(e)&&!D){q&&e.pointerType===`mouse`&&(E=0,C=0,w=0,W()),q=!1;return}q=!0;let[t,n]=G(e);if(E=1,j=performance.now(),e.pointerType===`mouse`&&!D&&(C=Math.max(-.6,Math.min(.6,t*.5)),w=Math.max(-.35,Math.min(.35,n*.3))),D){let t=e.clientX-O,n=e.clientY-k,r=Math.max(e.timeStamp-A,8);x+=t*.008,w=Math.max(-.6,Math.min(.6,w+n*.004)),S=Math.max(-12,Math.min(12,t*.008/(r/1e3))),A=e.timeStamp,O=e.clientX,k=e.clientY}W()},Y=e=>{if(!K(e))return;let t=e.target;t.closest(`a, button, input, textarea, select, [role="tab"]`)||e.pointerType===`mouse`&&t.closest(`[data-hud-panel]`)||(D=!0,S=0,O=e.clientX,k=e.clientY,A=e.timeStamp,document.documentElement.dataset.birdDrag=``,J(e))},X=()=>{D&&(D=!1,delete document.documentElement.dataset.birdDrag,W())};addEventListener(`pointermove`,J,{passive:!0}),addEventListener(`pointerdown`,Y,{passive:!0}),addEventListener(`pointerup`,X,{passive:!0}),addEventListener(`pointercancel`,X,{passive:!0});let Z=new ResizeObserver(()=>{H(),W()});Z.observe(this),z&&Z.observe(z);let Q=new IntersectionObserver(([e])=>{M=e.isIntersecting,M&&W()});Q.observe(this);let $=e=>{e.preventDefault(),cancelAnimationFrame(N),N=0,delete this.dataset.ready};n.addEventListener(`webglcontextlost`,$),p.addEventListener(`change`,W);let te=e(W);H(),W(),this.#e.push(()=>{cancelAnimationFrame(N),Z.disconnect(),Q.disconnect(),removeEventListener(`pointermove`,J),removeEventListener(`pointerdown`,Y),removeEventListener(`pointerup`,X),removeEventListener(`pointercancel`,X),n.removeEventListener(`webglcontextlost`,$),p.removeEventListener(`change`,W),te(),r.getExtension(`WEBGL_lose_context`)?.loseContext()})}disconnectedCallback(){this.#e.forEach(e=>e()),this.#e=[],this.#t=!1}#r(e){let t=(t,n)=>{let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.warn(`[bird] shader:`,e.getShaderInfoLog(r)),null)},n=t(e.VERTEX_SHADER,r),a=t(e.FRAGMENT_SHADER,i);if(!n||!a)return null;let o=e.createProgram();return e.attachShader(o,n),e.attachShader(o,a),e.linkProgram(o),e.getProgramParameter(o,e.LINK_STATUS)?(e.useProgram(o),o):(console.warn(`[bird] link:`,e.getProgramInfoLog(o)),null)}};customElements.get(`symbiote-bird`)||customElements.define(`symbiote-bird`,u);