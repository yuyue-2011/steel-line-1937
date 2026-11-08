/* ================================================================
   《钢铁防线 1937–1945》 · 中国篇 M1 垂直切片
   data.js —— 调色板 / 网格常量 / 守军 / 敌军 / 六关卡（数值对位 PvZ 一代）
   ================================================================ */
'use strict';

/* ---- 木刻版画调色板 ---- */
const INK     = '#241d15';
const PAPER   = '#d9c9a3';
const PAPER_D = '#e2d4ae';
const RED     = '#a63a2b';
const REDL    = '#c05546';
const GREEN   = '#5b6541';   // 国军灰绿
const GREEN_D = '#3f4831';
const EUNI    = '#8a7a4e';   // 日军黄褐
const EUNI_D  = '#6b5e3a';
const SKIN    = '#d9b98c';
const WATER   = '#5d7078';
const WATER_D = '#49585f';
const STONE   = '#b3a58a';
const STONE_D = '#8d7f68';
const BRICK   = '#9c856d';
const BRICK_D = '#6e5a48';
const YELLOW  = '#c1912f';
const STEEL   = '#6f6f6a';
const STEEL_D = '#565851';
const WOOD    = '#8b6a45';
const TAN     = '#c2a875';   // 沙袋
const SILVER  = '#cfd2cd';
const NIGHTA  = 0.45;

/* ---- 网格 ---- */
const GRID = { cw:88, ch:92, x0:120, y0:46, cols:9 };

/* ================= 守军单位（同位对位 PvZ 植物，同费同冷却） ================= */
const DEF = {
  rifleman: { name:'中正式步枪兵', cost:100, cd:7.5, hp:300, kind:'shooter', rate:1.4, dmg:20, shots:1, unlock:1,
    note:'「中正式」仿毛瑟M1924，1935年定型，口径7.92mm——抗战国军主力步枪，弹药与捷克式通用。' },
  kitchen:  { name:'战地伙房', cost:50, cd:7.5, hp:300, kind:'producer', interval:24, unlock:1,
    note:'老周的扁担挑着大饼与热汤穿行战壕——一碗热汤就是阵地。' },
  sandbag:  { name:'沙袋工事', cost:50, cd:30, hp:4000, kind:'wall', unlock:1,
    note:'城砖沙袋堆垒，淞沪巷战最基础的工事。' },
  grenades: { name:'集束手榴弹', cost:150, cd:50, hp:300, kind:'instant', unlock:2,
    note:'民仿德M24木柄手榴弹束捆——台儿庄巷战肉搏神器，可清一片。' },
  maxim:    { name:'二四式水冷重机枪', cost:175, cd:7.5, hp:300, kind:'shooter', rate:1.4, dmg:20, shots:1, slow:true, unlock:2,
    note:'民国二十四年式（仿马克沁MG08），水冷套筒让枪管「冷静」——命中减速＝持续压制。' },
  mine:     { name:'制式地雷', cost:25, cd:30, hp:300, kind:'mine', arm:15, unlock:3,
    note:'铁壳防步兵雷；埋设后解除保险约需15秒，专等第一个踩上来的。' },
  sword:    { name:'大刀队', cost:150, cd:7.5, hp:300, kind:'melee', unlock:3,
    note:'西北军传统大刀夜袭，喜峰口一战成名（1933）；「破锋八刀」。近身一口一个，战后需喘息整补。' },
  pontoon:  { name:'门桥浮台', cost:25, cd:7.5, hp:300, kind:'platform', water:true, unlock:4,
    note:'运河民船门桥——让工事跨水而筑；台儿庄之战运河船户助战运兵。' },
  smg:      { name:'花机关MP18组', cost:200, cd:7.5, hp:300, kind:'shooter', rate:1.4, dmg:20, shots:2, unlock:4,
    note:'伯格曼MP18冲锋枪，俗称「花机关」，弹鼓供弹——近战泼弹如雨（双倍火力）。' },
  bastion:  { name:'城墙碉垒', cost:125, cd:30, hp:8000, kind:'wall', antiLadder:true, unlock:5,
    note:'台儿庄城墙砖垒——竹梯够不着它。城墙数度易手，砖垒功不可没。' },
  atgun:    { name:'37mm战防炮组', cost:175, cd:7.5, hp:300, kind:'torch', unlock:5,
    note:'德制Pak36式37毫米战防炮；越过其阵位的直射弹皆为穿甲燃烧弹（伤害翻倍）。台儿庄击毁日军装甲的功臣。' },
  squad:    { name:'敢死队', cost:50, cd:30, hp:300, kind:'squash', dmg:1800, unlock:6,
    note:'池峰城师长悬赏大洋组敢死队夜袭夺回城墙（1938.4.3）——扑向最近之敌，一锤定音。' },
  /* ---- M2·万家岭/长沙/上高 ---- */
  mortar82:  { name:'82迫击炮急袭', cost:125, cd:45, hp:300, kind:'jalapeno', unlock:7,
    note:'全排急速射——一道火墙清空整行来敌。史实注：82迫击炮为国军团属火力骨干，万家岭山地战立功。' },
  magnet:    { name:'磁力排雷组', cost:100, cd:7.5, hp:300, kind:'magnet', pulse:5, unlock:8,
    note:'探雷器磁脉冲一响，敌军「行头」全飞：钢盔箱、钢板、门板、竹梯、高跷、工兵镐统统掀翻。' },
  mortar:    { name:'82迫击炮组', cost:300, cd:7.5, hp:300, kind:'lob', rate:3, dmg:80, unlock:8,
    note:'曲射越墙，专治门板盾；落点溅射伤及邻敌。史实注：迫击炮曲射是巷战拆工事的正解。' },
  spike:     { name:'反坦克地刺', cost:100, cd:7.5, hp:300, kind:'spike', dps:20, unlock:9,
    note:'敌军踩上去就掉血；装甲推土车碾上即爆。不可被啃食。史实注：上高阵地前的反坦克锥与地刺阵。' },
  /* ---- M2·莫斯科篇 ---- */
  dp27:      { name:'DP-27转盘机枪', cost:325, cd:7.5, hp:300, kind:'shooter3', rate:1.4, dmg:20, unlock:10,
    note:'一挺机枪封三行——本行与上下邻行同时开火。史实注：捷格加廖夫DP轻机枪，47发转盘弹匣，苏军步兵班火力核心。' },
  bottle:    { name:'燃烧瓶组', cost:150, cd:7.5, hp:300, kind:'lobslow', rate:3, dmg:40, unlock:11,
    note:'曲射燃烧瓶，落点起火——中弹者挣扎减速3秒。史实注：1941年莫城危机时，全城加班生产燃烧瓶。' },
  katyusha:  { name:'喀秋莎·BM-13', cost:300, cd:60, hp:300, kind:'jalapeno3', unlock:12,
    note:'一次齐射覆盖三行——火箭弹洗地。史实注：BM-13「喀秋莎」齐射之声，是1941年冬天德军最怕的声音。' },
  /* ---- M2·第三批 ---- */
  ptrd:      { name:'PTRD-41反坦克枪', cost:200, cd:7.5, hp:300, kind:'avshooter', rate:2.2, dmg:20, atv:5, unlock:13,
    note:'对步兵是步枪，对载具是炮——命中装甲单位伤害×5。史实注：杰格加廖夫PTRD-41，14.5mm，两名射手一组，专打坦克观察窗与履带。' },
  marine:    { name:'黑海水兵班', cost:150, cd:7.5, hp:300, kind:'shooter', rate:1.4, dmg:20, water:true, unlock:14,
    note:'可直接部署在水道里（无需门桥）。史实注：塞瓦斯托波尔的黑海舰队水兵上岸打陆战——条纹衫水兵连是守城的最后一道狠角色。' },
  pavlov:    { name:'巴甫洛夫楼据点', cost:150, cd:20, hp:4000, kind:'thornwall', dps:25, unlock:20,
    note:'加固楼房工事，耐久极高；啃它的敌军自己掉血。史实注：巴甫洛夫中士的班在斯大林格勒一栋楼里守了58天。' },
  /* ---- M3·第一批 ---- */
  split:     { name:'巷战哨组', cost:175, cd:7.5, hp:300, kind:'splitshooter', rate:1.4, dmg:20, unlock:22,
    note:'面朝两向的近战哨位——向前打、也向后打，掘地绕后的工兵绕不过它。史实注：斯大林格勒巷战，士兵用炸开的墙洞在楼层之间打洞机动，背靠背据守楼梯间。' },
  ml20:      { name:'ML-20重榴弹炮', cost:400, cd:25, hp:400, kind:'lob', rate:5, dmg:180, splash:95, atv:1.5, unlock:23,
    note:'122mm重炮曲射——大落点大溅射，一发洗掉一片。史实注：ML-20是苏军反炮兵与压制之王，德军称之为「猛兽屠刀」。' },
  su152:    { name:'SU-152自行火炮', cost:350, cd:25, hp:450, kind:'lob', rate:4.5, dmg:120, splash:80, atv:4, unlock:24,
    note:'152mm曲射：对载具伤害×4——虎豹克星。史实注：库尔斯克的SU-152营，一炮把虎式炮塔掀离座圈的战例不止一桩，得名「动物园管理员」。' },
  /* ---- M3·第二批 ---- */
  ppsh:     { name:'波波沙冲锋枪班', cost:150, cd:7.5, hp:300, kind:'shooter', rate:0.55, dmg:9, unlock:25,
    note:'71发弹鼓泼水——单发不疼，架不住每半秒一发。史实注：PPSh-41，700发/分，巷战与近战里德军自己都爱捡来用。' },
  looters:  { name:'战利品缴获队', cost:100, cd:12.5, hp:300, kind:'salvproducer', interval:15, val:15, unlock:26,
    note:'战场上每15秒清点一次缴获（+15，胜场结算到账）。史实注：科尔松口袋里德军扔下的装备堆成了山——方面军的缴获清点队忙了整整一个月。' },
  bs3:      { name:'BS-3重反坦克炮', cost:250, cd:10, hp:350, kind:'avshooter', rate:2.6, dmg:35, atv:6, unlock:27,
    note:'100mm穿甲弹——对载具伤害×6。史实注：BS-3是在列宁格勒围城里诞生的重炮，1944年起成军，专治一切厚皮。' },
  /* ---- M3/M4·续 ---- */
  zis3:     { name:'ZiS-3加农炮', cost:175, cd:10, hp:320, kind:'avshooter', rate:2.0, dmg:28, atv:4.5, unlock:28,
    note:'76mm万能炮——对载具×4.5，造价亲民。史实注：ZiS-3产量超过10万门，格拉宾设计局——「每门炮都是一支反坦克枪」。' },
  m120:     { name:'120重迫击炮', cost:275, cd:20, hp:350, kind:'lob', rate:4, dmg:130, splash:70, atv:2.5, unlock:32,
    note:'120mm曲射——溅射+载具×2.5。史实注：PM-43 120迫击炮，师属重压制火力，德军仿制了它并命名为GrW 378(r)。' },
  is2:      { name:'IS-2冲击炮位', cost:400, cd:30, hp:600, kind:'lob', rate:5, dmg:160, splash:85, atv:5, unlock:34,
    note:'122mm坦克炮曲射——对载具×5。史实注：IS-2在塞洛高地用分装弹拆工事，一发一个机枪巢。' },
  il2:      { name:'伊尔-2校射哨', cost:200, cd:30, hp:260, kind:'jalapeno', unlock:35,
    note:'呼叫伊尔-2强击机沿整行扫射清洗——一线平。史实注：伊尔-2「飞行坦克」产量3.6万架，德军叫它「黑死神」。' },
};
const DEF_ORDER = ['rifleman','kitchen','sandbag','grenades','maxim','mine','sword','pontoon','smg','bastion','atgun','squad','mortar82','magnet','mortar','spike','dp27','bottle','katyusha','ptrd','marine','pavlov','split','ml20','su152','ppsh','looters','bs3','zis3','m120','is2','il2'];

