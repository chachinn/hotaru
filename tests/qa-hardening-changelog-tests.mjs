import assert from 'node:assert/strict';
import fs from 'node:fs';

const text=fs.readFileSync('docs/QA_HARDENING_CHANGELOG.md','utf8');
for(const phrase of ['Shrine of Depth','Cryoculus','PWA shell v12','No existing runtime feature'])assert.match(text,new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
console.log('Hotaru QA-hardening changelog boundary QA: passed.');
