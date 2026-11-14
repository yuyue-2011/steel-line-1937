/* ================================================================
   game.js —— 战斗引擎 · 战争时钟 · 前线手册 · 存档 · 音效
   ================================================================ */
'use strict';

/* ---------- DOM ---------- */
const $ = (id) => document.getElementById(id);
const cv = $('cv'), CTX = cv.getContext('2d');

/* ---------- 存档 ---------- */
const SAVE_KEY = 'ironline_m1';
let SAVE = {
  furthest: 0,
  done: [false,false,false,false,false,false,false,false,false,false,false,false],
  hard: [false,false,false,false,false,false,false,false,false,false,false,false],
  diff: ['norm','norm','norm','norm','norm','norm','norm','norm','norm','norm','norm','norm'],
  helped: false,
  salvage: 0, totKills: 0,
  up: { dmg:0, hp:0, sun:0, cd:0 },
};
try {
  const s = JSON.parse(localStorage.getItem(SAVE_KEY));
  if (s && typeof s.furthest === 'number') SAVE = Object.assign(SAVE, s);
} catch(e){}
/* 存档迁移：关卡扩充与字段补全（导入外部存档时复用） */
/* V8.0 · 35 关档 → 45 关档：旧位序 → 新位序映射（北非/太平洋插在14-20位，西欧插在28-32位） */
const OLD35_TO_NEW45 = (() => {
  const m = [];
  for (let i=0; i<=13; i++) m[i] = i;          // 中国12 + 勒热夫/塞瓦斯托波尔不动
  m[14] = 19;                                   // 斯大林格勒 → 20位
  for (let i=15; i<=21; i++) m[i] = i + 6;      // 天王星…雅西 → 22-28位
  m[22] = 31;                                   // 维斯瓦 → 32位
  for (let i=23; i<=34; i++) m[i] = i + 10;     // 塞洛/柏林/胜利之路 → 34-45位
  return m;
})();
function remapOld35To45(){
  const nd = [], nh = [], ndf = [];
  for (let i=0; i<LEVELS.length; i++){ nd.push(false); nh.push(false); ndf.push('norm'); }
  for (let i=0; i<35 && i<SAVE.done.length; i++){
    const j = (OLD35_TO_NEW45[i] != null) ? OLD35_TO_NEW45[i] : i;
    nd[j] = !!SAVE.done[i];
    nh[j] = !!(SAVE.hard && SAVE.hard[i]);
    ndf[j] = (SAVE.diff && SAVE.diff[i]) || 'norm';
  }
  SAVE.done = nd; SAVE.hard = nh; SAVE.diff = ndf;
  if (typeof SAVE.furthest === 'number' && SAVE.furthest >= 0 && SAVE.furthest < 35){
    SAVE.furthest = (OLD35_TO_NEW45[SAVE.furthest] != null) ? OLD35_TO_NEW45[SAVE.furthest] : SAVE.furthest;
  }
}
function migrateSaveNow(){
  const n = (typeof LEVELS !== 'undefined') ? LEVELS.length : 15;
  /* V8.0：35 关旧档先按位序重映射到 45 关，再补齐 */
  if (SAVE.schema !== 45 && Array.isArray(SAVE.done) && (SAVE.done.length === 35 || SAVE.done.length === 25 || SAVE.done.length === 15)){
    while (SAVE.done.length < 35) SAVE.done.push(false);
    if (!Array.isArray(SAVE.hard)) SAVE.hard = [];
    while (SAVE.hard.length < 35) SAVE.hard.push(false);
    if (!Array.isArray(SAVE.diff)) SAVE.diff = [];
    while (SAVE.diff.length < 35) SAVE.diff.push('norm');
    remapOld35To45();
    SAVE.schema = 45;
  }
  while (SAVE.done.length < n) SAVE.done.push(false);
  if (SAVE.done.length > n) SAVE.done = SAVE.done.slice(0, n);
  SAVE.done = SAVE.done.map(v => !!v);
  if (!Array.isArray(SAVE.hard)){ SAVE.hard = []; }
  while (SAVE.hard.length < n) SAVE.hard.push(false);
  SAVE.hard = SAVE.hard.map(v => !!v).slice(0, n);
  if (!Array.isArray(SAVE.diff)){ SAVE.diff = []; }
  while (SAVE.diff.length < n) SAVE.diff.push('norm');
  SAVE.diff = SAVE.diff.map(v => (DIFFS && DIFFS.some(x => x.id === v)) ? v : 'norm').slice(0, n);
  if (typeof SAVE.salvage !== 'number' || !isFinite(SAVE.salvage)) SAVE.salvage = 0;
  if (typeof SAVE.totKills !== 'number' || !isFinite(SAVE.totKills)) SAVE.totKills = 0;
  SAVE.up = Object.assign({ dmg:0, hp:0, sun:0, cd:0, heal:0, loot:0, refund:0, lamp:0 }, SAVE.up || {});
  ['dmg','hp','sun','cd'].forEach(k => {
    SAVE.up[k] = Math.max(0, Math.min(3, Math.round(SAVE.up[k] || 0)));
  });
  ['heal','loot','refund','lamp'].forEach(k => {
    SAVE.up[k] = Math.max(0, Math.min(2, Math.round(SAVE.up[k] || 0)));
  });
  SAVE.furthest = Math.max(0, Math.min(n, Math.round(SAVE.furthest)));
  SAVE.v = 2;
  SAVE.schema = 45;
}
migrateSaveNow();
function medalCount(){ return SAVE.hard.filter(Boolean).length; }
function save(){
  try {
    /* 写入前把旧档转存备份槽（一键复原用） */
    const prev = localStorage.getItem(SAVE_KEY);
    if (prev && prev !== JSON.stringify(SAVE)) localStorage.setItem(SAVE_KEY + '_bak', prev);
    localStorage.setItem(SAVE_KEY, JSON.stringify(SAVE));
  } catch(e){}
}

/* ---------- 设置（画质/显示，持久化） ---------- */
const SET_KEY = 'ironline_set';
let SET = { quality:'high', bars:'always', fpsCap:0, fx:true, allUnlock:false };
const SET_DEFAULTS = JSON.parse(JSON.stringify(SET));
try {
  const s2 = JSON.parse(localStorage.getItem(SET_KEY));
  if (s2 && typeof s2 === 'object') SET = Object.assign(SET, s2);
} catch(e){}
function clampSet(){
  if (['high','med','low'].indexOf(SET.quality) < 0) SET.quality = 'high';
  if (['always','damaged'].indexOf(SET.bars) < 0) SET.bars = 'always';
  SET.fpsCap = [0, 30, 60].indexOf(SET.fpsCap) >= 0 ? SET.fpsCap : 0;
  SET.fx = !!SET.fx;
  SET.allUnlock = !!SET.allUnlock;
}
clampSet();
function saveSet(){ try { localStorage.setItem(SET_KEY, JSON.stringify(SET)); } catch(e){} }

/* ---------- 音效（WebAudio 全合成） ---------- */
const AU = {
  ctx: null, muted: false, lastShot: 0, bgmNext: 0, bgmStep: 0,
  init(){
    if (this.ctx) return;
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){}
  },
  tone(freq, dur, vol, type, slide){
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, slide), t0 + dur);
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  },
  noise(dur, vol, filterFreq, type){
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i=0;i<len;i++) d[i] = Math.random()*2 - 1;
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const f = this.ctx.createBiquadFilter();
    f.type = type || 'lowpass'; f.frequency.value = filterFreq || 800;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(this.ctx.destination);
    src.start(t0);
  },
  shot(){
    const now = performance.now();
    if (now - this.lastShot < 90) return;
    this.lastShot = now;
    this.noise(0.07, 0.10, 1700, 'bandpass');
    this.tone(240, 0.05, 0.05, 'square', 120);
  },
  hit(){ this.noise(0.05, 0.07, 600); },
  plant(){ this.tone(120, 0.14, 0.16, 'sine', 70); this.noise(0.05, 0.06, 400); },
  collect(){ this.tone(620, 0.09, 0.10, 'triangle'); setTimeout(()=>this.tone(930, 0.12, 0.09, 'triangle'), 60); },
  shovel(){ this.noise(0.1, 0.12, 900, 'bandpass'); },
  gong(){
    this.tone(128, 1.6, 0.30); this.tone(192, 1.4, 0.18); this.tone(287, 1.1, 0.10);
    this.noise(0.12, 0.2, 300);
  },
  boom(){ this.noise(0.5, 0.35, 900); this.tone(110, 0.5, 0.3, 'sine', 34); },
  boom2(){ this.noise(0.3, 0.22, 700); this.tone(150, 0.3, 0.2, 'sine', 60); },
  mortar(){ this.tone(300, 0.18, 0.14, 'sine', 90); this.noise(0.08, 0.08, 500); },
  magnet(){ this.tone(880, 0.22, 0.08, 'sine', 1400); this.tone(1320, 0.16, 0.05, 'sine', 900); },
  woodbreak(){ this.noise(0.14, 0.18, 2200, 'bandpass'); },
  charge(){ this.tone(392, 0.12, 0.2, 'square'); setTimeout(()=>this.tone(523, 0.14, 0.2, 'square'), 110); this.noise(0.2, 0.1, 500); },
  wave(){ this.noise(0.16, 0.16, 250); this.tone(90, 0.25, 0.22, 'sine', 60); },
  horn(){ const ns = [392, 523, 659, 784]; ns.forEach((f, i) => setTimeout(()=>this.tone(f, 0.26, 0.2, 'square'), i*180)); },
  lose(){ this.tone(220, 0.9, 0.25, 'sine', 70); this.tone(146, 1.2, 0.2, 'sine', 60); },
  bgm(){
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    if (this.bgmNext < now) this.bgmNext = now + 0.05;
    while (this.bgmNext < now + 0.3){
      const st = this.bgmStep % 8;
      const t = this.bgmNext;
      if (st===0 || st===4) this._beat(t, 66, 0.10, 0.2);
      if (st===2 || st===6) this._beat(t, 210, 0.045, 0.08, true);
      this.bgmStep++; this.bgmNext += 0.235;
    }
  },
  _beat(when, freq, vol, dur, snare){
    if (!this.ctx || this.muted) return;
    const t0 = when;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(this.ctx.destination); o.start(t0); o.stop(t0 + dur + 0.02);
    if (snare){
      const len = Math.floor(this.ctx.sampleRate * 0.06);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i=0;i<len;i++) d[i] = Math.random()*2-1;
      const src = this.ctx.createBufferSource(); src.buffer = buf;
      const f = this.ctx.createBiquadFilter(); f.type='highpass'; f.frequency.value = 1400;
      const g2 = this.ctx.createGain();
      g2.gain.setValueAtTime(0.03, t0); g2.gain.exponentialRampToValueAtTime(0.0001, t0+0.06);
      src.connect(f); f.connect(g2); g2.connect(this.ctx.destination); src.start(t0);
    }
  }
};

