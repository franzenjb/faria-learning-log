import test from 'node:test';
import assert from 'node:assert/strict';
import { utmZone, mgrs, dms, parseLatLon } from '../public/three-ways/model.js';
test('Fort Myers worked example matches PROJ (pyproj) values', () => {
  assert.equal(utmZone(26.64, -81.8722), 17);
  assert.equal(mgrs(17, 26.64, 413188.6375, 2946859.2331), '17R MK 13188 46859');
  assert.equal(dms(26.64, 'N', 'S'), '26° 38′ 24.0″ N');
});
test('UTM zone exceptions for Norway and Svalbard', () => {
  assert.equal(utmZone(60, 5), 32); assert.equal(utmZone(78, 15), 33); assert.equal(utmZone(0, -180), 1); assert.equal(utmZone(0, 179.9), 60);
});
test('parses decimal and DMS input', () => {
  assert.deepEqual(parseLatLon('26.64, -81.8722'), { lat: 26.64, lon: -81.8722 });
  assert.ok(Math.abs(parseLatLon('26°38′24″N 81°52′20″W').lon + 81.87222) < 1e-4);
  assert.equal(parseLatLon('hello'), null);
});
