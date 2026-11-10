import test from 'node:test';
import assert from 'node:assert/strict';
import {geometry} from '../public/polaris/model.js';
test('independently calculated pole altitude equals latitude throughout the northern hemisphere',()=>{for(let lat=0;lat<=90;lat+=.1){const g=geometry(lat);assert.ok(Math.abs(g.altitude-g.centralAngle)<1e-8);assert.ok(Math.abs(g.altitude+g.zenithDistance-90)<1e-8);assert.ok(Math.abs(g.up.x*g.north.x+g.up.y*g.north.y)<1e-12);assert.deepEqual(g.pole,{x:0,y:-1});}});
test('equator, 39 north, New York and North Pole preserve their distinct horizon and zenith references',()=>{for(const lat of [0,39,40.7,90]){const g=geometry(lat);assert.ok(Math.abs(g.altitude-lat)<1e-9);assert.ok(Math.abs(g.zenithDistance-(90-lat))<1e-9);assert.ok(Math.abs(Math.hypot(g.up.x,g.up.y)-1)<1e-12);}});
test('input clamps to the supported northern hemisphere',()=>{assert.equal(geometry(-10).latitude,0);assert.equal(geometry(100).latitude,90);assert.equal(geometry('bad').latitude,0);});