/* ---------- 全局状态 ---------- */
const G = {
  state: 'menu',          // menu | play | pause | win | lose
  lvIdx: 0, level: null, env: null, H: 542,
  sun: 0, simT: 0, elapsed: 0, waveIdx: 0, skyT: 3,
  plants: [], enemies: [], bullets: [], drops: [], sweepers: [], effects: [],
  grid: [], rows: 5, unlocked: [], cd: {},
  sel: null, shovel: false, hover: null,
  kills: 0, pendingWin: 0, loseFlash: 0,
  slotList: [], slotEls: [], fromAlmanac: 'title',
};

function rowY(r){ return GRID.y0 + r * GRID.ch; }
function colX(c){ return GRID.x0 + c * GRID.cw; }
function isWater(r){ return G.env && G.env.waterRows.indexOf(r) >= 0; }

/* ---------- 屏幕切换 ---------- */
const SCREENS = ['scr-title','scr-clock','scr-brief','scr-almanac','scr-help','scr-shop','scr-save','scr-set','scr-battle'];
function showScreen(id){
  SCREENS.forEach(s => $(s).classList.toggle('hidden', s !== id));
  $('ov-pause').classList.add('hidden');
  $('scr-result').classList.add('hidden');
}

/* ================================================================
   关卡启动
   ================================================================ */
function startLevel(i){
  G.lvIdx = i;
  const lv = LEVELS[i];
  G.level = lv;
  G.rows = lv.rows;
  /* V7.9：水行 = 关卡显式 waterRows 优先，否则按地形默认（tz/sv/dn 沿用旧值；ml 默认无水，需关卡自行声明） */
  const WATER_DEFAULT = { tz:[2,3], sv:[2,4], dn:[2] };
  G.env = { waterRows: lv.waterRows || WATER_DEFAULT[lv.terrain] || [], mudRows: lv.mudRows || [] };
  G.H = GRID.y0 + lv.rows * GRID.ch + 36;
  cv.height = G.H;
  cv.width = 960;

  G.up = { dmg:SAVE.up.dmg, hp:SAVE.up.hp, sun:SAVE.up.sun, cd:SAVE.up.cd,
           heal:SAVE.up.heal||0, loot:SAVE.up.loot||0, refund:SAVE.up.refund||0, lamp:SAVE.up.lamp||0 };
  G.healT = 4;
  G.dmgMul = 1 + 0.08 * G.up.dmg;
  G.hpMul  = 1 + 0.10 * G.up.hp;
  G.cdMul  = Math.max(0.5, 1 - 0.08 * G.up.cd);
  G.diff = DIFFS.find(x => x.id === (SAVE.diff[i] || 'norm')) || DIFFS[1];

  G.sun = lv.startSun + 50 * G.up.sun + G.diff.sun; G.simT = 0; G.elapsed = 0; G.waveIdx = 0;
  G.skyT = 4; G.plants = []; G.enemies = []; G.bullets = []; G.drops = [];
  G.shells = [];
  G.terrainCache = null; G.terrainCacheKey = null;   // 静态地形缓存重建（换关/换画质）
  G.sweepers = []; G.effects = [];
  G.sel = null; G.shovel = false; G.hover = null;
  G.kills = 0; G.salvage = 0; G.pendingWin = 0; G.cd = {};
  G.grid = [];
  for (let r=0; r<lv.rows; r++){
    const row = [];
    for (let c=0; c<GRID.cols; c++) row.push({ plant:null, plat:null, ladder:false });
    G.grid.push(row);
  }
  for (let r=0; r<lv.rows; r++){
    G.sweepers.push({ row:r, x:66, y: rowY(r) + GRID.ch - 14, state:'idle', gone:false });
  }
  G.unlocked = DEF_ORDER.filter(id => DEF[id].unlock <= lv.id);

  buildSlots();
  buildProgress();
  $('sun-count').textContent = G.sun;
  $('battle-tip').textContent = '「' + lv.title + '」 · ' + lv.tip;
  $('banner').className = '';
  showScreen('scr-battle');
  countdown();

  G.state = 'play';
  showBanner('准备——部署！', 'small', 1400);
}

function countdown(){
  const el = $('countdown');
  el.style.opacity = '1';
  el.textContent = '准备——';
  setTimeout(()=>{ el.textContent = '部署！'; }, 900);
  setTimeout(()=>{ el.style.opacity = '0'; }, 1900);
}

function buildSlots(){
  const wrap = $('slots');
  wrap.innerHTML = '';
  G.slotEls = [];
  G.slotList = G.unlocked.slice();
  /* V1.8.1：卡片数随进度增长（后期 32 张），按数量收窄，避免 HUD 撑成三行压掉画面 */
  wrap.className = G.slotList.length > 26 ? 'lots' : (G.slotList.length > 18 ? 'many' : '');
  G.slotList.forEach((type, idx) => {
    const d = DEF[type];
    const el = document.createElement('div');
    el.className = 'slot';
    el.title = d.name + ' · ' + d.cost;
    el.innerHTML = '<img src="' + makeIcon(type, false) + '"><div class="cost">' + d.cost + '</div><div class="cd"></div>' +
      (idx < 10 ? '<div class="key">' + ((idx+1) % 10) + '</div>' : '');
    el.addEventListener('click', () => { AU.init(); selectType(type); });
    wrap.appendChild(el);
    G.slotEls.push({ el, type, cd: el.querySelector('.cd') });
  });
  $('btn-shovel').classList.remove('sel');
}

function selectType(type){
  if (G.sel === type){ G.sel = null; return; }
  G.shovel = false;
  $('btn-shovel').classList.remove('sel');
  G.sel = type;
}

function buildProgress(){
  const total = G.level.waves.length;
  const flags = $('prog-flags');
  flags.innerHTML = '';
  G.level.waves.forEach((w, i) => {
    if (w.huge){
      const f = document.createElement('i');
      f.style.left = (i / total * 100) + '%';
      flags.appendChild(f);
    }
  });
  $('prog-fill').style.width = '0%';
}

/* ================================================================
   部署 / 拆除
   ================================================================ */
function canPlace(type, r, c){
  if (r < 0 || r >= G.rows || c < 0 || c >= GRID.cols) return false;
  const cell = G.grid[r][c];
  const water = isWater(r);
  const spec = DEF[type];
  if (cell.plant) return false;
  if (spec.kind === 'platform') return water && !cell.plat;
  if (water) return !!cell.plat || !!spec.water;   // 水兵班可直接下水
  return !cell.ladder;
}

function place(type, r, c){
  const d = DEF[type];
  if (G.sun < d.cost) { flashBanner('补给不足！', 'small', 800); return; }
  if ((G.cd[type] || 0) > 0) { flashBanner('增援冷却中……', 'small', 900); return; }
  if (!canPlace(type, r, c)) return;
  const hp = Math.round(d.hp * G.hpMul);
  const p = {
    type, row:r, col:c,
    x: colX(c) + GRID.cw/2, y: rowY(r) + GRID.ch - 10,
    hp, maxHp: hp, t: Math.random()*10,
    shootT: 0.5, burst: 0, burstT: 0, flash: 0,
    prodT: d.interval || 0, fuse: 1.0, armT: d.arm || 0, chewT: 0,
    state: 'idle', aimT: 0, jumpT: 0, jumpH: 0, jx: null, target: null,
    pulseT: d.pulse || 0, remove: false, phase: Math.random()*6,
  };
  G.plants.push(p);
  if (d.kind === 'platform') G.grid[r][c].plat = p; else G.grid[r][c].plant = p;
  G.sun -= d.cost;
  G.cd[type] = d.cd * G.cdMul;
  G.sel = null;
  AU.plant();
  $('sun-count').textContent = G.sun;
}

function removeAt(r, c){
  const cell = G.grid[r][c];
  if (cell.plant){
    /* 预备队制度：铲除守军按等级返还 40%/70% 布置费 */
    const rk = (G.up && G.up.refund) || 0;
    if (rk > 0){
      const back = Math.round((DEF[cell.plant.type] ? DEF[cell.plant.type].cost : 0) * (0.4 + 0.3 * (rk - 1)));
      if (back > 0){ G.sun += back; addEffect('plus15', cell.plant.x, cell.plant.y - 60, 0.8).val = back; syncHUD(); }
    }
    cell.plant.remove = true;
    cell.plant = null;
    AU.shovel();
    return;
  }
  if (cell.ladder){
    cell.ladder = false;
    addEffect('woodbreak', colX(c)+GRID.cw/2, rowY(r)+GRID.ch/2, 0.5);
    AU.woodbreak();
    return;
  }
  if (cell.plat){
    cell.plat.remove = true;
    cell.plat = null;
    AU.shovel();
  }
}
function killPlant(p){ p.remove = true; const cell = G.grid[p.row][p.col]; if (cell.plant === p) cell.plant = null; if (cell.plat === p) cell.plat = null; }

/* ================================================================
   波次
   ================================================================ */
function spawnWave(){
  const w = G.level.waves[G.waveIdx];
  w.units.forEach(entry => {
    const [type, n] = entry;
    const spec = EN[type];
    for (let i=0;i<n;i++){
      let rowsPool = spec.water ? G.env.waterRows : allLandRows();
      if (!rowsPool.length) rowsPool = allLandRows();   /* V7.9 兜底：无水行则泅渡兵上岸步行 */
      const row = rowsPool[Math.floor(Math.random()*rowsPool.length)];
      G.enemies.push({
        type, row,
        x: 1000 + i*36 + Math.random()*30,
        y: rowY(row) + GRID.ch - 12,
        hp: Math.round(spec.hp * G.diff.hp), maxHp: Math.round(spec.hp * G.diff.hp), shield: Math.round(spec.shield * G.diff.hp) || 0,
        speed: spec.speed * G.diff.spd, phase: Math.random()*6,
        slowT: 0, rage:false, eating:null, dead:false, deathT:0, remove:false,
        vaulting:0, vaultFrom:0, vaultTo:0, vaulted:false, hitFlash:0,
        submerged: !!spec.water, ladderDone:false,
        stilts: type === 'pogo', lostLadder:false,
        digging: type === 'digger' || type === 'de_sapper', reverse:false,
        vehicle: !!spec.vehicle,
      });
    }
  });
  G.waveIdx++;
  if (w.huge){ showBanner('大规模进攻！', '', 2200); AU.gong(); }
  else { AU.wave(); }
  $('prog-fill').style.width = (G.waveIdx / G.level.waves.length * 100) + '%';
}
function allLandRows(){
  const out = [];
  for (let r=0; r<G.rows; r++) if (!isWater(r)) out.push(r);
  return out;
}
function showBanner(text, cls, dur){
  const b = $('banner');
  b.textContent = text;
  b.className = 'show ' + (cls || '');
  clearTimeout(b._t);
  b._t = setTimeout(()=>{ b.className = ''; }, dur || 1800);
}
function flashBanner(t, c, d){ if (G.state==='play') showBanner(t, c, d); }

