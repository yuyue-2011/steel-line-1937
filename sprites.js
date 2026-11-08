/* ================================================================
   sprites.js —— 木刻版画风贴图（全程序绘制，零素材依赖）
   ================================================================ */
'use strict';

/* ---------- 基础工具 ---------- */
function rr(ctx, x, y, w, h, r){
  r = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y, x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x, y+h, r);
  ctx.arcTo(x, y+h, x, y, r);
  ctx.arcTo(x, y, x+w, y, r);
  ctx.closePath();
}
function box(ctx, x, y, w, h, fill, lw){
  rr(ctx, x, y, w, h, Math.min(4, w/3, h/3));
  ctx.fillStyle = fill; ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = lw || 3; ctx.stroke();
}
function hatch(ctx, x, y, w, h, color, gap, alpha){
  ctx.save(); rr(ctx, x, y, w, h, 2); ctx.clip();
  ctx.strokeStyle = color; ctx.globalAlpha = (alpha==null ? 0.30 : alpha);
  ctx.lineWidth = 1.3;
  for (let i = -h; i < w; i += gap){
    ctx.beginPath(); ctx.moveTo(x+i, y+h); ctx.lineTo(x+i+h, y); ctx.stroke();
  }
  ctx.restore(); ctx.globalAlpha = 1;
}
function dot(ctx, x, y, r, fill){
  ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fillStyle = fill || INK; ctx.fill();
}
function seg(ctx, x1, y1, x2, y2, w, col){
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.strokeStyle = col || INK; ctx.lineWidth = w || 3; ctx.lineCap = 'round'; ctx.stroke();
}
function srand(seed){
  let s = seed * 97 + 13;
  return function(){ s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

/* ---------- 国军头像（面朝右） ---------- */
function guoHead(ctx, x, y, hat){
  dot(ctx, x, y, 8, SKIN);
  ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x, y, 8, 0, 6.2832); ctx.stroke();
  dot(ctx, x + 3.5, y - 1, 1.5, INK);
  if (hat === 'cap'){
    rr(ctx, x-9, y-13, 18, 7, 3); ctx.fillStyle = GREEN_D; ctx.fill(); ctx.strokeStyle=INK; ctx.lineWidth=2.2; ctx.stroke();
    dot(ctx, x, y-9.5, 2.4, RED);
  } else if (hat === 'ushanka'){
    // 苏军护耳棉帽 + 红星
    ctx.beginPath(); ctx.arc(x, y-6, 9.5, Math.PI, 0); ctx.closePath();
    ctx.fillStyle = '#7a7055'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.stroke();
    rr(ctx, x-11, y-8, 5, 8, 2); ctx.fillStyle = '#8a8065'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.stroke();
    rr(ctx, x+6, y-8, 5, 8, 2); ctx.fillStyle = '#8a8065'; ctx.fill(); ctx.stroke();
    star(ctx, x, y-8, 4, RED);
  } else if (hat === 'pilotka'){
    // 苏军船形帽 + 红星
    rr(ctx, x-10, y-11, 20, 7, 3.5); ctx.fillStyle = '#6d6a4a'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke();
    dot(ctx, x, y-7.5, 2.6, RED);
  } else { // M35 钢盔
    ctx.beginPath(); ctx.arc(x, y-5, 10, Math.PI, 0); ctx.closePath();
    ctx.fillStyle = STEEL_D; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.stroke();
    seg(ctx, x-11, y-5, x+11, y-5, 2.6);
  }
}
/* 苏军头像快捷 */
function sovHead(ctx, x, y, hat){ guoHead(ctx, x, y, hat); }
/* ---------- 日军头像（面朝左） ---------- */
function riHead(ctx, x, y, opt){
  opt = opt || {};
  dot(ctx, x, y, 8, opt.rage ? REDL : SKIN);
  ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(x, y, 8, 0, 6.2832); ctx.stroke();
  dot(ctx, x - 3.5, y - 1, 1.5, INK);
  if (opt.stahl){ // 德军M35钢盔（宽沿穹顶）
    ctx.beginPath();
    ctx.moveTo(x-12, y-4); ctx.quadraticCurveTo(x-12, y-14, x, y-14);
    ctx.quadraticCurveTo(x+12, y-14, x+12, y-4);
    ctx.lineTo(x+14, y-3); ctx.quadraticCurveTo(x, y+0.5, x-14, y-3); ctx.closePath();
    ctx.fillStyle = '#4a5145'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.stroke();
    seg(ctx, x-11, y-9, x+11, y-9, 1.6, '#3a4038');
  }
  else if (opt.band){ // 千针白带
    rr(ctx, x-9, y-6, 18, 5, 1.5); ctx.fillStyle = '#ece5d2'; ctx.fill(); ctx.strokeStyle=INK; ctx.lineWidth=1.8; ctx.stroke();
    dot(ctx, x, y-3.5, 1.4, RED);
  } else if (opt.cap){ // 军官大檐帽
    rr(ctx, x-10, y-13, 20, 8, 2.5); ctx.fillStyle = (typeof opt.cap === 'string') ? opt.cap : EUNI_D; ctx.fill(); ctx.strokeStyle=INK; ctx.lineWidth=2.2; ctx.stroke();
    seg(ctx, x-9, y-5, x+9, y-5, 2.6);
    dot(ctx, x, y-9, 1.8, YELLOW);
  } else { // 90式钢盔+后帘
    rr(ctx, x-7, y+2, 8, 6, 2); ctx.fillStyle = EUNI_D; ctx.fill(); ctx.strokeStyle=INK; ctx.lineWidth=1.6; ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y-5, 10, Math.PI, 0); ctx.closePath();
    ctx.fillStyle = STEEL_D; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.stroke();
    seg(ctx, x-11, y-5, x+11, y-5, 2.6);
  }
  if (opt.rage){ seg(ctx, x-7, y-6, x-1, y-3, 2); seg(ctx, x+7, y-6, x+1, y-3, 2); }
}

/* ================================================================
   守军贴图 —— p: {type,x,y,t,flash,hp,maxHp,armT,fuse,chewT,state,...}
   ================================================================ */
var ICON_MODE = false;   /* makeIcon 绘制时置位：跳过战场阴影等仅限实机的修饰 */

