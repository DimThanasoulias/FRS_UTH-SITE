// Run with: node tests/browser/chat-media.mjs (requires Playwright and Chromium).
import { build } from 'esbuild';
import { createServer } from 'node:http';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { outputFiles } = await build({
  stdin: { contents: `import React from 'react'; import {createRoot} from 'react-dom/client'; import ChatMedia from './src/components/ChatMedia'; const root=createRoot(document.getElementById('root')); window.mount=(src,isGreek=false)=>root.render(React.createElement(ChatMedia,{src,isGreek,onPreview:()=>{},isGif:false}));`, resolveDir: process.cwd(), loader: 'tsx' },
  bundle: true, write: false, format: 'esm', jsx: 'automatic',
});
let requests = 0;
let recover = false;
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a4l8AAAAASUVORK5CYII=', 'base64');
const server = createServer((req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if(req.url==='/bundle.js') { res.setHeader('Content-Type','text/javascript'); res.end(outputFiles[0].text); }
  else if(req.url.startsWith('/photo.png')) {
    requests++;
    if(!recover && requests === 1) {res.writeHead(503);res.end('Temporary failure');}
    else {res.setHeader('Content-Type','image/png');res.end(png);}
  } else if(req.url.startsWith('/missing.png') && !recover) {res.writeHead(404);res.end();}
  else if(req.url.startsWith('/missing.png')) {res.setHeader('Content-Type','image/png');res.end(png);}
  else res.end('<div id="root"></div><script type="module" src="/bundle.js"></script>');
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless:true,args:['--no-sandbox']});
try {
 const page=await browser.newPage();
 await page.goto(`http://127.0.0.1:${server.address().port}`);
 await page.waitForFunction(()=>typeof window.mount==='function');
 await page.evaluate(()=>window.mount('/photo.png'));
 await page.waitForFunction(()=>document.querySelector('img')?.naturalWidth>0,{},{timeout:10000});
 assert.ok(requests>=2,'Temporary failures must retry automatically');
 console.log('PASS: transient image failure recovers automatically');
 await page.evaluate(()=>window.mount('/missing.png',true));
 const retry=page.getByRole('button',{name:'Δοκιμή ξανά',exact:true});
 await retry.waitFor({timeout:12000});
 assert.ok(!(await page.locator('body').innerText()).includes('διαγράφηκε'),'Loading errors must not claim deletion');
 recover=true;
 await retry.click();
 await page.waitForFunction(()=>document.querySelector('img')?.naturalWidth>0);
 console.log('PASS: persistent failure has honest Greek message and working manual retry');
 await page.evaluate(()=>window.mount('/missing.png?new',false));
 await page.waitForFunction(()=>document.querySelector('img')?.naturalWidth>0);
 console.log('PASS: changing the source resets error state');
} finally {await browser.close();server.close();}