/* ================================================================
   主更新
   ================================================================ */
function update(dt){
  G.simT += dt;
  G.elapsed += dt;

  // 冷却
  for (const k in G.cd){ if (G.cd[k] > 0) G.cd[k] = Math.max(0, G.cd[k] - dt); }

  // 天降补给
  if (G.level.sky > 0){
    G.skyT -= dt;
    if (G.skyT <= 0){
      G.skyT = G.level.sky * (0.75 + Math.random()*0.6) * G.diff.sky;
      const c = Math.floor(Math.random()*GRID.cols);
      const r = Math.floor(Math.random()*G.rows);
      G.drops.push({ x: colX(c) + 14 + Math.random()*(GRID.cw-28), y: -24, vy: 62,
        landY: rowY(r) + GRID.ch - 20, vx: 0, gravity: 0, landed:false, life: 12, val: 25 });
    }
  }

  // 波次触发
  if (G.waveIdx < G.level.waves.length){
    const w = G.level.waves[G.waveIdx];
    const alive = G.enemies.some(e => !e.dead);
    if (G.elapsed >= w.t || (!alive && G.elapsed >= w.t * 0.55 && G.waveIdx > 0)){
      spawnWave();
    }
  }

  updatePlants(dt);
  updateEnemies(dt);
  updateBullets(dt);
  updateShells(dt);
  updateSweepers(dt);
  updateDrops(dt);

  // 特效
  G.effects.forEach(fx => fx.age += dt);
  G.effects = G.effects.filter(fx => fx.age < fx.dur);

  G.plants = G.plants.filter(p => !p.remove);
  G.enemies = G.enemies.filter(e => !e.remove);

  // 胜负
  if (G.waveIdx >= G.level.waves.length && G.enemies.length === 0){
    G.pendingWin += dt;
    if (G.pendingWin > 1.1) doWin();
  }

  // 行军鼓
  AU.bgm();
}

function addEffect(kind, x, y, dur){
  /* 低画质/关特效：跳过纯装饰粒子（保留战斗判定反馈类） */
  const fx = { kind, x, y, age:0, dur: dur || 0.5 };
  if (SET.quality === 'low' || !SET.fx){
    if (kind === 'muzzle' || kind === 'smoke' || kind === 'woodbreak') return null;
  }
  G.effects.push(fx);
  return fx;
}

/* ---------- 守军更新 ---------- */
function updatePlants(dt){
  /* 战地医疗队：每4秒全体守军自愈 */
  if (G.up && G.up.heal > 0){
    G.healT -= dt;
    if (G.healT <= 0){
      G.healT = 4;
      const amt = 3 * G.up.heal;
      for (const p of G.plants){
        if (p.remove || p.hp >= p.maxHp) continue;
        p.hp = Math.min(p.maxHp, p.hp + amt);
      }
    }
  }
  for (const p of G.plants){
    if (p.remove) continue;
    const d = DEF[p.type];
    if (p.flash > 0) p.flash -= dt;

    if (d.kind === 'shooter'){
      const target = frontEnemyInRow(p.row, p.x);
      if (p.burst > 0){
        p.burstT -= dt;
        if (p.burstT <= 0){
          spawnBullet(p, d);
          p.burst--; p.burstT = 0.14;
        }
      } else if (target){
        p.shootT -= dt;
        if (p.shootT <= 0){
          spawnBullet(p, d);
          p.burst = (d.shots || 1) - 1;
          p.burstT = 0.14;
          p.shootT = d.rate;
          p.flash = 0.12;
          AU.shot();
        }
      } else {
        p.shootT = Math.min(p.shootT, 0.4);
      }
    }
    else if (d.kind === 'producer'){
      p.prodT -= dt;
      if (p.prodT <= 0){
        p.prodT = d.interval;
        G.drops.push({ x: p.x + (Math.random()*24-12), y: p.y - 46, vy: -110, vx: Math.random()*40-20,
          gravity: 300, landY: p.y - 14, landed:false, life: 12, val: 25 });
      }
    }
    else if (d.kind === 'instant'){
      p.fuse -= dt;
      if (p.fuse <= 0){
        explode(p.x, p.y - 30, p.row, 1, 1800, 150);
        killPlant(p);
      }
    }
    else if (d.kind === 'mine'){
      if (p.armT > 0){ p.armT -= dt; }
      else {
        const victim = G.enemies.find(e => !e.dead && !e.remove && e.row === p.row && Math.abs(e.x - p.x) < 38);
        if (victim){
          explode(p.x, p.y - 14, p.row, 0, 1800, 74);
          killPlant(p);
        }
      }
    }
    else if (d.kind === 'melee'){
      if (p.chewT > 0){ p.chewT -= dt; }
      else {
        const victim = G.enemies.filter(e => !e.dead && !e.remove && !e.vehicle && !e.digging && e.row === p.row && e.x > p.x - 44 && e.x < p.x + 95)
          .sort((a,b)=>a.x-b.x)[0];
        if (victim){
          swallow(victim, p);
          p.chewT = 42;
        }
      }
    }
    else if (d.kind === 'jalapeno'){
      p.fuse -= dt;
      if (p.fuse <= 0){
        // 整行急袭
        addEffect('rowfire', GRID.x0 + GRID.cw*4.5, rowY(p.row) + GRID.ch/2, 0.8);
        explodeDamage(p.row, 560, 620, 1800, true);
        AU.boom(); AU.gong();
        killPlant(p);
      }
    }
    else if (d.kind === 'lob'){
      const target = frontEnemyInRow(p.row, p.x);
      if (target){
        p.shootT -= dt;
        if (p.shootT <= 0){
          p.shootT = d.rate;
          p.flash = 0.15;
          const lead = Math.max(0, target.speed*88*0.9*(target.reverse?-1:1)) * (target.slowT>0?0.5:1);
          G.shells.push({ row:p.row, x0:p.x+6, y0:p.y-44, tx:Math.max(GRID.x0+20, Math.min(1000, target.x - lead)), t:0, dur:0.9, dmg:d.dmg, splash:d.splash, atv:d.atv });
          AU.mortar();
        }
      } else {
        p.shootT = Math.min(p.shootT, 0.5);
      }
    }
    else if (d.kind === 'magnet'){
      if (p.pulseT > 0){ p.pulseT -= dt; }
      else {
        p.pulseT = d.pulse;
        addEffect('wrench', p.x + 12, p.y - 46, 0.7);
        AU.magnet();
        for (const e of G.enemies){
          if (e.dead || e.remove) continue;
          if (e.vehicle) continue;
          if (Math.abs(e.row - p.row) > 1) continue;
          if (Math.abs(e.x - p.x) > 300) continue;
          if (stripGear(e)) addEffect('woodbreak', e.x, e.y - 60, 0.5);
        }
      }
    }
    else if (d.kind === 'spike'){
      for (const e of G.enemies){
        if (e.dead || e.remove || e.digging || e.vaulting > 0) continue;
        if (e.row !== p.row || Math.abs(e.x - p.x) > 50) continue;
        damageEnemy(e, d.dps * dt, true);
      }
    }
    else if (d.kind === 'shooter3'){
      // DP-27：本行 + 上下邻行
      const rows3 = [p.row-1, p.row, p.row+1].filter(r => r >= 0 && r < G.rows);
      const hasTarget = rows3.some(r => frontEnemyInRow(r, p.x));
      if (hasTarget){
        p.shootT -= dt;
        if (p.shootT <= 0){
          let fired = false;
          for (const r of rows3){
            const target = frontEnemyInRow(r, p.x);
            if (target){
              fired = true;
              G.bullets.push({ row:r, x:p.x + 26, y:p.y - 30 + (r - p.row)*GRID.ch*0.6, dmg:d.dmg, slow:false, fire:false });
            }
          }
          if (fired){ p.flash = 0.15; p.shootT = d.rate; AU.shot(); }
        }
      } else {
        p.shootT = Math.min(p.shootT, 0.5);
      }
    }
    else if (d.kind === 'lobslow'){
      const target = frontEnemyInRow(p.row, p.x);
      if (target){
        p.shootT -= dt;
        if (p.shootT <= 0){
          p.shootT = d.rate;
          p.flash = 0.15;
          const lead = Math.max(0, target.speed*88*0.9*(target.reverse?-1:1)) * (target.slowT>0?0.5:1);
          G.shells.push({ row:p.row, x0:p.x+6, y0:p.y-44, tx:Math.max(GRID.x0+20, Math.min(1000, target.x - lead)), t:0, dur:0.9, dmg:d.dmg, slow:true });
          AU.mortar();
        }
      } else {
        p.shootT = Math.min(p.shootT, 0.5);
      }
    }
    else if (d.kind === 'avshooter'){
      // PTRD：慢射速，对载具高倍穿甲
      const target = frontEnemyInRow(p.row, p.x);
      if (target){
        p.shootT -= dt;
        if (p.shootT <= 0){
          p.shootT = d.rate;
          p.flash = 0.15;
          G.bullets.push({ row:p.row, x:p.x + 28, y:p.y - 24, dmg:d.dmg, slow:false, fire:false, atv:d.atv });
          AU.shot();
        }
      } else {
        p.shootT = Math.min(p.shootT, 0.5);
      }
    }
    else if (d.kind === 'splitshooter'){
      // 巷战哨组：正/反双向独立开火
      const front = frontEnemyInRow(p.row, p.x);
      const rear = G.enemies.find(e => !e.dead && !e.remove && !e.submerged && e.digging !== true
        && e.row === p.row && e.x < p.x + 40 && e.x > GRID.x0 - 20);
      p.shootT -= dt;
      if (p.shootT <= 0 && (front || rear)){
        p.shootT = d.rate;
        p.flash = 0.14;
        if (front){
          G.bullets.push({ row:p.row, x:p.x + 40, y:p.y - 38, dmg:d.dmg, slow:false, fire:false });
        }
        if (rear){
          G.bullets.push({ row:p.row, x:p.x - 60, y:p.y - 38, dmg:d.dmg, slow:false, fire:false, back:true });
        }
        AU.shot();
      }
      if (!front && !rear){ p.shootT = Math.min(p.shootT, 0.4); }
    }
    else if (d.kind === 'salvproducer'){
      // 战利品缴获队：定期清点缴获
      if (p.prodT == null) p.prodT = d.interval;
      p.prodT -= dt;
      if (p.prodT <= 0){
        p.prodT = d.interval;
        G.salvage += d.val;
        addEffect('plus15', p.x, p.y - 58, 0.8).val = d.val;
        AU.plant();
        syncHUD();
      }
    }
    else if (d.kind === 'jalapeno3'){
      p.fuse -= dt;
      if (p.fuse <= 0){
        // 喀秋莎：三行齐射
        for (const r of [p.row-1, p.row, p.row+1]){
          if (r < 0 || r >= G.rows) continue;
          addEffect('rowfire', GRID.x0 + GRID.cw*4.5, rowY(r) + GRID.ch/2, 0.9);
          explodeDamage(r, 560, 620, 1800, true);
        }
        AU.boom(); AU.gong();
        killPlant(p);
      }
    }
    else if (d.kind === 'squash'){
      if (p.state === 'idle'){
        const victim = G.enemies.filter(e => !e.dead && !e.remove && e.row === p.row && e.x > p.x - 60 && e.x < p.x + GRID.cw*2)
          .sort((a,b)=>a.x-b.x)[0];
        if (victim){ p.state = 'aim'; p.aimT = 0.5; p.target = victim; }
      }
      else if (p.state === 'aim'){
        p.aimT -= dt;
        if (!p.target || p.target.dead || p.target.remove){
          const v2 = G.enemies.filter(e => !e.dead && !e.remove && e.row === p.row && e.x > p.x - 60 && e.x < p.x + GRID.cw*2.4)
            .sort((a,b)=>a.x-b.x)[0];
          p.target = v2 || null;
          if (!p.target && p.aimT < 0){ p.state = 'idle'; }
        }
        if (p.aimT <= 0 && p.target){
          p.state = 'jump'; p.jumpT = 0.85;
          p.jx = p.x; p.jumpH = 0;
          p.toX = Math.max(GRID.x0 + 30, p.target.x - p.target.speed*88*0.6 - 8);
        }
      }
      else if (p.state === 'jump'){
        p.jumpT -= dt;
        const k = 1 - Math.max(0, p.jumpT) / 0.85;
        p.jx = p.x + (p.toX - p.x) * k;
        p.jumpH = Math.sin(k * Math.PI) * 76;
        if (p.jumpT <= 0){
          p.jx = p.toX; p.jumpH = 0;
          addEffect('slash', p.jx, p.y, 0.3);
          explodeDamage(p.row, p.jx, 85, 1800, true);
          AU.boom();
          killPlant(p);
        }
      }
    }
  }
}
function spawnBullet(p, d){
  G.bullets.push({ row:p.row, x:p.x + 30, y:p.y - 36, dmg:d.dmg, slow:!!d.slow, fire:false });
}
/* 磁脉冲掠取：返回是否生效 */
function stripGear(e){
  const t = (e.type.indexOf('de_') === 0) ? DE_MAP[e.type] : e.type;
  if (t === 'crate' || t === 'plate'){
    if (e.hp > 270 * G.diff.hp){ e.hp = 270 * G.diff.hp; return true; }
    return false;
  }
  if (t === 'door' && e.shield > 0){ e.shield = 0; return true; }
  if (t === 'ladder' && !e.ladderDone && !e.lostLadder){ e.lostLadder = true; return true; }
  if (t === 'pogo' && e.stilts){ e.stilts = false; return true; }
  if (t === 'digger'){
    if (e.digging){ e.digging = false; e.reverse = true; e.speed = EN[e.type].speed * 0.44; return true; }
    return false;
  }
  return false;
}
/* 曲射炮弹 */
function updateShells(dt){
  for (const s of G.shells){
    s.t += dt;
    if (s.t >= s.dur){
      s.done = true;
      const hitY = rowY(s.row) + GRID.ch/2;
      if (s.atkPlant){
        /* 黄蜂自行火炮的炮弹：砸我方工事 */
        addEffect('shellpop', s.tx, hitY, 0.6);
        AU.boom2();
        for (const pl of G.plants){
          if (pl.remove || pl.row !== s.row) continue;
          if (Math.abs(pl.x - s.tx) < 60){
            pl.hp -= s.dmg;
            if (pl.hp <= 0) killPlant(pl);
          }
        }
        continue;
      }
      addEffect(s.slow ? 'firepop' : 'shellpop', s.tx, hitY, 0.55);
      AU.boom2();
      const sRad = s.splash || 55;
      for (const e of G.enemies){
        if (e.dead || e.remove || e.row !== s.row) continue;
        const dx = Math.abs(e.x - s.tx);
        if (dx < sRad){
          damageEnemy(e, s.dmg * (s.atv && e.vehicle ? s.atv : 1), true);
          if (s.slow && !e.dead) e.slowT = 3;
        }
        else if (dx < sRad + 75){
          damageEnemy(e, s.dmg * 0.5 * (s.atv && e.vehicle ? s.atv : 1), true);
          if (s.slow && !e.dead) e.slowT = 3;
        }
      }
    }
  }
  G.shells = G.shells.filter(s => !s.done);
}
function frontEnemyInRow(row, px){
  let best = null;
  for (const e of G.enemies){
    if (e.dead || e.row !== row || e.submerged || e.vaulting > 0 || e.digging) continue;
    if (e.x > px + 4 && e.x < 1090 && (!best || e.x < best.x)) best = e;
  }
  return best;
}
function swallow(victim, p){
  victim.remove = true;
  if (victim.eating) victim.eating = null;
  addEffect('slash', victim.x, victim.y, 0.32);
  AU.woodbreak();
  G.kills++;
}
function explode(x, y, row, rowSpread, dmg, radius){
  addEffect('boom', x, y, 0.7);
  AU.boom();
  explodeDamage(row, x, radius, dmg, true);
  if (rowSpread > 0){
    for (const dr of [-rowSpread, rowSpread]){
      explodeDamage(row + dr, x, radius, dmg, true);
    }
  }
}
function explodeDamage(row, x, radius, dmg, pierceShield){
  if (row < 0 || row >= G.rows) return;
  for (const e of G.enemies){
    if (e.dead || e.remove || e.row !== row) continue;
    if (Math.abs(e.x - x) <= radius){
      damageEnemy(e, dmg, pierceShield);
    }
  }
}
function damageEnemy(e, dmg, pierceShield){
  if (e.dead) return;
  if (e.digging && !pierceShield) return;   // 地下免疫直射
  dmg = dmg * G.dmgMul;
  if (e.shield > 0 && !pierceShield){
    e.shield -= dmg;
    if (e.shield <= 0){
      addEffect('woodbreak', e.x - 28, e.y - 40, 0.5);
      AU.woodbreak();
    }
  } else {
    if (e.shield > 0 && pierceShield) e.shield = 0;
    e.hp -= dmg;
  }
  e.hitFlash = 0.1;
  if (SET.fx && !pierceShield && Math.random() < 0.5) addEffect('spark', e.x, e.y - 28, 0.28);
  const tRage = (e.type.indexOf('de_') === 0) ? DE_MAP[e.type] : e.type;
  if (tRage === 'officer' && !e.rage && e.hp < 270 * G.diff.hp && e.hp > 0){
    e.rage = true; e.speed = EN[e.type].rageSpeed * G.diff.spd;
    addEffect('woodbreak', e.x, e.y - 50, 0.5);
  }
  if (e.hp <= 0 && !e.dead){
    killEnemy(e);
  }
}
function killEnemy(e){
  if (e.dead) return;
  e.dead = true; e.deathT = 1.0; e.eating = null; e.submerged = false;
  e.digging = false;
  G.kills++;
  G.salvage += EN[e.type].salv != null ? EN[e.type].salv : (EN[e.type].vehicle ? 20 : 5);
}

