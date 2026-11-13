/* Service worker de Mis Arcas — offline-first. Cada build cambia la versión de caché: el navegador instala el nuevo,
   App instalada (sw.js): se activa enseguida. Web (sw.js?web=1): espera a que el usuario toque «Recargar»
   (src/web/web.js manda 'skip-waiting'), así una pestaña abierta no pierde archivos a mitad de uso. */
const WEB = new URL(self.location.href).searchParams.has('web');
const CACHE = 'mis-arcas-mwf7jufg';
const PRECACHE = ["./","assets/alegreya-latin-400-italic-BXpar-rJ.woff2","assets/alegreya-latin-400-normal-BLlBRtDv.woff2","assets/alegreya-latin-500-normal-C25lLdV_.woff2","assets/alegreya-latin-700-normal-Vpz_43wJ.woff2","assets/almendra-sc-latin-400-normal-T-ss3kUA.woff2","assets/backup-CW-P7WiL.js","assets/cinzel-decorative-latin-700-normal-CnX1aK6s.woff2","assets/cinzel-latin-600-normal-DsxAee8W.woff2","assets/cinzel-latin-700-normal-CbKq1wQy.woff2","assets/coin-C1m6bMhJ.js","assets/cormorant-sc-latin-600-normal-Bwg_WQP1.woff2","assets/cormorant-sc-latin-700-normal-BmehT1vV.woff2","assets/eb-garamond-latin-400-italic-ELBeDG9B.woff2","assets/eb-garamond-latin-400-normal-QNaSt100.woff2","assets/eb-garamond-latin-500-normal-DzrUnV5r.woff2","assets/esm-CJWR9QzN.js","assets/esm-DaPnSB4Y.js","assets/germania-one-latin-400-normal-BqJ7AzEa.woff2","assets/grenze-gotisch-latin-600-normal-C3H1tCTC.woff2","assets/grenze-latin-500-normal-DL-xG-Kk.woff2","assets/grenze-latin-700-normal-BhnHXdwr.woff2","assets/index-6iTpjlhI.css","assets/index-Fop1L8rw.js","assets/leather-BJdoD0aY.webp","assets/leather-CFwDUemN.webp","assets/leather-ZcHCq37n.webp","assets/lockui-C7xLCskt.js","assets/marcellus-sc-latin-400-normal-BVWXGf4k.woff2","assets/medievalsharp-latin-400-normal-CCE21Gtm.woff2","assets/new-rocker-latin-400-normal-Dx1Qcjw-.woff2","assets/page-Bern3Hvp.webp","assets/page-CshLX1BU.webp","assets/parchment-C9Gg51An.webp","assets/pdf.min-F9R0__-p.js","assets/pdf.worker.min-BbW7gAor.js","assets/pdf.worker.min-Dr1KORA9.mjs","assets/pdftext-D30BVwAk.js","assets/pirata-one-latin-400-normal-C8jLWNfm.woff2","assets/share-CinS1iWR.js","assets/spectral-latin-400-italic-CDO25mTW.woff2","assets/spectral-latin-400-normal-CTVgUekv.woff2","assets/spectral-latin-500-normal-nNjq7_Cd.woff2","assets/surface-C822kEQT.webp","assets/surface-CxbE7MUO.webp","assets/surface-D0DHQkaY.webp","assets/surface-DxbOwS4S.webp","assets/surface-rchixsz3.webp","assets/uncial-antiqua-latin-400-normal-DPalS0aZ.woff2","assets/unifrakturmaguntia-latin-400-normal-ColWi6tl.woff2","assets/web-BEquLpre.js","assets/web-CNHH7lkG.js","assets/web-CorJ_EY-.js","assets/web-EvhDoezx.js","assets/web-ZjtwnaQh.js","assets/wood-CmBzbJ5K.webp","icons/icon-192.png","icons/icon-512.png","icons/icon.svg","icons/maskable-512.png","index.html","manifest.webmanifest"];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE.map((u) => new Request(u, { cache: 'reload' })))).then(() => (WEB ? undefined : self.skipWaiting())));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => (req.mode === 'navigate' ? caches.match('./') : Response.error()));
    })
  );
});

self.addEventListener('message', (e) => { if (e.data === 'skip-waiting') self.skipWaiting(); });
