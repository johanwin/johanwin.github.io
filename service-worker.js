"use strict";function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}var precacheConfig=[["/index.html","90df125d977cb3b1aa0abf5419f8697a"],["/static/css/main.c8279eb5.css","0b0832a46d769cee565843d577e3edf6"],["/static/js/main.03d36c22.js","0fbf58fc744ffa986d0b25642d63409b"],["/static/media/Bungee-Regular.43d8642d.woff2","43d8642dad278a6d89ed841bb5450794"],["/static/media/ProximaNova-Regular.9a60ae60.woff2","9a60ae6046f8be54eb10315b7d68a117"],["/static/media/ProximaNova-SemiBold.d95e053c.woff2","d95e053cc3c90fd7165117385ad6c455"],["/static/media/bg-diagonal.313e6bc2.svg","313e6bc2a20415052bf4841fdf99842f"],["/static/media/bg-nav.c037c6f6.svg","c037c6f6670c44ee93c27c7d5516c852"],["/static/media/capitalone-directportal1.c129ec1b.png","c129ec1b5bb9906e76c28f2ea15c9154"],["/static/media/capitalone-directportal2.c21bd41d.png","c21bd41d563372c75fb1d6c393e63161"],["/static/media/capitalone-directportal3.ab59a782.png","ab59a782e8ca82b86bc834f0920fca59"],["/static/media/capitalone-prequal2.f3347677.png","f334767729443d8637efa129e3307dd5"],["/static/media/capitalone-prequal3.4d1fe7d4.png","4d1fe7d41f69eb04a8ec3feb67644611"],["/static/media/capitalone-prequal4.be5dff07.png","be5dff076667e31e9e514dc97cb407c4"],["/static/media/hawkeye-agency1.83888bd0.png","83888bd079c8824d0aa6296bdf163771"],["/static/media/hawkeye-agency2.f0314217.png","f03142176db5d6539eccd1508286a34a"],["/static/media/hawkeye-tk1.60f2fb3e.png","60f2fb3ebbb21f12b95324ff1522fe32"],["/static/media/hero-about.4c2445a1.jpg","4c2445a1261e7add14b2942e44b5c134"],["/static/media/hero-contact.2f10ed75.jpg","2f10ed75be14699b8f2e1c1fcb7c67b5"],["/static/media/hero-home.eade695b.jpg","eade695bd22a0ecc4ce80d576b29dffe"],["/static/media/icon-about.7f06ef76.svg","7f06ef76c9a9b74a1db3b097c6b7c7fc"],["/static/media/icon-arrow.096c26b4.svg","096c26b4961ec1162a8d6fa2fb0f4c18"],["/static/media/icon-email.110ac27d.svg","110ac27d100907f262b5492a6240f807"],["/static/media/icon-instagram.22348831.svg","223488316d96bd229fe216883393180c"],["/static/media/icon-linkedin.56031ec1.svg","56031ec123294b11447d7232ddc95922"],["/static/media/icon-resume.f991b511.svg","f991b511c54fec38d0eb4751cccd01d1"],["/static/media/icrossing-bcbst1.16f69294.jpg","16f6929455060c011317673ba1e91248"],["/static/media/icrossing-bcbst2.04d6930a.jpg","04d6930a355ca0c3d757e1abe7d54956"],["/static/media/icrossing-hilton1.dca3228c.jpg","dca3228cd4fdd60c86c2627423ccf3f8"],["/static/media/icrossing-mitsubishi1.f3fec5cc.png","f3fec5cc79b247a9cc91d6d2bc7a2682"],["/static/media/john-nguyen-resume-cv.a9744dcf.pdf","a9744dcfb20569fe627ccc984a6eeb92"],["/static/media/john_nguyen.9fe9dd31.jpg","9fe9dd31e41b331c99649461b534ab40"],["/static/media/logo.3aec0b3b.svg","3aec0b3b70dbe46f0eb0c9e9ab7d372d"],["/static/media/portfolio-thumb-capitalone.a8b79d4e.jpg","a8b79d4e1ddd33e8f667ee91af1612b8"],["/static/media/portfolio-thumb-hawkeye.122a5156.jpg","122a5156fbc1a438a368adbfec240a35"],["/static/media/portfolio-thumb-icrossing.b34a6377.jpg","b34a6377308c1ebb3b8fdb3789d8b973"],["/static/media/squiggly-sharp.293ebdec.svg","293ebdec7cac7129d998827aa940de39"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=a),t.toString()},cleanResponse=function(e){if(!e.redirected)return Promise.resolve(e);return("body"in e?Promise.resolve(e.body):e.blob()).then(function(a){return new Response(a,{headers:e.headers,status:e.status,statusText:e.statusText})})},createCacheKey=function(e,a,t,c){var n=new URL(e);return c&&n.pathname.match(c)||(n.search+=(n.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(t)),n.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var t=new URL(a).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,a){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return a.every(function(a){return!a.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],t=e[1],c=new URL(a,self.location),n=createCacheKey(c,hashParamName,t,/\.\w{8}\./);return[c.toString(),n]}));self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(a){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!a.has(t)){var c=new Request(t,{credentials:"same-origin"});return fetch(c).then(function(a){if(!a.ok)throw new Error("Request for "+t+" returned a response with status "+a.status);return cleanResponse(a).then(function(a){return e.put(t,a)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var a=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(t){return Promise.all(t.map(function(t){if(!a.has(t.url))return e.delete(t)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var a,t=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(a=urlsToCacheKeys.has(t))||(t=addDirectoryIndex(t,"index.html"),a=urlsToCacheKeys.has(t));!a&&"navigate"===e.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],e.request.url)&&(t=new URL("/index.html",self.location).toString(),a=urlsToCacheKeys.has(t)),a&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(a){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,a),fetch(e.request)}))}});