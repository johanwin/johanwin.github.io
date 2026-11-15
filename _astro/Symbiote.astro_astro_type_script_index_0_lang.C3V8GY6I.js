import{n as e,t}from"./motion.C94dpMQs.js";var n=matchMedia(`(max-width: 767px), (pointer: coarse) and (max-height: 500px)`),r=`
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`,i=`
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
}`,a=e=>(e.replace(`#`,``).match(/.{2}/g)??[`ff`,`6b`,`1a`]).map(e=>parseInt(e,16)/255),o=(e,t)=>{let n=Math.cos(e),r=Math.sin(e),i=Math.cos(t),a=Math.sin(t);return new Float32Array([n,0,-r,r*a,i,n*a,r*i,-a,n*i])},s=class extends HTMLElement{#e=[];#t=!1;connectedCallback(){let e=[`pointermove`,`pointerdown`,`touchstart`,`keydown`,`scroll`,`wheel`],t=()=>{if(e.forEach(e=>removeEventListener(e,t)),!(this.#t||!this.isConnected)){if(n.matches){let e=()=>{n.matches||(n.removeEventListener(`change`,e),t())};n.addEventListener(`change`,e),this.#e.push(()=>n.removeEventListener(`change`,e))}else this.#t=!0,this.#n()}};e.forEach(e=>addEventListener(e,t,{passive:!0})),this.#e.push(()=>e.forEach(e=>removeEventListener(e,t)))}#n(){let n=this.querySelector(`canvas`),r=n.getContext(`webgl`,{premultipliedAlpha:!0,antialias:!1,alpha:!0,powerPreference:`low-power`});if(!r)return;let i=this.#r(r);if(!i)return;let s=Object.fromEntries([`uRes`,`uCenter`,`uTime`,`uRot`,`uPtr`,`uPtrAmt`,`uAccent`].map(e=>[e,r.getUniformLocation(i,e)])),c=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,c),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),r.STATIC_DRAW);let l=r.getAttribLocation(i,`aPos`);r.enableVertexAttribArray(l),r.vertexAttribPointer(l,2,r.FLOAT,!1,0,0),r.uniform3fv(s.uAccent,a(this.dataset.accent??`#ff6b1a`));let u=matchMedia(`(prefers-reduced-motion: reduce)`),d=()=>u.matches||t(),f=this.closest(`.tone-band`)??this.parentElement;f.style.touchAction=`pan-y pinch-zoom`;let p=.7,m=matchMedia(`(pointer: coarse)`).matches,h=m?1e3/30:0,g=.9,_=.4,v=-.15,y=0,b=0,x=0,S=0,C=[0,0,1],w=0,T=0,E=!1,D=0,O=0,k=0,A=0,j=!0,M=0,N=performance.now(),P=0,F=0,I=0,L=f.querySelector(`[data-symbiote-anchor]`),R=[.6,.47],z=()=>{if(innerWidth>=1024||!L){R=[.6,.47];return}let e=this.getBoundingClientRect(),t=L.getBoundingClientRect();if(!e.height)return;let n=(t.left+t.width/2-e.left)/e.width,r=1-(t.top+t.height/2-e.top)/e.height;R=[Math.min(.9,Math.max(.1,n)),Math.min(.95,Math.max(.05,r))]},B=()=>R,V=()=>{let e=Math.min(devicePixelRatio||1,1.5),t=Math.max(1,Math.round(this.clientWidth*e*p)),i=Math.max(1,Math.round(this.clientHeight*e*p));(n.width!==t||n.height!==i)&&(n.width=t,n.height=i,r.viewport(0,0,t,i)),r.uniform2f(s.uRes,t,i),z(),r.uniform2fv(s.uCenter,B())},H=e=>{if(M=0,e-N<h-4){M=requestAnimationFrame(H);return}let t=Math.min((e-N)/1e3,.05);N=e;let n=+!d();P+=t*(n?1:.15),E||(y+=b*t,b*=.04**t,y+=.06*t*n);let i=1-.002**t;_+=(y+x-_)*i,v+=(S-.12-v)*i,w+=(T-w)*(1-.05**t),r.uniform1f(s.uTime,P),r.uniformMatrix3fv(s.uRot,!1,o(_,v));let a=o(_,v),[c,l,u]=C;r.uniform3f(s.uPtr,a[0]*c+a[3]*l+a[6]*u,a[1]*c+a[4]*l+a[7]*u,a[2]*c+a[5]*l+a[8]*u),r.uniform1f(s.uPtrAmt,w),r.drawArrays(r.TRIANGLES,0,3);let f=t*1e3;f>(m?45:28)?F++:F=0,f<(m?36:14)?I++:I=0,F>20&&p>.35&&(g=p-.05,p-=.1,F=0,V()),I>120&&p+.05<=g+1e-6&&(p+=.05,I=0,V()),this.dataset.ready=``;let D=!d()||E||Math.abs(b)>.01||e-A<1500;j&&D&&(M=requestAnimationFrame(H))},U=()=>{!M&&j&&(N=performance.now(),M=requestAnimationFrame(H))},W=e=>{let t=this.getBoundingClientRect(),[n,r]=B(),i=Math.min(t.width,t.height);return[(e.clientX-t.left-n*t.width)/i,-(e.clientY-t.top-(1-r)*t.height)/i]},G=e=>{if(e.target.closest?.(`header, [role="dialog"]`))return!1;let t=this.getBoundingClientRect();return e.clientX>=t.left&&e.clientX<=t.right&&e.clientY>=t.top&&e.clientY<=t.bottom},K=!1,q=e=>{if(!G(e)&&!E){K&&e.pointerType===`mouse`&&(T=0,x=0,S=0,U()),K=!1;return}K=!0;let[t,n]=W(e),r=[t*1.6,n*1.6,.9],i=Math.hypot(r[0],r[1],r[2]);if(C=r.map(e=>e/i),T=1,A=performance.now(),e.pointerType===`mouse`&&!E&&(x=Math.max(-.6,Math.min(.6,t*.5)),S=Math.max(-.4,Math.min(.4,n*.35))),E){let t=e.clientX-D,n=e.clientY-O,r=Math.max(e.timeStamp-k,8);y+=t*.008,S=Math.max(-.7,Math.min(.7,S+n*.004)),b=Math.max(-12,Math.min(12,t*.008/(r/1e3))),k=e.timeStamp,D=e.clientX,O=e.clientY}U()},J=e=>{if(!G(e))return;let t=e.target;t.closest(`a, button, input, textarea, select, [role="tab"]`)||e.pointerType===`mouse`&&t.closest(`[data-hud-panel]`)||(E=!0,b=0,D=e.clientX,O=e.clientY,k=e.timeStamp,document.documentElement.dataset.symbioteDrag=``,q(e))},Y=()=>{E&&(E=!1,delete document.documentElement.dataset.symbioteDrag,U())};addEventListener(`pointermove`,q,{passive:!0}),addEventListener(`pointerdown`,J,{passive:!0}),addEventListener(`pointerup`,Y,{passive:!0}),addEventListener(`pointercancel`,Y,{passive:!0});let X=new ResizeObserver(()=>{V(),U()});X.observe(this),L&&X.observe(L);let Z=new IntersectionObserver(([e])=>{j=e.isIntersecting,j&&U()});Z.observe(this);let Q=e=>{e.preventDefault(),cancelAnimationFrame(M),M=0,delete this.dataset.ready};n.addEventListener(`webglcontextlost`,Q),u.addEventListener(`change`,U);let $=e(U);V(),U(),this.#e.push(()=>{cancelAnimationFrame(M),X.disconnect(),Z.disconnect(),removeEventListener(`pointermove`,q),removeEventListener(`pointerdown`,J),removeEventListener(`pointerup`,Y),removeEventListener(`pointercancel`,Y),n.removeEventListener(`webglcontextlost`,Q),u.removeEventListener(`change`,U),$(),r.getExtension(`WEBGL_lose_context`)?.loseContext()})}disconnectedCallback(){this.#e.forEach(e=>e()),this.#e=[],this.#t=!1}#r(e){let t=(t,n)=>{let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.warn(`[symbiote] shader:`,e.getShaderInfoLog(r)),null)},n=t(e.VERTEX_SHADER,r),a=t(e.FRAGMENT_SHADER,i);if(!n||!a)return null;let o=e.createProgram();return e.attachShader(o,n),e.attachShader(o,a),e.linkProgram(o),e.getProgramParameter(o,e.LINK_STATUS)?(e.useProgram(o),o):(console.warn(`[symbiote] link:`,e.getProgramInfoLog(o)),null)}};customElements.get(`symbiote-canvas`)||customElements.define(`symbiote-canvas`,s);