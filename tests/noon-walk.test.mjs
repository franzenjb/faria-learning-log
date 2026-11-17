import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const NYC = 74.01;
const delay = (west) => (west - NYC) * 4;
const cities = {
  Philadelphia: 75.17,
  Pittsburgh: 79.99,
  Nashville: 86.78,
  Memphis: 90.05,
  Denver: 104.99,
  'Los Angeles': 118.24,
  Fresno: 119.79,
  Barbados: 59.61,
  Rio: 43.17,
  Azores: 25.67,
  London: 0,
  Rome: -12.50,
  Berlin: -13.41,
  Istanbul: -28.98
};

test('talking-point offsets match 4 minutes per degree, rounded', () => {
  assert.equal(Math.round(delay(cities.Philadelphia)), 5);
  assert.equal(Math.round(delay(cities.Pittsburgh)), 24);
  assert.equal(Math.round(delay(cities.Nashville)), 51);
  assert.equal(Math.round(delay(cities.Memphis)), 64);
  assert.equal(Math.round(delay(cities.Denver)), 124); // 2 h 4 min
  assert.equal(Math.round(delay(cities['Los Angeles'])), 177); // 2 h 57 min
  assert.equal(Math.round(delay(cities.Fresno)), 183); // 3 h 3 min
});

test('when it is noon in New York, eastern talking points hold', () => {
  // local minutes after 12:00 = -delay
  const local = (west) => 12 * 60 - delay(west);
  const clock = (west) => {
    const m = local(west);
    return [Math.floor(m / 60), Math.round(m % 60)];
  };
  assert.deepEqual(clock(cities.Barbados), [12, 58]);
  assert.deepEqual(clock(cities.Rio), [14, 3]);
  assert.deepEqual(clock(cities.Azores), [15, 13]);
  assert.deepEqual(clock(cities.London), [16, 56]);
  assert.deepEqual(clock(cities.Rome), [17, 46]);
  assert.deepEqual(clock(cities.Berlin), [17, 50]);
  assert.deepEqual(clock(cities.Istanbul), [18, 52]);
});

test('H4 five-second error is 75 arcseconds, 1.25 arcminutes', () => {
  assert.equal(5 * 15, 75);
  assert.equal(75 / 60, 1.25);
});

test('topic 116 is wired into the build inputs', () => {
  const md = fs.readFileSync('content/topics/116-every-town-its-own-noon.md', 'utf8');
  assert.match(md, /\{\{widget:noon-walk\}\}/);
  assert.match(md, /US_Standard_Time_Zones_National_Atlas_2006\.png/);
  assert.ok(fs.existsSync('public/noon-walk/embed.html'));
  assert.ok(fs.existsSync('public/noon-walk/lesson.html'));
  assert.ok(fs.existsSync('public/img/Noon_Walks_West_NYC_to_LA_Tufte.svg'));
  assert.ok(fs.existsSync('public/downloads/Every_Town_Its_Own_Noon_Longitude_Railroad_Time_and_Time_Zones_Faria_2026-11-16.pdf'));
});