/* ---------- 敌军更新 ---------- */
function enemySpeedMul(e){
  let m = 1;
  if (e.slowT > 0) m *= 0.5;
  if (G.level.night && G.up && G.up.lamp) m *= (1 - 0.12 * G.up.lamp);
  if (G.level.speedMul) m *= G.level.speedMul;
  if (G.env.mudRows && G.env.mudRows.indexOf(e.row) >= 0) m *= 0.7;
  if (e.digging) m *= 1.0;
  return m;
}
function updateEnemies(dt){
  for (const e of G.enemies){
    if (e.remove) continue;
    if (e.dead){
      e.deathT -= dt;
      if (e.deathT <= 0) e.remove = true;
      continue;
    }
    if (e.hitFlash > 0) e.hitFlash -= dt;
    if (e.slowT > 0) e.slowT -= dt;

    /* ---- 掘进工兵：钻地 ---- */
    if (e.digging){
      e.x -= e.speed * GRID.cw * enemySpeedMul(e) * dt;
      if (e.x <= colX(1) + 50){
        e.digging = false;
        e.reverse = true;
        e.speed = EN[e.type].speed * 0.44;
        addEffect('crush', e.x, e.y, 0.6);
        AU.woodbreak();
      }
      continue;
    }
    /* ---- 黄蜂自行火炮：驻停右缘曲射 ---- */
    if (e.type === 'de_wespe'){
      e.atkT = (e.atkT == null ? 3 : e.atkT) - dt;
      if (e.x > 930){
        e.x -= e.speed * GRID.cw * enemySpeedMul(e) * dt;
      } else {
        if (e.atkT <= 0){
          e.atkT = 4;
          e.hitFlash = 0.18;   // 炮口焰（drawWespe 据此绘制）
          const targets = G.plants.filter(pl => !pl.remove && pl.row === e.row);
          if (targets.length){
            const tgt = targets[Math.floor(Math.random()*targets.length)];
            G.shells.push({ row:e.row, x0:e.x - 34, y0:e.y - 52, tx:Math.max(GRID.x0 + 20, Math.min(960, tgt.x)), t:0, dur:1.1, dmg:300, atkPlant:true });
            AU.mortar();
          }
        }
      }
      continue;   // 驻停后不参与常规移动/啃食（hitFlash由循环顶部统一扣减）
    }
    /* ---- 装甲推土车：碾压 ---- */
    if (e.vehicle){
      const frontX = e.x - 30;
      const col = Math.floor((frontX - GRID.x0) / GRID.cw);
      if (col >= 0 && col < GRID.cols){
        const cell = G.grid[e.row][col];
        const plant = cell.plant || cell.plat;
        if (plant && frontX <= plant.x + 24){
          if (plant.type === 'spike'){
            e.hp = 0; damageEnemy(e, 1, true);
            addEffect('boom', e.x, e.y - 30, 0.7);
          } else {
            addEffect('crush', plant.x, plant.y - 20, 0.6);
            killPlant(plant);
            AU.woodbreak();
          }
        }
      }
      e.x -= e.speed * GRID.cw * enemySpeedMul(e) * dt;
      if (e.hp <= 0) killEnemy(e);
      if (e.x < GRID.x0 - 6) triggerSweeper(e);
      continue;
    }

    /* ---- 高跷兵：蹦越 ---- */
    if (e.vaulting > 0){
      e.vaulting -= dt;
      const dur = e.type === 'pogo' ? 0.55 : 0.9;
      const k = 1 - Math.max(0, e.vaulting) / dur;
      e.x = e.vaultFrom + (e.vaultTo - e.vaultFrom) * k;
      if (e.vaulting <= 0){
        if (e.type === 'boat' || e.type === 'de_boat'){
          e.vaulted = true;
          e.speed = EN[e.type].afterSpeed;
          e.submerged = false;   // 弃舟步战：此后可被直射
          addEffect('woodbreak', e.x, e.y, 0.5);
        }
      }
      continue;
    }

    /* ---- 掘进工兵：反向拆家（向右） ---- */
    if (e.reverse){
      const frontX = e.x + 26;
      const col = Math.floor((frontX - GRID.x0) / GRID.cw);
      let eating = null;
      if (col >= 0 && col < GRID.cols){
        const plant = G.grid[e.row][col].plant;
        if (plant && plant.type !== 'spike' && frontX >= plant.x - 30 && frontX <= plant.x + 40) eating = plant;
      }
      if (eating){
        eating.hp -= 100 * dt;
        e.eating = eating;
        if (DEF[eating.type].kind === 'thornwall'){ damageEnemy(e, (DEF[eating.type].dps || 0) * dt, true); }   // 巴甫洛夫楼返伤
        if (eating.hp <= 0) killPlant(eating);
      } else {
        e.eating = null;
        e.x += e.speed * GRID.cw * enemySpeedMul(e) * dt;
        if (e.x > 1010){ e.remove = true; continue; } // 爬回去了
      }
      continue;
    }

    e.eating = null;
    const frontX = e.x - 26;
    const col = Math.floor((frontX - GRID.x0) / GRID.cw);
    let blocked = false;
    if (col >= 0 && col < GRID.cols){
      const cell = G.grid[e.row][col];
      const plant = cell.plant;
      if ((e.type === 'boat' || e.type === 'de_boat') && !e.vaulted && plant && frontX <= plant.x + 34 && frontX >= plant.x - 60){
        e.vaulting = 0.9;
        e.vaultFrom = e.x;
        e.vaultTo = Math.max(GRID.x0 + 20, plant.x - GRID.cw*0.8);
        AU.woodbreak();
        continue;
      }
      if (cell.ladder && plant){
        // 踩梯翻越，不吃
      }
      else if (plant && plant.type === 'spike'){
        // 地刺：直接踩过去（掉血在 plant 更新里）
      }
      else if (plant && frontX <= plant.x + 30 && frontX >= plant.x - 50){
        if (e.type === 'pogo' && e.stilts && !DEF[plant.type].antiLadder){
          // 蹦过这一格
          e.vaulting = 0.55;
          e.vaultFrom = e.x;
          e.vaultTo = Math.max(GRID.x0 + 24, plant.x - GRID.cw*0.75);
          AU.woodbreak();
          continue;
        }
        if (e.type === 'pogo' && e.stilts && DEF[plant.type].antiLadder){
          // 高跷折断
          e.stilts = false;
          e.speed = 0.22;
          addEffect('woodbreak', e.x, e.y - 40, 0.5);
          AU.woodbreak();
        }
        if (e.type === 'ladder' && !e.ladderDone && !e.lostLadder && !DEF[plant.type].antiLadder && !cell.ladder){
          cell.ladder = true;
          e.ladderDone = true;
          AU.woodbreak();
        } else {
          e.eating = plant;
          blocked = true;
        }
      }
    }

    if (blocked){
      if (e.eating){
        e.eating.hp -= 100 * dt;
        if (!e.dead && DEF[e.eating.type].kind === 'thornwall'){ damageEnemy(e, (DEF[e.eating.type].dps || 0) * dt, true); }  // 巴甫洛夫楼返伤（返伤致死时先终止本帧啃食结算）
        if (e.eating && e.eating.hp <= 0 && !e.dead){
          killPlant(e.eating);
          e.eating = null;
        }
      }
    } else {
      const sp = e.speed * GRID.cw * enemySpeedMul(e);
      e.x -= sp * dt;
    }

    // 泅渡兵：贴岸或进食才现身；冲锋舟弃舟后不再下潜
    if (EN[e.type].water && !e.vaulted){
      e.submerged = !e.eating && e.x > GRID.x0 + 26;
    }

    // 突入左端
    if (e.x < GRID.x0 - 6){
      triggerSweeper(e);
    }
  }
}
function triggerSweeper(e){
  const sw = G.sweepers.find(s => s.row === e.row && !s.gone);
  if (sw && sw.state === 'idle'){
    sw.state = 'go';
    AU.charge();
    showBanner((isWater(e.row) ? G.level.sweeperWater || '河防哨艇' : G.level.sweeper) + '出动！', 'small', 1400);
  } else if (!sw){
    if (e.x < GRID.x0 - 46) doLose();
  }
}

