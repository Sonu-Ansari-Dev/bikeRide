const C='bikedash-v9';
const A=['./','index.html','manifest.json','icon.svg','leaflet.js','leaflet.css','leaflet-rotate.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A.map(u=>new Request(u,{cache:'reload'})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
// installed app: open instantly from the cache (works offline), refresh the cache in the background
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return; // map tiles, routing, weather: always network
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(m=>{
    const f=fetch(e.request).then(r=>{if(r.ok)caches.open(C).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>m);
    return m||f;
  }));
});