/* ================= 军需处（缴获经济） ================= */
const UPGRADES = [
  { id:'dmg',    name:'军械升级',   desc:'所有弹药伤害 +8%',        base:400, mul:2, max:3, eff:'+8% / 级' },
  { id:'hp',     name:'军工被服',   desc:'守军单位耐久 +10%',       base:400, mul:2, max:3, eff:'+10% / 级' },
  { id:'sun',    name:'战地储备',   desc:'每关开局补给 +50',        base:300, mul:2, max:3, eff:'+50 / 级' },
  { id:'cd',     name:'补充兵员',   desc:'兵种卡冷却 -8%',          base:500, mul:2, max:3, eff:'-8% / 级' },
  { id:'heal',   name:'战地医疗队', desc:'全体守军每4秒自愈耐久',   base:600, mul:2, max:2, eff:'+3 / 4秒 / 级' },
  { id:'loot',   name:'缴获清点学', desc:'胜场缴获结算加成',        base:650, mul:2, max:2, eff:'+20% / 级' },
  { id:'refund', name:'预备队制度', desc:'铲除守军时返还部署补给',  base:500, mul:2, max:2, eff:'返还 40%/70% 布置费' },
  { id:'lamp',   name:'探照灯排',   desc:'夜战关卡敌军行进减速',    base:550, mul:2, max:2, eff:'-12% / 级' },
];

/* ================= 敌军序列（数值对位 PvZ 僵尸） ================= */
const EN = {
  infantry:   { name:'三八式步兵',     hp:270,  speed:0.22, water:false,
    note:'三八式步枪，射击精准、行动迟缓的基数单位。' },
  flagbearer: { name:'素旗指挥手',     hp:270,  speed:0.30, water:false, flag:true,
    note:'素色指挥旗一出——「大规模进攻」开始。' },
  crate:      { name:'弹药箱盔兵',     hp:640,  speed:0.22, water:false,
    note:'头顶弹药箱的辎重兵，防护升级。' },
  plate:      { name:'钢板辎重兵',     hp:1100, speed:0.20, water:false,
    note:'背负钢板的辎重兵，皮糙肉厚。' },
  officer:    { name:'参谋军官',       hp:420,  speed:0.15, rageSpeed:0.40, water:false,
    note:'举作战地图踱步；地图被打烂即「猪突」暴走。' },
  door:       { name:'门板盾兵',       hp:270,  shield:1100, speed:0.20, water:false,
    note:'拆门板为盾，正面免疫直射——怕曲射（手榴弹/地雷）与大刀队近战。' },
  ladder:     { name:'竹梯兵',         hp:500,  speed:0.35, water:false,
    note:'扛竹梯攀越工事——但城墙碉垒架不了梯。工兵铲可掀梯。' },
  banzai:     { name:'白刃猪突队',     hp:1400, speed:0.42, water:false,
    note:'白刃冲锋，快而硬——交给敢死队或城墙碉垒挡。' },
  swimmer:    { name:'泅渡爆破兵',     hp:340,  speed:0.18, water:true,
    note:'运河「水鬼」，潜行至工事前才现身——子弹打不着水下的它。' },
  boat:       { name:'强渡舟艇兵',     hp:340,  speed:0.45, afterSpeed:0.20, water:true,
    note:'乘舟疾冲，越过第一道工事后弃舟步战（只会跳一次）。' },
  /* ---- M2·万家岭/长沙/上高 ---- */
  pogo:       { name:'高跷越障兵',     hp:340,  speed:0.32, water:false,
    note:'踩着高跷一道道工事直接蹦过去——城墙碉垒能让高跷折断。' },
  digger:     { name:'掘进工兵',       hp:340,  speed:0.50, water:false,
    note:'掘地绕到阵地后方破土，从左往右拆你的家底；磁力排雷组能当场掀飞工兵镐。' },
  crusher:    { name:'装甲推土车',     hp:1350, speed:0.30, water:false, vehicle:true,
    note:'一路推平工事、碾过一切——唯有反坦克地刺能让它当场趴窝。' },
  /* ---- M2·莫斯科篇（德军） ---- */
  de_inf:     { name:'德军步兵',       hp:270,  speed:0.22, water:false,
    note:'Kar98k步枪、灰绿野战服、M35钢盔——巴巴罗萨的基干步兵。' },
  de_flag:    { name:'德军旗手',       hp:270,  speed:0.30, water:false, flag:true,
    note:'军旗前出——德军发起大规模进攻的信号。' },
  de_crate:   { name:'德军掷弹兵',     hp:640,  speed:0.22, water:false,
    note:'背负弹药箱的掷弹兵班，防护升级。' },
  de_officer: { name:'德军军官',       hp:420,  speed:0.15, rageSpeed:0.40, water:false,
    note:'举着地图板督战；地图被打烂即强令「强击」冲锋。' },
  de_storm:   { name:'德军强击群',     hp:1400, speed:0.42, water:false,
    note:'工兵强击营编成的强击群，快而硬——交给敢死队或碉垒硬顶。' },
  de_sapper:  { name:'德军战斗工兵',   hp:340,  speed:0.50, water:false,
    note:'爆破战斗工兵掘地绕后，破土后从左往右拆家；磁力排雷组能掀飞其工兵镐。' },
  de_panzer:  { name:'德军四号坦克',   hp:1800, speed:0.28, water:false, vehicle:true,
    note:'四号坦克F2型——正面碾压工事；反坦克地刺可断其履带。' },
  de_boat:    { name:'德军冲锋舟',     hp:500,  speed:0.30, water:true, afterSpeed:0.22,
    note:'载着步兵抢滩——撞上第一道工事后跃过一次，之后弃舟步战。黑海水兵班在水道里就能拦它。' },
  de_wespe:   { name:'德军黄蜂自行火炮', hp:900, speed:0.22, water:false, catapult:true,
    note:'停在阵地右缘，隔着半场朝你的工事抛155mm高爆弹——直射够得着但打着费时（900耐久、离得最远），用迫击炮、燃烧瓶或「喀秋莎」曲射敲掉它快得多。' },
  /* ---- M3·第一批 ---- */
  ro_inf:     { name:'罗军溃兵', hp:120, speed:0.24, water:false, salv:3,
    note:'天王星行动首日被打穿的罗马尼亚集团军——成群、慌乱、不经打，但架不住人多。' },
  de_frost:   { name:'冻伤德军', hp:220, speed:0.15, water:false,
    note:'被围圈里冻僵的德军——走得慢，人还多。围困战从秋天打到了冬天。' },
  de_tiger:   { name:'德军虎式坦克', hp:3600, speed:0.22, water:false, vehicle:true,
    note:'88炮重甲——正面几乎免疫直射，只有反坦克地刺、SU-152和「喀秋莎」治得了它。' },
  /* ---- M3·第二批 ---- */
  de_stug:    { name:'德军三号突击炮', hp:1500, speed:0.26, water:false, vehicle:true, salv:15,
    note:'低矮无塔的突击炮——顶盖厚、正面斜甲，专门顶着直射火力推工事。' },
  de_ss:      { name:'党卫军装甲掷弹兵', hp:320, speed:0.22, water:false, shield:160,
    note:'挂装甲盾牌的精锐掷弹兵——先打碎盾，再打人。科尔松突围时他们就这个阵形往外撞。' },
  de_ferd:    { name:'德军斐迪南坦克歼击车', hp:3000, speed:0.18, water:false, vehicle:true, salv:30,
    note:'200mm正面装甲+88炮——全游戏最硬的壳。没有机枪射击孔是它唯一的软肋。' },
  /* ---- M3/M4·续 ---- */
  ro_tank:    { name:'罗军R-2轻型坦克', hp:700, speed:0.32, water:false, vehicle:true, salv:8,
    note:'罗马尼亚的薄皮小车——快、脆、缴获还少；一炮一个，别让它们贴脸。' },
  de_panther: { name:'德军黑豹坦克', hp:2400, speed:0.26, water:false, vehicle:true, salv:22,
    note:'倾斜装甲+75长炮——速度与防护兼得。库尔斯克之后它成了德军装甲的主力。' },
  de_volks:   { name:'德军国民掷弹兵', hp:260, speed:0.2, water:false,
    note:'1944年的紧急征召兵——老的老、小的小，装备凑合。但守着本土，步兵管够。' },
};
const EN_ORDER = ['infantry','flagbearer','crate','plate','officer','door','ladder','banzai','swimmer','boat','pogo','digger','crusher','de_inf','de_flag','de_crate','de_officer','de_storm','de_sapper','de_panzer','de_boat','de_wespe','ro_inf','de_frost','de_tiger','de_stug','de_ss','de_ferd','ro_tank','de_panther','de_volks'];

/* ================= 难度三档（每关可选） ================= */
const DIFFS = [
  { id:'easy', name:'练兵', tag:'敌军-25%耐久 · 开局+75补给 · 缴获×0.5',
    hp:0.75, spd:0.94, sun:75, sky:0.85, salv:0.5 },
  { id:'norm', name:'实战', tag:'敌军-8%耐久 · 开局+30补给 · 缴获×1.0',
    hp:0.92, spd:1.00, sun:30, sky:1.00, salv:1.0 },
  { id:'hard', name:'精锐', tag:'敌军+30%耐久且提速 · 开局-25补给 · 缴获×1.5 · 首克授纪念章',
    hp:1.30, spd:1.08, sun:-25, sky:1.15, salv:1.5 },
];