function drawDef(ctx, p, t){
  const type = p.type;
  ctx.save();
  ctx.translate(p.x, p.y);
  if (!ICON_MODE){
    /* —— V7.8 战场美化：单位接地软阴影 —— */
    ctx.beginPath(); ctx.ellipse(0, 3, 17, 5.2, 0, 0, 6.28);
    ctx.fillStyle = 'rgba(15,12,8,.17)'; ctx.fill();
  }
  const bob = Math.sin(t*2.2 + p.x*0.05) * 1.5;

  if (type === 'rifleman' || type === 'smg'){
    const isSMG = (type === 'smg');
    const recoil = p.flash > 0 ? -3 : 0;
    // 腿
    seg(ctx, -5, -26, -7 + (isSMG?-3:0), 0, 5); seg(ctx, 5, -26, 8, 0, 5);
    // 军装上衣
    box(ctx, -11, -50+bob*0.4, 22, 26, isSMG ? '#616c46' : GREEN, 3);
    hatch(ctx, -11, -50+bob*0.4, 22, 26, INK, 8, 0.12);
    seg(ctx, -11, -40, 11, -40, 2.4, EUNI_D); // 腰带
    // 头
    guoHead(ctx, recoil*0.4, -58+bob*0.4, 'helmet');
    // 枪
    if (isSMG){
      box(ctx, 6+recoil, -40, 26, 6, STEEL, 2.4);
      dot(ctx, 16+recoil, -33, 6, INK);        // 弹鼓
      dot(ctx, 14+recoil, -33, 2.4, STEEL);
      seg(ctx, 6+recoil, -37, 1, -30, 3);
      guoArm(ctx, 10, -44, 18+recoil, -38);
    } else {
      seg(ctx, 2+recoil, -50, 34+recoil, -36, 4, WOOD);   // 枪身
      seg(ctx, 26+recoil, -40.5, 38+recoil, -34, 3.4, STEEL); // 枪管
      box(ctx, 6+recoil, -42, 8, 5, STEEL, 2);             // 机匣
      guoArm(ctx, 8, -46, 24+recoil, -41);
    }
    if (p.flash > 0){ star(ctx, 40+recoil, -37, 7, YELLOW); }
  }
  else if (type === 'kitchen'){
    seg(ctx, -5, -24, -7, 0, 5); seg(ctx, 5, -24, 8, 0, 5);
    box(ctx, -11, -46, 22, 24, GREEN, 3);
    guoHead(ctx, 0, -54, 'cap');
    // 扁担与吊桶
    seg(ctx, -26, -44, 26, -40, 3.4, WOOD);
    const sw = Math.sin(t*2.6)*3;
    seg(ctx, -24, -43, -24, -28+sw*0.4, 2, INK); seg(ctx, 24, -41, 24, -26+sw*0.4, 2, INK);
    box(ctx, -31, -28+sw*0.4, 14, 12, WOOD, 2.4); box(ctx, 17, -26+sw*0.4, 14, 12, WOOD, 2.4);
    hatch(ctx, 17, -26+sw*0.4, 14, 12, INK, 5, 0.2);
    // 蒸汽
    ctx.globalAlpha = 0.5;
    for (let i=0;i<2;i++){
      const ph = (t*0.5 + i*0.5) % 1;
      ctx.beginPath(); ctx.arc(-24+i*48, -34 - ph*22, 3+ph*5, 0, 6.28);
      ctx.strokeStyle = '#efeadd'; ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  else if (type === 'sandbag' || type === 'bastion'){
    const f = Math.max(0.01, p.hp / p.maxHp);
    if (type === 'sandbag'){
      for (let rowi=0; rowi<3; rowi++){
        const n = rowi===2 ? 2 : 3;
        for (let i=0;i<n;i++){
          const bx = -27 + i*20 + (rowi===2?10:0), by = -52 + rowi*18;
          box(ctx, bx, by, 18, 15, TAN, 2.4);
          seg(ctx, bx+2, by+7, bx+16, by+7, 1.4, '#8f7a54');
        }
      }
      if (f < 0.6){ seg(ctx, -12, -50, -4, -20, 2, INK); }
      if (f < 0.3){ seg(ctx, 8, -48, 2, -6, 2, INK); seg(ctx, -20, -30, 16, -16, 2, INK); }
    } else {
      // 城墙碉垒
      box(ctx, -30, -78, 60, 78, BRICK, 3.4);
      // 垛口
      for (let i=0;i<3;i++){ box(ctx, -28 + i*20, -88, 14, 12, BRICK, 2.6); }
      // 砖缝
      for (let yy=-70; yy<-6; yy+=12){ seg(ctx, -28, yy, 28, yy, 1.6, '#6e5a48'); }
      for (let yy=-70, k=0; yy<-10; yy+=12, k++){
        for (let xx=-22+(k%2)*14; xx<26; xx+=16){ seg(ctx, xx, yy, xx, yy+10, 1.6, '#6e5a48'); }
      }
      // 门洞
      ctx.beginPath(); ctx.moveTo(-8,0); ctx.lineTo(-8,-16); ctx.arc(0,-16,8,Math.PI,0); ctx.lineTo(8,0);
      ctx.fillStyle = '#3a3229'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke();
      if (f < 0.6){ seg(ctx, -18, -64, -8, -22, 2.2, INK); }
      if (f < 0.3){ seg(ctx, 14, -70, 6, -8, 2.2, INK); seg(ctx, -24, -30, 20, -14, 2, INK); }
    }
  }
  else if (type === 'grenades'){
    const sc = 1 + Math.max(0, 1 - p.fuse) * 0.15;
    ctx.scale(sc, sc);
    for (let i=0;i<5;i++){
      const gx = -16 + i*8;
      seg(ctx, gx, -14, gx, -40, 3.4, WOOD);
      box(ctx, gx-4, -50, 8, 11, STEEL, 2);
    }
    rr(ctx, -14, -22, 28, 7, 2); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
    if (Math.sin(t*18) > 0){ dot(ctx, 0, -54, 3.4, YELLOW); dot(ctx, 0, -54, 1.6, '#fff'); }
  }
  else if (type === 'maxim'){
    // 潜伏射手
    box(ctx, -30, -18, 20, 10, GREEN, 2.6);
    guoHead(ctx, -24, -26, 'helmet');
    seg(ctx, -22, -12, -10, -6, 3.4); // 托枪臂
    // 三脚架
    seg(ctx, 2, -20, -4, 0, 3.4); seg(ctx, 8, -20, 14, 0, 3.4);
    // 机匣
    box(ctx, -6, -30, 24, 11, STEEL, 2.6);
    // 水冷套筒
    box(ctx, 16, -32, 30, 12, STEEL_D, 2.6);
    dot(ctx, 22, -26, 1.4); dot(ctx, 30, -26, 1.4); dot(ctx, 38, -26, 1.4);
    // 枪口
    seg(ctx, 46, -26, 56, -26, 3.4, STEEL);
    // 弹链
    ctx.strokeStyle = INK; ctx.lineWidth = 1.8;
    for (let i=0;i<5;i++){ ctx.strokeRect(-8 - i*6, -28 + (i%2)*2, 5, 7); }
    if (p.flash > 0){ star(ctx, 60, -26, 8, YELLOW); }
    // 水冷蒸汽
    ctx.globalAlpha = 0.4;
    const ph = (t*0.8) % 1;
    ctx.beginPath(); ctx.arc(30, -36 - ph*14, 2.5 + ph*4, 0, 6.28);
    ctx.strokeStyle = '#efeadd'; ctx.lineWidth = 2; ctx.stroke();
    ctx.globalAlpha = 1;
  }
  else if (type === 'mine'){
    if (p.armT > 0){
      // 埋设中（半埋）
      ctx.beginPath(); ctx.arc(0, -4, 12, Math.PI, 0); ctx.closePath();
      ctx.fillStyle = STEEL_D; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.stroke();
      ctx.font = 'bold 11px "KaiTi",serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#e2d4ae';
      ctx.fillText('埋设 ' + Math.ceil(p.armT) + 's', 0, -14);
    } else {
      ctx.beginPath(); ctx.arc(0, -8, 15, Math.PI, 0); ctx.closePath();
      ctx.fillStyle = STEEL_D; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
      seg(ctx, -9, -13, -6, -20, 2.2); seg(ctx, 0, -16, 0, -24, 2.2); seg(ctx, 9, -13, 6, -20, 2.2);
      if (Math.sin(t*8) > 0){ dot(ctx, 0, -24, 3, REDL); }
    }
  }
  else if (type === 'sword'){
    if (p.chewT > 0){
      // 喘息：抱刀蹲坐
      seg(ctx, -10, -16, -14, 0, 5); seg(ctx, 10, -16, 14, 0, 5);
      box(ctx, -12, -34, 24, 20, GREEN, 3);
      guoHead(ctx, 0, -42, 'helmet');
      dot(ctx, -6, -40, 4.4, SKIN); dot(ctx, 6, -40, 4.4, SKIN); // 鼓腮
      ctx.strokeStyle=INK; ctx.lineWidth=1.8;
      ctx.beginPath(); ctx.arc(-6,-40,4.4,0,6.28); ctx.stroke();
      ctx.beginPath(); ctx.arc(6,-40,4.4,0,6.28); ctx.stroke();
      seg(ctx, 12, -34, 12, -14, 3, WOOD); // 刀柄
      box(ctx, 8, -48, 10, 15, SILVER, 2.4);
    } else {
      seg(ctx, -5, -26, -7, 0, 5); seg(ctx, 5, -26, 8, 0, 5);
      box(ctx, -11, -50, 22, 26, GREEN, 3);
      hatch(ctx, -11, -50, 22, 26, INK, 8, 0.12);
      guoHead(ctx, 0, -58, 'helmet');
      // 大刀
      box(ctx, 14, -66, 7, 30, SILVER, 2.4);
      seg(ctx, 17, -66, 22, -62, 2.2, SILVER);
      seg(ctx, 17, -36, 17, -26, 3.4, WOOD);
      rr(ctx, 14, -32, 7, 5, 2); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.stroke();
      guoArm(ctx, 6, -46, 16, -40);
    }
  }
  else if (type === 'pontoon'){
    const boby = Math.sin(t*2 + p.x*0.03) * 2;
    ctx.translate(0, boby);
    box(ctx, -32, -16, 64, 12, WOOD, 3);
    for (let i=0;i<4;i++){ seg(ctx, -26+i*16, -14, -18+i*16, -6, 2.4, '#6d5233'); }
    rr(ctx, -30, -20, 60, 6, 3); ctx.fillStyle = '#a08055'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.stroke();
    seg(ctx, -30, -18, 30, -18, 2, '#5d4429');
    // 系缆桩
    dot(ctx, -26, -22, 3, INK); dot(ctx, 26, -22, 3, INK);
  }
  else if (type === 'atgun'){
    // 车轮
    ctx.beginPath(); ctx.arc(-6, -12, 12, 0, 6.2832); ctx.fillStyle = WOOD; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.stroke();
    for (let i=0;i<4;i++){ const a = i*Math.PI/4 + t*0.2; seg(ctx, -6+Math.cos(a)*10, -12+Math.sin(a)*10, -6-Math.cos(a)*10, -12-Math.sin(a)*10, 1.8); }
    dot(ctx, -6, -12, 2.6, STEEL);
    // 炮盾
    ctx.save(); ctx.rotate(-0.1);
    box(ctx, -14, -38, 14, 24, STEEL, 2.6);
    ctx.restore();
    // 炮管
    seg(ctx, 0, -30, 34, -30, 5, STEEL);
    dot(ctx, 34, -30, 3.4, INK);
    seg(ctx, 2, -28, 6, -8, 3, STEEL); // 开脚架
    // 炮手
    box(ctx, -30, -24, 16, 12, GREEN, 2.6);
    guoHead(ctx, -26, -32, 'helmet');
    if (p.flash > 0){ star(ctx, 40, -30, 8, YELLOW); }
  }
  else if (type === 'squad'){
    // 敢死队：蓄势 / 跃出
    if (p.state === 'jump' && p.jx != null){
      ctx.translate(p.jx - p.x, 0); // 由 render 传入绘制坐标
    }
    const crouch = (p.state === 'idle');
    const yy = crouch ? -18 : -30;
    seg(ctx, -8, yy, -12, 0, 5); seg(ctx, 8, yy, 12, 0, 5);
    box(ctx, -12, yy-18, 24, 20, GREEN, 3);
    hatch(ctx, -12, yy-18, 24, 20, INK, 8, 0.12);
    // 腰间手榴弹束
    rr(ctx, -4, yy-14, 10, 8, 2); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
    guoHead(ctx, 0, yy-26, 'helmet');
    // 大刀前指
    box(ctx, 12, yy-20, 6, 24, SILVER, 2.2);
    seg(ctx, 15, yy-20, 20, yy-16, 2, SILVER);
    seg(ctx, 15, yy+4, 15, yy+12, 3, WOOD);
    guoArm(ctx, 4, yy-14, 14, yy-8);
    if (p.state !== 'idle'){ seg(ctx, -22, yy+2, -34, yy+6, 2, 'rgba(36,29,21,.4)'); }
  }
  else if (type === 'mortar82'){
    // 82迫击炮急袭：双炮手 + 高仰角炮
    seg(ctx, -6, -20, -14, 0, 3.4); seg(ctx, 6, -20, 14, 0, 3.4);
    // 炮身（大仰角）
    ctx.save(); ctx.rotate(-0.85);
    seg(ctx, 0, -8, 0, -44, 7, STEEL);
    seg(ctx, 0, -40, 0, -50, 9, STEEL_D);
    ctx.restore();
    box(ctx, -8, -22, 16, 10, STEEL_D, 2.4); // 座钣
    dot(ctx, 0, -46, 3, RED);
    // 双炮手
    box(ctx, -26, -30, 14, 14, GREEN, 2.6); guoHead(ctx, -20, -38, 'helmet');
    box(ctx, 14, -28, 14, 12, GREEN, 2.6); guoHead(ctx, 20, -36, 'helmet');
    // 待发弹
    dot(ctx, -30, -8, 4, INK);
    // 急袭火花
    if (p.flash > 0 || (p.fuse != null && p.fuse < 0.4)){
      star(ctx, 0, -52, 9 * (1 - (p.fuse||0) + 0.3), YELLOW);
      seg(ctx, -14, -58, 14, -58, 2, REDL);
    }
  }
  else if (type === 'magnet'){
    // 磁力排雷组：探雷环
    seg(ctx, -5, -26, -8, 0, 5); seg(ctx, 5, -26, 8, 0, 5);
    box(ctx, -11, -50, 22, 26, GREEN, 3);
    hatch(ctx, -11, -50, 22, 26, INK, 8, 0.12);
    guoHead(ctx, 0, -58, 'helmet');
    // 探雷杆 + 大环
    seg(ctx, 6, -44, 26, -56, 3, WOOD);
    ctx.beginPath(); ctx.ellipse(34, -60, 10, 12, 0.5, 0, 6.28);
    ctx.strokeStyle = STEEL; ctx.lineWidth = 3.4; ctx.stroke();
    ctx.strokeStyle = INK; ctx.lineWidth = 1.4; ctx.stroke();
    guoArm(ctx, 4, -44, 22, -52);
    // 磁脉冲环
    if (p.pulseT != null && p.pulseT < 1.2){
      const k = 1 - p.pulseT / 1.2;
      ctx.globalAlpha = 0.6 * (1 - k);
      ctx.beginPath(); ctx.arc(30, -40, 20 + k*130, 0, 6.28);
      ctx.strokeStyle = '#8fb6c4'; ctx.lineWidth = 3; ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
  else if (type === 'mortar'){
    // 82迫击炮组（曲射）
    seg(ctx, -8, -18, -14, 0, 3.4); seg(ctx, 8, -18, 14, 0, 3.4);
    ctx.save(); ctx.rotate(-0.6);
    seg(ctx, 0, -6, 0, -38, 6, STEEL);
    seg(ctx, 0, -34, 0, -44, 8, STEEL_D);
    ctx.restore();
    box(ctx, -10, -18, 18, 8, STEEL_D, 2.2);
    // 炮手 + 弹药箱
    box(ctx, -30, -26, 14, 16, GREEN, 2.6); guoHead(ctx, -23, -34, 'helmet');
    box(ctx, 16, -16, 18, 14, WOOD, 2.4);
    seg(ctx, 16, -9, 34, -9, 1.8, '#6d5233');
    dot(ctx, 25, -20, 3, YELLOW);
    guoArm(ctx, 0, -30, 14, -36);
    if (p.flash > 0){ star(ctx, 6, -44, 8, YELLOW); }
  }
  else if (type === 'spike'){
    // 反坦克地刺：一排钢牙
    for (let i=0;i<5;i++){
      const sx = -32 + i*16;
      ctx.beginPath(); ctx.moveTo(sx-6, -4); ctx.lineTo(sx, -16); ctx.lineTo(sx+6, -4); ctx.closePath();
      ctx.fillStyle = STEEL; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(sx-6, -4); ctx.lineTo(sx+6, -4); ctx.closePath();
      ctx.fillStyle = STEEL_D; ctx.fill(); ctx.stroke();
    }
    seg(ctx, -36, -5, 36, -5, 3, '#565851');
    hatch(ctx, -36, -5, 72, 5, INK, 6, 0.3);
  }
  else if (type === 'dp27'){
    // DP-27转盘机枪：俯姿机枪手 + 转盘弹匣
    seg(ctx, -8, -16, -12, 0, 5); seg(ctx, 8, -16, 12, 0, 5);
    // 枪身 + 脚架
    seg(ctx, 22, -26, -18, -22, 5, STEEL);
    seg(ctx, -14, -24, -18, -6, 2.6, STEEL); seg(ctx, -10, -23, -6, -6, 2.6, STEEL);
    // 转盘弹匣（俯视圆盘）
    dot(ctx, 6, -22, 8.5, INK);
    dot(ctx, 6, -22, 6.5, STEEL);
    dot(ctx, 6, -22, 2, INK);
    // 枪手（俯姿）
    box(ctx, -16, -38, 26, 14, '#6d6a4a', 3);
    sovHead(ctx, -12, -44, 'ushanka');
    guoArm(ctx, -8, -32, 10, -26);
    // 三行齐射的提示刻线
    ctx.globalAlpha = 0.3;
    seg(ctx, 30, -34, 44, -34, 2, INK); seg(ctx, 30, -22, 44, -22, 2, INK); seg(ctx, 30, -10, 44, -10, 2, INK);
    ctx.globalAlpha = 1;
    if (p.flash > 0){ star(ctx, -22, -24, 7, YELLOW); }
  }
  else if (type === 'bottle'){
    // 燃烧瓶组：投掷手 + 瓶架
    seg(ctx, -5, -26, -7, 0, 5); seg(ctx, 5, -26, 8, 0, 5);
    box(ctx, -11, -50, 22, 26, '#6d6a4a', 3);
    hatch(ctx, -11, -50, 22, 26, INK, 8, 0.12);
    seg(ctx, -11, -40, 11, -40, 2.4, '#4a3f28');
    sovHead(ctx, 0, -58, 'pilotka');
    // 瓶架（3瓶）
    for (let i=0;i<3;i++){
      const bx = 14 + i*8, by = -46 + (i%2)*6;
      box(ctx, bx, by, 6, 10, '#7a8a6a', 2);
      dot(ctx, bx+3, by-3, 2.4, '#c9a23a');   // 火芯
      seg(ctx, bx+3, by-3, bx+3, by-7, 2, REDL);
    }
    guoArm(ctx, 6, -44, 22, -50);
    if (p.flash > 0){ star(ctx, 30, -54, 6, REDL); }
  }
  else if (type === 'katyusha'){
    // 喀秋莎BM-13：卡车 + 斜置导轨
    seg(ctx, -6, -20, -12, 0, 4.5); seg(ctx, 26, -20, 30, 0, 4.5);
    // 车体
    box(ctx, -34, -34, 66, 18, '#6d7752', 3);
    box(ctx, 14, -46, 20, 14, '#6d7752', 2.6);   // 驾驶室
    dot(ctx, 32, -40, 4, '#8fa08a');
    // 车轮
    for (let i=0;i<2;i++){ dot(ctx, -18+i*22, -10, 8, '#3a352c'); dot(ctx, -18+i*22, -10, 3, '#6d675d'); }
    // 火箭导轨（斜向上）
    ctx.save(); ctx.rotate(-0.42);
    for (let i=0;i<4;i++){
      seg(ctx, -30, -48 - i*8, 34, -48 - i*8, 3.4, '#8a8456');
      dot(ctx, 36, -48 - i*8, 3, RED);
    }
    ctx.restore();
    // 待发火箭（fuse末端闪烁）
    if (p.fuse != null && p.fuse < 0.5){
      star(ctx, 30, -62, 8*(1-p.fuse*2), YELLOW);
    }
  }
  else if (type === 'ptrd'){
    // PTRD-41反坦克枪：两人枪组（射手俯姿+装填手）
    seg(ctx, -8, -18, -12, 0, 5); seg(ctx, 8, -18, 12, 0, 5);
    // 长枪身 + 制退器
    seg(ctx, 30, -22, -34, -18, 5, STEEL);
    seg(ctx, -38, -18, -32, -18, 7, STEEL_D);
    box(ctx, 8, -26, 12, 7, STEEL_D, 2);        // 弹仓
    seg(ctx, -14, -22, -20, -4, 2.6, STEEL);    // 两脚架
    // 射手（俯姿）
    box(ctx, -20, -34, 26, 13, '#6d6a4a', 3);
    sovHead(ctx, -14, -40, 'ushanka');
    guoArm(ctx, -10, -28, 12, -22);
    // 装填手
    box(ctx, 14, -30, 18, 12, '#7a7455', 2.6);
    dot(ctx, 22, -36, 7, SKIN);
    ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(22, -36, 7, 0, 6.28); ctx.stroke();
    dot(ctx, 24.5, -37, 1.4, INK);
    box(ctx, 16, -45, 14, 7, '#6d6a4a', 2);     // 帽
    star(ctx, 23, -41.5, 3, RED);
    // 命中载具标记（穿甲光）
    if (p.flash > 0){ star(ctx, -44, -18, 9, YELLOW); star(ctx, -44, -18, 5, '#fff'); }
  }
  else if (type === 'marine'){
    // 黑海水兵班：条纹衫 + 无檐水兵帽
    seg(ctx, -5, -26, -7, 0, 5); seg(ctx, 5, -26, 8, 0, 5);
    box(ctx, -11, -50, 22, 26, '#2e3238', 3);   // 黑色水兵外套
    // 条纹衫（telnyashka）
    for (let i=0;i<4;i++){ seg(ctx, -11, -48 + i*6, 11, -48 + i*6, 2.2, '#ece5d2'); }
    seg(ctx, -11, -40, 11, -40, 2.4, '#ece5d2');
    // 头 + 无檐帽（飘带）
    dot(ctx, 0, -58, 8, SKIN);
    ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(0, -58, 8, 0, 6.28); ctx.stroke();
    dot(ctx, 3.5, -57, 1.5, INK);
    rr(ctx, -10, -68, 20, 8, 4); ctx.fillStyle = '#ece5d2'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke();
    seg(ctx, -8, -62, -14, -54, 2, '#ece5d2'); seg(ctx, 8, -62, 14, -54, 2, '#ece5d2');  // 帽飘带
    // 步枪
    const recoil = p.flash > 0 ? -3 : 0;
    seg(ctx, 2 + recoil, -50, 34 + recoil, -36, 4, WOOD);
    seg(ctx, 26 + recoil, -40.5, 38 + recoil, -34, 3.4, STEEL);
    box(ctx, 6 + recoil, -42, 8, 5, STEEL, 2);
    guoArm(ctx, 8, -46, 24 + recoil, -41);
    if (p.flash > 0){ star(ctx, 40 + recoil, -37, 7, YELLOW); }
  }
  else if (type === 'pavlov'){
    // 巴甫洛夫楼：加固四层楼
    const bob = Math.sin(t*2.2 + p.x*0.05) * 1.5;
    box(ctx, -36, -96 + bob, 72, 96, '#8a7a64', 3.4);
    hatch(ctx, -36, -96 + bob, 72, 96, INK, 12, 0.1);
    // 层线与窗户
    for (let fl=0; fl<4; fl++){
      const fy = -88 + bob + fl*22;
      seg(ctx, -36, fy + 20, 36, fy + 20, 2, '#6d6156');
      for (const wx of [-26, -6, 14]){
        box(ctx, wx, fy, 14, 13, fl === 0 ? '#241d15' : '#4a4336', 2);
        if (fl >= 1){ dot(ctx, wx + 7, fy + 6, 2, (Math.sin(t*3 + fl + wx) > 0.3) ? YELLOW : '#2a251d'); }  // 火光窗
      }
    }
    // 楼顶弹痕与沙袋
    ctx.globalAlpha = 0.5; dot(ctx, -20, -96 + bob, 6, '#4a4336'); ctx.globalAlpha = 1;
    for (let i=0;i<3;i++){ box(ctx, -30 + i*22, -12 + bob, 16, 10, WOOD, 2.2); }
    // 反坦克枪窗位（三层）
    seg(ctx, 14, -42 + bob, 40, -34 + bob, 3, STEEL);
  }
  else if (type === 'split'){
    // 巷战哨组：一正一背的沙袋哨位
    const bob = Math.sin(t*2.2 + p.x*0.05) * 1.5;
    // 双向沙袋堆
    for (let i=0;i<3;i++){
      box(ctx, -16 + i*14, -20 - (i===1?8:0) + bob*0.4, 22, 12, WOOD, 2.2);
      dot(ctx, -16 + i*14 + 11, -20 - (i===1?8:0) + bob*0.4 + 2, 2.2, '#8f7a58');
    }
    // 正向射手（面朝右=敌来向）
    seg(ctx, -4, -24, -6, -4, 4.6); seg(ctx, 4, -24, 6, -4, 4.6);
    box(ctx, 2, -48, 20, 24, '#7a7455', 3);
    sovHead(ctx, 12, -56, 'ushanka');
    guoArm(ctx, 16, -44, 34, -38);
    const r1 = p.flash > 0 ? -3 : 0;
    seg(ctx, 10 + r1, -46, 38 + r1, -36, 3.6, WOOD);
    seg(ctx, 32 + r1, -41, 44 + r1, -36, 2.6, STEEL);
    // 背向射手（面朝左=防绕后）
    seg(ctx, -22, -24, -24, -4, 4.6); seg(ctx, -30, -24, -32, -4, 4.6);
    box(ctx, -30, -48, 20, 24, '#6d6a4a', 3);
    sovHead(ctx, -20, -56, 'ushanka');
    guoArm(ctx, -24, -44, -42, -38);
    seg(ctx, -28, -46, -56, -36, 3.6, WOOD);
    seg(ctx, -50, -41, -62, -36, 2.6, STEEL);
    if (p.flash > 0){
      star(ctx, 48, -36, 7, YELLOW); star(ctx, -66, -36, 7, YELLOW);
    }
  }
  else if (type === 'ml20' || type === 'su152'){
    // ML-20重榴弹炮 / SU-152自行火炮
    const bob = Math.sin(t*2.2 + p.x*0.05) * 1.5;
    const barrelR = type === 'ml20' ? 5.6 : 6.4;
    const bLen = type === 'ml20' ? 44 : 38;
    if (type === 'su152'){
      // SU-152：履带底盘 + 案体战斗室
      box(ctx, -30, -22 + bob, 62, 16, '#3a352c', 3);
      for (let i=0;i<4;i++){ dot(ctx, -22 + i*15, -14 + bob, 5, '#6d675d'); dot(ctx, -22 + i*15, -14 + bob, 1.8, '#3a352c'); }
      box(ctx, -26, -44 + bob, 54, 24, '#4a5145', 3);
      hatch(ctx, -26, -44 + bob, 54, 24, INK, 7, 0.16);
      // 152重炮（短粗，朝左上）
      ctx.save();
      ctx.translate(-24, -46 + bob); ctx.rotate(-0.3);
      seg(ctx, 0, 0, -bLen, 0, barrelR, STEEL);
      seg(ctx, -bLen-6, 0, -bLen+4, 0, barrelR+1.4, STEEL_D);
      ctx.restore();
      // 车长（坦克盔探身）
      sovHead(ctx, 8, -52 + bob);
    } else {
      // ML-20：牵引炮架 + 大架双腿
      seg(ctx, 8, -12, 26, -2, 4.6, STEEL_D);
      seg(ctx, 8, -12, -16, -2, 4.6, STEEL_D);
      dot(ctx, 26, -1, 5, STEEL_D); dot(ctx, -16, -1, 5, STEEL_D);
      box(ctx, -16, -26 + bob, 40, 16, '#4a5145', 3);
      // 防盾 + 122长炮管
      box(ctx, -20, -34 + bob, 10, 20, STEEL_D, 2.6);
      ctx.save();
      ctx.translate(-16, -30 + bob); ctx.rotate(-0.34);
      seg(ctx, 0, 0, -bLen, 0, barrelR, STEEL);
      seg(ctx, -bLen-7, 0, -bLen+4, 0, barrelR+1.6, STEEL_D);
      ctx.restore();
      // 炮班两人
      box(ctx, 6, -38, 16, 20, '#6d6a4a', 2.6);
      sovHead(ctx, 14, -44, 'ushanka');
      box(ctx, 22, -30, 14, 16, '#7a7455', 2.6);
      sovHead(ctx, 29, -36, 'ushanka');
    }
    // 开火特效
    if (p.flash > 0){
      const fx = type === 'su152' ? -58 : -54;
      star(ctx, fx, -34 + bob, 12, YELLOW); star(ctx, fx, -34 + bob, 6, '#fff');
    }
    // 落点提示（即将开火时炮口星标）
    if (p.shootT != null && p.shootT < 0.6 && p.flash <= 0){
      star(ctx, type === 'su152' ? -46 : -44, -30 + bob, 5, '#e0a422');
    }
  }
  else if (type === 'ppsh'){
    // 波波沙冲锋枪班：跪姿泼弹
    const bob = Math.sin(t*2.4 + p.x*0.05) * 1.6;
    box(ctx, -16, -26, 32, 22, WOOD, 2.2);                    // 沙袋座
    dot(ctx, -6, -20, 2.4, '#8f7a58'); dot(ctx, 6, -20, 2.4, '#8f7a58');
    seg(ctx, -4, -24, -8, -4, 4.6); seg(ctx, 4, -24, 8, -4, 4.6); // 跪姿双腿
    box(ctx, -2, -48, 20, 26, '#7a7455', 2.8);
    sovHead(ctx, 8, -56, 'pilotka');
    const r1 = p.flash > 0 ? -3 : 0;
    seg(ctx, 6 + r1, -44, 34 + r1, -34, 3.2, WOOD);          // 枪身
    dot(ctx, 12 + r1, -40, 6.2, STEEL_D);                     // 71发弹鼓
    ctx.beginPath(); ctx.arc(12 + r1, -40, 6.2, 0, 6.28); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
    seg(ctx, 32 + r1, -36, 44 + r1, -32, 2.2, STEEL);
    if (p.flash > 0){ star(ctx, 50, -32, 6.5, YELLOW); }
    // 弹壳
    if (SET && SET.fx && Math.random() < 0.12){ dot(ctx, -10 + Math.random()*8, -18, 1.6, '#c9a23a'); }
  }
  else if (type === 'looters'){
    // 战利品缴获队：清点桌+弹药箱+记账员
    const bob = Math.sin(t*2.0 + p.x*0.05) * 1.2;
    // 桌面（地图+登记簿）
    box(ctx, -20, -30 + bob, 40, 8, WOOD, 2.4);
    seg(ctx, -14, -36 + bob, 14, -36 + bob, 2.6, '#8a7a5c');
    seg(ctx, -8, -34 + bob, 6, -32 + bob, 1.6, '#8a7a5c');
    // 弹药箱堆
    box(ctx, 8, -46 + bob, 20, 16, '#6d5233', 2.2);
    seg(ctx, 8, -38 + bob, 28, -38 + bob, 2, '#8f7a58');
    dot(ctx, 18, -42 + bob, 1.6, '#c9a23a');
    box(ctx, -24, -44 + bob, 14, 14, '#7a6448', 2);
    // 两个清点兵
    box(ctx, -14, -56, 14, 24, '#7a7455', 2.6);
    sovHead(ctx, -7, -62, 'pilotka');
    box(ctx, 20, -54, 13, 22, '#6d6a4a', 2.6);
    sovHead(ctx, 26, -60, 'ushanka');
    seg(ctx, 4, -50, 18, -46, 2.6, '#7a7455');                // 递箱手臂
    // 定期缴获闪光
    if (p.prodT != null && p.prodT < 1.6){
      star(ctx, 0, -58, 5.5, '#e0a422');
      ctx.font = 'bold 10px "Microsoft YaHei",sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = '#6e5a2c'; ctx.fillText('+15', 0, -70);
    }
  }
  else if (type === 'zis3' || type === 'bs3'){
    // ZiS-3 76mm / BS-3 100mm 反坦克炮
    const bob = Math.sin(t*2.2 + p.x*0.05) * 1.4;
    const big = type === 'bs3';
    const bLen = big ? 50 : 40, bR = big ? 4.8 : 3.8;
    // 大架双腿 + 轮
    seg(ctx, 10, -12, 30, -2, 4.2, STEEL_D);
    seg(ctx, 10, -12, -12, -2, 4.2, STEEL_D);
    dot(ctx, -16, -2, 4.6, STEEL_D); dot(ctx, 30, -2, 4.6, STEEL_D);
    dot(ctx, 8, -10, 6.2, '#3a352c'); dot(ctx, 8, -10, 2.4, STEEL_D);   // 轮
    // 防盾 + 身管
    box(ctx, -18, -34 + bob, 10, 22, STEEL_D, 2.4);
    ctx.save();
    ctx.translate(-14, -30 + bob); ctx.rotate(-0.22);
    seg(ctx, 0, 0, -bLen, 0, bR, STEEL);
    if (big) seg(ctx, -bLen-6, 0, -bLen+4, 0, bR+1.6, STEEL_D);
    else dot(ctx, -bLen, 0, 3.6, STEEL_D);
    ctx.restore();
    // 炮班
    box(ctx, 8, -40, 14, 20, '#6d6a4a', 2.4);
    sovHead(ctx, 15, -46, 'ushanka');
    if (big){
      box(ctx, 22, -32, 13, 18, '#7a7455', 2.4);
      sovHead(ctx, 28, -38, 'ushanka');
    }
    if (p.flash > 0){ star(ctx, -bLen - 12, -30 + bob, big ? 11 : 8, YELLOW); }
  }
  else if (type === 'm120'){
    // 120重迫击炮：座钣+粗炮管
    const bob = Math.sin(t*2.2 + p.x*0.05) * 1.4;
    ctx.beginPath(); ctx.ellipse(0, -4, 24, 7, 0, 0, 6.28);
    ctx.fillStyle = STEEL_D; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.stroke();
    ctx.save();
    ctx.translate(4, -8); ctx.rotate(-0.9);
    seg(ctx, 0, 0, 0, -40, 6.4, STEEL);
    seg(ctx, 0, -46, 0, -12, 7.8, STEEL_D);
    dot(ctx, 0, -48, 3.4, STEEL_D);
    ctx.restore();
    box(ctx, -26, -28, 14, 18, '#6d5233', 2.2);               // 弹药箱
    box(ctx, 16, -36, 14, 22, '#6d6a4a', 2.4);
    sovHead(ctx, 23, -42, 'ushanka');
    if (p.flash > 0){ star(ctx, -12, -52, 9, YELLOW); }
  }
  else if (type === 'is2'){
    // IS-2冲击炮位：重坦克底盘+122大炮
    const bob = Math.sin(t*2.2 + p.x*0.05) * 1.4;
    box(ctx, -32, -22 + bob, 64, 16, '#3a352c', 3);
    for (let i=0;i<4;i++){ dot(ctx, -24 + i*15, -14 + bob, 5, '#6d675d'); dot(ctx, -24 + i*15, -14 + bob, 1.8, '#3a352c'); }
    box(ctx, -26, -46 + bob, 52, 26, '#4a5145', 3);
    hatch(ctx, -26, -46 + bob, 52, 26, INK, 7, 0.16);
    // 球形炮塔 + 122炮（粗+制退器）
    ctx.beginPath(); ctx.arc(0, -48 + bob, 13, Math.PI, 0); ctx.closePath();
    ctx.fillStyle = '#43483f'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.stroke();
    ctx.save();
    ctx.translate(-12, -48 + bob); ctx.rotate(-0.3);
    seg(ctx, 0, 0, -46, 0, 5.6, STEEL);
    seg(ctx, -52, 0, -42, 0, 7.4, STEEL_D);
    ctx.restore();
    sovHead(ctx, 14, -54 + bob);
    if (p.flash > 0){ star(ctx, -64, -44 + bob, 12, YELLOW); star(ctx, -64, -44 + bob, 6, '#fff'); }
  }
  else if (type === 'il2'){
    // 伊尔-2校射哨：电台+天线+地图桌
    const bob = Math.sin(t*2.0 + p.x*0.05) * 1.4;
    box(ctx, -18, -28, 36, 8, WOOD, 2.4);                     // 桌
    box(ctx, 4, -44, 18, 16, '#4a5145', 2.4);                 // 电台箱
    seg(ctx, 12, -44, 12, -70, 1.8, STEEL);                   // 鞭状天线
    dot(ctx, 12, -70, 2.4, RED);
    ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.arc(12, -70, 7 + Math.sin(t*6)*2, 0, 6.28);
    ctx.strokeStyle = '#e0a422'; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.globalAlpha = 1;
    box(ctx, -14, -54, 14, 24, '#7a7455', 2.6);               // 校射哨兵
    sovHead(ctx, -7, -60, 'pilotka');
    seg(ctx, 2, -48, 12, -44, 2.6, '#7a7455');                // 按电台的手
    // 起飞指示旗
    if (p.fuse != null && p.fuse > 0 && p.fuse < 1.2){
      seg(ctx, -22, -52, -22, -74, 2, WOOD);
      box(ctx, -22, -74, 16, 10, RED, 1.8);
    }
    if (p.flash > 0){
      // 低空掠过的伊尔剪影
      ctx.save(); ctx.globalAlpha = 0.8; ctx.translate(60, -92); ctx.rotate(-0.06);
      box(ctx, -26, -6, 52, 12, '#4f5650', 2.4);              // 机身
      ctx.beginPath(); ctx.moveTo(-8, -2); ctx.lineTo(-30, 14); ctx.lineTo(-4, 8); ctx.closePath();
      ctx.fillStyle = '#4a5145'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
      dot(ctx, 30, -2, 4, '#3a4038');
      ctx.restore(); ctx.globalAlpha = 1;
    }
  }
  ctx.restore();
  /* ---- 守军血条（受损时显示） ---- */
  if (p.hp < p.maxHp - 1 && p.hp > 0){
    const w = 44, bx = p.x - w/2;
    const by = p.y - (type === 'bastion' ? 104 : (type === 'sandbag' ? 74 : (type === 'mortar' || type === 'mortar82' ? 70 : 84)));
    const frac = Math.max(0, p.hp / p.maxHp);
    ctx.fillStyle = 'rgba(30,24,16,.88)'; ctx.fillRect(bx - 1, by - 1, w + 2, 6);
    ctx.fillStyle = frac > 0.5 ? '#63a33d' : (frac > 0.25 ? '#e0a422' : REDL);
    ctx.fillRect(bx, by, w * frac, 4);
  }
}
function guoArm(ctx, x1, y1, x2, y2){
  seg(ctx, x1, y1, x2, y2, 4, GREEN);
  dot(ctx, x2, y2, 3, SKIN);
  ctx.strokeStyle = INK; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.arc(x2, y2, 3, 0, 6.28); ctx.stroke();
}
function star(ctx, x, y, r, fill){
  ctx.beginPath();
  for (let i=0;i<8;i++){
    const a = i * Math.PI / 4;
    const rr2 = i%2===0 ? r : r*0.42;
    ctx.lineTo(x + Math.cos(a)*rr2, y + Math.sin(a)*rr2);
  }
  ctx.closePath(); ctx.fillStyle = fill || YELLOW; ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 1.6; ctx.stroke();
}

/* ================================================================
   敌军贴图 —— e:{type,x,y,phase,hp,shield,slowT,rage,eating,dead,deathT,...}
   德军条目以 de_ 前缀映射到同构行为类型，贴图换阵营皮肤
   ================================================================ */
const DE_MAP = { de_inf:'infantry', de_flag:'flagbearer', de_crate:'crate', de_officer:'officer', de_storm:'banzai', de_sapper:'digger', de_panzer:'crusher', de_boat:'boat', ro_inf:'infantry', de_frost:'infantry', de_tiger:'crusher', de_stug:'crusher', de_ss:'plate', de_ferd:'crusher', ro_tank:'crusher', de_panther:'crusher', de_volks:'infantry' };
const FELDGR = '#5a6552';   // 德军野战灰
const ROBRAUN = '#7a6448';  // 罗军褐
const VOLKS = '#6d6a5c';    // 国民掷弹兵·灰大衣
function drawEn(ctx, e, t){
  const rawType = e.type;
  const de = rawType.indexOf('de_') === 0;
  const ro = rawType === 'ro_inf' || rawType === 'ro_tank';
  const frost = rawType === 'de_frost';
  const volks = rawType === 'de_volks';
  const type = (de || ro) ? DE_MAP[rawType] : rawType;
  ctx.save();
  ctx.translate(e.x, e.y);
  if (!ICON_MODE){
    /* —— V7.8 战场美化：敌军接地阴影（载具加宽加深） —— */
    const big = e.vehicle || type === 'crusher' || type === 'plate' || type === 'door';
    ctx.beginPath(); ctx.ellipse(0, 4, big ? 26 : 16, big ? 6.5 : 4.8, 0, 0, 6.28);
    ctx.fillStyle = big ? 'rgba(15,12,8,.22)' : 'rgba(15,12,8,.16)';
    ctx.fill();
  }
  if (rawType === 'de_wespe'){ drawWespe(ctx, e, t); ctx.restore(); drawEnBar(ctx, e); return; }
  if (type === 'crusher'){ ((de || rawType === 'ro_tank') ? drawTank : drawCrusher)(ctx, e, t); ctx.restore(); drawEnBar(ctx, e); return; }
  if (e.digging && !e.dead){
    // 掘进中：土垄 + 镐柄尖
    const bump = Math.sin(t*10 + e.phase) * 2;
    ctx.beginPath(); ctx.ellipse(0, -8 + bump, 34, 12, 0, 0, 6.28);
    ctx.fillStyle = '#6d563c'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, -10 + bump, 22, 7, 0, 0, 6.28);
    ctx.fillStyle = '#7d6448'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.stroke();
    seg(ctx, 10, -12, 22, -30, 2.6, WOOD);
    dot(ctx, 22, -31, 3.4, STEEL);
    ctx.globalAlpha = 0.5;
    for (let i=0;i<3;i++){
      const ph = ((t*1.6 + i*0.33) % 1);
      ctx.beginPath(); ctx.arc(30 + ph*26, -8 - ph*10, 2 + ph*4, 0, 6.28);
      ctx.strokeStyle = '#8f7a58'; ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore(); drawEnBar(ctx, e); return;
  }
  if (e.reverse && !e.dead) ctx.scale(-1, 1);
  if (e.dead){
    const f = Math.max(0, e.deathT);
    ctx.globalAlpha = Math.min(1, f / 0.3);
    ctx.rotate(-1.45 * (1 - f));
    // 白旗
    seg(ctx, 10, -40, 10, -62, 2.2);
    box(ctx, 10, -62, 14, 10, '#ece5d2', 1.8);
    dot(ctx, 8, -40, 3, SKIN);
  }
  const base = EN[type];
  const eating = !!e.eating;
  const walkPh = e.dead ? 0 : Math.sin(t*7 + e.phase) * (eating ? 2 : 9);
  const lean = e.rage ? -0.16 : (eating ? -0.10 : -0.05);
  if (!e.dead) ctx.rotate(lean);

  /* 满血判定：耐久高于「一名普通步兵的满血」才算行头完整（原为魔数 269，随难度缩放） */
  const fullHp = e.hp > EN.infantry.hp * ((typeof G !== 'undefined' && G.diff) ? G.diff.hp : 1);
  if (e.submerged && !e.dead){
    // 潜航：只露钢盔尖与通气管
    seg(ctx, 6, -6, 6, -26, 3.4, STEEL);
    dot(ctx, 6, -28, 3, STEEL_D);
    ctx.beginPath(); ctx.arc(6, -34, 4.4, 0, 6.28); ctx.fillStyle = STEEL_D; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
    ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.ellipse(4, -2, 26, 6, 0, 0, 6.28); ctx.strokeStyle = '#cfe0e6'; ctx.lineWidth = 2; ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
    drawEnBar(ctx, e);
    return;
  }
  if (type === 'pogo' && e.stilts && !e.dead){
    // 高跷：两根长杆 + 弹跳
    const hop = e.vaulting > 0 ? Math.sin((1 - e.vaulting / 0.55) * Math.PI) * 62 : Math.abs(Math.sin(t*6 + e.phase)) * 9;
    seg(ctx, -9, 0, -9, -66, 3, WOOD);
    seg(ctx, 9, 0, 9, -66, 3, WOOD);
    seg(ctx, -14, 0, -4, 0, 3, WOOD); seg(ctx, 4, 0, 14, 0, 3, WOOD); // 踏脚
    ctx.save(); ctx.translate(0, -hop);
    riSoldierBody(ctx, t, 0, { noLegs: true, yy: -58 });
    seg(ctx, -6, -32, -12, -62, 2.6, EUNI); seg(ctx, 6, -32, 12, -62, 2.6, EUNI); // 手扶杆
    ctx.restore();
    if (e.vaulting > 0){
      ctx.globalAlpha = 0.35;
      seg(ctx, 16, -30, 34, -34, 2, INK); seg(ctx, 18, -12, 36, -14, 2, INK);
      ctx.globalAlpha = 1;
    }
  }
  else if (type === 'boat' && !e.vaulted && !e.dead){
    // 乘舟
    ctx.beginPath();
    ctx.moveTo(-36, -10); ctx.quadraticCurveTo(0, 12, 36, -10);
    ctx.closePath(); ctx.fillStyle = WOOD; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    seg(ctx, -36, -10, 36, -10, 3.4);
    for (let i=-2;i<=2;i++){ seg(ctx, i*13, -4, i*13, -12, 2, '#6d5233'); }
    // 桨
    seg(ctx, -20, -34, -34, -6, 2.6, WOOD);
    // 乘员
    riSoldierBody(ctx, t, walkPh, { noLegs:true, yy:-34 });
    // 尾迹
    ctx.globalAlpha = 0.4;
    for (let i=0;i<3;i++){
      const ph = ((t*1.4 + i*0.33) % 1);
      ctx.beginPath(); ctx.ellipse(38 + ph*24, -4, 8 + ph*6, 3, 0, 0, 6.28);
      ctx.strokeStyle = '#cfe0e6'; ctx.lineWidth = 1.6; ctx.stroke();
    }
    ctx.globalAlpha = 1;
  } else {
    riSoldierBody(ctx, t, walkPh, {
      uni: ro ? ROBRAUN : (volks ? VOLKS : (de ? FELDGR : EUNI)),
      head: type === 'banzai' ? (de ? { stahl:true } : { band: true })
           : (ro ? { cap: ROBRAUN }
           : (volks ? { cap: '#5c594e' }
           : (type === 'officer' ? { cap: de ? FELDGR : true } : (de ? { stahl:true } : {})))),
    });
    /* 国民掷弹兵：破旧大衣下摆+围巾 */
    if (volks && !e.dead){
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(-13, -30); ctx.lineTo(-15, -14); ctx.lineTo(-4, -16); ctx.closePath();
      ctx.fillStyle = VOLKS; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.stroke();
      seg(ctx, -10, -46, 10, -46, 3.2, '#8a8065');
      ctx.restore();
    }
    /* 冻伤德军：裹毯披肩 + 冰霜 */
    if (frost && !e.dead){
      ctx.save();
      ctx.globalAlpha = 0.92;
      ctx.beginPath();
      ctx.moveTo(-14, -46); ctx.quadraticCurveTo(0, -56, 14, -46);
      ctx.lineTo(16, -28); ctx.quadraticCurveTo(0, -22, -16, -28); ctx.closePath();
      ctx.fillStyle = '#8f8b7d'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke();
      hatch(ctx, -14, -44, 28, 18, INK, 6, 0.18);
      ctx.globalAlpha = 0.75;
      dot(ctx, -10, -50, 1.6, '#dfe8ea'); dot(ctx, 6, -52, 1.8, '#dfe8ea'); dot(ctx, 12, -30, 1.4, '#dfe8ea');
      ctx.restore();
    }
    /* ---- 附件 ---- */
    if (type === 'infantry' || type === 'crate' || type === 'plate' || type === 'officer' || type === 'door' || type === 'ladder' || type === 'banzai' || type === 'boat'){
      // 步枪（斜持）；罗军溃兵溃逃不带枪
      if (type === 'banzai'){
        seg(ctx, -4, -40, -44, -30, 3.4, WOOD);       // 端枪前刺
        seg(ctx, -44, -30, -58, -27, 2.6, STEEL);     // 刺刀
        seg(ctx, -8, -30, -30, -32, 3, EUNI);
        // 冲刺线
        ctx.globalAlpha = 0.35;
        seg(ctx, 22, -44, 40, -46, 2, INK); seg(ctx, 22, -24, 42, -24, 2, INK);
        ctx.globalAlpha = 1;
      } else if (ro && !e.dead){
        // 罗军溃兵：空手抱头溃逃
        ctx.globalAlpha = 0.3;
        seg(ctx, 24, -46, 44, -44, 2, INK); seg(ctx, 26, -26, 46, -28, 2, INK);
        ctx.globalAlpha = 1;
        dot(ctx, 4, -52, 3.2, SKIN); dot(ctx, 10, -52, 3.2, SKIN);   // 抱头双手
      } else {
        seg(ctx, 14, -48, -18, -22, 3.4, WOOD);
        seg(ctx, -13, -24, -24, -14, 2.6, STEEL);
      }
    }
    if (type === 'digger'){
      // 工兵镐扛肩 + 背包
      seg(ctx, 12, -34, 34, -56, 3, WOOD);
      seg(ctx, 30, -58, 38, -50, 3, STEEL);
      box(ctx, 6, -50, 12, 18, EUNI_D, 2.2);
      dot(ctx, 24, -34, 3, SKIN);
    }
    if (type === 'flagbearer'){
      seg(ctx, 12, -12, 12, -78, 2.6, WOOD);
      if (de){
        // 德军军旗（深灰燕尾旗）
        ctx.beginPath(); ctx.moveTo(12, -78); ctx.lineTo(-14 + Math.sin(t*6)*3, -66); ctx.lineTo(-14 + Math.sin(t*6)*3, -54); ctx.lineTo(12, -56); ctx.closePath();
        ctx.fillStyle = '#3a4038'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke();
        seg(ctx, -12, -60, 8, -62, 3, '#ece5d2');
        seg(ctx, -12, -56, 8, -58, 1.6, '#ece5d2');
      } else {
        ctx.beginPath(); ctx.moveTo(12, -78); ctx.lineTo(-16 + Math.sin(t*6)*3, -68); ctx.lineTo(12, -58); ctx.closePath();
        ctx.fillStyle = '#d8cdb4'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke();
      }
      rr(ctx, -12, -36, 22, 6, 2); ctx.fillStyle = de ? '#3a4038' : RED; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
    }
    if (type === 'crate' && fullHp){
      box(ctx, -17, -78, 34, 20, WOOD, 2.4);
      seg(ctx, -17, -71, 17, -71, 1.8, '#6d5233');
      seg(ctx, -9, -58, -9, -74, 1.8, INK); seg(ctx, 9, -58, 9, -74, 1.8, INK);
    }
    if (type === 'plate' && fullHp){
      box(ctx, -22, -56, 16, 34, STEEL, 2.4);       // 胸前钢板
      hatch(ctx, -22, -56, 16, 34, INK, 6, 0.25);
      box(ctx, 10, -52, 14, 30, EUNI_D, 2.2);       // 背包架
    }
    if (type === 'officer'){
      if (fullHp){
        box(ctx, -26, -44, 22, 16, '#ece5d2', 2);   // 作战地图
        seg(ctx, -20, -38, -12, -32, 1.6, '#8f8a7a'); seg(ctx, -18, -32, -10, -40, 1.6, '#8f8a7a');
        seg(ctx, -4, -40, -18, -34, 2.6, de ? FELDGR : EUNI);
      }
    }
    if (type === 'door' && e.shield > 0){
      box(ctx, -38, -64, 14, 62, '#a08055', 3);     // 门板
      hatch(ctx, -38, -64, 14, 62, INK, 7, 0.15);
      seg(ctx, -36, -50, -26, -50, 2.4, STEEL); seg(ctx, -36, -18, -26, -18, 2.4, STEEL);
      dot(ctx, -31, -34, 2.4, STEEL);
    }
    if (type === 'ladder' && !e.ladderDone){
      seg(ctx, 30, -78, -34, -4, 2.6, '#96803f');
      seg(ctx, 38, -74, -26, 0, 2.6, '#96803f');
      for (let i=0;i<5;i++){
        const k = i/4;
        seg(ctx, 30+( -64)*k + 8*(1-k)*0.2, -78 + 74*k, 38 + (-64)*k - 8*(1-k)*0.2, -74 + 74*k, 2.2, '#96803f');
      }
    }
    if (type === 'swimmer'){
      for (let i=0;i<2;i++){
        const ph = ((t*1.2 + i*0.5) % 1);
        ctx.globalAlpha = 0.4;
        ctx.beginPath(); ctx.ellipse(0, -2 - ph*6, 6 + ph*8, 2.4, 0, 0, 6.28);
        ctx.strokeStyle = '#cfe0e6'; ctx.lineWidth = 1.6; ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    if (type === 'boat' && e.vaulted){
      // 弃舟后滴水
      ctx.globalAlpha = 0.4;
      dot(ctx, -6, -8 - ((t*30)%8), 1.6, '#cfe0e6');
      ctx.globalAlpha = 1;
    }
  }
  // 减速泛蓝
  if (e.slowT > 0 && !e.dead){
    ctx.globalAlpha = 0.30;
    rr(ctx, -26, -66, 44, 66, 8); ctx.fillStyle = '#5d86a8'; ctx.fill();
    ctx.globalAlpha = 1;
  }
  if (e.hitFlash > 0 && !e.dead){
    ctx.globalAlpha = 0.5 * (e.hitFlash / 0.1);
    rr(ctx, -24, -62, 40, 62, 8); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  drawEnBar(ctx, e);
}

/* ---------- 敌军血条（头顶常显；门板盾单独一条） ---------- */
function drawEnBar(ctx, e){
  if (e.dead) return;
  /* 设置：敌军血条「受损时显示」模式 */
  if (typeof SET !== 'undefined' && SET && SET.bars === 'damaged' && e.hp >= e.maxHp - 0.5) return;
  const spec = EN[e.type];
  const w = 40, x = e.x - w/2;
  let y = e.y - 80;
  const deT = e.type.indexOf('de_') === 0;
  if (e.type === 'crusher' || e.type === 'de_panzer' || e.type === 'de_tiger' || e.type === 'de_stug' || e.type === 'de_ferd' || e.type === 'de_panther' || e.type === 'ro_tank') y = e.y - 66;
  else if (e.type === 'de_wespe') y = e.y - 62;
  else if (e.digging) y = e.y - 34;
  else if (e.type === 'pogo' && e.stilts) y = e.y - 100;
  else if ((e.type === 'boat' || e.type === 'de_boat') && !e.vaulted) y = e.y - 112;
  else if (e.type === 'crate' || e.type === 'ladder' || e.type === 'flagbearer' || deT && (e.type === 'de_crate' || e.type === 'de_flag')) y = e.y - 92;
  if (e.shield > 0){
    ctx.fillStyle = 'rgba(30,24,16,.88)'; ctx.fillRect(x - 1, y - 7, w + 2, 6);
    ctx.fillStyle = '#9fb6c4';
    ctx.fillRect(x, y - 6, w * Math.min(1, Math.max(0, e.shield / (spec.shield || 1))), 3.5);
  }
  ctx.fillStyle = 'rgba(30,24,16,.88)'; ctx.fillRect(x - 1, y - 1, w + 2, 6);
  /* V1.8.1：分母改用本单位实际满血（精锐档 hp×1.3 原先会画出条框外 30%） */
  const frac = Math.min(1, Math.max(0, e.hp / (e.maxHp || spec.hp)));
  ctx.fillStyle = frac > 0.5 ? '#63a33d' : (frac > 0.25 ? '#e0a422' : REDL);
  ctx.fillRect(x, y, w * frac, 3.5);
}

/* ---------- 装甲推土车 ---------- */
function drawCrusher(ctx, e, t){
  if (e.dead){
    const f = Math.max(0, e.deathT);
    ctx.globalAlpha = Math.min(1, f / 0.35);
    ctx.rotate(0.4 * (1 - f));
  }
  const wob = Math.sin(t*12 + e.phase) * 1.5;
  // 车体
  box(ctx, -36, -44 + wob, 64, 26, STEEL, 3.4);
  box(ctx, -14, -56 + wob, 34, 14, STEEL_D, 2.8);            // 驾驶舱
  dot(ctx, 8, -49 + wob, 4, '#8fa08a');                       // 观察窗
  hatch(ctx, -36, -44 + wob, 64, 26, INK, 7, 0.2);
  // 铆钉
  for (let i=0;i<5;i++) dot(ctx, -30 + i*13, -38 + wob, 1.5, INK);
  // 铲刀（朝行进方向·左）
  ctx.beginPath(); ctx.moveTo(-38, -16); ctx.lineTo(-46, -6); ctx.lineTo(-38, -2); ctx.closePath();
  ctx.fillStyle = '#565851'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
  // 车轮
  for (let i=0;i<3;i++){
    const wx = -26 + i*22, wy = -12;
    ctx.beginPath(); ctx.arc(wx, wy, 9, 0, 6.28);
    ctx.fillStyle = '#3a352c'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.save(); ctx.translate(wx, wy); ctx.rotate(t*4);
    seg(ctx, -7, 0, 7, 0, 2, '#6d675d'); seg(ctx, 0, -7, 0, 7, 2, '#6d675d');
    ctx.restore();
  }
  // 履带挡泥板
  seg(ctx, -34, -20 + wob, 26, -20 + wob, 4, '#565851');
  // 排气烟
  const heavy = e.hp < (e.maxHp || EN.crusher.hp) * 0.5;   // V1.8.1：按本单位实际满血判定重伤冒烟
  ctx.globalAlpha = heavy ? 0.55 : 0.3;
  for (let i=0;i<(heavy?3:2);i++){
    const ph = ((t*0.8 + i*0.33) % 1);
    ctx.beginPath(); ctx.arc(26 + ph*14, -54 - ph*18 - wob, 3 + ph*5, 0, 6.28);
    ctx.fillStyle = '#5b5245'; ctx.fill();
  }
  ctx.globalAlpha = 1;
  if (e.slowT > 0 && !e.dead){
    ctx.globalAlpha = 0.3; rr(ctx, -46, -60, 82, 52, 8); ctx.fillStyle = '#5d86a8'; ctx.fill(); ctx.globalAlpha = 1;
  }
}
/* 日军士兵躯干（面朝左），feet 在 (0,0) */
function riSoldierBody(ctx, t, walkPh, opt){
  opt = opt || {};
  const yy = opt.yy == null ? 0 : opt.yy; // 抬升（乘舟）
  if (!opt.noLegs){
    seg(ctx, -5, yy-26, -5 + walkPh, yy, 5);
    seg(ctx, 5, yy-26, 5 - walkPh*0.6, yy, 5);
    ctx.strokeStyle = '#4a3f28'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(-6, yy-12); ctx.lineTo(-6, yy-2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(6, yy-12); ctx.lineTo(6, yy-2); ctx.stroke();
  }
  box(ctx, -11, yy-50, 22, 26, opt.uni || EUNI, 3);
  hatch(ctx, -11, yy-50, 22, 26, INK, 8, 0.12);
  seg(ctx, -11, yy-40, 11, yy-40, 2.4, '#4a3f28');
  dot(ctx, 0, yy-44, 3.4, opt.uni ? '#b0b6a8' : '#c9a23a'); // 领章（德军灰白）
  riHead(ctx, 0, yy-58, opt.head || {});
}

/* ---------- 竹梯（架在格子上） ---------- */
function drawLadderAt(ctx, cx, cy){
  ctx.save(); ctx.translate(cx, cy);
  seg(ctx, -10, -2, 26, -76, 2.6, '#96803f');
  seg(ctx, 4, 0, 40, -74, 2.6, '#96803f');
  for (let i=0;i<5;i++){
    const k = i/5;
    seg(ctx, -10 + 36*k, -2 - 74*k*0.98, 4 + 36*k, 0 - 74*k*0.98, 2.2, '#96803f');
  }
  ctx.restore();
}

/* ---------- 德军黄蜂自行火炮（驻停曲射） ---------- */
function drawWespe(ctx, e, t){
  if (e.dead){
    const f = Math.max(0, e.deathT);
    ctx.globalAlpha = Math.min(1, f / 0.35);
    ctx.rotate(0.3 * (1 - f));
  }
  const wob = Math.sin(t*7 + e.phase) * 0.8;
  // 履带底盘
  box(ctx, -34, -20 + wob, 64, 16, '#3a352c', 3);
  for (let i=0;i<4;i++){ dot(ctx, -24 + i*16, -12 + wob, 4.6, '#6d675d'); dot(ctx, -24 + i*16, -12 + wob, 1.6, '#3a352c'); }
  // 车体 + 敞开战斗室
  box(ctx, -30, -36 + wob, 58, 18, '#5a6552', 3);
  hatch(ctx, -30, -36 + wob, 58, 18, INK, 7, 0.16);
  box(ctx, -14, -48 + wob, 30, 14, '#4a5145', 2.6);   // 战斗室后墙
  // 105mm榴弹炮（仰角朝左上）
  ctx.save();
  ctx.translate(-10, -46 + wob);
  ctx.rotate(-0.38);
  seg(ctx, 0, 0, -40, 0, 4.2, STEEL);
  dot(ctx, -40, 0, 4.4, STEEL_D);
  dot(ctx, 0, 0, 5, '#3a4038');
  ctx.restore();
  // 炮口火光（开火瞬间）
  if (e.hitFlash > 0.08){ star(ctx, -52, -58 + wob, 9, YELLOW); }
  // 车长（探出战斗室，钢盔）
  riHead(ctx, 4, -52 + wob, { stahl:true });
  const heavy = e.hp < (e.maxHp || EN[e.type].hp) * 0.5;   // V1.8.1：同上，避免精锐档提前冒烟
  ctx.globalAlpha = heavy ? 0.5 : 0.25;
  for (let i=0;i<(heavy?3:2);i++){
    const ph = ((t*0.8 + i*0.33) % 1);
    ctx.beginPath(); ctx.arc(26 + ph*12, -46 - ph*14 - wob, 3 + ph*4, 0, 6.28);
    ctx.fillStyle = '#5b5245'; ctx.fill();
  }
  ctx.globalAlpha = 1;
  if (e.slowT > 0 && !e.dead){
    ctx.globalAlpha = 0.3; rr(ctx, -40, -64, 76, 62, 8); ctx.fillStyle = '#5d86a8'; ctx.fill(); ctx.globalAlpha = 1;
  }
}

/* ---------- 德军坦克族（四号/虎式/黑豹/三突/斐迪南/罗军R-2） ---------- */
function drawTank(ctx, e, t){
  const rt = e.type;
  const mode = rt === 'de_tiger' ? 'tiger' : rt === 'de_panther' ? 'panther'
             : rt === 'de_stug' ? 'stug' : rt === 'de_ferd' ? 'ferd'
             : rt === 'ro_tank' ? 'ro2' : 'iv';
  const S = mode === 'tiger' ? 1.14 : mode === 'ferd' ? 1.1
          : mode === 'panther' ? 1.06 : mode === 'ro2' ? 0.82
          : mode === 'stug' ? 0.94 : 1;
  const HULL = mode === 'ferd' ? '#56594f' : mode === 'panther' ? '#4f5650'
             : mode === 'ro2' ? '#7a6a4a' : mode === 'stug' ? '#56594f' : '#5a6552';
  ctx.save();
  if (S !== 1) ctx.scale(S, S);
  if (e.dead){
    const f = Math.max(0, e.deathT);
    ctx.globalAlpha = Math.min(1, f / 0.35);
    ctx.rotate(0.3 * (1 - f));
  }
  const wob = Math.sin(t*10 + e.phase) * 1.2;
  // 履带
  box(ctx, -40, -22 + wob, 76, 18, '#3a352c', 3.2);
  for (let i=0;i<5;i++){
    const wx = -30 + i*15;
    dot(ctx, wx, -13 + wob, 5.6, '#6d675d');
    dot(ctx, wx, -13 + wob, 2, '#3a352c');
  }
  ctx.save(); ctx.translate(-40, -13+wob); ctx.rotate(t*5);
  seg(ctx, 0, -8, 0, 8, 2.6, '#6d675d'); ctx.restore();
  ctx.save(); ctx.translate(36, -13+wob); ctx.rotate(t*5);
  seg(ctx, 0, -8, 0, 8, 2.6, '#6d675d'); ctx.restore();
  // 车体（防磁纹：虎/黑豹/三突/斐迪南）
  box(ctx, -38, -44 + wob, 72, 24, HULL, 3.2);
  hatch(ctx, -38, -44 + wob, 72, 24, INK, 7, 0.16);
  if (mode === 'tiger' || mode === 'panther' || mode === 'stug' || mode === 'ferd'){
    ctx.globalAlpha = 0.35; ctx.strokeStyle = INK; ctx.lineWidth = 1.2;
    for (let zy = -42; zy < -22; zy += 6){
      ctx.beginPath();
      for (let zx = -36; zx <= 30; zx += 8){ ctx.lineTo(zx, zy + ((zx/8)%2)*2.5); }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  // 前装甲斜面（朝左；黑豹大倾斜/斐迪南厚块/罗军薄）
  if (mode === 'panther'){
    ctx.beginPath(); ctx.moveTo(-38, -42+wob); ctx.lineTo(-52, -30+wob); ctx.lineTo(-38, -24+wob); ctx.closePath();
    ctx.fillStyle = '#48503f'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.8; ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(-38, -42+wob); ctx.lineTo(-46, -28+wob); ctx.lineTo(-38, -24+wob); ctx.closePath();
    ctx.fillStyle = mode === 'ro2' ? '#6d5e42' : '#4a5145'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.8; ctx.stroke();
  }
  /* ---- 炮塔/战斗室 + 火炮 ---- */
  if (mode === 'stug' || mode === 'ferd' || mode === 'ro2'){
    // 无塔突击炮/歼击车：低矮固定战斗室
    const ch = mode === 'ferd' ? 18 : 12;
    box(ctx, -12, -46 - ch + wob, 46, ch + 8, mode === 'ro2' ? '#6d5e42' : '#43483f', 2.6);
    hatch(ctx, -12, -46 - ch + wob, 46, ch + 8, INK, 6, 0.15);
    const gl = mode === 'ferd' ? 66 : mode === 'ro2' ? 34 : 48;
    const gr = mode === 'ferd' ? 5.6 : mode === 'ro2' ? 3.2 : 4.4;
    seg(ctx, -14, -44 + wob, -14 - gl, -40 + wob, gr, STEEL);
    if (mode === 'ferd') seg(ctx, -14 - gl - 7, -40.5 + wob, -14 - gl + 4, -41.5 + wob, gr + 1.6, STEEL_D);
    else dot(ctx, -14 - gl, -40 + wob, 4, STEEL_D);
  } else {
    // 有塔坦克
    box(ctx, -6, -58 + wob, 34, 16, '#4a5145', 2.8);
    if (mode === 'tiger'){
      box(ctx, -34, -50 + wob, 16, 12, '#43483f', 2.2);        // 炮塔尾舱
      seg(ctx, -8, -50 + wob, -70, -44 + wob, 5.2, STEEL);     // 88炮
      seg(ctx, -76, -44.5 + wob, -64, -45.5 + wob, 8, STEEL_D); // 制退器
      seg(ctx, -36, -26 + wob, 32, -26 + wob, 5, '#43483f');    // 侧裙板
      for (let i=0;i<3;i++){ dot(ctx, -24 + i*22, -25 + wob, 1.8, INK); }
    } else if (mode === 'panther'){
      box(ctx, -30, -56 + wob, 14, 10, '#43483f', 2.2);         // 尾舱
      seg(ctx, -8, -50 + wob, -66, -46 + wob, 4.8, STEEL);      // 75长炮
      seg(ctx, -72, -46.6 + wob, -60, -47.4 + wob, 7, STEEL_D);
      // 炮塔斜面
      ctx.beginPath(); ctx.moveTo(-6, -58+wob); ctx.lineTo(-14, -50+wob); ctx.lineTo(-6, -46+wob); ctx.closePath();
      ctx.fillStyle = '#43483f'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke();
    } else {
      seg(ctx, -8, -50 + wob, -56, -46 + wob, 4.4, STEEL);
      dot(ctx, -56, -46 + wob, 4, STEEL_D);
    }
    dot(ctx, 6, -50 + wob, 3, '#e8dcc0');
  }
  if (mode !== 'ro2') dot(ctx, 6, -50 + wob, 3, '#e8dcc0');
  // 挡泥板 + 工具箱
  seg(ctx, -40, -26 + wob, 34, -26 + wob, 4, '#4a5145');
  box(ctx, 8, -40 + wob, 16, 8, '#3a4038', 2);
  // 排气烟
  const heavy = e.hp < (e.maxHp || EN[e.type].hp) * 0.5;   // V1.8.1：同上，避免精锐档提前冒烟
  ctx.globalAlpha = heavy ? 0.55 : 0.3;
  for (let i=0;i<(heavy?3:2);i++){
    const ph = ((t*0.8 + i*0.33) % 1);
    ctx.beginPath(); ctx.arc(32 + ph*12, -50 - ph*16 - wob, 3 + ph*4.5, 0, 6.28);
    ctx.fillStyle = '#5b5245'; ctx.fill();
  }
  ctx.globalAlpha = 1;
  if (e.slowT > 0 && !e.dead){
    ctx.globalAlpha = 0.3; rr(ctx, -46, -62, 84, 60, 8); ctx.fillStyle = '#5d86a8'; ctx.fill(); ctx.globalAlpha = 1;
  }
  ctx.restore();
}

/* ---------- T-34 反冲击（L12 专用） ---------- */
function drawT34(ctx, s, t){
  ctx.save(); ctx.translate(s.x, s.y);
  const wob = Math.sin(t*11) * 1.4;
  // 履带
  box(ctx, -42, -24 + wob, 82, 20, '#3a352c', 3.4);
  for (let i=0;i<5;i++){ dot(ctx, -32 + i*16, -14 + wob, 6, '#6d675d'); dot(ctx, -32 + i*16, -14 + wob, 2, '#3a352c'); }
  // 斜面车体（朝右行进）
  box(ctx, -40, -46 + wob, 78, 24, '#5d6a4a', 3.2);
  ctx.beginPath(); ctx.moveTo(38, -44+wob); ctx.lineTo(48, -28+wob); ctx.lineTo(38, -24+wob); ctx.closePath();
  ctx.fillStyle = '#6d7752'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.8; ctx.stroke();
  // 炮塔朝右
  box(ctx, -10, -62 + wob, 36, 17, '#6d7752', 2.8);
  seg(ctx, 24, -54 + wob, 66, -50 + wob, 4.4, STEEL);
  dot(ctx, 66, -50 + wob, 4, STEEL_D);
  // 红星
  star(ctx, 6, -54 + wob, 5, RED);
  // 履带扬雪
  ctx.globalAlpha = 0.5;
  for (let i=0;i<3;i++){
    const ph = ((t*1.6 + i*0.33) % 1);
    ctx.beginPath(); ctx.arc(-44 - ph*26, -8 - ph*14, 3 + ph*5, 0, 6.28);
    ctx.fillStyle = '#e8e2cd'; ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---------- 反冲击小队（割草机） ---------- */
function drawSweeper(ctx, s, t, isWater){
  ctx.save(); ctx.translate(s.x, s.y);
  if (G.level && G.level.sweeperTank && !isWater){ drawT34(ctx, s, t); ctx.restore(); return; }
  if (isWater){
    const bob = Math.sin(t*5)*2;
    ctx.translate(0, bob);
    ctx.beginPath(); ctx.moveTo(-34, -8); ctx.quadraticCurveTo(0, 10, 34, -8); ctx.closePath();
    ctx.fillStyle = WOOD; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    seg(ctx, -34, -8, 34, -8, 3.4);
    box(ctx, -8, -34, 18, 8, STEEL, 2.4);
    seg(ctx, 10, -30, 30, -30, 3, STEEL);
    box(ctx, -14, -48, 18, 16, GREEN, 2.6);
    guoHead(ctx, -6, -56, 'helmet');
  } else {
    const run = Math.sin(t*14)*10;
    seg(ctx, -6, -26, -6 - run, 0, 5); seg(ctx, 6, -26, 6 + run, 0, 5);
    box(ctx, -11, -50, 22, 26, GREEN, 3);
    guoHead(ctx, 2, -58, 'helmet');
    seg(ctx, 0, -44, -44, -30, 3.4, WOOD);
    seg(ctx, -44, -30, -60, -26, 2.6, STEEL);
    guoArm(ctx, -6, -46, -30, -36);
    // 红袖标（反冲击标识）
    rr(ctx, -11, -46, 7, 6, 2); ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.globalAlpha = 0.35;
    seg(ctx, 18, -50, 34, -52, 2, INK); seg(ctx, 18, -20, 36, -18, 2, INK);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

/* ---------- 补给空投 ---------- */
function drawDrop(ctx, d, t, skin){
  ctx.save(); ctx.translate(d.x, d.y);
  if (d.vy < 0 || !d.landed){
    const sway = Math.sin(t*3 + d.x) * 0.12;
    ctx.rotate(sway);
  }
  const blink = d.life < 3 ? (Math.sin(t*10) > 0 ? 1 : 0.35) : 1;
  ctx.globalAlpha = blink;
  if (skin === 'sh'){
    // 市民包裹
    box(ctx, -10, -14, 20, 16, '#cbb488', 2.4);
    seg(ctx, -10, -6, 10, -6, 2.2, RED);
    seg(ctx, 0, -14, 0, 2, 2.2, RED);
    dot(ctx, 0, -6, 2.6, RED);
  } else {
    // 空投木箱＋小伞
    box(ctx, -8, -10, 16, 13, WOOD, 2.2);
    seg(ctx, -8, -4, 8, -4, 1.6, '#6d5233');
    if (!d.landed){
      ctx.beginPath(); ctx.arc(0, -26, 14, Math.PI, 0); ctx.closePath();
      ctx.fillStyle = '#d8cdb4'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
      seg(ctx, -13, -26, -7, -10, 1.4); seg(ctx, 13, -26, 7, -10, 1.4); seg(ctx, 0, -26, 0, -10, 1.4);
    }
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---------- 子弹 ---------- */
function drawBullet(ctx, b){
  if (b.fire){
    ctx.save(); ctx.translate(b.x, b.y);
    ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(-6, -4); ctx.lineTo(-3, 0); ctx.lineTo(-6, 4); ctx.closePath();
    ctx.fillStyle = REDL; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.6; ctx.stroke();
    dot(ctx, 2, 0, 2.6, YELLOW);
    ctx.globalAlpha = 0.35; seg(ctx, -10, 0, -22, 0, 3, YELLOW); ctx.globalAlpha = 1;
    ctx.restore();
  } else {
    /* —— V7.8 曳光增强：渐隐长尾 + 淡黄光晕 —— */
    ctx.globalAlpha = 0.10; dot(ctx, b.x - 3, b.y, 8.5, '#ffe9b0'); ctx.globalAlpha = 1;
    dot(ctx, b.x, b.y, 4.4, b.slow ? '#9db8c9' : '#f2e6c8');
    ctx.strokeStyle = INK; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.arc(b.x, b.y, 4.4, 0, 6.28); ctx.stroke();
    ctx.globalAlpha = 0.5; seg(ctx, b.x-7, b.y, b.x-15, b.y, 2.4, '#f2e6c8');
    ctx.globalAlpha = 0.22; seg(ctx, b.x-15, b.y, b.x-26, b.y, 1.8, '#e8dcc0'); ctx.globalAlpha = 1;
  }
}

/* ---------- 特效 ---------- */
function drawEffect(ctx, fx, t){
  const f = fx.age / fx.dur;
  ctx.save();
  if (fx.kind === 'boom'){
    const r = 18 + f * 60;
    ctx.globalAlpha = Math.max(0, 1 - f);
    ctx.strokeStyle = INK; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(fx.x, fx.y, r, 0, 6.28); ctx.stroke();
    ctx.strokeStyle = REDL; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(fx.x, fx.y, r*0.7, 0, 6.28); ctx.stroke();
    dot(ctx, fx.x, fx.y, 12*(1-f), YELLOW);
    ctx.globalAlpha = Math.max(0, 0.5 - f*0.5);
    for (let i=0;i<4;i++){
      const a = i*1.57 + 0.7;
      dot(ctx, fx.x + Math.cos(a)*r*0.9, fx.y + Math.sin(a)*r*0.9 - f*20, 6*(1-f), '#6f6f6a');
    }
    ctx.globalAlpha = 1;
  }
  else if (fx.kind === 'muzzle'){ star(ctx, fx.x, fx.y, 6*(1-f), YELLOW); }
  else if (fx.kind === 'slash'){
    ctx.globalAlpha = Math.max(0, 1 - f*1.6);
    ctx.strokeStyle = '#f4eeda'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(fx.x, fx.y - 20, 34, -1.2, 1.0); ctx.stroke();
    ctx.strokeStyle = INK; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(fx.x, fx.y - 20, 34, -1.2, 1.0); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  else if (fx.kind === 'plus25' || fx.kind === 'plus15'){
    ctx.globalAlpha = Math.max(0, 1 - f);
    ctx.font = 'bold 17px "KaiTi",serif'; ctx.textAlign = 'center';
    ctx.fillStyle = '#c1912f'; ctx.strokeStyle = INK; ctx.lineWidth = 0.8;
    ctx.fillText(fx.kind === 'plus25' ? '+25' : '+' + (fx.val || 15), fx.x, fx.y - f*36);
    ctx.globalAlpha = 1;
  }
  else if (fx.kind === 'spark'){
    /* V7.8 命中火花：四散短线，随进度外扩渐隐 */
    ctx.globalAlpha = Math.max(0, 1 - f);
    for (let i=0;i<5;i++){
      const a = i * 1.256 + 0.6;
      const r1 = 4 + f * 16, r2 = r1 + 5 * (1 - f);
      seg(ctx, fx.x + Math.cos(a)*r1, fx.y + Math.sin(a)*r1,
             fx.x + Math.cos(a)*r2, fx.y + Math.sin(a)*r2, 1.8, i % 2 ? '#ffd27a' : '#f2a13c');
    }
    dot(ctx, fx.x, fx.y, 2.4 * (1 - f) + 1, '#ffe9b0');
    ctx.globalAlpha = 1;
  }
  else if (fx.kind === 'woodbreak'){
    ctx.globalAlpha = Math.max(0, 1 - f);
    for (let i=0;i<5;i++){
      const a = 2.4 + i*0.35;
      seg(ctx, fx.x, fx.y, fx.x + Math.cos(a)*38*f + i*3, fx.y + Math.sin(a)*30*f, 2.6, WOOD);
    }
    ctx.globalAlpha = 1;
  }
  else if (fx.kind === 'firepop'){
    // 燃烧瓶落点（火团）
    ctx.globalAlpha = Math.max(0, 1 - f);
    ctx.beginPath(); ctx.arc(fx.x, fx.y, 10 + f*24, 0, 6.28);
    ctx.fillStyle = 'rgba(192,85,70,'+(0.55*(1-f))+')'; ctx.fill();
    ctx.strokeStyle = REDL; ctx.lineWidth = 2.6; ctx.stroke();
    for (let i=0;i<5;i++){
      const a = 1.6 + i*0.85;
      seg(ctx, fx.x, fx.y, fx.x + Math.cos(a)*26*f, fx.y - Math.sin(a)*30*f, 2.6, YELLOW);
    }
    ctx.globalAlpha = 1;
  }
  else if (fx.kind === 'shellpop'){
    // 迫击炮落点
    ctx.globalAlpha = Math.max(0, 1 - f);
    ctx.beginPath(); ctx.arc(fx.x, fx.y, 12 + f*34, 0, 6.28);
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.arc(fx.x, fx.y, 6 + f*20, 0, 6.28);
    ctx.fillStyle = 'rgba(192,85,70,'+(0.6*(1-f))+')'; ctx.fill();
    for (let i=0;i<6;i++){
      const a = 1.2 + i*0.7;
      seg(ctx, fx.x, fx.y, fx.x + Math.cos(a)*36*f, fx.y - Math.sin(a)*30*f, 2.4, '#8a7454');
    }
    ctx.globalAlpha = 1;
  }
  else if (fx.kind === 'rowfire'){
    const y = fx.y, a = Math.max(0, 1 - f);
    ctx.globalAlpha = 0.75 * a;
    ctx.fillStyle = REDL;
    ctx.fillRect(GRID.x0 - 16, y - 26, GRID.cw * 9 + 24, 46);
    ctx.globalAlpha = a;
    for (let i=0;i<14;i++){
      const fxp = GRID.x0 - 10 + i*58 + (i%2)*18;
      const h = 26 + ((i*37)%20);
      ctx.beginPath(); ctx.moveTo(fxp, y+14); ctx.lineTo(fxp+9, y+14-h*a); ctx.lineTo(fxp+18, y+14); ctx.closePath();
      ctx.fillStyle = YELLOW; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.6; ctx.stroke();
    }
    ctx.globalAlpha = a * 0.5;
    for (let i=0;i<8;i++){
      ctx.beginPath(); ctx.arc(GRID.x0 + i*105 + 30, y - 20 - f*40, 5 + f*9, 0, 6.28);
      ctx.fillStyle = '#4a4038'; ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  else if (fx.kind === 'wrench'){
    // 磁脉冲掠取
    ctx.globalAlpha = Math.max(0, 1 - f);
    ctx.strokeStyle = '#8fb6c4'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(fx.x, fx.y, 14 + f*54, 0, 6.28); ctx.stroke();
    ctx.strokeStyle = INK; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(fx.x, fx.y, 8 + f*36, 0, 6.28); ctx.stroke();
    for (let i=0;i<3;i++){
      const a = 0.8 + i*1.9;
      seg(ctx, fx.x, fx.y, fx.x + Math.cos(a)*30*f, fx.y - 40*f - i*10, 2.4, STEEL);
    }
    ctx.globalAlpha = 1;
  }
  else if (fx.kind === 'crush'){
    // 碾压尘土
    ctx.globalAlpha = Math.max(0, 1 - f);
    for (let i=0;i<6;i++){
      const ph = (i*0.167 + f*0.6) % 1;
      ctx.beginPath(); ctx.arc(fx.x - 20 + i*12, fx.y - 8 - ph*26, 4 + ph*8, 0, 6.28);
      ctx.fillStyle = '#8f8066'; ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

/* ---------- 曲射炮弹 ---------- */
function drawShell(ctx, s, t){
  const k = Math.min(1, s.t / s.dur);
  const x = s.x0 + (s.tx - s.x0) * k;
  const y = s.y0 - Math.sin(Math.PI * k) * 130;
  dot(ctx, x, y, 5, INK);
  dot(ctx, x - 2, y - 2, 1.8, '#8fa08a');
  ctx.globalAlpha = 0.4;
  for (let i=1;i<=3;i++){
    dot(ctx, x - i*9, y + i*2 + Math.sin(Math.PI*Math.max(0,k-i*0.03))*2, 2.4 - i*0.5, '#8f8a7a');
  }
  ctx.globalAlpha = 1;
}

/* ================================================================
   地形
   ================================================================ */
/* ---------- 地形渲染（静态层缓存 + 动态层） ---------- */
function drawTerrain(ctx, lv, env, t, H){
  const qkey = (typeof SET !== 'undefined' && SET) ? SET.quality : 'high';
  const key = lv.id + '|' + qkey + '|' + H;
  if (!G.terrainCache || G.terrainCacheKey !== key){
    const c = document.createElement('canvas'); c.width = 960; c.height = H;
    const cx = c.getContext('2d');
    drawTerrainStatic(cx, lv, env, H);
    G.terrainCache = c; G.terrainCacheKey = key;
  }
  ctx.drawImage(G.terrainCache, 0, 0);
  drawTerrainDyn(ctx, lv, env, t, H);
}
/* 动态覆盖层：雪花 / 水面波光 / 装饰小船 / 废墟烟 */
function drawTerrainDyn(ctx, lv, env, t, H){
  const { x0, y0, ch, cols } = GRID;
  const gridW = GRID.cw * cols;
  const qn = (typeof SET !== 'undefined' && SET) ? (SET.quality === 'high' ? 1 : SET.quality === 'med' ? 0.55 : 0) : 1;
  if (lv.terrain === 'ms' && qn > 0){
    const n = Math.round(26 * qn);
    for (let i=0;i<n;i++){
      const sx = (i*137 + t*26*(1+(i%3)*0.3)) % 960;
      const sy = (i*89 + t*38) % H;
      ctx.globalAlpha = 0.45 + (i%3)*0.15;
      dot(ctx, sx, sy, 1.2 + (i%3)*0.7, '#f2efe6');
    }
    ctx.globalAlpha = 1;
  }
  if (lv.terrain === 'dn' && qn > 0){
    /* ---- dn 第聂伯河：水面涟漪 + 漂木 ---- */
    for (const r of env.waterRows){
      const ry = y0 + r*ch;
      for (let i=0;i<Math.round(3*qn);i++){
        const wx = x0 + ((i*233 + t*10*(1+(i%2))) % gridW), wy = ry + 12 + (i%3)*9;
        ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.ellipse(wx, wy, 12, 2.6, 0, 0, 6.28);
        ctx.strokeStyle = '#cfd8da'; ctx.lineWidth = 1.6; ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    const ph = (t*0.12) % 1;
    const r0 = env.waterRows[0];
    if (r0 != null){
      ctx.save();
      ctx.translate(x0 + 40 + ph*(gridW-120), y0 + r0*ch + ch*0.55 + Math.sin(t*1.7)*2);
      ctx.rotate(0.06);
      seg(ctx, -16, 0, 16, 0, 5.2, '#6d5233');
      seg(ctx, 4, -2.6, 12, -2.6, 1.6, '#8f7a58');
      ctx.globalAlpha = 0.4;
      ctx.beginPath(); ctx.ellipse(26, 4, 9, 2.4, 0, 0, 6.28);
      ctx.strokeStyle = '#cfd8da'; ctx.lineWidth = 1.4; ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }
  if (lv.terrain === 'ds' && qn > 0){
    /* ---- V8.0 ds 沙漠：地表热浪波动 + 流沙掠影 ---- */
    const n = Math.round(5 * qn);
    for (let i=0;i<n;i++){
      const wy = y0 + 12 + (i*97 % (lv.rows*ch - 24));
      const wob = Math.sin(t*1.1 + i*1.7) * 5;
      ctx.globalAlpha = 0.06 + (i % 2)*0.03;
      ctx.fillStyle = '#f0dca4';
      ctx.fillRect(x0 + 20 + (i*151 % (gridW-140)) + wob, wy, 90, 5);
    }
    // 流沙细粒（风从右往左）
    const gn = Math.round(14 * qn);
    ctx.globalAlpha = 0.35;
    for (let i=0;i<gn;i++){
      const gx2 = x0 + gridW + 40 - ((i*173 + t*34*(1+(i%3)*0.4)) % (gridW + 80));
      const gy2 = y0 + 10 + (i*83 % (lv.rows*ch - 20));
      dot(ctx, gx2, gy2, 1 + (i % 2)*0.6, '#e0c188');
    }
    ctx.globalAlpha = 1;
    // 烈日光晕呼吸
    ctx.globalAlpha = 0.10 + Math.sin(t*0.8)*0.04;
    dot(ctx, 700, y0*0.34, 26, '#f7e3b0');
    ctx.globalAlpha = 1;
  }
  if (lv.terrain === 'tz'){
    const lastWater = env.waterRows[env.waterRows.length-1];
    if (lastWater != null){
      const by = y0 + lastWater*ch + ch - 16 + Math.sin(t*1.6)*2.4;
      ctx.save(); ctx.translate(x0 + gridW - 70, by);
      ctx.beginPath(); ctx.moveTo(-26, -6); ctx.quadraticCurveTo(0, 8, 26, -6); ctx.closePath();
      ctx.fillStyle = WOOD; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.stroke();
      seg(ctx, -26, -6, 26, -6, 2.4);
      seg(ctx, 6, -6, 6, -26, 2, WOOD);
      ctx.beginPath(); ctx.moveTo(6, -26); ctx.quadraticCurveTo(24, -22, 28, -16); ctx.lineTo(6, -16); ctx.closePath();
      ctx.fillStyle = '#cbb488'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.stroke();
      ctx.restore();
    }
    if (qn > 0){
      for (const r of env.waterRows){
        const ry = y0 + r*ch;
        for (let i=0;i<Math.round(4*qn);i++){
          const wx = x0 + ((i*211 + t*14*(1+(i%2))) % gridW), wy = ry + 14 + (i%3)*8;
          ctx.globalAlpha = 0.25;
          seg(ctx, wx, wy, wx + 16, wy, 1.4, '#cfe0e6');
        }
      }
      ctx.globalAlpha = 1;
    }
  }
  if (lv.terrain === 'sv' && qn > 0){
    // 海面涌动线
    for (const r of env.waterRows){
      const ry = y0 + r*ch;
      for (let i=0;i<Math.round(5*qn);i++){
        const wx = x0 + ((i*173 + t*18) % gridW), wy = ry + 10 + (i%4)*9;
        ctx.globalAlpha = 0.3;
        seg(ctx, wx, wy, wx + 18, wy, 1.6, '#9fc4c0');
      }
    }
    ctx.globalAlpha = 1;
  }
  if (lv.terrain === 'ruin' && qn > 0){
    // 废墟余烟（3缕）
    for (let i=0;i<Math.round(3*qn);i++){
      const sx = 180 + i*300, sy = y0 + 4;
      const ph = (t*0.22 + i*0.37) % 1;
      ctx.globalAlpha = 0.28 * (1 - ph);
      ctx.beginPath(); ctx.arc(sx + Math.sin(t*0.7 + i)*10, sy - ph*40, 4 + ph*9, 0, 6.28);
      ctx.fillStyle = '#6b675f'; ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}
function drawTerrainStatic(ctx, lv, env, H){
  const { x0, y0, cw, ch, cols } = GRID;
  const rows = lv.rows;
  const gridW = cw * cols;
  const rnd = srand(lv.id * 31 + 7);
  const t = 0;   // 静态层不随时间变化：个别块的烟雾等装饰引用 t 时取 0（动态层另有 drawTerrainDyn 负责动画）

  if (lv.terrain === 'sh'){
    /* ---- 顶带：苏州河南岸天际线 ---- */
    ctx.fillStyle = '#5b5044'; ctx.fillRect(0, 0, 960, y0);
    ctx.strokeStyle = 'rgba(20,16,10,.4)'; ctx.lineWidth = 1.4;
    for (let x=0; x<960; x+=44){ ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, 0); ctx.stroke(); }
    // 远处楼宇剪影（南岸）
    ctx.fillStyle = '#403a30';
    let bx = 180;
    while (bx < 960){
      const bw = 40 + rnd()*70, bh = 14 + rnd()*26;
      ctx.fillRect(bx, y0-bh, bw, bh);
      bx += bw + 10 + rnd()*30;
    }
    // 烟
    ctx.globalAlpha = 0.25;
    for (let i=0;i<3;i++){
      const ph = (t*0.12 + i*0.33) % 1;
      dot(ctx, 300 + i*220 + Math.sin(t+i)*8, y0 - 10 - ph*34, 6 + ph*12, '#8d8578');
    }
    ctx.globalAlpha = 1;

    /* ---- 左：四行仓库立面 ---- */
    ctx.fillStyle = '#4a4038'; ctx.fillRect(0, 0, x0-4, H);
    ctx.strokeStyle = 'rgba(15,12,8,.5)'; ctx.lineWidth = 1.6;
    for (let yy=54; yy<H; yy+=46){ seg(ctx, 0, yy, x0-4, yy, 1.6, 'rgba(15,12,8,.5)'); }
    for (let xx=26; xx<x0-4; xx+=30){ seg(ctx, xx, 0, xx, H, 1.6, 'rgba(15,12,8,.35)'); }
    // 窗
    for (let wy=10; wy<H-60; wy+=46){
      for (let wx=14; wx<x0-30; wx+=30){
        box(ctx, wx, wy, 16, 22, lv.night ? '#171b2b' : '#332e26', 1.8);
        if (lv.night && ((wx*7+wy) % 3 === 0)){
          ctx.globalAlpha = 0.8; dot(ctx, wx+8, wy+8, 2.2, '#e8c96a'); ctx.globalAlpha = 1;
        }
      }
    }
    // 弹孔
    dot(ctx, 66, 90, 5, '#241d15'); dot(ctx, 78, 96, 3, '#241d15');
    dot(ctx, 40, 200, 4, '#241d15');
    // 大门（各排共用）
    const gateY = y0 + (rows*ch)/2 - 34;
    box(ctx, 18, gateY, 84, 68, '#3a3229', 3.4);
    seg(ctx, 60, gateY, 60, gateY+68, 2.4, '#241d15');
    dot(ctx, 52, gateY+34, 3, YELLOW); dot(ctx, 68, gateY+34, 3, YELLOW);
    // 匾额
    box(ctx, 26, gateY-22, 68, 20, '#7a6450', 2.4);
    ctx.font = 'bold 15px "KaiTi","STKaiti",serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#e8dcc0';
    ctx.fillText('固 守', 60, gateY-7);
    // 楼顶旗（L2起）
    if (lv.id >= 2){
      seg(ctx, 92, 8, 92, 54, 2.6, WOOD);
      const wv = Math.sin(t*3)*4;
      ctx.beginPath(); ctx.moveTo(92, 10); ctx.quadraticCurveTo(70+wv, 14, 62+wv*0.6, 22); ctx.lineTo(92, 30); ctx.closePath();
      ctx.fillStyle = RED; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke();
      dot(ctx, 76+wv*0.5, 20, 3.4, '#ece5d2');
    }

    /* ---- 右缘：断壁 ---- */
    ctx.fillStyle = '#574a3c'; ctx.fillRect(x0+gridW+4, 0, 960-(x0+gridW+4), H);
    ctx.fillStyle = '#403a30';
    ctx.fillRect(x0+gridW+10, y0-26, 30, 26);
    ctx.fillRect(x0+gridW+34, y0-44, 14, 44);
    ctx.globalAlpha = 0.3;
    for (let yy=y0+20; yy<H; yy+=60){ dot(ctx, x0+gridW+18+rnd()*30, yy, 3+rnd()*4, '#241d15'); }
    ctx.globalAlpha = 1;

    /* ---- 地面：砖地 ---- */
    for (let r=0; r<rows; r++){
      const ry = y0 + r*ch;
      ctx.fillStyle = (r % 2 === 0) ? BRICK : '#94806a';
      ctx.fillRect(x0, ry, gridW, ch);
    }
    ctx.strokeStyle = 'rgba(20,16,10,.35)'; ctx.lineWidth = 1.2;
    for (let r=0; r<=rows; r++){ seg(ctx, x0, y0+r*ch, x0+gridW, y0+r*ch, 2, 'rgba(20,16,10,.4)'); }
    for (let yy=y0; yy<y0+rows*ch; yy+=23){
      seg(ctx, x0, yy, x0+gridW, yy, 1.2, 'rgba(20,16,10,.25)');
      const off = ((yy-y0)/23) % 2 ? 44 : 0;
      for (let xx=x0+off; xx<x0+gridW; xx+=88){ seg(ctx, xx, yy, xx, yy+23, 1.2, 'rgba(20,16,10,.25)'); }
    }
    // 瓦砾
    for (let i=0;i<rows*14;i++){
      const rx = x0 + rnd()*gridW, ry = y0 + rnd()*rows*ch;
      if (Math.abs(rx % cw - cw/2) < 30) continue;
      ctx.globalAlpha = 0.5;
      dot(ctx, rx, ry, 1.5 + rnd()*2.5, '#5f4f3e');
      ctx.globalAlpha = 1;
    }
  }
  else if (lv.terrain === 'tz') { /* ---- tz 台儿庄 ---- */
    /* 顶带：城墙 + 城楼 */
    ctx.fillStyle = '#7d7158'; ctx.fillRect(0, 0, 960, y0);
    for (let x=6; x<960; x+=36){ box(ctx, x, 4, 24, 14, '#8d8066', 2); }
    ctx.strokeStyle = 'rgba(20,16,10,.3)'; ctx.lineWidth = 1.2;
    for (let yy=22; yy<y0; yy+=16){ seg(ctx, 0, yy, 960, yy, 1.2, 'rgba(20,16,10,.22)'); }
    // 城楼（左）
    ctx.fillStyle = '#4a4038';
    ctx.beginPath(); ctx.moveTo(6, y0); ctx.lineTo(6, 16); ctx.lineTo(20, 4); ctx.lineTo(104, 4); ctx.lineTo(118, 16); ctx.lineTo(118, y0); ctx.closePath();
    ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.stroke();
    box(ctx, 34, 14, 20, 26, lv.night ? '#171b2b' : '#332e26', 2);
    box(ctx, 68, 14, 20, 26, lv.night ? '#171b2b' : '#332e26', 2);
    box(ctx, 30, -2, 64, 16, '#5b4a3a', 2.4);
    ctx.font = 'bold 13px "KaiTi","STKaiti",serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#e8dcc0';
    ctx.fillText('台儿庄', 62, 10);
    /* 右缘：牌坊 */
    const px = x0 + gridW + 6;
    seg(ctx, px+8, y0-6, px+8, y0+70, 5, '#5b4a3a');
    seg(ctx, px+34, y0-6, px+34, y0+70, 5, '#5b4a3a');
    box(ctx, px, y0-10, 44, 12, '#5b4a3a', 2.2);
    box(ctx, px+4, y0-22, 36, 10, '#6d5946', 2.2);
    if (lv.night){
      dot(ctx, px+8, y0+8, 4, '#e8c96a'); dot(ctx, px+34, y0+8, 4, '#e8c96a');
    }
    ctx.fillStyle = '#6b5e49'; ctx.fillRect(px+44, 0, 960-px-44, H);

    /* 左缘：城门 */
    const gateY = y0 + (rows*ch)/2 - 34;
    ctx.fillStyle = '#4a4038'; ctx.fillRect(0, y0, x0-4, rows*ch);
    box(ctx, 20, gateY, 82, 68, '#3a3229', 3.4);
    ctx.beginPath(); ctx.arc(61, gateY, 41, Math.PI, 0); ctx.fillStyle = '#4a4038'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    seg(ctx, 61, gateY, 61, gateY+68, 2.4, '#241d15');
    box(ctx, 28, gateY-24, 66, 18, '#7a6450', 2.4);
    ctx.font = 'bold 14px "KaiTi","STKaiti",serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#e8dcc0';
    ctx.fillText('不 退', 61, gateY-10);

    /* 行地面 */
    for (let r=0; r<rows; r++){
      const ry = y0 + r*ch;
      const isWater = env.waterRows.indexOf(r) >= 0;
      if (isWater){
        ctx.fillStyle = WATER_D; ctx.fillRect(x0, ry, gridW, ch);
        ctx.fillStyle = 'rgba(93,112,120,.35)'; ctx.fillRect(x0, ry, gridW, ch*0.4);
        // 波光
        for (let i=0;i<10;i++){
          const wx = x0 + rnd()*gridW, wy = ry + 12 + rnd()*(ch-24);
          ctx.globalAlpha = 0.3;
          seg(ctx, wx, wy, wx + 14, wy, 1.6, '#cfe0e6');
          ctx.globalAlpha = 1;
        }
      } else {
        ctx.fillStyle = (r % 2 === 0) ? STONE : '#a89a7e';
        ctx.fillRect(x0, ry, gridW, ch);
        ctx.strokeStyle = 'rgba(20,16,10,.28)'; ctx.lineWidth = 1.4;
        for (let i=0;i<6;i++){
          const sx = x0 + i*(gridW/6) + rnd()*8, sy = ry + rnd()*(ch-30);
          rr(ctx, sx, sy, gridW/6 - 6, 28, 3); ctx.stroke();
        }
        for (let i=0;i<8;i++){ ctx.globalAlpha = 0.4; dot(ctx, x0+rnd()*gridW, ry+rnd()*ch, 1.4+rnd()*2, '#5f5643'); ctx.globalAlpha = 1; }
      }
      // 岸缘
      if (isWater){
        const above = G_isWater(env.waterRows, r-1);
        const below = G_isWater(env.waterRows, r+1);
        if (!above){ box(ctx, x0, ry-4, gridW, 8, STONE_D, 2); for (let xx=x0+8; xx<x0+gridW; xx+=64){ dot(ctx, xx, ry-6, 3.4, INK); } }
        if (!below){ box(ctx, x0, ry+ch-4, gridW, 8, STONE_D, 2); for (let xx=x0+30; xx<x0+gridW; xx+=64){ dot(ctx, xx, ry+ch-2, 3.4, INK); } }
      }
    }
    seg(ctx, x0, y0, x0, y0+rows*ch, 2.6, 'rgba(20,16,10,.5)');
  }
  else if (lv.terrain === 'ml'){
    /* ---- 万家岭·山地 ---- */
    // 顶带：远山山脊 + 云雾
    ctx.fillStyle = '#8a7a5c'; ctx.fillRect(0, 0, 960, y0);
    ctx.fillStyle = '#6d5f47';
    ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(0, 26); ctx.quadraticCurveTo(160, 4, 300, 30); ctx.quadraticCurveTo(520, 6, 680, 26); ctx.quadraticCurveTo(820, 10, 960, 30); ctx.lineTo(960, y0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke();
    ctx.globalAlpha = 0.35;
    for (let i=0;i<3;i++){
      const ph = (t*0.08 + i*0.33) % 1;
      ctx.beginPath(); ctx.ellipse(200+i*260, 18 + ph*10, 90, 9, 0, 0, 6.28);
      ctx.fillStyle = '#e8dcc0'; ctx.fill();
    }
    ctx.globalAlpha = 1;
    // 左：山顶碉堡
    const gateY = y0 + (rows*ch)/2 - 34;
    ctx.fillStyle = '#5b5044'; ctx.fillRect(0, 0, x0-4, H);
    box(ctx, 8, 2, 100, 26, '#4a4038', 2.6);
    box(ctx, 18, gateY, 84, 68, '#3a3229', 3.4);
    seg(ctx, 60, gateY, 60, gateY+68, 2.4, '#241d15');
    box(ctx, 24, gateY-22, 72, 18, '#7a6450', 2.4);
    ctx.font = 'bold 14px "KaiTi","STKaiti",serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#e8dcc0';
    ctx.fillText('张古山', 60, gateY-8);
    // 右缘：断木与碎石
    ctx.fillStyle = '#6b5e49'; ctx.fillRect(x0+gridW+4, 0, 960-(x0+gridW+4), H);
    for (let i=0;i<3;i++){
      const tx = x0+gridW+12+rnd()*28, ty = y0+30+rnd()*(H-y0-60);
      seg(ctx, tx, ty, tx+8, ty-22, 4, '#5b4a3a');
      seg(ctx, tx+2, ty-6, tx-6, ty-14, 3, '#5b4a3a');
    }
    // 地面：山坡土色 + 石块
    for (let r=0; r<rows; r++){
      const ry = y0 + r*ch;
      ctx.fillStyle = (r % 2 === 0) ? '#a08a5c' : '#97825a';
      ctx.fillRect(x0, ry, gridW, ch);
      // 坡向阴影（右上深）
      ctx.globalAlpha = 0.12; ctx.fillStyle = '#241d15';
      ctx.fillRect(x0, ry, gridW, 10); ctx.fillRect(x0+gridW-14, ry, 14, ch);
      ctx.globalAlpha = 1;
      for (let i=0;i<10;i++){
        const rx = x0 + rnd()*gridW, ry2 = ry + 14 + rnd()*(ch-20);
        ctx.globalAlpha = 0.5;
        dot(ctx, rx, ry2, 2 + rnd()*3, '#7d6a4e');
        ctx.globalAlpha = 1;
      }
      // 稀草
      for (let i=0;i<6;i++){
        const gx = x0 + rnd()*gridW, gy = ry + ch - 8 - rnd()*10;
        seg(ctx, gx, gy, gx-2, gy-7, 1.6, '#6d6a3c'); seg(ctx, gx, gy, gx+3, gy-6, 1.6, '#6d6a3c');
      }
    }
    for (let r=0; r<=rows; r++){ seg(ctx, x0, y0+r*ch, x0+gridW, y0+r*ch, 2, 'rgba(20,16,10,.4)'); }
  }
  else if (lv.terrain === 'cs'){
    /* ---- 长沙·街巷 ---- */
    // 顶带：骑楼铺面
    ctx.fillStyle = '#6b5f4b'; ctx.fillRect(0, 0, 960, y0);
    let sx2 = 150;
    while (sx2 < 960){
      const bw = 60 + rnd()*40;
      box(ctx, sx2, y0-30, bw, 30, '#5b4a3a', 2.4);
      // 铺面门板
      for (let i=0;i<3;i++){ box(ctx, sx2+6+i*((bw-12)/3), y0-26, (bw-18)/3, 20, '#8b6a45', 1.6); }
      // 招幌
      const zw = ['布','米','茶','药'][(Math.floor(rnd()*4))];
      seg(ctx, sx2+bw-8, y0-28, sx2+bw-8, y0-14, 1.6, '#241d15');
      box(ctx, sx2+bw-16, y0-14, 16, 14, '#cbb488', 1.6);
      ctx.font = 'bold 11px "KaiTi","STKaiti",serif'; ctx.textAlign = 'center'; ctx.fillStyle = INK;
      ctx.fillText(zw, sx2+bw-8, y0-3);
      sx2 += bw + 8;
    }
    // 天心阁剪影（右）
    ctx.fillStyle = '#4a4038';
    ctx.beginPath(); ctx.moveTo(880, y0); ctx.lineTo(880, y0-26); ctx.lineTo(896, y0-38); ctx.lineTo(930, y0-38); ctx.lineTo(946, y0-26); ctx.lineTo(946, y0); ctx.closePath();
    ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke();
    seg(ctx, 913, y0-38, 913, y0-52, 2.6, WOOD);
    // 左：城墙门
    const gateY = y0 + (rows*ch)/2 - 34;
    ctx.fillStyle = '#7d7158'; ctx.fillRect(0, 0, x0-4, H);
    for (let yy=26; yy<H; yy+=40){ seg(ctx, 4, yy, x0-8, yy, 1.6, 'rgba(20,16,10,.3)'); }
    box(ctx, 20, gateY, 82, 68, '#3a3229', 3.4);
    ctx.beginPath(); ctx.arc(61, gateY, 41, Math.PI, 0); ctx.fillStyle = '#7d7158'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    box(ctx, 28, gateY-24, 66, 18, '#7a6450', 2.4);
    ctx.font = 'bold 14px "KaiTi","STKaiti",serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#e8dcc0';
    ctx.fillText('长 沙', 61, gateY-10);
    // 右缘：瓦砾墙
    ctx.fillStyle = '#6b5e49'; ctx.fillRect(x0+gridW+4, 0, 960-(x0+gridW+4), H);
    for (let yy=y0+16; yy<H; yy+=48){ box(ctx, x0+gridW+8, yy, 34, 22, '#5b4a3a', 2); }
    // 地面：青石板 + 中行泥沼
    for (let r=0; r<rows; r++){
      const ry = y0 + r*ch;
      const isMud = (env.mudRows || []).indexOf(r) >= 0;
      if (isMud){
        ctx.fillStyle = '#6b543a'; ctx.fillRect(x0, ry, gridW, ch);
        // 泥洼
        for (let i=0;i<6;i++){
          const px2 = x0 + rnd()*gridW, py = ry + 16 + rnd()*(ch-30);
          ctx.beginPath(); ctx.ellipse(px2, py, 16 + rnd()*14, 6 + rnd()*4, 0, 0, 6.28);
          ctx.fillStyle = '#54402a'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.6; ctx.stroke();
        }
        // 气泡（动）
        const bub = (t*1.4) % 1;
        ctx.globalAlpha = 0.6 - bub*0.5;
        dot(ctx, x0+gridW*0.3, ry+ch-18 - bub*8, 3+bub*3, '#8a7454');
        dot(ctx, x0+gridW*0.72, ry+ch-14 - bub*8, 2.4+bub*2.6, '#8a7454');
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = (r % 2 === 0) ? '#8f8a7a' : '#867f6e';
        ctx.fillRect(x0, ry, gridW, ch);
        ctx.strokeStyle = 'rgba(20,16,10,.26)'; ctx.lineWidth = 1.3;
        for (let i=0;i<6;i++){
          const px3 = x0 + i*(gridW/6) + rnd()*6, py = ry + rnd()*(ch-28);
          rr(ctx, px3, py, gridW/6 - 5, 26, 3); ctx.stroke();
        }
        for (let i=0;i<7;i++){ ctx.globalAlpha = 0.35; dot(ctx, x0+rnd()*gridW, ry+rnd()*ch, 1.4+rnd()*2, '#4a4336'); ctx.globalAlpha = 1; }
      }
    }
    for (let r=0; r<=rows; r++){ seg(ctx, x0, y0+r*ch, x0+gridW, y0+r*ch, 2, 'rgba(20,16,10,.4)'); }
  }
  else if (lv.terrain === 'ms'){
    /* ---- 莫斯科·雪原 ---- */
    // 顶带：铅灰天 + 克里姆林剪影（含塔楼圆顶）
    ctx.fillStyle = '#9a9a92'; ctx.fillRect(0, 0, 960, y0);
    dot(ctx, 850, 22, 13, '#e8e2cd');
    ctx.globalAlpha = 0.3; dot(ctx, 850, 22, 20, '#e8e2cd'); ctx.globalAlpha = 1;
    // 克里姆林墙 + 斯帕斯克塔（压缩在 0..y0 带内）
    ctx.fillStyle = '#7a3f35';
    ctx.fillRect(430, y0-22, 190, 22);
    for (let x=436; x<616; x+=24){ box(ctx, x, y0-28, 14, 7, '#7a3f35', 1.6); }
    box(ctx, 456, y0-44, 22, 24, '#7a3f35', 2.2);
    ctx.beginPath(); ctx.moveTo(456, y0-44); ctx.lineTo(467, y0-46); ctx.lineTo(478, y0-44); ctx.closePath();
    ctx.fillStyle = '#6b3229'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
    star(ctx, 467, y0-38, 4, RED);
    dot(ctx, 460, y0-32, 2, '#ece5d2'); dot(ctx, 474, y0-32, 2, '#ece5d2');
    // 圣瓦西里圆顶剪影
    ctx.beginPath(); ctx.arc(560, y0-12, 11, Math.PI, 0); ctx.closePath();
    ctx.fillStyle = '#7a5a3a'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(584, y0-10, 8, Math.PI, 0); ctx.closePath();
    ctx.fillStyle = '#8a6a3a'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(548, y0-9, 7, Math.PI, 0); ctx.closePath();
    ctx.fillStyle = '#6e5233'; ctx.fill(); ctx.stroke();
    // 左：莫斯科城门
    const gateY = y0 + (rows*ch)/2 - 34;
    ctx.fillStyle = '#8a8a80'; ctx.fillRect(0, 0, x0-4, H);
    for (let yy=22; yy<H; yy+=38){ seg(ctx, 4, yy, x0-8, yy, 1.4, 'rgba(20,16,10,.25)'); }
    box(ctx, 20, gateY, 82, 68, '#3a3a33', 3.4);
    ctx.beginPath(); ctx.arc(61, gateY, 41, Math.PI, 0); ctx.fillStyle = '#8a8a80'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    seg(ctx, 61, gateY, 61, gateY+68, 2.4, '#241d15');
    box(ctx, 28, gateY-24, 66, 18, '#7a6450', 2.4);
    ctx.font = 'bold 14px "KaiTi","STKaiti",serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#e8dcc0';
    ctx.fillText('莫斯科', 61, gateY-10);
    // 右缘：雪杉
    ctx.fillStyle = '#a8a89e'; ctx.fillRect(x0+gridW+4, 0, 960-(x0+gridW+4), H);
    for (let i=0;i<5;i++){
      const tx = x0+gridW+12+rnd()*30, ty = y0+30+rnd()*(H-y0-50), th = 40+rnd()*24;
      ctx.beginPath(); ctx.moveTo(tx, ty-th); ctx.lineTo(tx-14, ty); ctx.lineTo(tx+14, ty); ctx.closePath();
      ctx.fillStyle = '#5a6a52'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.stroke();
      ctx.globalAlpha = 0.5; dot(ctx, tx, ty-th+6, 5, '#e8e2cd'); ctx.globalAlpha = 1;
    }
    // 地面：雪原（脏雪色 + 车辙）
    for (let r=0; r<rows; r++){
      const ry = y0 + r*ch;
      ctx.fillStyle = (r % 2 === 0) ? '#d6d2c6' : '#ccc8bc';
      ctx.fillRect(x0, ry, gridW, ch);
      ctx.globalAlpha = 0.35;
      for (let i=0;i<5;i++){
        const px = x0 + rnd()*gridW, py = ry + 14 + rnd()*(ch-26);
        ctx.beginPath(); ctx.ellipse(px, py, 20+rnd()*16, 4+rnd()*3, 0, 0, 6.28);
        ctx.fillStyle = '#ece8dc'; ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalAlpha = 0.18;
      seg(ctx, x0+10, ry+ch*0.4, x0+gridW-30, ry+ch*0.5, 4, '#6b5a48');
      seg(ctx, x0+30, ry+ch*0.7, x0+gridW-10, ry+ch*0.62, 3, '#6b5a48');
      ctx.globalAlpha = 1;
      if (r % 2 === 1){
        ctx.beginPath(); ctx.ellipse(x0 + gridW*0.6, ry + ch*0.5, 20, 8, 0, 0, 6.28);
        ctx.fillStyle = '#a89680'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.stroke();
      }
    }
    for (let r=0; r<=rows; r++){ seg(ctx, x0, y0+r*ch, x0+gridW, y0+r*ch, 2, 'rgba(20,16,10,.32)'); }
  }
  else if (lv.terrain === 'dn'){
    /* ---- dn 第聂伯河·滩岸 ---- */
    const gateY = y0 + (rows*ch)/2 - 34;
    // 顶带：对岸秋色林线 + 侦察气球
    ctx.fillStyle = '#9a9276'; ctx.fillRect(0, 0, 960, y0);
    ctx.fillStyle = '#7d8468';
    for (let i=0;i<12;i++){
      const bx2 = 30 + i*78, bh = 12 + (i*37 % 14);
      ctx.beginPath();
      ctx.moveTo(bx2, y0); ctx.lineTo(bx2+12, y0-bh); ctx.lineTo(bx2+44, y0);
      ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = '#b0a276'; ctx.fillRect(0, y0-6, 960, 6);   // 对岸沙滩亮带
    dot(ctx, 850, 16, 11, '#d9c9a3');                            // 秋阳
    // 侦察气球（静态剪影+微动由dyn省略）
    ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.ellipse(180, 20, 12, 9, 0, 0, 6.28);
    ctx.fillStyle = '#c2b598'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.6; ctx.stroke();
    seg(ctx, 180, 29, 180, y0-2, 1.2, '#8a8072');
    ctx.globalAlpha = 1;
    // 左缘：登陆门牌「第聂伯河渡口」
    box(ctx, 20, gateY, 82, 68, '#4a4740', 3.4);
    ctx.beginPath(); ctx.arc(61, gateY, 41, Math.PI, 0); ctx.fillStyle = '#8f887a'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    seg(ctx, 61, gateY, 61, gateY+68, 2.4, '#241d15');
    box(ctx, 22, gateY-24, 78, 18, '#6d5233', 2.4);
    ctx.font = 'bold 11px "KaiTi","STKaiti",serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#e8dcc0';
    ctx.fillText('第聂伯河渡口', 61, gateY-10);
    // 右缘：破损栈桥桩
    ctx.fillStyle = '#9a958a'; ctx.fillRect(x0+gridW+4, 0, 960-(x0+gridW+4), H);
    for (let i=0;i<5;i++){
      const py = y0 + 24 + i*((H-y0-40)/5);
      seg(ctx, x0+gridW+8, py, x0+gridW+26, py-8, 4.4, WOOD);
      seg(ctx, x0+gridW+14, py+10, x0+gridW+30, py+4, 3, WOOD);
    }
    // 地面：沙岸行 / 河道行
    for (let r=0; r<rows; r++){
      const ry = y0 + r*ch;
      const isW = env.waterRows.indexOf(r) >= 0;
      if (isW){
        ctx.fillStyle = '#4f7076'; ctx.fillRect(x0, ry, gridW, ch);
        ctx.globalAlpha = 0.4;
        for (let i=0;i<4;i++){
          const px = x0 + 30 + i*100 + (r*53 % 40);
          ctx.beginPath(); ctx.ellipse(px, ry + 12 + (i%2)*10, 16, 3, 0, 0, 6.28);
          ctx.strokeStyle = '#cfd8da'; ctx.lineWidth = 1.6; ctx.stroke();
        }
        ctx.globalAlpha = 1;
        const above = env.waterRows.indexOf(r-1) >= 0, below = env.waterRows.indexOf(r+1) >= 0;
        if (!above){ box(ctx, x0, ry-3, gridW, 8, '#8a7a5c', 2.2); for (let xx=x0+8; xx<x0+gridW; xx+=64){ dot(ctx, xx, ry-6, 3.2, INK); } }
        if (!below){ box(ctx, x0, ry+ch-4, gridW, 8, '#8a7a5c', 2.2); for (let xx=x0+30; xx<x0+gridW; xx+=64){ dot(ctx, xx, ry+ch-2, 3.2, INK); } }
      } else {
        ctx.fillStyle = (r % 2 === 0) ? '#c8bb9a' : '#bfb190';
        ctx.fillRect(x0, ry, gridW, ch);
        // 沙滩卵石 + 芦苇丛
        ctx.globalAlpha = 0.6;
        for (let i=0;i<6;i++){
          const px = x0 + 20 + ((i*173 + r*97) % (gridW-40)), py = ry + 10 + ((i*61 + r*31) % (ch-20));
          dot(ctx, px, py, 2.6 + (i%3), '#a89a78');
        }
        ctx.globalAlpha = 1;
        for (let i=0;i<3;i++){
          const px = x0 + 60 + i*(gridW/3) + (r*67 % 50);
          for (let k=0;k<4;k++){
            const ang = -Math.PI/2 + (k-1.5)*0.16;
            seg(ctx, px, ry+ch-2, px + Math.cos(ang)*16, ry+ch-2+Math.sin(ang)*22, 2, '#9a8a58');
            dot(ctx, px + Math.cos(ang)*16, ry+ch-4+Math.sin(ang)*22, 1.8, '#7a6a3c');
          }
        }
      }
    }
    for (let r=0; r<=rows; r++){ seg(ctx, x0, y0+r*ch, x0+gridW, y0+r*ch, 2, 'rgba(20,16,10,.32)'); }
  }
  else if (lv.terrain === 'sv'){
    /* ---- 塞瓦斯托波尔·湾岸 ---- */
    // 顶带：黑海海平线 + 远处沉船与炮台剪影
    ctx.fillStyle = '#7f949c'; ctx.fillRect(0, 0, 960, y0);
    ctx.fillStyle = '#5f7480'; ctx.fillRect(0, y0-8, 960, 8);
    // 远处沉船桅杆
    seg(ctx, 140, y0-2, 128, y0-26, 3, '#3f4a44');
    seg(ctx, 140, y0-20, 158, y0-4, 2.2, '#3f4a44');
    // 麦克西门炮台剪影
    ctx.fillStyle = '#8a8072';
    ctx.fillRect(760, y0-14, 90, 14);
    ctx.fillRect(788, y0-24, 24, 12);
    seg(ctx, 800, y0-24, 786, y0-36, 4, '#6d675d');
    // 左：要塞城门
    const gateY = y0 + (rows*ch)/2 - 34;
    ctx.fillStyle = '#8f887a'; ctx.fillRect(0, 0, x0-4, H);
    for (let yy=22; yy<H; yy+=38){ seg(ctx, 4, yy, x0-8, yy, 1.4, 'rgba(20,16,10,.25)'); }
    box(ctx, 20, gateY, 82, 68, '#4a4740', 3.4);
    ctx.beginPath(); ctx.arc(61, gateY, 41, Math.PI, 0); ctx.fillStyle = '#8f887a'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    seg(ctx, 61, gateY, 61, gateY+68, 2.4, '#241d15');
    box(ctx, 28, gateY-24, 66, 18, '#7a6450', 2.4);
    ctx.font = 'bold 11px "KaiTi","STKaiti",serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#e8dcc0';
    ctx.fillText('塞瓦斯托波尔', 61, gateY-10);
    // 右缘：破损防波堤
    ctx.fillStyle = '#9a958a'; ctx.fillRect(x0+gridW+4, 0, 960-(x0+gridW+4), H);
    for (let i=0;i<4;i++){
      const bx = x0+gridW+10+rnd()*34, byy = y0+40+rnd()*(H-y0-80);
      box(ctx, bx, byy, 10, 26+rnd()*14, '#7d786c', 2.2);
      ctx.globalAlpha = 0.5; dot(ctx, bx+5, byy+4, 4, '#ece5d2'); ctx.globalAlpha = 1;
    }
    // 地面：岩岸与海
    for (let r=0; r<rows; r++){
      const ry = y0 + r*ch;
      const isW = env.waterRows.indexOf(r) >= 0;
      if (isW){
        ctx.fillStyle = '#4f7076'; ctx.fillRect(x0, ry, gridW, ch);
        ctx.fillStyle = 'rgba(70,100,105,.4)'; ctx.fillRect(x0, ry, gridW, ch*0.35);
      } else {
        ctx.fillStyle = (r % 2 === 0) ? '#a8a091' : '#c0b8a6';
        ctx.fillRect(x0, ry, gridW, ch);
        ctx.globalAlpha = 0.3;
        for (let i=0;i<6;i++){
          const px = x0 + rnd()*gridW, py = ry + 10 + rnd()*(ch-20);
          ctx.beginPath(); ctx.ellipse(px, py, 10+rnd()*10, 4, 0, 0, 6.28);
          ctx.fillStyle = '#8a8272'; ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      if (isW){
        const above = env.waterRows.indexOf(r-1) >= 0, below = env.waterRows.indexOf(r+1) >= 0;
        if (!above){ box(ctx, x0, ry-4, gridW, 8, '#6d675d', 2.2); for (let xx=x0+8; xx<x0+gridW; xx+=64){ dot(ctx, xx, ry-6, 3.4, INK); } }
        if (!below){ box(ctx, x0, ry+ch-4, gridW, 8, '#6d675d', 2.2); for (let xx=x0+30; xx<x0+gridW; xx+=64){ dot(ctx, xx, ry+ch-2, 3.4, INK); } }
      }
    }
    for (let r=0; r<=rows; r++){ seg(ctx, x0, y0+r*ch, x0+gridW, y0+r*ch, 2, 'rgba(20,16,10,.35)'); }
  }
  else if (lv.terrain === 'ruin'){
    /* ---- 斯大林格勒·废墟 ---- */
    // 顶带：燃烧的城市天际线
    ctx.fillStyle = '#8a6a4a'; ctx.fillRect(0, 0, 960, y0);
    ctx.fillStyle = '#c78a52'; dot(ctx, 870, 14, 10, '#d9a05e');  // 烟日
    // 断楼剪影
    ctx.fillStyle = '#4a4038';
    const bs = [[60,26],[130,38],[210,20],[300,32],[420,24],[520,40],[640,22],[730,34]];
    for (const [bx2, bh] of bs){
      ctx.fillRect(bx2, y0-bh, 44, bh);
      // 断裂缺口
      ctx.fillStyle = '#8a6a4a';
      ctx.beginPath(); ctx.moveTo(bx2+44, y0-bh); ctx.lineTo(bx2+44, y0-bh+10); ctx.lineTo(bx2+32, y0-bh+4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#4a4038';
      // 黑窗
      ctx.fillStyle = '#241d15';
      for (let wy2 = y0-bh+6; wy2 < y0-6; wy2 += 12){ ctx.fillRect(bx2+8, wy2, 8, 6); ctx.fillRect(bx2+26, wy2, 8, 6); }
      ctx.fillStyle = '#4a4038';
    }
    // 左：伏尔加河堤门
    const gateY = y0 + (rows*ch)/2 - 34;
    ctx.fillStyle = '#7d6a58'; ctx.fillRect(0, 0, x0-4, H);
    for (let yy=22; yy<H; yy+=38){ seg(ctx, 4, yy, x0-8, yy, 1.4, 'rgba(20,16,10,.25)'); }
    box(ctx, 20, gateY, 82, 68, '#3d3630', 3.4);
    ctx.beginPath(); ctx.arc(61, gateY, 41, Math.PI, 0); ctx.fillStyle = '#7d6a58'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    seg(ctx, 61, gateY, 61, gateY+68, 2.4, '#241d15');
    box(ctx, 28, gateY-24, 66, 18, '#6e5a48', 2.4);
    ctx.font = 'bold 13px "KaiTi","STKaiti",serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#e8dcc0';
    ctx.fillText('斯大林格勒', 61, gateY-10);
    // 右缘：坍塌楼群
    ctx.fillStyle = '#6d6156'; ctx.fillRect(x0+gridW+4, 0, 960-(x0+gridW+4), H);
    for (let i=0;i<4;i++){
      const bx3 = x0+gridW+8+rnd()*30, bh3 = 30+rnd()*30;
      ctx.fillStyle = '#4a4038';
      ctx.beginPath();
      ctx.moveTo(bx3, y0+30+rnd()*(H-y0-90)+bh3);
      ctx.lineTo(bx3, y0+30+rnd()*(H-y0-90));
      ctx.lineTo(bx3+22+rnd()*10, y0+30+rnd()*(H-y0-90)-10);
      ctx.lineTo(bx3+34, y0+30+rnd()*(H-y0-90)+bh3);
      ctx.closePath(); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
    }
    // 地面：焦土瓦砾
    for (let r=0; r<rows; r++){
      const ry = y0 + r*ch;
      ctx.fillStyle = (r % 2 === 0) ? '#9a8a74' : '#8a7a64';
      ctx.fillRect(x0, ry, gridW, ch);
      // 瓦砾块
      for (let i=0;i<8;i++){
        const px = x0 + rnd()*gridW, py = ry + 8 + rnd()*(ch-16);
        ctx.save(); ctx.translate(px, py); ctx.rotate(rnd()*1.2);
        box(ctx, -6, -4, 10+rnd()*8, 6+rnd()*5, '#6d6156', 1.6);
        ctx.restore();
      }
      // 弹坑与焦痕
      if (r % 2 === 1){
        ctx.beginPath(); ctx.ellipse(x0 + gridW*0.45, ry + ch*0.5, 26, 9, 0, 0, 6.28);
        ctx.fillStyle = '#4a4336'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.stroke();
        ctx.globalAlpha = 0.4; dot(ctx, x0 + gridW*0.8, ry + ch*0.3, 9, '#2a251d'); ctx.globalAlpha = 1;
      }
    }
    for (let r=0; r<=rows; r++){ seg(ctx, x0, y0+r*ch, x0+gridW, y0+r*ch, 2, 'rgba(20,16,10,.4)'); }
  }
  else {
    /* ---- 上高·旱田 ---- */
    // 顶带：丘陵梯田
    ctx.fillStyle = '#93825c'; ctx.fillRect(0, 0, 960, y0);
    ctx.fillStyle = '#7d6a48';
    ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(0, 34); ctx.quadraticCurveTo(240, 18, 470, 34); ctx.quadraticCurveTo(700, 20, 960, 32); ctx.lineTo(960, y0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
    // 田埂线
    seg(ctx, 120, 30, 210, 22, 1.6, 'rgba(20,16,10,.35)');
    seg(ctx, 480, 32, 590, 24, 1.6, 'rgba(20,16,10,.35)');
    seg(ctx, 720, 28, 830, 22, 1.6, 'rgba(20,16,10,.35)');
    // 左：上高城门
    const gateY = y0 + (rows*ch)/2 - 34;
    ctx.fillStyle = '#8a7a5c'; ctx.fillRect(0, 0, x0-4, H);
    box(ctx, 14, 2, 92, 22, '#5b4a3a', 2.4);
    box(ctx, 20, gateY, 82, 68, '#3a3229', 3.4);
    ctx.beginPath(); ctx.arc(61, gateY, 41, Math.PI, 0); ctx.fillStyle = '#8a7a5c'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    seg(ctx, 61, gateY, 61, gateY+68, 2.4, '#241d15');
    box(ctx, 28, gateY-24, 66, 18, '#7a6450', 2.4);
    ctx.font = 'bold 14px "KaiTi","STKaiti",serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#e8dcc0';
    ctx.fillText('上 高', 61, gateY-10);
    // 右缘：竹林
    ctx.fillStyle = '#7d7454'; ctx.fillRect(x0+gridW+4, 0, 960-(x0+gridW+4), H);
    for (let i=0;i<6;i++){
      const bx2 = x0+gridW+10+rnd()*32, by2 = y0+20+rnd()*(H-y0-40);
      seg(ctx, bx2, by2, bx2+3, by2-34-rnd()*14, 3.4, '#6d6a3c');
      seg(ctx, bx2+2, by2-24, bx2-8, by2-34, 2.2, '#6d6a3c');
      seg(ctx, bx2+2, by2-30, bx2+12, by2-40, 2.2, '#6d6a3c');
    }
    // 地面：田垄
    for (let r=0; r<rows; r++){
      const ry = y0 + r*ch;
      ctx.fillStyle = (r % 2 === 0) ? '#a8945c' : '#9f8a54';
      ctx.fillRect(x0, ry, gridW, ch);
      // 垄沟
      for (let i=0;i<5;i++){
        const fy = ry + 12 + i*16;
        seg(ctx, x0+6, fy, x0+gridW-6, fy+3, 1.8, 'rgba(20,16,10,.22)');
      }
      // 稻茬
      for (let i=0;i<16;i++){
        const rx = x0 + rnd()*gridW, ry2 = ry + 6 + rnd()*(ch-12);
        seg(ctx, rx, ry2, rx-1, ry2-6, 1.6, '#8a7434');
      }
      // 弹坑
      if (r % 2 === 0){
        ctx.beginPath(); ctx.ellipse(x0 + gridW*0.55, ry + ch*0.5, 26, 10, 0, 0, 6.28);
        ctx.fillStyle = '#8a7434'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.stroke();
      }
    }
    for (let r=0; r<=rows; r++){ seg(ctx, x0, y0+r*ch, x0+gridW, y0+r*ch, 2, 'rgba(20,16,10,.4)'); }
  }
  if (lv.terrain === 'ds'){
    /* ---- ds 阿拉曼 · 沙漠（V8.0 新地形） ----（独立 if：与上方互斥链条等价） */
    // 顶带：北非白昼沙空 + 低悬烈日
    ctx.fillStyle = '#c49a5e'; ctx.fillRect(0, 0, 960, y0);
    ctx.fillStyle = '#d6ad6e'; ctx.fillRect(0, y0*0.55, 960, y0*0.45);
    dot(ctx, 700, y0*0.34, 13, '#f0d492'); ctx.globalAlpha = 0.25; dot(ctx, 700, y0*0.34, 22, '#f7e3b0'); ctx.globalAlpha = 1;
    // 远处沙丘剪影（两叠）
    ctx.fillStyle = '#a87f4c';
    ctx.beginPath(); ctx.moveTo(0, y0);
    for (let x=0; x<=960; x+=60){ ctx.lineTo(x, y0 - 10 - Math.sin(x*0.013)*9 - Math.cos(x*0.031)*5); }
    ctx.lineTo(960, y0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#9a724a';
    ctx.beginPath(); ctx.moveTo(0, y0);
    for (let x=0; x<=960; x+=48){ ctx.lineTo(x, y0 - 4 - Math.abs(Math.sin(x*0.02))*7); }
    ctx.lineTo(960, y0); ctx.closePath(); ctx.fill();
    // 铁路路堤（阿拉曼铁路，沿战线横贯）
    box(ctx, x0, y0-7, gridW, 7, '#7a5f3c', 1.8);
    for (let xx=x0+6; xx<x0+gridW; xx+=26){ seg(ctx, xx, y0-6, xx, y0-1, 2.2, '#5f4826'); }
    seg(ctx, x0, y0-4.5, x0+gridW, y0-4.5, 1.4, '#3c3226');
    // 左侧：盒子工事立面（沙袋墙 + 铁丝网）
    ctx.fillStyle = '#8f7048'; ctx.fillRect(0, 0, x0-4, H);
    ctx.strokeStyle = 'rgba(40,28,14,.45)'; ctx.lineWidth = 1.4;
    for (let yy=40; yy<H; yy+=38){ seg(ctx, 0, yy, x0-4, yy, 1.4, 'rgba(40,28,14,.45)'); }
    for (let wy2=54; wy2<H-40; wy2+=38){
      for (let wx2=12; wx2<x0-24; wx2+=24){
        box(ctx, wx2, wy2, 17, 20, '#a08152', 1.6);
        ctx.globalAlpha = 0.5; seg(ctx, wx2+2, wy2+10, wx2+15, wy2+10, 1.2, '#6d5433'); ctx.globalAlpha = 1;
      }
    }
    // 铁丝网（对角交叉）
    ctx.lineWidth = 1.6; ctx.strokeStyle = '#4a3a24';
    for (let yy2=16; yy2<H-10; yy2+=22){ seg(ctx, 4, yy2, x0-8, yy2+14, 1.3, '#4a3a24'); seg(ctx, 4, yy2+14, x0-8, yy2, 1.3, 'rgba(74,58,36,.55)'); }
    for (let xx3=6; xx3<x0-8; xx3+=20){ dot(ctx, xx3, 12 + (xx3 % 44), 1.8, '#3c3226'); }
    // 场地：沙地 + 沙纹波弧 + 碎石 + 枯灌木
    for (let r=0; r<rows; r++){
      const ry = y0 + r*ch;
      ctx.fillStyle = (r % 2 === 0) ? '#c8a265' : '#bfa05f';
      ctx.fillRect(x0, ry, gridW, ch);
      // 沙纹：行内三道风成波弧
      for (let i=0;i<3;i++){
        const sy = ry + 14 + i*18;
        ctx.beginPath();
        ctx.moveTo(x0+8, sy);
        for (let x=x0+8; x<=x0+gridW-8; x+=34){ ctx.quadraticCurveTo(x+17, sy + ((x/34 + i) % 2 === 0 ? -5 : 5), x+34, sy); }
        ctx.strokeStyle = 'rgba(90,64,30,.22)'; ctx.lineWidth = 1.5; ctx.stroke();
      }
      // 碎石与弹坑
      for (let i=0;i<9;i++){
        const gx = x0 + rnd()*gridW, gy = ry + 8 + rnd()*(ch-16);
        dot(ctx, gx, gy, 1.6 + rnd()*1.4, '#8f7247');
      }
      if (r % 2 === 1){
        ctx.beginPath(); ctx.ellipse(x0 + gridW*(0.3 + (r%4)*0.18), ry + ch*0.55, 22, 8, 0, 0, 6.28);
        ctx.fillStyle = '#a3844f'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.stroke();
      }
      // 枯灌木（稀疏硬点）
      for (let i=0;i<3;i++){
        const bx3 = x0 + 24 + rnd()*(gridW-48), by3 = ry + 18 + rnd()*(ch-30);
        seg(ctx, bx3, by3, bx3-4, by3-9, 1.8, '#6d6a3c');
        seg(ctx, bx3, by3, bx3+5, by3-8, 1.6, '#7a7444');
        dot(ctx, bx3, by3, 1.6, '#5d5a30');
      }
    }
    // 地雷区警示桩（史实：几十万颗地雷）
    for (let i=0;i<7;i++){
      const mx = x0 + 40 + rnd()*(gridW-80), my = y0 + 18 + (i%5)*(rows*ch-30)/5;
      seg(ctx, mx, my, mx, my+14, 2.2, '#7a5f3c');
      dot(ctx, mx, my-2, 3.2, '#b03a2b');
      ctx.globalAlpha = 0.6; seg(ctx, mx-6, my+8, mx+6, my+12, 1.4, '#4a3a24'); ctx.globalAlpha = 1;
    }
    for (let r=0; r<=rows; r++){ seg(ctx, x0, y0+r*ch, x0+gridW, y0+r*ch, 2, 'rgba(60,40,20,.32)'); }
  }

  /* 列高亮分隔（浅） */
  ctx.globalAlpha = 0.06; ctx.fillStyle = '#fff';
  for (let c=1; c<cols; c++){ ctx.fillRect(x0 + c*cw - 1, y0, 2, rows*ch); }
  ctx.globalAlpha = 1;

  /* ---- V7.8 全地形通用美化：行间明暗条纹 + 顶带天光 ---- */
  ctx.globalAlpha = 0.05; ctx.fillStyle = '#241d15';
  for (let r = 0; r < rows; r++){
    if (r % 2 === 1) ctx.fillRect(x0, y0 + r * ch, gridW, ch);
  }
  ctx.globalAlpha = 0.07; ctx.fillStyle = '#fff7e0';
  ctx.fillRect(x0, y0, gridW, ch * 0.45);
  ctx.globalAlpha = 1;
}
function G_isWater(waterRows, r){ return waterRows.indexOf(r) >= 0; }

/* ---------- 夜幕 ---------- */
function drawNight(ctx, lv, env, t, H){
  ctx.fillStyle = 'rgba(14,18,34,' + NIGHTA + ')';
  ctx.fillRect(0, 0, 960, H);
  if (lv.terrain === 'sh'){
    // 探照灯
    for (let i=0;i<2;i++){
      const a = 0.5 + Math.sin(t*0.4 + i*2.4)*0.3;
      ctx.save(); ctx.translate(180 + i*430, 0);
      ctx.rotate(a);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-70, 400); ctx.lineTo(70, 400); ctx.closePath();
      ctx.fillStyle = 'rgba(232,201,106,.07)'; ctx.fill();
      ctx.restore();
    }
  } else {
    // 月
    dot(ctx, 850, 34, 22, '#e8e2cd');
    ctx.globalAlpha = 0.25; dot(ctx, 850, 34, 30, '#e8e2cd'); ctx.globalAlpha = 1;
    dot(ctx, 843, 28, 5, '#cfc9b2'); dot(ctx, 856, 40, 3.4, '#cfc9b2');
  }
}

/* ---------- 水面覆盖带（行实体之后） ---------- */
function drawWaterBand(ctx, r, t){
  const { y0, ch, x0 } = GRID;
  const ry = y0 + r*ch;
  ctx.fillStyle = 'rgba(73,88,95,.5)';
  ctx.fillRect(x0-30, ry + ch - 34, 960-(x0-30)+40, 34);
  ctx.strokeStyle = 'rgba(207,224,230,.5)'; ctx.lineWidth = 2;
  for (let k=0;k<2;k++){
    ctx.beginPath();
    for (let x=x0-30; x<970; x+=26){
      const y = ry + ch - 20 - k*10 + Math.sin(x*0.05 + t*2 + k)*3;
      if (x === x0-30) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

/* ---------- 图标 ---------- */
const ICON_CACHE = {};
function makeIcon(type, isEnemy){
  const key = (isEnemy ? 'e_' : 'd_') + type + '_v2';
  if (ICON_CACHE[key]) return ICON_CACHE[key];
  const c = document.createElement('canvas'); c.width = 64; c.height = 64;
  const ctx = c.getContext('2d');
  /* ---- 纸底渐变卡 ---- */
  const g = ctx.createLinearGradient(0, 0, 0, 64);
  if (isEnemy){ g.addColorStop(0, '#dbcaa2'); g.addColorStop(1, '#c4b28a'); }
  else { g.addColorStop(0, '#ece0c4'); g.addColorStop(1, '#dbd0b2'); }
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  /* 纸纹（斜细线，双色） */
  ctx.globalAlpha = 0.06; ctx.strokeStyle = INK; ctx.lineWidth = 1;
  for (let y = -8; y < 64; y += 7){ ctx.beginPath(); ctx.moveTo(2, y); ctx.lineTo(62, y + 6); ctx.stroke(); }
  ctx.globalAlpha = 0.05;
  for (let y = 4; y < 64; y += 11){ ctx.beginPath(); ctx.moveTo(2, y); ctx.lineTo(62, y - 5); ctx.stroke(); }
  ctx.globalAlpha = 1;
  /* ---- 底部暗角晕影（vignette） ---- */
  const vg = ctx.createLinearGradient(0, 40, 0, 64);
  vg.addColorStop(0, 'rgba(36,29,21,0)'); vg.addColorStop(1, 'rgba(36,29,21,.20)');
  ctx.fillStyle = vg; ctx.fillRect(0, 40, 64, 24);
  const vg2 = ctx.createLinearGradient(0, 0, 0, 22);
  vg2.addColorStop(0, 'rgba(255,250,235,.28)'); vg2.addColorStop(1, 'rgba(255,250,235,0)');
  ctx.fillStyle = vg2; ctx.fillRect(0, 0, 64, 22);
  /* ---- 地面阴影（双层椭圆） ---- */
  ctx.beginPath(); ctx.ellipse(32, 56, 22, 6.5, 0, 0, 6.28);
  ctx.fillStyle = 'rgba(36,29,21,.32)'; ctx.fill();
  ctx.beginPath(); ctx.ellipse(32, 56, 13, 3.6, 0, 0, 6.28);
  ctx.fillStyle = 'rgba(36,29,21,.22)'; ctx.fill();
  /* ---- 单位（按体型自适应缩放） ---- */
  const SC_DEF = { katyusha:0.52, mortar:0.62, mortar82:0.62, pavlov:0.55, bastion:0.6, squad:0.62, atgun:0.62, dp27:0.74, ptrd:0.66, marine:0.7, ml20:0.52, su152:0.56, split:0.58, ppsh:0.74, looters:0.6, bs3:0.56, zis3:0.6, m120:0.64, is2:0.54, il2:0.6 };
  const SC_EN = { de_panzer:0.5, crusher:0.5, de_tiger:0.44, de_wespe:0.54, de_boat:0.56, boat:0.56, de_storm:0.7, banzai:0.7, plate:0.64, crate:0.66, de_crate:0.66, ladder:0.66, flagbearer:0.68, de_flag:0.68, door:0.62, ro_inf:0.72, de_frost:0.72, de_volks:0.72, de_stug:0.48, de_ferd:0.42, de_panther:0.46, ro_tank:0.58, de_ss:0.62 };
  const scD = SC_DEF[type] || 0.7, scE = SC_EN[type] || 0.74;
  if (isEnemy){
    const spec = EN[type];
    const e = { type, x:36, y:58, phase:0, hp:spec.hp, maxHp:spec.hp, shield:spec.shield||0,
      slowT:0, rage:false, eating:null, dead:false, deathT:0, hitFlash:0,
      vaulting:0, vaulted:false, submerged:false, ladderDone:false,
      stilts:type==='pogo', digging:false, reverse:false, vehicle:!!spec.vehicle };
    ctx.save(); ctx.scale(scE, scE);
    e.x = 46 / scE; e.y = 55 / scE;
    /* V1.8.1：ICON_MODE 用 try/finally 复位——单张贴图出错不再污染后续所有图标 */
    ICON_MODE = true;
    try { drawEn(ctx, e, 0.3); }
    catch(err){ if (window.console) console.warn('icon fail(en): ' + type, err); }
    finally { ICON_MODE = false; ctx.restore(); }
  } else {
    const spec = DEF[type];
    const p = { type, x:0, y:0, t:0, flash:0, hp:spec.hp, maxHp:spec.hp,
      armT:0, fuse:1, chewT:0, state:'idle', jx:null, jy:null, shootT:1, prodT:1, pulseT:1, phase:0 };
    ctx.save(); ctx.scale(scD, scD);
    p.x = 0; p.y = 62 / scD;
    ctx.translate(47 / scD, 0);
    ICON_MODE = true;
    try { drawDef(ctx, p, 0.3); }
    catch(err){ if (window.console) console.warn('icon fail(def): ' + type, err); }
    finally { ICON_MODE = false; ctx.restore(); }
  }
  /* ---- 内框 ---- */
  ctx.strokeStyle = 'rgba(36,29,21,.65)'; ctx.lineWidth = 2.8;
  rr(ctx, 2, 2, 60, 60, 6); ctx.stroke();
  ctx.strokeStyle = 'rgba(236,229,210,.5)'; ctx.lineWidth = 1;
  rr(ctx, 4.5, 4.5, 55, 55, 5); ctx.stroke();
  /* ---- 阵营绶带（左上燕尾旗） ---- */
  ctx.beginPath();
  ctx.moveTo(2.5, 2.5); ctx.lineTo(26, 2.5); ctx.lineTo(26, 8.5); ctx.lineTo(20, 5.5); ctx.lineTo(2.5, 12);
  ctx.closePath();
  ctx.fillStyle = isEnemy ? '#8a3a2c' : '#4a5a40';
  ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.4; ctx.stroke();
  /* 绶带纹章：敌=双斜杠 / 我=星 */
  if (isEnemy){
    ctx.strokeStyle = '#ece5d2'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(9, 3.5); ctx.lineTo(16, 9); ctx.moveTo(13, 3.2); ctx.lineTo(19, 7); ctx.stroke();
  } else {
    star(ctx, 10, 6.5, 4.4, '#ece5d2');
  }
  ICON_CACHE[key] = c.toDataURL();
  return ICON_CACHE[key];
}
