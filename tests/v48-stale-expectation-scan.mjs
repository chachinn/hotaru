import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const files=fs.readdirSync(root).filter(name=>name.endsWith('.mjs')&&name!=='v48-stale-expectation-scan.mjs');
const stale=[];
for(const name of files){
  const text=fs.readFileSync(path.join(root,name),'utf8');
  const hits=[];
  if(/const CACHE = ['"]hotaru-shell-v47['"]/.test(text))hits.push('v47-current');
  if(/PREVIOUS_CACHE\s*=\s*['"]hotaru-shell-v46['"]/.test(text))hits.push('v46-previous');
  if(/pwa-update\\?\.js\\?\?v=1\\?\.1\\?\.1|pwa-update\.js\?v=1\.1\.1/.test(text))hits.push('updater-1.1.1');
  if(/aloy-reviewed-bootstrap\\?\.js\\?\?v=1\\?\.0\\?\.1|aloy-reviewed-bootstrap\.js\?v=1\.0\.1/.test(text))hits.push('bootstrap-1.0.1');
  if(hits.length)stale.push(`${name}: ${hits.join(', ')}`);
}
if(stale.length)console.error(`Stale v48 expectations:\n${stale.join('\n')}`);
assert.deepEqual(stale,[],'tests must not pin the superseded v47/v46 recovery pair or old updater/bootstrap request keys');
console.log('v48 stale PWA expectation scan passed.');