/* ================= 六关卡（严格编年：1937.10.27 — 1938.4.3） ================= */
const LEVELS = [
  {
    id:1, date:'1937.10.27', title:'四行仓库 · 苏州河北岸', sub:'淞沪会战 · 第88师524团「八百壮士」',
    terrain:'sh', rows:5, night:false, sky:10, startSun:100,
    sweeper:'补充连反冲击',
    newDef:['rifleman','kitchen','sandbag'], newEn:['infantry','flagbearer'],
    brief:'淞沪会战尾声，「八百壮士」（实为四五二人）退守苏州河北岸四行仓库。你的阵地就是这栋楼。南岸租界的市民正隔河注视——每一份掷来的包裹，都是声援。',
    goal:'顶住日军步兵三波冲击，守住仓库大门。',
    tip:'先布「战地伙房」再布步枪兵——补给包裹从天而降，点击收集。',
    win:'仓库仍在。对岸的欢呼隔着河传过来——但这只是开始。',
    waves:[
      { t:20, units:[['infantry',2]] },
      { t:42, units:[['infantry',3]] },
      { t:68, huge:true, units:[['flagbearer',1],['infantry',5]] },
    ],
  },
  {
    id:2, date:'1937.10.29', title:'楼顶的旗', sub:'淞沪会战 · 坚守第3日',
    terrain:'sh', rows:5, night:true, sky:13, startSun:75,
    sweeper:'补充连反冲击',
    newDef:['grenades','maxim'], newEn:['crate'],
    brief:'10月28日夜，童子军杨惠敏泅渡苏州河送来国旗；29日清晨，国旗升起在楼顶，南岸万人欢呼。今夜市民的包裹会不断掷过河来——守住这面旗。',
    goal:'守住四行仓库，粉碎日军的夜间进攻。',
    tip:'「集束手榴弹」可清一片；水冷重机枪命中减速，用来迟滞冲锋。',
    win:'旗，还在楼顶飘。',
    waves:[
      { t:20, units:[['infantry',2]] },
      { t:42, units:[['infantry',2],['crate',1]] },
      { t:62, units:[['infantry',3],['crate',2]] },
      { t:86, huge:true, units:[['flagbearer',1],['infantry',4],['crate',2]] },
    ],
  },
  {
    id:3, date:'1937.11.01', title:'最后的守夜', sub:'淞沪会战 · 撤离租界前夜',
    terrain:'sh', rows:5, night:true, sky:22, startSun:100,
    sweeper:'孤军突击组',
    newDef:['mine','sword'], newEn:['plate'],
    brief:'坚守已四日，上峰有令：今夜全军撤入租界。这是最后一夜——日军投入了背负钢板的辎重兵，市民的包裹却越来越少。省着用。',
    goal:'守好最后一夜，掩护孤军撤离。',
    tip:'「制式地雷」便宜好用；「大刀队」近身一口一个，吃完要喘息四十二秒。',
    win:'夜色掩护下，孤军鱼贯撤入租界。四行仓库的故事，从此传遍世界。',
    waves:[
      { t:18, units:[['infantry',3]] },
      { t:38, units:[['infantry',2],['crate',2]] },
      { t:58, units:[['crate',2],['plate',1],['infantry',2]] },
      { t:84, huge:true, units:[['flagbearer',1],['infantry',5],['crate',2],['plate',2]] },
    ],
  },
  {
    id:4, date:'1938.03.27', title:'台儿庄 · 运河古镇', sub:'徐州会战 · 台儿庄战役开幕',
    terrain:'tz', rows:6, night:false, sky:11, startSun:75,
    sweeper:'预备队敢死连', sweeperWater:'河防哨艇',
    newDef:['pontoon','smg'], newEn:['officer','swimmer'],
    brief:'1938年春，战火烧到运河古镇台儿庄。日军矶谷、坂垣两师团夹击，城中运河成为天然防线。水道需先铺「门桥浮台」，民船已备好；水下有「水鬼」——泅渡爆破兵，到工事跟前才现身。',
    goal:'守住运河古镇，顶住五波进攻。',
    tip:'水道上先铺门桥浮台才能布兵；「花机关」双倍火力，配水冷机枪压制。军官的地图被打烂会暴走。',
    win:'古镇未失。巷战，才刚刚开始。',
    waves:[
      { t:18, units:[['infantry',2]] },
      { t:36, units:[['infantry',2],['officer',1],['swimmer',1]] },
      { t:56, units:[['infantry',2],['swimmer',2],['crate',1]] },
      { t:78, units:[['infantry',3],['officer',2],['swimmer',2]] },
      { t:102, huge:true, units:[['flagbearer',1],['infantry',4],['crate',2],['officer',1],['swimmer',2]] },
    ],
  },
  {
    id:5, date:'1938.03.31', title:'西北城墙', sub:'台儿庄战役 · 城墙拉锯',
    terrain:'tz', rows:6, night:false, sky:11, startSun:100,
    sweeper:'预备队敢死连', sweeperWater:'河防哨艇',
    newDef:['bastion','atgun'], newEn:['door','ladder','boat'],
    brief:'台儿庄城墙数度易手，日军搬来门板当盾、竹梯攀墙。把「城墙碉垒」筑起来——竹梯够不着它；「37mm战防炮」能给直射弹药换穿甲弹头。',
    goal:'城墙不倒，台儿庄不丢。',
    tip:'门板盾兵正面免疫直射——用集束手榴弹、地雷或大刀队破盾；舟艇兵只会跳过第一道工事，后面再设一层。',
    win:'砖垒上弹痕累累，但每一块砖都还在。',
    waves:[
      { t:16, units:[['infantry',2],['ladder',1]] },
      { t:34, units:[['door',2],['infantry',2],['boat',1]] },
      { t:54, units:[['ladder',1],['crate',2],['boat',2],['swimmer',1]] },
      { t:76, units:[['door',2],['infantry',2],['officer',1],['swimmer',2]] },
      { t:100, huge:true, units:[['flagbearer',1],['door',2],['ladder',2],['crate',2],['officer',1],['infantry',3],['boat',2],['swimmer',1]] },
    ],
  },
  {
    id:6, date:'1938.04.03', title:'敢死队之夜', sub:'台儿庄战役 · 池峰城师长悬赏组敢死队',
    terrain:'tz', rows:6, night:true, sky:15, startSun:125,
    sweeper:'预备队敢死连', sweeperWater:'河防哨艇',
    newDef:['squad'], newEn:['banzai'],
    brief:'4月3日，池峰城师长悬赏大洋组织敢死队，夜袭夺回西北城墙。今夜你将亲自放他们出去。日军白刃猪突队倾巢而出——快而硬。挺过去，外线大反攻就在明日。',
    goal:'夺回之夜：顶住最后的总攻。',
    tip:'「敢死队」会扑向最近的敌人，一锤定音——留给白刃猪突队；城墙碉垒是它们的最好对手。',
    win:'4月6日，外线汤恩伯军团全线反攻——台儿庄大捷！此役之后，徐州战场攻守易势。〔台儿庄篇完〕',
    waves:[
      { t:16, units:[['infantry',2],['crate',1]] },
      { t:34, units:[['banzai',2],['infantry',2],['door',1]] },
      { t:52, units:[['crate',2],['plate',1],['officer',1],['swimmer',2]] },
      { t:72, units:[['banzai',3],['door',2],['ladder',1],['boat',2]] },
      { t:96, huge:true, units:[['flagbearer',1],['banzai',4],['infantry',3],['crate',2],['plate',1],['door',2],['swimmer',2]] },
    ],
  },
  /* ============ M2 第一批：万家岭 — 长沙 — 上高 ============ */
  {
    id:7, date:'1938.10.07', title:'万家岭 · 张古山', sub:'万家岭战役 · 第74军51师',
    terrain:'ml', rows:5, night:false, sky:10, startSun:100, speedMul:0.92,
    sweeper:'突击队反冲击',
    newDef:['mortar82'], newEn:['pogo'],
    brief:'1938年10月，日军第106师团钻进德安以西的山坳。74军强攻张古山——突击队攀崖夜袭，居高临下。坡地阻滞敌军步子，但日军工兵踩着高跷，一道道工事直接蹦过去。',
    goal:'夺回并守住张古山阵地。',
    tip:'高跷兵蹦得过沙袋，蹦不过「城墙碉垒」；「82迫击炮急袭」可整行急射清场。',
    win:'10月10日，万家岭大捷——106师团被歼逾半，几遭全歼。这是抗战中唯一几乎成建制歼灭日军师团的战例。',
    waves:[
      { t:16, units:[['infantry',2],['crate',1]] },
      { t:36, units:[['infantry',2],['pogo',2]] },
      { t:56, units:[['plate',1],['pogo',2],['crate',2]] },
      { t:76, units:[['pogo',3],['infantry',2],['officer',1]] },
      { t:98, huge:true, units:[['flagbearer',1],['pogo',3],['plate',2],['infantry',4],['crate',1]] },
    ],
  },
  {
    id:8, date:'1939.09.23', title:'长沙 · 街巷泥沼', sub:'第一次长沙会战 · 第52军/第74军',
    terrain:'cs', rows:5, night:false, sky:10, startSun:100, mudRows:[2],
    sweeper:'预备队反冲击',
    newDef:['magnet','mortar'], newEn:['digger'],
    brief:'1939年9月，第一次长沙会战。湘北街巷泥沼遍地——敌军陷进去步子就慢半拍。但日军的掘进工兵会钻地绕到你身后，破土后从左往右拆你的家底。',
    goal:'守住长沙，顶住五波攻势。',
    tip:'「磁力排雷组」能周期掀飞门板、高跷、工兵镐；「82迫击炮组」曲射越盾。掘进工兵现身回头时，靠前的伙房也能打它。',
    win:'10月中旬，迫敌全线退却——第一次长沙会报捷，湘省无恙。',
    waves:[
      { t:16, units:[['infantry',2]] },
      { t:34, units:[['digger',1],['crate',2],['pogo',1]] },
      { t:54, units:[['digger',2],['door',1],['infantry',2]] },
      { t:74, units:[['digger',1],['pogo',2],['plate',1],['officer',1]] },
      { t:96, huge:true, units:[['flagbearer',1],['digger',2],['door',2],['crate',2],['infantry',3],['pogo',1]] },
    ],
  },
  {
    id:9, date:'1941.03.15', title:'上高 · 旱田血战', sub:'上高会战 · 第74军',
    terrain:'sg', rows:5, night:false, sky:11, startSun:125,
    sweeper:'预备队反冲击',
    newDef:['spike'], newEn:['crusher'],
    brief:'1941年3月，上高。日军第33、34师团分路合击，74军在上高城下硬顶。敌军出动了装甲推土车——一路推平工事，唯有反坦克地刺能让它趴窝。',
    goal:'打赢这场「抗战以来最精彩之战」。',
    tip:'地刺不可被啃食，敌军踩上去就掉血；装甲推土车碾上地刺即毁。集束手榴弹与敢死队也能炸穿它。',
    win:'上高大捷——何应钦称之为「抗战以来最精彩之作战」。1941年4月，湘赣边界，举国振奋。〔中国篇完〕',
    waves:[
      { t:16, units:[['infantry',2],['crusher',1]] },
      { t:34, units:[['crusher',1],['crate',2],['pogo',1]] },
      { t:54, units:[['crusher',2],['door',1],['digger',2],['officer',1]] },
      { t:74, units:[['door',2],['pogo',2],['plate',1],['crusher',1],['crate',2]] },
      { t:96, huge:true, units:[['flagbearer',1],['crusher',2],['door',2],['digger',2],['plate',2],['banzai',3],['infantry',2]] },
    ],
  },
  /* ============ M2 第二批：莫斯科篇·前三关 ============ */
  {
    id:10, date:'1941.11.07', title:'红场 · 阅兵场', sub:'莫斯科保卫战 · 红场十月革命节阅兵',
    terrain:'ms', rows:5, night:false, sky:9, startSun:125, faction:'de',
    sweeper:'西伯利亚营反冲击',
    newDef:['dp27'], newEn:['de_inf','de_officer','de_flag'],
    brief:'1941年11月7日，德军兵临城下，斯大林力排众议照常举行红场阅兵——受阅部队穿过克里姆林宫的红墙，直接开赴前线。你手里是刚列装的DP-27转盘机枪：一挺封三行。守住红场。',
    goal:'守住红场西侧阵地，粉碎德军先头部队。',
    tip:'「DP-27转盘机枪」同时压制本行与上下邻行——摆在行与行之间收益最大。',
    win:'受阅部队直接开赴前线——广播把这一幕传遍世界：莫斯科没有投降。〔莫斯科篇·第一幕〕',
    waves:[
      { t:16, units:[['de_inf',2]] },
      { t:36, units:[['de_inf',2],['de_crate',1]] },
      { t:56, units:[['de_officer',1],['de_inf',3]] },
      { t:76, units:[['de_crate',2],['de_inf',3]] },
      { t:98, huge:true, units:[['de_flag',1],['de_crate',2],['de_officer',1],['de_inf',4]] },
    ],
  },
  {
    id:11, date:'1941.11.16', title:'沃洛科拉姆斯克 · 28勇士', sub:'莫斯科保卫战 · 潘菲洛夫师28勇士',
    terrain:'ms', rows:5, night:true, sky:12, startSun:125, faction:'de',
    sweeper:'西伯利亚营反冲击',
    newDef:['bottle'], newEn:['de_storm','de_panzer','de_crate'],
    brief:'11月16日，沃洛科拉姆斯克方向。潘菲洛夫步兵师的28名战士在杜博谢科沃会让站挡住德军坦克纵队——政治指导员克洛奇科夫高喊：「俄罗斯虽大，但我们已无路可退——身后就是莫斯科！」敌军强击群与四号坦克来了。',
    goal:'在杜博谢科沃让坦克停下来。',
    tip:'「燃烧瓶组」曲射越盾并使敌军着火减速3秒；夜战空投稀少，弹药要省。反坦克地刺断履带。',
    win:'28勇士拖住了整整一个坦克纵队。11月底，德军再无力推进——莫城之下，闪电神话开始碎裂。',
    waves:[
      { t:16, units:[['de_inf',2],['de_crate',1]] },
      { t:36, units:[['de_storm',2],['de_inf',2]] },
      { t:56, units:[['de_panzer',1],['de_officer',1],['de_inf',2]] },
      { t:76, units:[['de_storm',2],['de_panzer',1],['de_crate',2]] },
      { t:98, huge:true, units:[['de_flag',1],['de_storm',3],['de_panzer',2],['de_officer',1],['de_inf',3]] },
    ],
  },
  {
    id:12, date:'1941.12.05', title:'莫斯科 · 大反攻', sub:'莫斯科保卫战 · 加里宁方面军/西方面军反攻',
    terrain:'ms', rows:5, night:false, sky:10, startSun:150, faction:'de', sweeperTank:true,
    sweeper:'T-34坦克营反冲击',
    newDef:['katyusha'], newEn:['de_sapper'],
    brief:'12月5日，科涅夫与朱可夫的方面军全线转入反攻。严冬降临，德军冻在雪原上动弹不得——而你的「喀秋莎」火箭炮已装填完毕，反冲击的T-34已发动引擎。德军战斗工兵还会掘地绕后，小心你的家底。',
    goal:'全线反攻——把德军打回出发线！',
    tip:'「喀秋莎」一次齐射覆盖三行；T-34反冲击一锤定音；掘地工兵现身回头时，靠前的伙房也能打它。',
    win:'1942年1月，德军被逐退100—250公里——莫斯科保卫战胜利。德军在二战中的第一个重大战略失败。〔莫斯科篇完〕',
    waves:[
      { t:16, units:[['de_inf',2],['de_panzer',1]] },
      { t:36, units:[['de_sapper',1],['de_crate',2],['de_inf',1]] },
      { t:56, units:[['de_sapper',2],['de_storm',2],['de_panzer',1],['de_officer',1]] },
      { t:74, units:[['de_panzer',2],['de_storm',2],['de_crate',2]] },
      { t:96, huge:true, units:[['de_flag',1],['de_panzer',2],['de_storm',3],['de_sapper',2],['de_inf',2],['de_officer',1]] },
    ],
  },
  /* ============ M2 第三批：勒热夫 → 塞瓦斯托波尔 → 斯大林格勒 ============ */
  {
    id:13, date:'1942.01.08', title:'勒热夫 · 绞肉机', sub:'勒热夫-维亚济马进攻战役 · 加里宁方面军',
    terrain:'ms', rows:5, night:false, sky:9, startSun:125, faction:'de',
    sweeper:'西伯利亚营反冲击',
    newDef:['ptrd'], newEn:[],
    brief:'1942年1月8日，科涅夫的加里宁方面军向勒热夫突出部发起强攻——这里钉着德军中央集团军群最锋利的箭头。莫德尔在冰原上层层设防，四号坦克与强击群不断反扑。你手里有了新家伙：PTRD-41反坦克枪，14.5毫米，专敲坦克的观察窗和履带。',
    goal:'在突出部南翼守住突破口，拖住德军中央集团军群。',
    tip:'PTRD对步兵只有普通步枪火力，但对装甲单位伤害×5——摆在坦克必经之路上，比集束手榴弹稳得多。',
    win:'勒热夫没有攻下来——但突出部被死死咬住。德军9个师被钉在冰原上无法南调。几个月后，这些本可以出现在斯大林格勒的师，还在勒热夫的雪里挨冻。〔绞肉机之名，由此而来〕',
    waves:[
      { t:16, units:[['de_inf',2],['de_crate',1]] },
      { t:36, units:[['de_panzer',1],['de_officer',1],['de_inf',2]] },
      { t:56, units:[['de_panzer',2],['de_storm',1],['de_crate',1]] },
      { t:76, units:[['de_panzer',2],['de_officer',2],['de_storm',2]] },
      { t:98, huge:true, units:[['de_flag',1],['de_panzer',3],['de_storm',3],['de_crate',2],['de_officer',1],['de_inf',2]] },
    ],
  },
  {
    id:14, date:'1942.06.02', title:'塞瓦斯托波尔 · 要塞海', sub:'塞瓦斯托波尔围城 · 黑海舰队水兵上岸',
    terrain:'sv', rows:5, night:false, sky:10, startSun:125, faction:'de',
    sweeper:'海军步兵反冲击', sweeperWater:'黑海哨艇',
    newDef:['marine'], newEn:['de_boat'],
    brief:'1942年夏，曼施坦因的第11集团军用「古斯塔夫」巨炮轰击塞瓦斯托波尔。城市依托湾汊与炮台据守——黑海舰队的水兵把军舰上的炮搬上岸，人也都上了岸。德军冲锋舟正从海面扑来：条带水道是你最后的防线，水兵班可以直接下水布防。',
    goal:'守住塞瓦斯托波尔湾岸，掩护运输船队抢运伤员撤离。',
    tip:'「黑海水兵班」无需门桥浮台即可部署在水道中，先手拦住冲锋舟；陆上用PTRD和反坦克地刺对付装甲。',
    win:'要塞坚守了250个昼夜。6月30日，守军奉命撤离——塞瓦斯托波尔陷落，但它吞掉了德军第11集团军整整一个夏天。这支部队没能出现在伏尔加河畔。〔黑海之血，没有白流〕',
    waves:[
      { t:16, units:[['de_boat',2],['de_inf',1]] },
      { t:36, units:[['de_boat',2],['de_crate',1],['de_inf',2]] },
      { t:56, units:[['de_boat',3],['de_storm',1],['de_officer',1]] },
      { t:76, units:[['de_boat',3],['de_storm',2],['de_panzer',1]] },
      { t:98, huge:true, units:[['de_flag',1],['de_boat',4],['de_storm',3],['de_panzer',1],['de_officer',1],['de_crate',2]] },
    ],
  },
  /* ================================================================
     V8.0 · 按计划插入：北非篇（英第8集团军）+ 太平洋篇（美陆战1师）
     史实：阿拉曼盒子 42.7.2 / 伊鲁河口 42.8.21 / 阿拉姆哈勒法 42.8.31-9.5 /
     埃德森岭血岭 42.9.13 / 马坦尼考沙洲 42.10.25
     ================================================================ */
  {
    id:15, date:'1942.07.02', title:'阿拉曼 · 盒子', sub:'第一次阿拉曼战役 · 英第8集团军',
    terrain:'ds', rows:5, night:false, sky:10, startSun:160, faction:'de',
    sweeper:'第2新西兰师反冲击',
    newDef:[], newEn:['de_inf','de_stug'],
    brief:'1942年7月，埃及边境。隆美尔推进到阿拉曼——再往东八十英里就是亚历山大港和尼罗河三角洲。英军在这里构筑了一连串「盒子」：环形工事加密集雷场，钉死在铁路两侧。守壕人把工兵铲插进沙里——这一次，脚下不是河泥，是沙漠。',
    goal:'守住「盒子」防线，挡住非洲装甲军的第一次冲击。',
    tip:'沙地开阔无水道，正面平防；III号突击炮走中路——37mm战防炮前置点名；掷弹兵波次稳，机枪+沙袋标准作业。',
    win:'非洲军的锋头在盒子前钝了。双方就此僵持——这两个月里，铁路两侧的沙地上埋下了几十万颗地雷。〔北非 · 盒子防线〕',
    waves:[
      { t:14, units:[['de_inf',6]] },
      { t:34, units:[['de_inf',7],['de_stug',1]] },
      { t:54, units:[['de_officer',1],['de_inf',8],['de_crate',2]] },
      { t:74, units:[['de_stug',1],['de_inf',8],['de_sapper',2]] },
      { t:94, huge:true, units:[['de_flag',1],['de_stug',2],['de_officer',1],['de_inf',10],['de_crate',2],['de_sapper',3]] },
    ],
  },
  {
    id:16, date:'1942.08.21', title:'伊鲁河口 · 夜袭', sub:'瓜达尔卡纳尔战役 · 美陆战1师',
    terrain:'ml', rows:5, night:true, sky:9, startSun:165, faction:'jp',
    sweeper:'陆战队预备营',
    newDef:[], newEn:['infantry','banzai'],
    brief:'1942年8月21日凌晨，瓜岛。一木支队——缺一个整数都算侮辱的七百人——在伊鲁河口沙嘴上发起了他们的「白兵万能」：刺刀冲锋，直扑滩头。他们相信美国人一触即溃。椰林里等着他们的，是成排的重机枪。',
    goal:'守住滩头阵地，粉碎一木支队的夜袭。',
    tip:'夜战丛林空投稀少；万岁冲锋来得快——机枪贴前排、地雷埋滩口；预留弹药给第二波。',
    win:'天亮时，河口的沙嘴上再没有站着的日本兵。一木清直在海滩上烧掉了军旗。太平洋的第一课：他们不会退。〔瓜岛 · 河口之夜〕',
    waves:[
      { t:12, units:[['banzai',5],['infantry',4]] },
      { t:32, units:[['banzai',6],['infantry',5]] },
      { t:52, units:[['officer',1],['banzai',6],['infantry',6]] },
      { t:72, units:[['banzai',5],['infantry',7],['crate',1]] },
      { t:90, huge:true, units:[['flagbearer',1],['banzai',10],['infantry',8],['officer',1]] },
    ],
  },
  {
    id:17, date:'1942.08.31', title:'阿拉姆哈勒法 · 矛头之夜', sub:'阿拉姆哈勒法战役 · 英第8集团军',
    terrain:'ds', rows:5, night:true, sky:9, startSun:170, faction:'de',
    sweeper:'第44师夜战群',
    newDef:[], newEn:['de_inf','de_stug','de_sapper'],
    brief:'8月31日夜，阿拉姆哈勒法岭。隆美尔最后一次尝试绕过阿拉曼——装甲矛头折向东南，撞上的是埋伏在岭脊反斜面上的英军。蒙哥马利刚到中东八天，他给前线只下了一条指令：不许主动追击，让他们来撞。炮声在沙漠夜里滚了一整夜。',
    goal:'依托岭脊反斜面，折断非洲军的装甲矛头。',
    tip:'夜沙空投稀少，弹药精打；工兵渗透要纵深排雷；矛头会绕行——两道沙袋墙，别把家底压在第一线。',
    win:'9月2日，隆美尔收兵。非洲军从此再无力发起进攻——阿拉曼的僵局，变成了绞索。〔北非 · 矛头折断〕',
    waves:[
      { t:12, units:[['de_inf',6],['de_sapper',2]] },
      { t:32, units:[['de_stug',1],['de_inf',8]] },
      { t:52, units:[['de_officer',1],['de_stug',1],['de_sapper',3],['de_inf',8]] },
      { t:70, units:[['de_stug',2],['de_inf',9],['de_crate',2]] },
      { t:88, huge:true, units:[['de_flag',1],['de_stug',2],['de_officer',1],['de_sapper',4],['de_inf',11],['de_crate',3]] },
    ],
  },
  {
    id:18, date:'1942.09.05', title:'阿拉姆哈勒法 · 装甲撞墙', sub:'阿拉姆哈勒法战役 · 英第8集团军',
    terrain:'ds', rows:5, night:false, sky:10, startSun:170, faction:'de', sweeperTank:true,
    sweeper:'沙漠空军急袭编队',
    newDef:[], newEn:['de_stug','de_officer','de_sapper'],
    brief:'9月5日，黎明。15装甲师的坦克迎着朝阳撞向岭脊——它们要为前夜的失败讨个说法。岭后是成排的反坦克炮和野炮，天上盘旋着「沙漠空军」的战斗轰炸机。非洲军最后的进攻动能，将在今天耗尽在这道墙上。',
    goal:'守住岭脊炮阵地，耗尽非洲军装甲预备队。',
    tip:'篇末总攻：突击炮集群冲锋——反坦克地刺+PTRD前压；空军急袭会自动清行；弹药箱护送队要速决。',
    win:'黄昏点验战场：非洲军的进攻动能耗尽。双方都心照不宣——下一场总攻，将从另一方发起。〔北非 · 装甲撞墙〕',
    waves:[
      { t:12, units:[['de_inf',7],['de_crate',2]] },
      { t:32, units:[['de_stug',2],['de_officer',1],['de_inf',8]] },
      { t:52, units:[['de_stug',2],['de_sapper',3],['de_inf',9]] },
      { t:70, units:[['de_stug',3],['de_officer',1],['de_crate',3],['de_inf',10]] },
      { t:88, huge:true, units:[['de_flag',1],['de_stug',4],['de_officer',1],['de_sapper',4],['de_crate',3],['de_inf',12]] },
    ],
  },
  {
    id:19, date:'1942.09.13', title:'血岭之夜', sub:'瓜达尔卡纳尔战役 · 埃德森岭',
    terrain:'ml', rows:5, night:true, sky:9, startSun:170, faction:'jp',
    sweeper:'袭击营预备队',
    newDef:[], newEn:['banzai','officer','pogo'],
    brief:'9月13日夜，埃德森岭。川口支队三千人摸黑穿过丛林，向这条俯瞰机场的珊瑚脊发起「斩断式」夜袭。岭上只有八百余名陆战队员——岭失，机场即失。这一夜在战史里留下了一个名字：血岭（Bloody Ridge）。',
    goal:'死守埃德森岭，保住亨德森机场。',
    tip:'夜丛林主战场：万岁波一波接一波——沙袋墙后放机枪；高跷侦察兵越障抄后，碉垒封路；弹药见底时，机场炮群会替你收尾。',
    win:'9月14日黎明，日军遗尸阵地前。山脊保住了——机场的飞机，天亮照常起飞。〔瓜岛 · 血岭〕',
    waves:[
      { t:12, units:[['banzai',6],['pogo',2]] },
      { t:30, units:[['officer',1],['banzai',7],['infantry',5]] },
      { t:48, units:[['banzai',8],['pogo',3],['infantry',6]] },
      { t:66, units:[['officer',1],['banzai',8],['infantry',7],['crate',1]] },
      { t:84, huge:true, units:[['flagbearer',1],['banzai',12],['pogo',4],['infantry',9],['officer',1]] },
    ],
  },
  {
    id:20, date:'1942.09.13', title:'斯大林格勒 · 一寸山河', sub:'斯大林格勒战役 · 巷战开幕',
    terrain:'ruin', rows:5, night:false, sky:8, startSun:150, faction:'de', sweeperTank:true,
    sweeper:'T-34工厂队反冲击',
    newDef:['pavlov'], newEn:['de_wespe'],
    brief:'1942年9月13日，德军突入斯大林格勒城。崔可夫的命令只有一句：「贴上去——离敌人越近，他的炮兵越不敢开火。」废墟之间的近战开始了。城东河畔，巴甫洛夫中士和他的班正在加固一栋四层楼；德军的黄蜂自行火炮停在半场外，朝你的每一处工事抛高爆弹。',
    goal:'守住中央车站与巴甫洛夫楼之间的街区。',
    tip:'「巴甫洛夫楼据点」耐久极高且啃它的人自己掉血；黄蜂自行火炮停在右缘、离得最远——步枪够得着但磨得慢，用迫击炮/燃烧瓶曲射或「喀秋莎」一发洗掉更划算。',
    win:'这栋楼后来以「巴甫洛夫楼」之名载入战史——58天，德军没能跨过它。城市还剩最后一口气，而伏尔加河对岸，天王星行动的炮口已经悄然昂起……〔M3 预告：天王星反击 1942.11.19〕',
    waves:[
      { t:16, units:[['de_inf',2],['de_wespe',1]] },
      { t:36, units:[['de_storm',2],['de_sapper',1],['de_inf',1]] },
      { t:56, units:[['de_wespe',1],['de_panzer',1],['de_officer',1],['de_inf',2]] },
      { t:74, units:[['de_wespe',2],['de_storm',2],['de_sapper',2]] },
      { t:96, huge:true, units:[['de_flag',1],['de_wespe',2],['de_panzer',2],['de_storm',3],['de_sapper',2],['de_officer',1],['de_inf',2]] },
    ],
  },
  /* ============ M3 第一批：天王星 → 指环行动 → 库尔斯克 ============ */
  {
    id:21, date:'1942.10.25', title:'沙洲万岁', sub:'瓜达尔卡纳尔战役 · 马坦尼考沙洲',
    terrain:'ml', rows:5, night:false, sky:10, startSun:175, faction:'jp', sweeperTank:true,
    sweeper:'陆战队炮群急袭',
    newDef:[], newEn:['banzai','crusher','crate'],
    brief:'10月25日，马坦尼考河口沙洲。丸山师团的总攻败退了，「仙台武士」的残部被赶下沙洲——九五式轻战车碾着河水压上来，步兵端着刺刀跟在车后。沙洲只有两百米宽，退一步就是海。',
    goal:'封死沙洲通道，全歼仙台师团残部。',
    tip:'轻战车走水线冲滩——反坦克地刺前置滩口；万岁残兵密集——机枪+手榴弹齐射；弹药箱堆护送优先打掉。',
    win:'潮水退去时，沙洲上的「万岁」声停了。仙台师团的旗，再也没有在瓜岛升起过。〔瓜岛 · 沙洲终章〕',
    waves:[
      { t:12, units:[['banzai',6],['infantry',6]] },
      { t:32, units:[['crusher',1],['banzai',7],['infantry',7]] },
      { t:52, units:[['crusher',1],['crate',2],['banzai',8],['infantry',7]] },
      { t:70, units:[['crusher',2],['banzai',8],['infantry',9],['crate',2]] },
      { t:88, huge:true, units:[['flagbearer',1],['crusher',3],['banzai',10],['crate',3],['infantry',11],['officer',1]] },
    ],
  },
  {
    id:22, date:'1942.11.19', title:'天王星 · 合围', sub:'天王星行动 · 西南方面军/顿河方面军',
    terrain:'ms', rows:5, night:false, sky:9, startSun:150, faction:'de',
    sweeper:'近卫第2集团军反冲击',
    newDef:['split'], newEn:['ro_inf'],
    brief:'1942年11月19日晨，雾。瓦图京的西南方面军在冰原上放出了蓄力三周的一拳——罗马尼亚第3集团军的防线在一天之内被打穿。黄昏时，T-34的前灯已经在向卡拉奇会合。你守的是合围圈上的一段侧翼：罗马尼亚溃兵成群涌来，混着德军的战斗群；城里派来的巷战哨组身经百战——他们向前开火，也向后开火。',
    goal:'守住合围圈侧翼，接应两翼装甲集群的钳形会合。',
    tip:'「巷战哨组」双向射击，是防掘地工兵与绕后散兵的定心丸；罗军溃兵不经打但架不住人多，DP-27三行机枪最划算。',
    win:'11月23日，两支装甲矛头在卡拉奇会师——33万德军被装进了斯大林格勒口袋。前线广播只说了一句话：「我们合围了他们。」〔口袋收紧了〕',
    waves:[
      { t:16, units:[['ro_inf',5],['de_inf',1]] },
      { t:36, units:[['ro_inf',8],['de_officer',1]] },
      { t:56, units:[['ro_inf',10],['de_storm',1],['de_panzer',1]] },
      { t:76, units:[['ro_inf',12],['de_panzer',1],['de_officer',1]] },
      { t:98, huge:true, units:[['ro_inf',16],['de_flag',1],['de_panzer',2],['de_storm',2],['de_officer',1]] },
    ],
  },
  {
    id:23, date:'1943.01.10', title:'指环行动 · 收网', sub:'斯大林格勒围歼战 · 顿河方面军',
    terrain:'ms', rows:5, night:true, sky:8, startSun:125, faction:'de',
    sweeper:'第64集团军突击群',
    newDef:['ml20'], newEn:['de_frost'],
    brief:'1943年1月10日，罗科索夫斯基的顿河方面军对口袋发起最后清剿。包围圈里的德军第6集团军已经没有冬装、没有弹药、没有面包——他们在冻土上挣扎着打完最后几发子弹。你的ML-20重榴弹炮已经就位：122毫米，一发上去，什么阵地都不存在了。夜里打，省着点补给。',
    goal:'分割压缩包围圈，逐段吃掉被围德军。',
    tip:'夜战空投稀少，ML-20贵但一发顶一片——优先砸军官与坦克扎堆的行；冻伤德军走得慢，正好给你攒缴获。',
    win:'1月31日，保卢斯带着91000名冻伤的部下走进了战俘营——德军在斯大林格勒输掉了整整一个集团军。柏林那天的广播放了贝多芬葬礼进行曲。〔伏尔加河畔，枪声渐息〕',
    waves:[
      { t:16, units:[['de_frost',4],['de_inf',1]] },
      { t:36, units:[['de_frost',6],['de_officer',1],['de_inf',2]] },
      { t:56, units:[['de_frost',8],['de_panzer',1],['de_wespe',1]] },
      { t:76, units:[['de_frost',10],['de_storm',2],['de_officer',1]] },
      { t:98, huge:true, units:[['de_flag',1],['de_frost',12],['de_panzer',2],['de_storm',2],['de_wespe',1],['de_officer',1]] },
    ],
  },
  {
    id:24, date:'1943.07.12', title:'库尔斯克 · 铁犁', sub:'库尔斯克会战 · 普罗霍罗夫卡',
    terrain:'cs', rows:5, night:false, sky:9, startSun:175, faction:'de', sweeperTank:true,
    sweeper:'近卫第5坦克集团军反冲击',
    newDef:['su152'], newEn:['de_tiger'],
    brief:'1943年7月12日晨，普罗霍罗夫卡的麦浪还带着露水。德军的「城堡」攻势冲到这里已经是强弩之末——但冲在最前面的，是新到的虎式重型坦克：88炮，重甲，正面几乎免疫直射。你身后的自行火炮营换装了SU-152：152毫米榴弹，专治各种装甲厚皮。罗特米斯特罗夫的近卫第5坦克集团军正在待命反冲击。',
    goal:'顶住德军装甲矛头的最后冲击，随后转入反攻。',
    tip:'虎式交SU-152曲射（载具×4）或反坦克地刺；PTRD+燃烧瓶减速拉扯；「喀秋莎」留给旗手那波。麦田开阔地没有遮蔽——火力纵深就是你的一切。',
    win:'黄昏时分，普罗霍罗夫卡草原上烧着几百辆坦克。德军在东线的最后一次战略进攻，到此为止。从此，红军掌握的不再只是防御……〔M3 第一批完〕',
    waves:[
      { t:16, units:[['de_inf',2],['de_panzer',1]] },
      { t:36, units:[['de_tiger',1],['de_storm',2],['de_inf',1]] },
      { t:56, units:[['de_tiger',1],['de_panzer',2],['de_wespe',1],['de_officer',1]] },
      { t:74, units:[['de_tiger',2],['de_panzer',2],['de_sapper',2],['de_storm',2]] },
      { t:96, huge:true, units:[['de_flag',1],['de_tiger',3],['de_panzer',3],['de_wespe',2],['de_storm',3],['de_officer',1],['de_inf',2]] },
    ],
  },
  /* ============ M3 第二批：第聂伯河 → 科尔松 → 巴格拉季昂 ============ */
  {
    id:25, date:'1943.09.30', title:'第聂伯河 · 抢滩', sub:'下第聂伯罗夫斯克攻势 · 中央方面军',
    terrain:'dn', waterRows:[2], rows:5, night:false, sky:9, startSun:150, faction:'de',
    sweeper:'第聂伯河区舰队哨艇',
    newDef:['ppsh'], newEn:['de_stug'],
    brief:'1943年9月末，两个方面军顶着空袭连夜泅渡第聂伯河。你踹上右岸的第一脚已经站稳——一个桥头堡，正被德军的反扑反复冲刷。冲锋舟还在往返摆渡，波波沙班刚上岸就往沙袋后面滚；对岸推过来的，是低矮的三号突击炮。',
    goal:'守住右岸桥头堡，掩护舟桥纵队架设重桥。',
    tip:'「波波沙冲锋枪班」近距泼弹专拦冲锋舟跳滩的步兵；水道那行可用门桥浮台+水兵班前置；突击炮正面硬，交给PTRD与SU-152曲射。',
    win:'10月里，60个师从你身后踏过浮桥。第聂伯河右岸的登陆场连成一片——曼施坦因的「东方壁垒」塌了半边。〔渡河成功〕',
    waves:[
      { t:16, units:[['de_inf',2],['de_boat',1]] },
      { t:36, units:[['de_boat',2],['de_storm',1],['de_inf',1]] },
      { t:56, units:[['de_stug',1],['de_officer',1],['de_boat',2]] },
      { t:76, units:[['de_stug',2],['de_storm',2],['de_sapper',1]] },
      { t:98, huge:true, units:[['de_flag',1],['de_stug',2],['de_panzer',1],['de_boat',3],['de_storm',2],['de_officer',1]] },
    ],
  },
  {
    id:26, date:'1944.01.28', title:'科尔松 · 收口', sub:'科尔松-舍甫琴科夫斯基战役 · 乌克兰第1方面军',
    terrain:'cs', rows:5, night:false, sky:9, startSun:150, faction:'de', mudRows:[2],
    sweeper:'乌克兰第1方面军反冲击',
    newDef:['looters'], newEn:['de_ss'],
    brief:'1944年1月末，德军两个军被合围在科尔松的「大锅」里。解围的突围集群挂着装甲盾牌往你的口袋墙上撞——党卫军装甲掷弹兵打头。雪开始化了，泥浆没过脚踝。你身后新上来的缴获清点队已经在做战场笔记：打完这一仗，什么都归账。',
    goal:'扎紧口袋，顶住德军突围集群的垂死冲撞。',
    tip:'「战利品缴获队」每15秒+15缴获（胜场到账），后方摆一排稳赚；装甲掷弹兵先碎盾再伤人，DP-27+迫击炮混着打；解冻泥泞行军会拖慢双方。',
    win:'2月17日雪停，突围的德军扔下装备在泥里投降——德军在乌克兰输掉了第二个「斯大林格勒」。缴获堆成的山，清点了一个月。〔口袋又一次收紧〕',
    waves:[
      { t:16, units:[['de_inf',2],['de_ss',1]] },
      { t:36, units:[['de_ss',2],['de_officer',1],['de_inf',1]] },
      { t:56, units:[['de_ss',2],['de_stug',1],['de_wespe',1]] },
      { t:76, units:[['de_ss',3],['de_storm',2],['de_sapper',1],['de_officer',1]] },
      { t:98, huge:true, units:[['de_flag',1],['de_ss',4],['de_stug',2],['de_panzer',1],['de_storm',2],['de_officer',1]] },
    ],
  },
  {
    id:27, date:'1944.06.22', title:'巴格拉季昂 · 破垒', sub:'巴格拉季昂行动 · 白俄罗斯第1方面军',
    terrain:'dn', waterRows:[1,3], rows:5, night:false, sky:10, startSun:175, faction:'de', sweeperTank:true,
    sweeper:'白俄罗斯第1方面军反冲击',
    newDef:['bs3'], newEn:['de_ferd'],
    brief:'1944年6月22日凌晨，白俄罗斯。三年前的同一天，德国人打进了苏联；今天，炮兵元帅罗科索夫斯基把两万门炮调上了战线。沼泽与河汊之间，德军中央集团军群的「堡垒」地带开始崩解。最扎眼的敌人叫斐迪南——200毫米正面装甲，穿甲弹打上去像敲钟。',
    goal:'撕开德军堡垒地带，合围明斯克方向的重兵集团。',
    tip:'沼泽水道两行（1、3行）天然减速，用浮台+水兵班封锁；斐迪南正面免疫直射——用BS-3（×6）、SU-152（×4）或地刺；「喀秋莎」留给扛旗波。',
    win:'五周之内，德军中央集团军群被歼28个师、丢明斯克——红军前锋已站在维斯瓦河岸眺望华沙。三年前的债，开始连本带利地还了。〔M3 完〕',
    waves:[
      { t:16, units:[['de_inf',2],['de_volks',2]] },
      { t:36, units:[['de_stug',1],['de_ss',2],['de_officer',1]] },
      { t:56, units:[['de_ferd',1],['de_panther',1],['de_wespe',1],['de_inf',2]] },
      { t:76, units:[['de_ferd',1],['de_panther',2],['de_storm',2],['de_sapper',2]] },
      { t:98, huge:true, units:[['de_flag',1],['de_ferd',2],['de_panther',2],['de_tiger',1],['de_stug',2],['de_storm',3],['de_officer',1]] },
    ],
  },
  /* ============ M4：直捣柏林 ============ */
  {
    id:28, date:'1944.08.20', title:'雅西 · 崩解', sub:'雅西-基什尼奥夫战役 · 乌克兰第2方面军',
    terrain:'cs', rows:5, night:false, sky:10, startSun:175, faction:'de',
    sweeper:'乌克兰第2方面军反冲击',
    newDef:['zis3'], newEn:['ro_tank'],
    brief:'1944年8月20日晨，罗马尼亚前线。德军以为山地是屏障，红军的炮火准备只用了两个小时。雅西两侧的防线一天之内被凿穿——罗军的轻型坦克营掉头就跑，把德军的侧翼亮了个精光。你的ZiS-3加农炮营在反斜面上展开了直射阵地。',
    goal:'凿穿雅西防线，切断南乌克兰集团军群的退路。',
    tip:'R-2轻型坦克快而脆——ZiS-3一发一个（载具×4.5）；罗军溃兵与罗坦克混潮时，波波沙拦人、加农炮点名铁皮。',
    win:'四天之内，南乌克兰集团军群被围歼于基什尼奥夫；8月23日，罗马尼亚倒戈。东线的南翼一夜之间转了向。〔轴心在瓦解〕',
    waves:[
      { t:16, units:[['ro_inf',4],['ro_tank',1]] },
      { t:36, units:[['ro_tank',2],['de_inf',2],['de_officer',1]] },
      { t:56, units:[['ro_tank',2],['de_stug',1],['de_ss',1],['ro_inf',4]] },
      { t:76, units:[['ro_tank',3],['de_panther',1],['de_storm',2]] },
      { t:98, huge:true, units:[['de_flag',1],['ro_tank',4],['de_panther',1],['de_stug',1],['de_ss',2],['ro_inf',8],['de_officer',1]] },
    ],
  },
  /* ================================================================
     V8.0 · 按计划插入：西欧篇（美101空降师，突出部之冬 → 雷马根夺桥）
     史实：巴斯托涅被围 44.12.18 / 「Nuts!」44.12.22 / 第4装甲师解围 44.12.26 /
     雷马根铁桥 45.3.7
     ================================================================ */
  {
    id:29, date:'1944.12.18', title:'十字路口 · 被围', sub:'突出部战役 · 巴斯托涅 · 美101空降师',
    terrain:'sh', rows:5, night:true, sky:8, startSun:165, faction:'de',
    sweeper:'第10装甲师残部',
    newDef:[], newEn:['de_volks','de_storm'],
    brief:'1944年12月18日，巴斯托涅。阿登的浓雾里，德军装甲矛头绕过这座控制七条公路的十字路口小镇——然后回过头来，把它整个围住。城里只有第101空降师和几个残破的装甲分遣队。他们没有冬装、弹药拮据，也没有撤退命令——因为根本没有撤退这个选项。',
    goal:'守住十字路口，不许德军装甲师通过巴斯托涅。',
    tip:'雾夜空投稀少——弹药经济紧到极点；强击群+国民掷弹兵混编冲锋，沙袋墙省着用；每格都要有备份兵。',
    win:'包围圈合拢了——但小镇还在。电台里，守军对劝降书的答复只有一个词。〔阿登 · 被围第一天〕',
    waves:[
      { t:14, units:[['de_volks',7],['de_storm',2]] },
      { t:34, units:[['de_officer',1],['de_volks',8],['de_storm',3]] },
      { t:54, units:[['de_stug',1],['de_volks',8],['de_sapper',3]] },
      { t:74, units:[['de_officer',1],['de_storm',4],['de_volks',9],['de_crate',2]] },
      { t:92, huge:true, units:[['de_flag',1],['de_stug',1],['de_officer',1],['de_storm',5],['de_volks',12],['de_sapper',4]] },
    ],
  },
  {
    id:30, date:'1944.12.22', title:'Nuts! · 最密波次', sub:'突出部战役 · 巴斯托涅 · 劝降书之日',
    terrain:'sh', rows:5, night:false, sky:9, startSun:170, faction:'de',
    sweeper:'第705歼击营',
    newDef:[], newEn:['de_storm','de_sapper','de_volks'],
    brief:'12月22日，德军送来劝降书：体面投降，或者被彻底毁灭。麦考利夫的回答后来印进了每一本战史——「Nuts!」（呸！）。接下来的两天，德军把整个军团的炮弹都倒向这个小镇：这是全役最密集的波次。',
    goal:'在德军最密集的攻势下，守住劝降书之后的小镇。',
    tip:'波次间隔极短——手快过脑：预铺沙袋墙、地刺成排；强击群专啃前排，碉垒顶住；燃烧瓶管涌口。',
    win:'炮击停了，阵地还在。第三天早晨，地面的雾里传来了另一种引擎声——不是德国的。〔阿登 · Nuts!〕',
    waves:[
      { t:12, units:[['de_volks',8],['de_storm',3]] },
      { t:30, units:[['de_stug',1],['de_officer',1],['de_volks',9],['de_storm',3]] },
      { t:48, units:[['de_storm',5],['de_sapper',4],['de_volks',9]] },
      { t:66, units:[['de_stug',2],['de_officer',1],['de_storm',5],['de_volks',10],['de_crate',3]] },
      { t:84, huge:true, units:[['de_flag',1],['de_stug',2],['de_officer',2],['de_storm',6],['de_sapper',5],['de_volks',13],['de_crate',3]] },
    ],
  },
  {
    id:31, date:'1944.12.26', title:'巴顿 · 解围之矛', sub:'突出部战役 · 第4装甲师解围巴斯托涅',
    terrain:'cs', rows:5, night:false, sky:10, startSun:180, faction:'de', sweeperTank:true,
    sweeper:'第4装甲师楔形队',
    newDef:[], newEn:['de_panther','de_volks','de_storm'],
    brief:'12月26日，解围战。巴顿的第3军团在风雪里转过一百度，第4装甲师从南面楔进包围圈——楔尖是谢尔曼的钢铁纵队。封锁线上的德军拼死封口：黑豹、国民掷弹兵、强击群全部压上。这一锤砸开，十字路口就活了。',
    goal:'配合北上的装甲矛头，击破包围圈最后一道封锁线。',
    tip:'黑豹正面重甲——SU-152曲射或反坦克地刺伺候；第4装甲师楔形队会自动清行；把弹药留给封锁线上的掷弹兵海。',
    win:'16时45分，先导坦克碾进巴斯托涅城区。第101空降师的回电只有一句：「我们没觉得被围过。」〔阿登 · 解围〕',
    waves:[
      { t:12, units:[['de_volks',8],['de_storm',3],['de_crate',2]] },
      { t:32, units:[['de_panther',1],['de_officer',1],['de_volks',9],['de_storm',4]] },
      { t:52, units:[['de_panther',1],['de_stug',1],['de_sapper',4],['de_volks',9]] },
      { t:70, units:[['de_panther',2],['de_officer',1],['de_storm',5],['de_volks',11],['de_crate',3]] },
      { t:88, huge:true, units:[['de_flag',1],['de_panther',2],['de_stug',2],['de_officer',2],['de_storm',6],['de_sapper',5],['de_volks',13],['de_crate',3]] },
    ],
  },
  {
    id:32, date:'1945.01.12', title:'维斯瓦河 · 冰解', sub:'维斯瓦河-奥得河攻势 · 近卫第8集团军',
    terrain:'ml', rows:5, night:false, sky:9, startSun:175, faction:'de',
    sweeper:'近卫第8集团军反冲击',
    newDef:['m120'], newEn:['de_panther'],
    brief:'1945年1月12日清晨5点，维斯瓦河。25分钟、每公里300门炮——朱可夫和科涅夫在同一小时放开了整条战线。德军的A集团军群还在阵地里睡觉，黑豹营的预备队刚发动引擎。你的120重迫击炮营把成箱的弹幕往对面山脊上砸，丘陵后面的雪泥翻成了浪。',
    goal:'从马格努谢夫登陆场冲出，直插奥得河。',
    tip:'黑豹是速度与甲的平衡体——ZiS-3/BS-3点名，120重迫弹幕洗护步兵；山地减速带（0.92）对双方生效，注意换防节奏。',
    win:'三周500公里——1月31日，红军前锋已经站在奥得河上，柏林城郊80公里。国旗插在了对岸。〔柏林已入炮程〕',
    waves:[
      { t:16, units:[['de_volks',3],['de_inf',2]] },
      { t:36, units:[['de_panther',1],['de_ss',2],['de_officer',1]] },
      { t:56, units:[['de_panther',2],['de_stug',1],['de_wespe',1],['de_volks',3]] },
      { t:76, units:[['de_panther',2],['de_ferd',1],['de_storm',2],['de_sapper',2]] },
      { t:98, huge:true, units:[['de_flag',1],['de_panther',3],['de_ferd',1],['de_tiger',1],['de_stug',2],['de_ss',2],['de_volks',4],['de_officer',1]] },
    ],
  },
  {
    id:33, date:'1945.03.07', title:'雷马根 · 夺桥', sub:'西线攻势 · 鲁登道夫铁桥',
    terrain:'ruin', rows:5, night:false, sky:11, startSun:185, faction:'de', sweeperTank:true,
    sweeper:'第9装甲师先遣营',
    newDef:[], newEn:['de_ferd','de_tiger','de_volks'],
    brief:'1945年3月7日，雷马根。美第9装甲师的先遣队转过山弯，看见鲁登道夫铁桥还立在莱茵河上——爆破的烟正从桥墩升起。守桥德军接到的命令是「桥在人在，桥亡人亡」。抢在第二波爆破前压上桥面，西线的胜负就已注定。',
    goal:'掩护工兵剪断引线，夺取雷马根铁桥。',
    tip:'桥头废墟是斐迪南的猎场——ML-20/BS-3 远程点名；虎式堵桥面，地刺+PTRD轮上；桥西侧的预制工事交给「喀秋莎」三行齐扫。',
    win:'15时许，星条旗升上桥塔。「千年帝国」在莱茵河上裂开了第一道桥墩——柏林，已在直射表上。〔西线 · 夺桥〕',
    waves:[
      { t:12, units:[['de_volks',8],['de_storm',3],['de_crate',2]] },
      { t:32, units:[['de_tiger',1],['de_officer',1],['de_volks',10],['de_storm',4]] },
      { t:52, units:[['de_ferd',1],['de_tiger',1],['de_sapper',4],['de_volks',10]] },
      { t:72, units:[['de_ferd',2],['de_tiger',1],['de_officer',1],['de_storm',5],['de_volks',11],['de_crate',3]] },
      { t:92, huge:true, units:[['de_flag',1],['de_ferd',2],['de_tiger',2],['de_stug',2],['de_officer',2],['de_storm',6],['de_sapper',5],['de_volks',13],['de_crate',3]] },
    ],
  },
  {
    id:34, date:'1945.04.16', title:'塞洛高地 · 攻坚', sub:'柏林战役 · 白俄罗斯第1方面军',
    terrain:'cs', rows:5, night:false, sky:10, startSun:175, faction:'de', sweeperTank:true,
    sweeper:'近卫第4坦克军反冲击',
    newDef:['is2'], newEn:['de_volks'],
    brief:'1945年4月16日凌晨，奥得河畔143个探照灯同时点亮——白俄罗斯第1方面军总攻柏林。挡在城前的最后一道天险叫塞洛高地：国民掷弹兵的散兵坑、88炮巢、斐迪南埋在反斜面。朱可夫把IS-2重型坦克团调了上来：122毫米，专门拆山头。',
    goal:'拿下塞洛高地，为坦克集团军打开通往柏林的大门。',
    tip:'IS-2曲射（载具×5）点名重甲；国民掷弹兵人海交给波波沙+DP-27；黄蜂炮与斐迪南优先用 IS-2 / ML-20 曲射点名。',
    win:'4月19日黄昏，塞洛高地易手。通往柏林的道路敞开了——苏联坦克的电台里只剩一句话：「目标，柏林市中心。」〔城就在眼前〕',
    waves:[
      { t:16, units:[['de_volks',4],['de_inf',2]] },
      { t:36, units:[['de_stug',1],['de_ss',2],['de_volks',2],['de_officer',1]] },
      { t:56, units:[['de_panther',2],['de_wespe',2],['de_volks',4]] },
      { t:76, units:[['de_ferd',2],['de_tiger',1],['de_storm',3],['de_sapper',2]] },
      { t:98, huge:true, units:[['de_flag',1],['de_ferd',2],['de_panther',2],['de_tiger',2],['de_stug',2],['de_ss',3],['de_volks',6],['de_officer',1]] },
    ],
  },
  {
    id:35, date:'1945.04.30', title:'柏林 · 胜利旗', sub:'柏林战役 · 国会大厦',
    terrain:'ruin', rows:5, night:false, sky:10, startSun:200, faction:'de', sweeperTank:true,
    sweeper:'第150步兵师突击群',
    newDef:['il2'], newEn:['de_volks','de_ss','de_ferd','de_tiger'],
    brief:'1945年4月30日，柏林城内。地铁隧道里还在打巷战，蒂尔加滕的防空塔打红了炮管——国会大厦就在街对面。第150师的突击组正在整理旗帜；你的前进校射哨背着电台，随时可以把「黑死神」叫下来洗掉整条街。这是最后一战。',
    goal:'突击国会大厦，把胜利旗插上穹顶。',
    tip:'最后一战火力全开：缴获经济早已雄厚——伊尔-2整行扫射（一线平）留给扎堆波；守备混编了全谱装备，地刺与曲射照旧是铁律。',
    win:'1945年4月30日夜，叶戈罗夫与坎塔里亚把红旗插上了国会大厦穹顶。5月9日零点，莫斯科上空一千门礼炮齐鸣——战争，结束了。〔柏林 · 胜利旗〕',
    waves:[
      { t:16, units:[['de_volks',4],['de_ss',2]] },
      { t:36, units:[['de_stug',1],['de_panther',1],['de_inf',2],['de_officer',1]] },
      { t:56, units:[['de_tiger',1],['de_panther',1],['de_wespe',2],['de_ss',2],['de_volks',4]] },
      { t:76, units:[['de_ferd',2],['de_tiger',1],['de_storm',3],['de_sapper',3],['de_ss',2]] },
      { t:96, huge:true, units:[['de_flag',1],['de_ferd',2],['de_tiger',2],['de_panther',2],['de_stug',2],['de_ss',3],['de_storm',3],['de_volks',8],['de_officer',1]] },
    ],
  },

  /* ================================================================
     V7.9 · 胜利之路（无终局）：湘西反攻 → 桂柳反攻 → 远东风暴 → 胜利日
     史实参照：湘西会战(1945.4.9-6.7)、桂柳反攻(1945.4-8)、库页岛战役(8.11-25)、
     虎头要塞(8.15-26)、哈尔滨空降(8.18)、占守岛(8.18-19)、沈阳(8.20)、旅顺(8.22)、
     密苏里号签字(9.2)；其后仍有十六受降区（南京9.9、台北10.25、越北……）
     ================================================================ */
  {
    id:36, date:'1945.05.12', title:'雪峰山 · 山门追歼', sub:'湘西会战 · 雪峰山大捷',
    terrain:'ml', rows:5, night:false, sky:10, startSun:180, faction:'jp',
    sweeper:'第74军出击集群',
    newDef:[], newEn:['banzai','pogo','digger'],
    brief:'1945年5月，雪峰山。4月9日发起的「芷江作战」已被拖进泥里——日军第20军的三个师团在山隘里耗尽锐气，5月8日起中国军队全线转入反击。雪峰山间的每一条山门、每一道反斜面，都成了退路变坟场的关口。这是正面战场最后一次大型会战的追歼阶段，芷江机场的燃烧弹随叫随到。',
    goal:'封闭山门，围歼溃退的第20军集群。',
    tip:'溃军会拼死突围：万岁冲锋频率极高——沙袋墙+制式地雷迟滞，机枪封口；高跷兵走山脊捷径，碉垒前置；掘进工兵钻山体掏后方，纵深留磁力排雷组。',
    win:'6月7日，湘西会战以日军溃退告终——芷江机场安然无恙。这是正面战场最后一场大会战，此后猎枪换了个方向：该我们出击了。〔雪峰山大捷〕',
    waves:[
      { t:14, units:[['banzai',5],['infantry',5],['pogo',2]] },
      { t:34, units:[['officer',1],['infantry',9],['digger',2],['pogo',3]] },
      { t:54, units:[['crusher',1],['banzai',6],['crate',2],['infantry',8]] },
      { t:74, units:[['officer',1],['digger',3],['pogo',4],['infantry',9]] },
      { t:94, huge:true, units:[['flagbearer',1],['crusher',2],['officer',1],['banzai',8],['digger',4],['pogo',5],['infantry',12]] },
    ],
  },
  {
    id:37, date:'1945.06.14', title:'柳州 · 反攻首捷', sub:'桂柳反攻 · 第二/第三方面军',
    terrain:'cs', rows:5, night:false, sky:10, startSun:175, faction:'jp',
    sweeper:'第46军迂回支队',
    newDef:[], newEn:['infantry','officer','crate'],
    brief:'1945年6月，桂柳反攻。第二、第三方面军对第11军合围柳州——第46军自南路迂回，友军三面会攻。城里的日军补给线早被中美空军掐断，据点守备队还在等一列永远不会进站的军车。九年前从这儿丢掉的城市，现在一步一步拿回来。',
    goal:'会攻柳州外围据点，收复机场。',
    tip:'正面平推即可但弹药箱掷弹兵硬——机枪+曲射分工；军官激励残兵，优先点名；缴获学满级的部队在此回报极高。',
    win:'柳州光复，机场跑道重新铺上中国的石板。军报标题只有八个字：「八年血债，今始偿还。」〔反攻 · 第一号战报〕',
    waves:[
      { t:14, units:[['infantry',6],['crate',2]] },
      { t:34, units:[['officer',1],['infantry',8],['crate',2],['digger',2]] },
      { t:54, units:[['crusher',1],['infantry',8],['pogo',2]] },
      { t:74, units:[['officer',1],['crate',3],['digger',3],['infantry',8]] },
      { t:94, huge:true, units:[['flagbearer',1],['crusher',2],['officer',1],['crate',3],['digger',3],['infantry',12],['pogo',3]] },
    ],
  },
  {
    id:38, date:'1945.08.09', title:'海拉尔 · 破垒', sub:'远东战役 · 后贝加尔方面军',
    terrain:'sv', rows:5, night:false, sky:10, startSun:180, faction:'jp',
    sweeper:'苏蒙骑兵机械化集群',
    newDef:[], newEn:['digger','pogo','infantry'],
    brief:'1945年8月9日零时，苏联对日宣战。一百五十万红军跨过边境——外贝加尔方面军穿越戈壁与大兴安岭，直插海拉尔要塞群。关东军还在等「苏军至少需要三个月准备」的情报。他们错了三周。',
    goal:'撕开海拉尔筑垒地域，掩护装甲主力通过。',
    tip:'掘进工兵从地下钻到你后方——纵深布雷与沙袋墙防掏；高跷兵跨行突袭，机枪封锁斜向通道。',
    win:'筑垒地域一夜洞穿。方面军司令部电文：「抵抗微弱，按计划推进。」〔远东 · 第一击〕',
    waves:[
      { t:14, units:[['infantry',6],['digger',2]] },
      { t:34, units:[['pogo',3],['infantry',8],['digger',3]] },
      { t:54, units:[['crusher',1],['digger',3],['crate',2],['infantry',8]] },
      { t:74, units:[['officer',1],['pogo',4],['digger',4],['infantry',8]] },
      { t:94, huge:true, units:[['flagbearer',1],['crusher',2],['officer',1],['pogo',5],['digger',5],['infantry',14]] },
    ],
  },
  {
    id:39, date:'1945.08.11', title:'南萨哈林 · 横断', sub:'库页岛战役 · 第16集团军',
    terrain:'ml', rows:5, night:true, sky:9, startSun:175, faction:'jp', waterRows:[2],
    sweeper:'北太平洋舰队登陆群',
    newDef:[], newEn:['swimmer','boat','digger'],
    brief:'8月11日，库页岛（桦太）南部。远东第2方面军第16集团军兵分三路横断岛脊，北太平洋舰队同时在西岸送登陆兵上滩。8月15日广播里的停战诏书没能让这里停火——岛屿深处的日军抵抗了整整十四天。',
    goal:'横断库页岛南部，分割日军守备集群。',
    tip:'夜战雨林空投稀少，弹药精打；西岸登陆的泅渡兵与爆破艇走水线——岸炮压水；掘进工兵钻林矿坑道掏后方，纵深排雷。',
    win:'8月25日，真冈港的日军投降——南萨哈林全境易手。桦太岛四十年的日据史，画上句号。〔远东 · 横断〕',
    waves:[
      { t:14, units:[['swimmer',5],['infantry',4]] },
      { t:34, units:[['boat',2],['digger',3],['infantry',7]] },
      { t:54, units:[['boat',2],['swimmer',6],['pogo',3],['infantry',6]] },
      { t:74, units:[['boat',3],['digger',4],['crate',2],['infantry',7]] },
      { t:94, huge:true, units:[['flagbearer',1],['boat',4],['swimmer',8],['digger',5],['crate',3],['infantry',11],['officer',1]] },
    ],
  },
  {
    id:40, date:'1945.08.15', title:'虎头 · 永备巨炮', sub:'远东战役 · 第35集团军',
    terrain:'ruin', rows:5, night:true, sky:9, startSun:185, faction:'jp', sweeperTank:true,
    sweeper:'第34筑垒工兵旅',
    newDef:[], newEn:['crusher','digger','crate'],
    brief:'8月15日，广播里传来天皇的停战诏书——虎头要塞的日军把它当成「心理战」掐断了广播。这座地下要塞藏着410毫米巨炮，炮口直指西伯利亚铁路。停战诏书发布之后，这里的战斗又持续了整整十一天。',
    goal:'逐个拔除永备工事，摧毁410毫米巨炮。',
    tip:'装甲推土车为巨炮开路——反坦克地刺+PTRD断履；掘进工兵从地下掏炮位，纵深工事别贴前排；夜战火光即坐标，伊尔-2点名最划算。',
    win:'8月26日，最后一处地下工事哑火。要塞参谋烧掉密码本走出坑道——这是二战最后的要塞战之一。〔停战诏书之后 · 第11天〕',
    waves:[
      { t:14, units:[['infantry',6],['digger',2],['crate',2]] },
      { t:34, units:[['crusher',1],['digger',3],['infantry',8]] },
      { t:54, units:[['crusher',2],['crate',3],['pogo',3],['infantry',8]] },
      { t:74, units:[['crusher',2],['digger',4],['officer',1],['infantry',10]] },
      { t:94, huge:true, units:[['flagbearer',1],['crusher',4],['officer',1],['digger',5],['crate',4],['pogo',4],['infantry',14]] },
    ],
  },
  {
    id:41, date:'1945.08.18', title:'哈尔滨 · 空降斩首', sub:'远东战役 · 空降兵先遣支队',
    terrain:'sh', rows:5, night:false, sky:11, startSun:180, faction:'jp',
    sweeper:'近卫空降第37军',
    newDef:[], newEn:['infantry','officer','banzai'],
    brief:'8月18日，哈尔滨机场。运输机群顶着日军高射机枪强行机降——空降兵落地就往市区冲，目标只有一个：关东军司令部与广播电台。这座城市里有白俄、有情报网、有十年的地下抵抗组织，他们等这一天等了十四年。',
    goal:'抢占广播电台，瘫痪关东军指挥中枢。',
    tip:'巷战节奏极快，波次间隔短——速摆速补；军官与万岁兵混编冲锋，机枪阵地设路口拐角；散兵交给燃烧瓶。',
    win:'电台的电波里换成了《喀秋莎》。关东军司令官山田乙三被俘于司令部地下室——满洲的抵抗中枢，不复存在。〔远东 · 斩首〕',
    waves:[
      { t:12, units:[['infantry',7],['banzai',3]] },
      { t:30, units:[['officer',1],['infantry',9],['crate',2]] },
      { t:48, units:[['banzai',6],['pogo',3],['infantry',8]] },
      { t:66, units:[['crusher',1],['officer',1],['crate',3],['infantry',9]] },
      { t:84, huge:true, units:[['flagbearer',1],['crusher',2],['officer',2],['banzai',8],['crate',3],['pogo',4],['infantry',13]] },
    ],
  },
  {
    id:42, date:'1945.08.19', title:'占守岛 · 滩头', sub:'千岛群岛战役 · 堪察加防区',
    terrain:'dn', rows:5, night:true, sky:9, startSun:180, faction:'jp',
    sweeper:'海军步兵营',
    newDef:[], newEn:['swimmer','boat','digger'],
    brief:'8月18日夜，占守岛。堪察加防区的红军没有像样的登陆舰——渔船、拖轮、驳船，什么都上了。凌晨的浓雾里，海军步兵跳进齐颈的海水往滩头爬，对岸是第91师团的混凝土炮台。停战诏书已发布四天，这里却爆发了整场远东战役最血腥的一夜。',
    goal:'背海攻坚，拔除滩头炮台群。',
    tip:'无退路关卡：水行首两排是泅渡敌——岸炮压水线；爆破艇贴雾冲滩，沙袋墙顶住；天亮前敌军会一波总攻，把地刺全埋在滩前。',
    win:'8月19日午后，第91师团打出白旗。占守岛之战伤亡之重冠绝远东——但千岛的大门，被推开了。〔千岛 · 血色滩头〕',
    waves:[
      { t:12, units:[['swimmer',6],['boat',1]] },
      { t:32, units:[['boat',2],['swimmer',6],['infantry',6]] },
      { t:52, units:[['boat',3],['digger',3],['infantry',7]] },
      { t:70, units:[['boat',3],['swimmer',8],['crate',3],['infantry',8]] },
      { t:88, huge:true, units:[['flagbearer',1],['boat',5],['swimmer',10],['digger',4],['crate',3],['infantry',12],['officer',1]] },
    ],
  },
  {
    id:43, date:'1945.08.20', title:'沈阳 · 机场冲击', sub:'远东战役 · 近卫坦克第6集团军',
    terrain:'ruin', rows:5, night:false, sky:11, startSun:190, faction:'jp',
    sweeper:'近卫坦克第5军',
    newDef:[], newEn:['crusher','pogo','crate'],
    brief:'8月20日，沈阳。近卫坦克第6集团军狂奔八百公里，先头营直接冲进奉天机场——关东军航空兵的地勤还在跑道上给飞机加油。伪满「皇帝」的专列停在站台上，车门开着，人已不见。这座城市十四年没见过中国的军旗。',
    goal:'抢占机场与火车站，切断关东军西撤铁路。',
    tip:'开阔地遭遇战：推土车集群冲机场跑道——PTRD+AT地刺前置；高跷兵从站台方向越障偷家，后排留机枪；弹药箱堆越打越多，速决。',
    win:'坦克堵住了站台，930架日机未及起飞便成了战利品——「满洲国」三个字，从地图上被抹掉了。〔远东 · 铁拳〕',
    waves:[
      { t:12, units:[['infantry',8],['crate',2]] },
      { t:32, units:[['crusher',2],['pogo',4],['infantry',8]] },
      { t:52, units:[['crusher',2],['crate',3],['digger',3],['infantry',9]] },
      { t:70, units:[['crusher',3],['officer',1],['pogo',5],['infantry',10]] },
      { t:88, huge:true, units:[['flagbearer',1],['crusher',4],['officer',1],['pogo',6],['crate',4],['digger',4],['infantry',15]] },
    ],
  },
  {
    id:44, date:'1945.08.22', title:'旅顺口 · 收复', sub:'远东战役 · 第39集团军',
    terrain:'dn', rows:5, night:false, sky:10, startSun:185, faction:'jp',
    sweeper:'第39集团军先遣支队',
    newDef:[], newEn:['boat','crusher','officer'],
    brief:'8月22日，旅顺口。这条军港1905年被日本夺走，四十年后红军的坦克开到了码头。黄金山炮台、白玉山祠堂、关东州的每一寸铁轨——这里埋着两代人的国耻。空降兵先落在机场，舰队随后进港。',
    goal:'肃清港区，占领黄金山炮台。',
    tip:'水陆混攻：爆破艇绕炮台侧翼——岸炮封锁水道；守备军官督战队反复激励残部，缴获学+军械升级在此回报最高。',
    win:'军港的探照灯重新亮起时，码头上有人用俄语和汉语同时喊了一句话：「到家了。」——旅大回归。〔四十年 · 一江之隔〕',
    waves:[
      { t:14, units:[['boat',2],['infantry',6],['crate',2]] },
      { t:34, units:[['crusher',1],['officer',1],['infantry',9],['crate',2]] },
      { t:54, units:[['boat',3],['digger',3],['infantry',9]] },
      { t:74, units:[['crusher',2],['officer',1],['pogo',4],['infantry',10]] },
      { t:92, huge:true, units:[['flagbearer',1],['boat',4],['crusher',3],['officer',2],['digger',4],['crate',4],['infantry',14]] },
    ],
  },
  {
    id:45, date:'1945.09.02', title:'东京湾 · 胜利日', sub:'密苏里号 · 日本投降签字仪式',
    terrain:'sh', rows:5, night:false, sky:12, startSun:200, faction:'jp', sweeperTank:true,
    sweeper:'盟军海军陆战队仪仗队',
    newDef:[], newEn:['infantry','flagbearer','officer','banzai'],
    brief:'1945年9月2日，东京湾。四百五十架舰载机从云层里压过密苏里号的桅杆——这是给签字仪式的「礼炮」。军刀和指挥刀正在一张铺绿呢的桌子上被收走。但在从南洋丛林到中国战区的一百多万日军盘踞地里，还有十六个受降区等着受降军官、还有拒不放下枪的孤军。胜利不是终点，是下一季的开始。',
    goal:'肃清湾畔最后的抵抗据点，掩护受降仪式进行。',
    tip:'本关不必节省：缴获经济、八项军备、全谱兵种——把八年攒下的家底打出去。此后受降季还有新的战线等着你。',
    win:'9时整，签字笔落下。甲板上的水兵、战俘营走出的幸存者、值更的炊事兵——所有人都在同一秒安静了。但电台还在响：「南京，9月9日。台北，10月25日。越南北部……」受降季，才刚刚开始。〔胜利日 · 待续〕',
    waves:[
      { t:14, units:[['infantry',8],['crate',2],['banzai',3]] },
      { t:34, units:[['officer',1],['infantry',10],['pogo',3]] },
      { t:54, units:[['crusher',2],['banzai',6],['crate',3],['infantry',10]] },
      { t:74, units:[['crusher',2],['officer',2],['digger',4],['infantry',11],['pogo',4]] },
      { t:94, huge:true, units:[['flagbearer',1],['crusher',3],['officer',2],['banzai',8],['digger',5],['crate',4],['pogo',5],['infantry',16]] },
    ],
  },
];