/* ---------- 子弹 ---------- */
function updateBullets(dt){
  for (const b of G.bullets){
    if (b.back){
      b.x -= 560 * dt;
      if (b.x < GRID.x0 - 60){ b.remove = true; continue; }
    } else {
      b.x += 560 * dt;
      if (b.x > 1020){ b.remove = true; continue; }
    }
    if (!b.fire && !b.back){
      for (const p of G.plants){
        if (p.type === 'atgun' && p.row === b.row && !p.remove && Math.abs(b.x - p.x) < 40){
          b.fire = true; b.dmg *= 2;
          break;
        }
      }
    }
    let hit = null;
    for (const e of G.enemies){
      if (e.dead || e.remove || e.row !== b.row || e.submerged || e.vaulting > 0 || e.digging) continue;
      if (b.x > e.x - 34 && b.x < e.x + 28){
        if (!hit || e.x < hit.x) hit = e;
      }
    }
    if (hit){
      /* V1.8.1：G.dmgMul 统一在 damageEnemy 内结算，此处不再重复乘（原本直射/曲射吃了两次） */
      const atvDmg = b.dmg * (b.atv && hit.vehicle ? b.atv : 1);
      damageEnemy(hit, atvDmg, false);
      if (b.slow && !b.fire) hit.slowT = 8;
      if (b.fire) hit.slowT = 0;
      if (b.atv && hit.vehicle) addEffect('woodbreak', b.x + 6, b.y - 10, 0.35);   // 装甲被击穿
      AU.hit();
      addEffect('muzzle', b.x + 6, b.y, 0.12);
      b.remove = true;
    }
  }
  G.bullets = G.bullets.filter(b => !b.remove);
}

/* ---------- 反冲击 ---------- */
function updateSweepers(dt){
  for (const s of G.sweepers){
    if (s.gone) continue;
    if (s.state === 'go'){
      s.x += 640 * dt;
      for (const e of G.enemies){
        if (!e.dead && !e.remove && e.row === s.row && Math.abs(e.x - s.x) < 56){
          killEnemy(e);
        }
      }
      if (s.x > 1020){ s.gone = true; }
    }
  }
}

/* ---------- 补给 ---------- */
function updateDrops(dt){
  for (const d of G.drops){
    if (!d.landed){
      if (d.gravity){
        d.vy += d.gravity * dt;
      }
      d.y += d.vy * dt;
      d.x += (d.vx || 0) * dt;
      if (d.vy > 0 && d.y >= d.landY){
        d.y = d.landY; d.landed = true;
      }
      if (d.y > cv.height + 40){ d.remove = true; }
    } else {
      d.life -= dt;
      if (d.life <= 0) d.remove = true;
    }
  }
  G.drops = G.drops.filter(d => !d.remove);
}
function collectDrop(d){
  G.sun += d.val;
  d.remove = true;
  addEffect('plus25', d.x, d.y - 10, 0.8);
  AU.collect();
  $('sun-count').textContent = G.sun;
}

/* ================================================================
   渲染
   ================================================================ */
let lastFrame = 0, hudTimer = 0;
function loop(now){
  /* 帧率上限（弱机优化）：30帧档 */
  if (SET.fpsCap === 30 && lastFrame && now - lastFrame < 30){
    requestAnimationFrame(loop);
    return;
  }
  const t = now / 1000;
  const dt = Math.min(0.05, (now - lastFrame) / 1000 || 0.016);
  lastFrame = now;
  if (G.state === 'play'){
    update(dt);
    hudTimer += dt;
    if (hudTimer > 0.12){ hudTimer = 0; syncHUD(); }
  }
  if (!$('scr-battle').classList.contains('hidden')){
    render(G.simT);
  }
  requestAnimationFrame(loop);
}

function render(t){
  const ctx = CTX;
  drawTerrain(ctx, G.level, G.env, t, G.H);

  // 悬停提示
  if (G.state === 'play' && G.hover){
    const { r, c } = G.hover;
    const ok = (G.sel && canPlace(G.sel, r, c)) || G.shovel;
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = ok ? '#7fa05a' : '#a63a2b';
    ctx.fillRect(colX(c), rowY(r), GRID.cw, GRID.ch);
    ctx.globalAlpha = 1;
    if (G.sel && ok){
      ctx.globalAlpha = 0.5;
      drawDef(ctx, { type:G.sel, x:colX(c)+GRID.cw/2, y:rowY(r)+GRID.ch-10, t:0, flash:0,
        hp:1, maxHp:1, armT:0, fuse:1, chewT:0, state:'idle', jx:null, jumpH:0, phase:0 }, t);
      ctx.globalAlpha = 1;
    }
  }

  // 反冲击小队
  for (const s of G.sweepers){
    if (!s.gone) drawSweeper(ctx, s, t, isWater(s.row));
  }

  // 逐行绘制（行序=前后关系）
  for (let r=0; r<G.rows; r++){
    for (const p of G.plants){
      if (p.row !== r || p.remove) continue;
      if (p.type === 'pontoon') drawDef(ctx, p, t);
    }
    for (const p of G.plants){
      if (p.row !== r || p.remove || p.type === 'pontoon') continue;
      let px = p.x, py = p.y;
      if (p.type === 'squad' && p.state === 'jump' && p.jx != null){ px = p.jx; py = p.y - (p.jumpH || 0); }
      drawDef(ctx, Object.assign({}, p, { x:px, y:py }), t);
    }
    for (let c=0; c<GRID.cols; c++){
      if (G.grid[r][c].ladder) drawLadderAt(ctx, colX(c) + GRID.cw/2, rowY(r) + GRID.ch - 8);
    }
    const rowEn = G.enemies.filter(e => e.row === r && !e.remove);
    rowEn.sort((a,b) => b.x - a.x);
    for (const e of rowEn) drawEn(ctx, e, t);
    if (isWater(r)) drawWaterBand(ctx, r, t);
  }

  for (const b of G.bullets) drawBullet(ctx, b);
  for (const s of G.shells) drawShell(ctx, s, t);
  for (const fx of G.effects) drawEffect(ctx, fx, t);
  if (G.level.night) drawNight(ctx, G.level, G.env, t, G.H);
  for (const d of G.drops) drawDrop(ctx, d, t, G.level.terrain);
}