/* ---- 守军特性速览（手册用） ---- */
function defStats(id){
  const d = DEF[id];
  const a = [];
  a.push('费用 '+d.cost+' · 冷却 '+d.cd+'秒');
  const k = d.kind;
  if (k !== 'thornwall' && d.hp) a.push('耐久 '+d.hp);
  if (k === 'shooter'){
    a.push('直射伤害 '+(d.dmg*(d.shots||1))+' / '+d.rate+'秒'
      + (d.slow ? '（命中减速）' : '') + (d.rate <= 1 ? '（泼弹）' : '')
      + (d.water ? ' · 可部署于水道' : ''));
  }
  else if (k === 'producer') a.push('每 '+d.interval+' 秒产出 25 补给');
  else if (k === 'wall') a.push(d.antiLadder ? '工事 · 竹梯无法攀越' : '工事 · 高耐久');
  else if (k === 'instant') a.push('立即引爆 · 3×3 范围 · 破盾');
  else if (k === 'mine') a.push('埋设 '+d.arm+' 秒后待发 · 破盾');
  else if (k === 'melee') a.push('近身吞噬 · 喘息 42 秒 · 破盾');
  else if (k === 'platform') a.push('水道基座');
  else if (k === 'torch') a.push('越位穿甲（直射伤害翻倍）');
  else if (k === 'squash') a.push('扑杀最近之敌 · 破盾');
  else if (k === 'jalapeno') a.push('整行急袭 · 破盾');
  else if (k === 'jalapeno3') a.push('三行齐射 · 破盾');
  else if (k === 'magnet') a.push('每 '+d.pulse+' 秒磁脉冲 · 掀飞敌军器材');
  else if (k === 'spike') a.push('踩踏 '+d.dps+'/秒 · 装甲车克星 · 不可啃食');
  else if (k === 'shooter3') a.push('三行齐射 '+d.dmg+'×3 / '+d.rate+'秒');
  else if (k === 'lobslow') a.push('曲射 '+d.dmg+' / '+d.rate+'秒 · 落点起火减速3秒 · 破盾');
  else if (k === 'splitshooter') a.push('双向直射 '+d.dmg+'×2 / '+d.rate+'秒');
  else if (k === 'avshooter') a.push('直射 '+d.dmg+' / '+d.rate+'秒 · 载具受伤×'+d.atv);
  else if (k === 'thornwall') a.push('工事耐久 '+d.hp+' · 啃食者返伤 '+d.dps+'/秒');
  else if (k === 'salvproducer') a.push('每 '+d.interval+' 秒缴获 +'+d.val+'（胜场结算）');
  else if (k === 'lob'){
    a.push('曲射 '+d.dmg+' / '+d.rate+'秒 · 溅射'+(d.splash||55)+' · 破盾'
      + (d.atv ? ' · 载具受伤×'+d.atv : ''));
  }
  return a.join('　');
}
function enStats(id){
  const e = EN[id];
  const a = [];
  a.push('耐久 '+e.hp+(e.shield?('（含门板盾 '+e.shield+'）'):''));
  a.push('速度 '+(e.speed>=0.35?'快':(e.speed>=0.2?'中':'慢')));
  if (e.water) a.push('水路单位');
  if (e.flag) a.push('大规模进攻前导');
  if (e.rageSpeed) a.push('地图被毁后暴走');
  if (id === 'door') a.push('正面免疫直射');
  if (id === 'ladder') a.push('架梯攀越工事');
  if (id === 'swimmer') a.push('潜行时免疫直射');
  if (id === 'boat' || id === 'de_boat') a.push('抢滩跃障（仅一次）· 水道行进');
  if (id === 'pogo') a.push('蹦越工事（碉垒除外）');
  if (id === 'digger' || id === 'de_sapper') a.push('掘地绕后 · 反向拆家');
  if (id === 'crusher' || id === 'de_panzer') a.push('碾压工事 · 地刺即毁');
  if (id === 'de_wespe') a.push('远程炮击工事 · 停驻右缘 · 曲射/伊尔-2 清它最快');
  if (id === 'ro_inf') a.push('数量压场 · 一碰就碎');
  if (id === 'de_frost') a.push('迟缓爬行 · 夜战海量');
  if (id === 'de_tiger') a.push('碾压工事 · 地刺/SU-152/喀秋莎可破');
  if (id === 'de_stug' || id === 'de_ferd' || id === 'ro_tank' || id === 'de_panther') a.push('碾压工事 · 地刺可断履带');
  if (id === 'de_ferd') a.push('正面特厚 · 优先曲射/地刺');
  if (id === 'de_ss') a.push('先碎盾再伤人 · 曲射/喀秋莎连人带盾洗');
  if (id === 'de_volks') a.push('量大管饱 · 泼弹火力欢迎');
  return a.join('　');
}