function syncHUD(){
  G.slotEls.forEach(({ el, type, cd }) => {
    const d = DEF[type];
    const remain = G.cd[type] || 0;
    cd.style.height = (remain > 0 ? (remain / d.cd * 100) : 0) + '%';
    el.classList.toggle('poor', G.sun < d.cost);
    el.classList.toggle('sel', G.sel === type);
  });
  $('btn-shovel').classList.toggle('sel', G.shovel);
  $('sun-count').textContent = G.sun;
}

/* ================================================================
   输入
   ================================================================ */
function canvasPos(ev){
  const rect = cv.getBoundingClientRect();
  return { x:(ev.clientX - rect.left) * (cv.width / rect.width), y:(ev.clientY - rect.top) * (cv.height / rect.height) };
}
cv.addEventListener('mousemove', ev => {
  const p = canvasPos(ev);
  const c = Math.floor((p.x - GRID.x0) / GRID.cw);
  const r = Math.floor((p.y - GRID.y0) / GRID.ch);
  G.hover = (c >= 0 && c < GRID.cols && r >= 0 && r < G.rows) ? { r, c } : null;
});
cv.addEventListener('mouseleave', () => { G.hover = null; });
cv.addEventListener('click', ev => {
  AU.init();
  if (G.state !== 'play') return;
  const p = canvasPos(ev);
  // 1. 收补给
  for (let i = G.drops.length - 1; i >= 0; i--){
    const d = G.drops[i];
    if (Math.hypot(d.x - p.x, d.y - p.y) < 46){ collectDrop(d); return; }
  }
  const c = Math.floor((p.x - GRID.x0) / GRID.cw);
  const r = Math.floor((p.y - GRID.y0) / GRID.ch);
  if (c < 0 || c >= GRID.cols || r < 0 || r >= G.rows) return;
  // 2. 工兵铲
  if (G.shovel){
    const cell = G.grid[r][c];
    if (cell.plant || cell.plat || cell.ladder) removeAt(r, c);
    G.shovel = false;
    $('btn-shovel').classList.remove('sel');
    return;
  }
  // 3. 部署
  if (G.sel){
    if (canPlace(G.sel, r, c)) place(G.sel, r, c);
    else flashBanner(isWater(r) && !G.grid[r][c].plat ? '水道上先铺「门桥浮台」' : '此处无法部署', 'small', 1100);
  }
});
cv.addEventListener('contextmenu', ev => {
  ev.preventDefault();
  G.sel = null; G.shovel = false;
});
document.addEventListener('keydown', ev => {
  if (ev.key === 'Escape'){
    if (G.sel || G.shovel){ G.sel = null; G.shovel = false; }
    else if (G.state === 'play') pauseGame();
    else if (G.state === 'pause') resumeGame();
  }
  if (G.state === 'play' && /^[0-9]$/.test(ev.key)){
    const idx = ev.key === '0' ? 9 : (parseInt(ev.key, 10) - 1);
    if (G.slotList[idx]) selectType(G.slotList[idx]);
  }
});
$('btn-shovel').addEventListener('click', () => {
  AU.init();
  G.shovel = !G.shovel;
  G.sel = null;
  $('btn-shovel').classList.toggle('sel', G.shovel);
});
$('btn-pause').addEventListener('click', () => { if (G.state === 'play') pauseGame(); });
document.addEventListener('click', () => AU.init(), { once: true });

/* ---------- 暂停 ---------- */
function pauseGame(){
  if (G.state !== 'play') return;
  G.state = 'pause';
  showOverlay('ov-pause');
}
function resumeGame(){
  G.state = 'play';
  $('ov-pause').classList.add('hidden');
}
function showOverlay(id){
  $('ov-pause').classList.add('hidden');
  $('scr-result').classList.add('hidden');
  const el = $(id);
  if (id === 'ov-pause') el.classList.remove('hidden');
  if (id === 'scr-result'){ $('scr-battle').classList.remove('hidden'); el.classList.remove('hidden'); }
}
$('btn-resume').addEventListener('click', resumeGame);
$('btn-restart').addEventListener('click', () => { startLevel(G.lvIdx); });
$('btn-quit').addEventListener('click', () => { G.state = 'menu'; buildClock(); showScreen('scr-clock'); });
$('btn-pause-manual').addEventListener('click', () => { openAlmanac('pause'); });

/* ================================================================
   胜负结算
   ================================================================ */
function doWin(){
  if (G.state !== 'play') return;
  G.state = 'win';
  AU.horn();
  const first = !SAVE.done[G.lvIdx];
  SAVE.done[G.lvIdx] = true;
  SAVE.furthest = Math.max(SAVE.furthest, G.lvIdx + 1);
  const hardWon = (G.diff.id === 'hard') && !SAVE.hard[G.lvIdx];
  if (G.diff.id === 'hard') SAVE.hard[G.lvIdx] = true;
  const lootMul = 1 + 0.2 * (G.up.loot || 0);
  const gain = Math.round((G.salvage + 300 + (first ? 500 : 0)) * G.diff.salv * lootMul);
  SAVE.salvage += gain;
  SAVE.totKills += G.kills;
  save();
  const lv = G.level;
  const body = $('result-body');
  const hasNext = G.lvIdx + 1 < LEVELS.length;
  body.innerHTML =
    '<div class="r-seal">捷</div>' +
    '<h3>' + lv.date + ' · ' + lv.title + '</h3>' +
    '<p>' + lv.win + '</p>' +
    '<div class="r-stats">歼敌 ' + G.kills + ' · 剩余补给 ' + Math.floor(G.sun) + ' · 难度「' + G.diff.name + '」</div>' +
    '<div class="r-stats salvage">缴获 +' + gain + '（军需处可换装）</div>' +
    (hardWon ? '<div class="r-stats medal">★ 「精锐」首克——授予纪念章！（勋章 ' + medalCount() + '）</div>' : '') +
    '<div class="row-end">' +
      (hasNext ? '<button id="btn-next" class="btn big">下一战</button>' : '') +
      '<button id="btn-res-clock" class="btn">战争时钟</button>' +
    '</div>';
  $('scr-result').classList.remove('hidden');
  if (hasNext) $('btn-next').addEventListener('click', () => { showBrief(G.lvIdx + 1); });
  $('btn-res-clock').addEventListener('click', () => { buildClock(); showScreen('scr-clock'); G.state='menu'; });
}
function doLose(){
  if (G.state !== 'play') return;
  G.state = 'lose';
  AU.lose();
  const lootMul2 = 1 + 0.2 * (G.up.loot || 0);
  const gain = Math.round(G.salvage * G.diff.salv * lootMul2);
  SAVE.salvage += gain;
  SAVE.totKills += G.kills;
  save();
  const body = $('result-body');
  body.innerHTML =
    '<div class="r-seal lose">守</div>' +
    '<h3>阵地失守</h3>' +
    '<p>敌军突入了防线左端——收拢残部，重整旗鼓，再战一回。</p>' +
    '<div class="r-stats">歼敌 ' + G.kills + ' · 已顶住 ' + Math.floor(G.elapsed) + ' 秒</div>' +
    '<div class="r-stats salvage">缴获 +' + gain + '（败仗也算战果）</div>' +
    '<div class="row-end">' +
      '<button id="btn-retry" class="btn big">重整旗鼓</button>' +
      '<button id="btn-lose-clock" class="btn">战争时钟</button>' +
    '</div>';
  $('scr-result').classList.remove('hidden');
  $('btn-retry').addEventListener('click', () => { startLevel(G.lvIdx); });
  $('btn-lose-clock').addEventListener('click', () => { buildClock(); showScreen('scr-clock'); G.state='menu'; });
}

/* ================================================================
   战争时钟（选关）
   ================================================================ */
function buildClock(){
  const wrap = $('clock-cards');
  wrap.innerHTML = '';
  const head = document.createElement('div');
  head.className = 'clock-head';
  head.innerHTML =
    '<div class="salv-balance">缴获物资 <b>' + SAVE.salvage + '</b> · 累计歼敌 ' + SAVE.totKills + '</div>' +
    '<button id="btn-clock-shop" class="btn small">军需处</button>';
  wrap.appendChild(head);
  LEVELS.forEach((lv, i) => {
    const unlocked = i <= SAVE.furthest || SET.allUnlock;
    const div = document.createElement('div');
    div.className = 'mission' + (unlocked ? '' : ' locked') + (SAVE.done[i] ? ' done' : '');
    const dName = DIFFS.find(x => x.id === (SAVE.diff[i] || 'norm')).name;
    const state = SAVE.done[i]
      ? '<span class="st-seal">捷</span>' + (SAVE.hard[i] ? '<span class="hard-seal">精</span>' : '')
      : (unlocked ? '待出征' : '未解锁');
    div.innerHTML =
      '<div class="m-date">' + lv.date + '</div>' +
      '<div class="m-title">' + lv.title + '</div>' +
      '<div class="m-sub">' + lv.sub + '</div>' +
      '<div class="m-state">' + state + (unlocked && !SAVE.done[i] ? '<span class="diff-tag">' + dName + '</span>' : '') + '</div>';
    if (unlocked){
      div.addEventListener('click', () => { AU.init(); showBrief(i); });
    }
    wrap.appendChild(div);
  });
  /* —— 后续关卡预告卡（不占 LEVELS 序号，不可点） —— */
  if (LEVELS.length >= 45){
    const tea = document.createElement('div');
    tea.className = 'mission teaser';
    tea.innerHTML =
      '<div class="m-date">DLC · 时间线插槽</div>' +
      '<div class="m-title">后续战役 · 敬请期待</div>' +
      '<div class="m-sub">敦刻尔克 1940.5 · 比尔哈凯姆 · 常德 1943.11 · 科希马 · 衡阳 · 阿纳姆 · 南洋孤军…… 新战线正在勘察</div>' +
      '<div class="m-state"><span class="diff-tag">V1.8.2 敬请期待</span></div>';
    wrap.appendChild(tea);
  }
  $('btn-clock-shop').addEventListener('click', () => openShop('clock'));
  $('btn-clock-back').onclick = () => { showTitle(); };
}

/* ---------- 标题屏（战功行） ---------- */
function showTitle(){
  const h = $('title-honors');
  if (h){
    h.innerHTML = '战功 · 歼敌 <b>' + SAVE.totKills + '</b> · 缴获 <b>' + SAVE.salvage + '</b> · 已克 <b>' + SAVE.done.filter(Boolean).length + '</b>/' + LEVELS.length + ' 战 · 勋章 <b>' + medalCount() + '</b> 枚';
  }
  showScreen('scr-title');
}

/* ================================================================
   军需处（缴获经济）
   ================================================================ */
let shopBack = 'title';
function openShop(from){
  shopBack = from || 'title';
  const body = $('shop-body');
  const items = UPGRADES.map(u => {
    const lvl = SAVE.up[u.id];
    const cost = Math.round(u.base * Math.pow(u.mul, lvl));
    const maxed = lvl >= u.max;
    const dots = '●'.repeat(lvl) + '○'.repeat(u.max - lvl);
    const effNow = u.eff || '';
    return (
      '<div class="shop-item' + (maxed ? ' maxed' : '') + '">' +
        '<div class="si-name">' + u.name + ' <span class="si-dots">' + dots + '</span></div>' +
        '<div class="si-desc">' + u.desc + '（' + effNow + '）</div>' +
        '<div class="si-cost">' + (maxed ? '已满编' : ('需缴获 ' + cost)) + '</div>' +
        (maxed ? '' : '<button class="btn small buy" data-id="' + u.id + '" data-cost="' + cost + '"' +
          (SAVE.salvage < cost ? ' disabled' : '') + '>换装</button>') +
      '</div>');
  }).join('');
  body.innerHTML =
    '<h2>军 需 处</h2>' +
    '<div class="salv-balance big">缴获物资 <b>' + SAVE.salvage + '</b><span class="s-hint">（每歼敌 +5 · 装甲 +20 · 胜仗 +300 · 首克 +500 · 八类军备永久生效）</span></div>' +
    '<div class="shop-grid">' + items + '</div>' +
    '<div class="row-end"><button id="btn-shop-back" class="btn">返回</button></div>';
  body.querySelectorAll('button.buy').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const cost = parseInt(btn.getAttribute('data-cost'), 10);
      const u = UPGRADES.find(x => x.id === id);
      if (SAVE.salvage >= cost && SAVE.up[id] < u.max){
        SAVE.salvage -= cost;
        SAVE.up[id]++;
        save();
        AU.collect();
        openShop(shopBack);
      }
    });
  });
  $('btn-shop-back').addEventListener('click', () => {
    if (shopBack === 'clock'){ buildClock(); showScreen('scr-clock'); }
    else showTitle();
  });
  showScreen('scr-shop');
}

/* ================================================================
   战报（简报）
   ================================================================ */
let briefIdx = 0;
let selDiff = 'norm';
function showBrief(i){
  briefIdx = i;
  selDiff = SAVE.diff[i] || 'norm';
  const lv = LEVELS[i];
  const body = $('brief-body');
  const newDefs = (lv.newDef || []).map(id =>
    '<div class="u-chip"><img src="' + makeIcon(id, false) + '"><span>' + DEF[id].name + '<br><span class="tag">新列装</span></span></div>').join('');
  const newEns = (lv.newEn || []).map(id =>
    '<div class="u-chip"><img src="' + makeIcon(id, true) + '"><span>' + EN[id].name + '<br><span class="tag">敌情</span></span></div>').join('');
  body.innerHTML =
    '<div class="b-head"><div class="b-no">第 ' + (i+1) + ' 号战报</div><div class="b-date">' + lv.date + '</div></div>' +
    '<h3>' + lv.title + '</h3>' +
    '<div class="b-sub">' + lv.sub + '</div>' +
    '<p class="b-text">' + lv.brief + '</p>' +
    (newDefs ? '<div class="b-units">' + newDefs + '</div>' : '') +
    (newEns ? '<div class="b-units">' + newEns + '</div>' : '') +
    '<div class="b-goal"><b>任务：</b>' + lv.goal + '</div>' +
    '<div class="b-tip">▲ ' + lv.tip + '</div>' +
    '<div class="diff-row">' + DIFFS.map(d =>
      '<button class="diff-chip' + (d.id === selDiff ? ' on' : '') + '" data-diff="' + d.id + '">' +
        '<b>' + d.name + '</b><span>' + d.tag + '</span>' +
      '</button>').join('') + '</div>' +
    '<div class="row-end">' +
      '<button id="btn-go" class="btn big">出　征</button>' +
      '<button id="btn-brief-back" class="btn">返回</button>' +
    '</div>';
  showScreen('scr-brief');
  G.state = 'menu';
  body.querySelectorAll('.diff-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      selDiff = chip.getAttribute('data-diff');
      body.querySelectorAll('.diff-chip').forEach(c => c.classList.toggle('on', c === chip));
    });
  });
  $('btn-go').addEventListener('click', () => {
    SAVE.diff[i] = selDiff;
    save();
    startLevel(i);
  });
  $('btn-brief-back').addEventListener('click', () => { buildClock(); showScreen('scr-clock'); });
}

/* ================================================================
   前线手册
   ================================================================ */
let almanacTab = 'def';
function openAlmanac(from){
  G.fromAlmanac = from || 'title';
  almanacTab = 'def';
  $('tab-def').classList.add('on');
  $('tab-en').classList.remove('on');
  buildAlmanac();
  showScreen('scr-almanac');
}
$('tab-def').addEventListener('click', () => {
  almanacTab = 'def'; $('tab-def').classList.add('on'); $('tab-en').classList.remove('on'); buildAlmanac();
});
$('tab-en').addEventListener('click', () => {
  almanacTab = 'en'; $('tab-en').classList.add('on'); $('tab-def').classList.remove('on'); buildAlmanac();
});
$('btn-almanac-back').addEventListener('click', () => {
  if (G.fromAlmanac === 'pause'){
    /* 战斗中看手册：先恢复战斗屏，再压上暂停层——否则渲染循环见 scr-battle 隐藏，画面冻结 */
    showScreen('scr-battle');
    showOverlay('ov-pause');
  }
  else showScreen('scr-title');
});
function buildAlmanac(){
  const grid = $('almanac-grid');
  const detail = $('almanac-detail');
  grid.innerHTML = '';
  detail.innerHTML = '<div style="font-size:12.5px;color:#6b5636;padding:8px">点选单位查看详情——每一件装备都注有它的史实身世。</div>';
  const list = almanacTab === 'def' ? DEF_ORDER : EN_ORDER;
  const known = almanacTab === 'def'
    ? DEF_ORDER.filter(id => DEF[id].unlock <= Math.max(1, SAVE.furthest + 1))
    : EN_ORDER.filter(id => {
        const lvl = LEVELS[Math.min(LEVELS.length-1, Math.max(0, SAVE.furthest))];
        return (lvl && (lvl.newEn || []).indexOf(id) >= 0) || levelSeen(id);
      });
  const showList = list.filter(id => (almanacTab === 'def' ? known.indexOf(id) >= 0 : known.indexOf(id) >= 0));
  const finalList = showList.length ? showList : list.slice(0, 3);
  finalList.forEach(id => {
    const isEn = almanacTab === 'en';
    const card = document.createElement('div');
    card.className = 'a-card';
    card.innerHTML = '<img src="' + makeIcon(id, isEn) + '"><div class="a-name">' + (isEn ? EN[id].name : DEF[id].name) + '</div>';
    card.addEventListener('click', () => {
      grid.querySelectorAll('.a-card').forEach(el => el.classList.remove('on'));
      card.classList.add('on');
      detail.innerHTML =
        '<h4>' + (isEn ? EN[id].name : DEF[id].name) + '</h4>' +
        '<div class="stats">' + (isEn ? enStats(id) : defStats(id)) + '</div>' +
        '<div class="note">' + (isEn ? EN[id].note : DEF[id].note) + '</div>';
    });
    grid.appendChild(card);
  });
}
function levelSeen(enId){
  for (let i=0; i<LEVELS.length; i++){
    if (SAVE.done[i] || i <= SAVE.furthest){
      if ((LEVELS[i].newEn || []).indexOf(enId) >= 0) return true;
    }
  }
  return false;
}

/* ================================================================
   标题 / 帮助 / 军需处
   ================================================================ */
/* ================================================================
   存档管理（导出 / 导入 / 重置）
   ================================================================ */
function exportSaveCode(){
  return 'IRONSJ1.' + btoa(unescape(encodeURIComponent(JSON.stringify(SAVE))));
}
function importSaveCode(code){
  code = (code || '').trim();
  if (code.indexOf('IRONSJ1.') !== 0) throw new Error('存档码应以「IRONSJ1.」开头');
  const json = decodeURIComponent(escape(atob(code.slice(8))));
  const obj = JSON.parse(json);   // 解析失败会抛错
  if (!obj || typeof obj.furthest !== 'number' || !Array.isArray(obj.done)){
    throw new Error('存档内容无效（缺少进度字段）');
  }
  SAVE = Object.assign({
    furthest:0, done:[], hard:[], diff:[], helped:false,
    salvage:0, totKills:0, up:{ dmg:0, hp:0, sun:0, cd:0 },
  }, obj);
  migrateSaveNow();
  save();
  return true;
}
function openSaveScreen(){
  $('save-summary').innerHTML =
    '进度：<b>' + SAVE.done.filter(Boolean).length + '</b>/' + LEVELS.length + ' 战 · 最远：第 ' + Math.min(SAVE.furthest + 1, LEVELS.length) + ' 战<br>' +
    '勋章 <b>' + medalCount() + '</b> 枚 · 缴获 <b>' + SAVE.salvage + '</b> · 累计歼敌 <b>' + SAVE.totKills + '</b>';
  $('save-export').value = exportSaveCode();
  $('save-import').value = '';
  $('save-msg').textContent = '';
  $('save-msg').className = '';
  showScreen('scr-save');
}
function saveMsg(text, ok){
  const m = $('save-msg');
  m.textContent = text;
  m.className = ok ? 'ok' : 'err';
}
$('btn-save').addEventListener('click', () => openSaveScreen());
$('btn-save-back').addEventListener('click', () => showTitle());
$('btn-save-copy').addEventListener('click', () => {
  const ta = $('save-export');
  ta.select();
  let okc = false;
  try { okc = document.execCommand('copy'); } catch(e){}
  if (!okc && navigator.clipboard){
    navigator.clipboard.writeText(ta.value).then(
      () => saveMsg('已复制到剪贴板（若失败请手动全选复制）。', true),
      () => saveMsg('自动复制失败——请手动全选复制。', false));
    return;
  }
  saveMsg(okc ? '已复制到剪贴板。' : '请手动全选复制存档码。', okc);
});
$('btn-save-import').addEventListener('click', () => {
  try {
    importSaveCode($('save-import').value);
    saveMsg('导入成功！页面即将重载……', true);
    setTimeout(() => location.reload(), 900);
  } catch(err){
    saveMsg('导入失败：' + err.message, false);
  }
});
$('btn-save-reset').addEventListener('click', (ev) => {
  const b = ev.currentTarget;
  if (b.getAttribute('data-armed') !== '1'){
    b.setAttribute('data-armed', '1');
    b.textContent = '再点一次确认清空！';
    setTimeout(() => { b.setAttribute('data-armed', '0'); b.textContent = '清空存档'; }, 2600);
    return;
  }
  b.setAttribute('data-armed', '0');
  b.textContent = '清空存档';
  try { localStorage.removeItem(SAVE_KEY); } catch(e){}
  saveMsg('存档已清空！页面即将重载……', true);
  setTimeout(() => location.reload(), 900);
});

/* ================================================================
   设置（性能 / 显示）
   ================================================================ */
function syncSetButtons(){
  const groups = [['set-quality', String(SET.quality)], ['set-bars', String(SET.bars)], ['set-fps', String(SET.fpsCap)], ['set-fx', String(SET.fx ? 1 : 0)], ['set-unlock', String(SET.allUnlock ? 1 : 0)]];
  for (const [gid, val] of groups){
    const g = $(gid);
    if (!g) continue;
    g.querySelectorAll('button').forEach(b => {
      const on = b.getAttribute('data-v') === val;
      b.classList.toggle('on', on);
    });
  }
}
function openSetScreen(){
  syncSetButtons();
  /* 跳关下拉：从下一关到末关 + 末尾「全关」 */
  const sel = $('set-jump-level');
  if (sel){
    sel.innerHTML = '';
    for (let i = SAVE.furthest + 2; i <= LEVELS.length; i++){
      const o = document.createElement('option');
      o.value = i; o.textContent = '第 ' + i + ' 关 · ' + LEVELS[i-1].title;
      sel.appendChild(o);
    }
    if (!sel.options.length){
      const o = document.createElement('option');
      o.value = LEVELS.length; o.textContent = '（进度已到最后一关）';
      sel.appendChild(o);
    }
  }
  ['set-jump-msg','set-salvage-msg','set-reset-msg'].forEach(id => { const el = $(id); if (el){ el.textContent = ''; el.className = 'set-msg'; } });
  refreshUndoBtn();
  showScreen('scr-set');
}
$('btn-set').addEventListener('click', () => openSetScreen());
$('btn-set-back').addEventListener('click', () => showTitle());
[['set-quality','quality'],['set-bars','bars']].forEach(([gid, key]) => {
  $(gid).addEventListener('click', ev => {
    const b = ev.target.closest('button');
    if (!b) return;
    SET[key] = b.getAttribute('data-v');
    saveSet(); syncSetButtons();
    if (key === 'quality'){ G.terrainCache = null; }   // 立刻失效，返回战斗即重建
  });
});
$('set-fps').addEventListener('click', ev => {
  const b = ev.target.closest('button');
  if (!b) return;
  SET.fpsCap = parseInt(b.getAttribute('data-v'), 10) || 0;
  saveSet(); syncSetButtons();
});
$('set-fx').addEventListener('click', ev => {
  const b = ev.target.closest('button');
  if (!b) return;
  SET.fx = b.getAttribute('data-v') === '1';
  saveSet(); syncSetButtons();
});

/* 跳关开关 + 一键复原默认设置 */
$('set-unlock').addEventListener('click', ev => {
  const b = ev.target.closest('button');
  if (!b) return;
  SET.allUnlock = b.getAttribute('data-v') === '1';
  saveSet(); syncSetButtons();
});

/* 解锁到第N关（进度跳关，只向前解锁；已通关卡可无限重打） */
function jumpToLevel(n){
  const idx = Math.max(0, Math.min(LEVELS.length - 1, Math.round(n) - 1));
  if (idx <= SAVE.furthest){
    const m = $('set-jump-msg');
    m.textContent = '当前进度已到第 ' + (SAVE.furthest + 1) + ' 关，无需跳关。';
    m.className = 'set-msg';
    return;
  }
  SAVE.furthest = idx;
  while (SAVE.done.length < idx + 1) SAVE.done.push(false);
  save();
  const m2 = $('set-jump-msg');
  m2.textContent = '已解锁至第 ' + (idx + 1) + ' 关「' + LEVELS[idx].title + '」（之前关卡仍可随时重打；可用「撤销跳关」或「一键复原」回退）。';
  m2.className = 'set-msg ok';
  refreshUndoBtn();
}
$('btn-set-jump').addEventListener('click', () => {
  const sel = $('set-jump-level');
  jumpToLevel(parseInt(sel.value, 10) || 1);
});
$('set-jump-level').addEventListener('change', () => {
  const m = $('set-jump-msg');
  m.textContent = '';
});

/* 自选数量领取缴获物资（沙盒便利功能） */
$('btn-set-salvage').addEventListener('click', () => {
  const inp = $('set-salvage-input');
  let n = parseInt(inp.value, 10);
  const m = $('set-salvage-msg');
  if (!isFinite(n) || n < 0){ m.textContent = '请输入 0 — 99999 之间的整数。'; m.className = 'set-msg err'; return; }
  n = Math.min(99999, Math.max(0, n));
  SAVE.salvage += n;
  save();
  m.textContent = '已领取 ' + n + ' 缴获 · 当前余额 ' + SAVE.salvage + '（军需处可消费）。';
  m.className = 'set-msg ok';
  inp.value = 500;
});
/* 实际战果进度：通关过的最远关（不含跳关解锁量） */
function realProgress(){
  let r = 0;
  for (let i = 0; i < SAVE.done.length; i++) if (SAVE.done[i]) r = i + 1;
  return r;
}
function undoJump(){
  const real = realProgress();
  if (SAVE.furthest <= real) return false;
  SAVE.furthest = real;
  save();
  return true;
}
function refreshUndoBtn(){
  const ub = $('btn-set-undo');
  if (!ub) return;
  const real = realProgress();
  if (SAVE.furthest > real){
    ub.disabled = false;
    ub.textContent = '撤销跳关（第 ' + (SAVE.furthest + 1) + ' 关 → 第 ' + (real + 1) + ' 关）';
  } else {
    ub.disabled = true;
    ub.textContent = '无可撤销的跳关';
  }
}
$('btn-set-undo').addEventListener('click', () => {
  const m = $('set-jump-msg');
  if (undoJump()){
    m.textContent = '已撤销跳关：进度回到实际战果第 ' + (SAVE.furthest + 1) + ' 关（全关解锁开关若开着请一并关掉）。';
    m.className = 'set-msg ok';
    buildClock();
  } else {
    m.textContent = '当前没有靠跳关解锁的关卡。';
    m.className = 'set-msg';
  }
  refreshUndoBtn();
});
$('btn-set-reset').addEventListener('click', ev => {
  const b = ev.currentTarget;
  if (b.getAttribute('data-armed') !== '1'){
    b.setAttribute('data-armed', '1');
    b.textContent = '再点一次确认复原（5秒内）！';
    setTimeout(() => { if (b.getAttribute('data-armed') === '1'){ b.setAttribute('data-armed', '0'); b.textContent = '一键复原默认设置'; } }, 5000);
    return;
  }
  b.setAttribute('data-armed', '0');
  b.textContent = '一键复原默认设置';
  SET = JSON.parse(JSON.stringify(SET_DEFAULTS));
  clampSet();
  saveSet();
  G.terrainCache = null; G.terrainCacheKey = null;   // 画质档复原后重建
  syncSetButtons();
  /* 同步撤销跳关，令「复原」覆盖跳关造成的一切解锁 */
  const jumped = undoJump();
  const real = realProgress();
  SAVE.furthest = Math.min(SAVE.furthest, real);
  save();
  const m = $('set-reset-msg');
  m.textContent = '已恢复默认设置（高画质/血条常显/不限帧/特效开/按进度解锁）'
    + (jumped ? '，并撤销跳关：进度回到实际战果第 ' + (SAVE.furthest + 1) + ' 关。' : '。')
    + ' 存档数据（关卡战果/缴获/军备）不受影响。';
  m.className = 'set-msg ok';
  buildClock();
  refreshUndoBtn();
});

$('btn-save-restore').addEventListener('click', (ev) => {
  const b = ev.currentTarget;
  if (b.getAttribute('data-armed') !== '1'){
    b.setAttribute('data-armed', '1');
    b.textContent = '再点一次确认复原！';
    setTimeout(() => { b.setAttribute('data-armed', '0'); b.textContent = '从备份一键复原存档'; }, 2600);
    return;
  }
  b.setAttribute('data-armed', '0');
  b.textContent = '从备份一键复原存档';
  try {
    const bak = localStorage.getItem(SAVE_KEY + '_bak');
    if (!bak){ saveMsg('没有可用的备份（首次存档后才会有）。', false); return; }
    const obj = JSON.parse(bak);
    if (!obj || typeof obj.furthest !== 'number') throw new Error('备份内容无效');
    SAVE = Object.assign({ furthest:0, done:[], hard:[], diff:[], helped:false,
      salvage:0, totKills:0, up:{ dmg:0, hp:0, sun:0, cd:0 } }, obj);
    migrateSaveNow();
    save();
    saveMsg('已从备份复原存档！页面即将重载……', true);
    setTimeout(() => location.reload(), 900);
  } catch(err){
    saveMsg('复原失败：' + err.message, false);
  }
});

$('btn-campaign').addEventListener('click', () => { buildClock(); showScreen('scr-clock'); });
$('btn-almanac').addEventListener('click', () => openAlmanac('title'));
$('btn-shop').addEventListener('click', () => openShop('title'));
$('btn-help').addEventListener('click', () => showScreen('scr-help'));
$('btn-help-back').addEventListener('click', () => showTitle());
$('btn-manual').addEventListener('click', () => { if (G.state === 'play') pauseGame(); openAlmanac('pause'); });

/* ---------- 静音按钮（动态加入 HUD） ---------- */
(function addMute(){
  const b = document.createElement('button');
  b.className = 'tool'; b.title = '音效开关'; b.textContent = '音';
  b.addEventListener('click', () => {
    AU.init(); AU.muted = !AU.muted;
    b.textContent = AU.muted ? '哑' : '音';
    b.style.background = AU.muted ? '#241d15' : '';
    b.style.color = AU.muted ? '#d9c9a3' : '';
  });
  $('hud-right').appendChild(b);
})();

/* ================================================================
   启动
   ================================================================ */
(function boot(){
  showTitle();
  requestAnimationFrame(loop);
})();

/* 调试暴露（SAVE 用取值器：导入/复原会整体替换 SAVE 对象，直接引用会指向旧档） */
window.__IRONLINE__ = { G, LEVELS, DEF, EN, startLevel, showBrief, openShop };
Object.defineProperty(window.__IRONLINE__, 'SAVE', { get: () => SAVE, enumerable: true });
