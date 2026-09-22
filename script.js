/* mc_game.js — Block Battle PvP Arena | Original Low-Poly Edition */
(function(){
"use strict";
if(!window.THREE){
  document.body.innerHTML="<div class='screen'><div class='panel'><h1 class='title'>NO CONNECTION</h1><p class='tagline'>3D engine could not load. Check network.</p></div></div>";
  return;
}

/* ============================================
   WORLD CONSTANTS
   ============================================ */
const WX=80,WY=48,WZ=80,CS=16;
const CXN=WX/CS,CZN=WZ/CS;
const TILE=64,ACOL=8,AROW=8;

/* ============================================
   BLOCK TILE INDICES
   ============================================ */
const T={GRASS_TOP:0,GRASS_SIDE:1,DIRT:2,STONE:3,PLANK:4,LEAF:5,SAND:6,STEEL:7,ENERGY:8,ROCK:9,WATER:10,COAL_ORE:11,COPPER_ORE:12,IRON_ORE:13,GOLD_ORE:14,DIAMOND_ORE:15,FLINT:16,FURNACE:17,CHEST:18,TORCH:19,CRAFT_TABLE:20,GUNPOWDER:21};
const AIR=0;
function al(t){return{px:t,nx:t,py:t,ny:t,pz:t,nz:t};}

/* ============================================
   BLOCK DEFINITIONS
   ============================================ */
const B=[
  null,
  {id:1,name:"Grass",tiles:{px:T.GRASS_SIDE,nx:T.GRASS_SIDE,pz:T.GRASS_SIDE,nz:T.GRASS_SIDE,py:T.GRASS_TOP,ny:T.DIRT},hard:0.55,hp:16,dmg:6,tint:0x6aa84f},
  {id:2,name:"Dirt",tiles:al(T.DIRT),hard:0.5,hp:14,dmg:6,tint:0x7a5334},
  {id:3,name:"Stone",tiles:al(T.STONE),hard:1.15,hp:34,dmg:13,tint:0x8b8b90},
  {id:4,name:"Planks",tiles:al(T.PLANK),hard:0.85,hp:24,dmg:9,tint:0xb27f47},
  {id:5,name:"Leaves",tiles:al(T.LEAF),hard:0.3,hp:8,dmg:4,tint:0x3b7d33},
  {id:6,name:"Sand",tiles:al(T.SAND),hard:0.45,hp:12,dmg:6,tint:0xe0d39a},
  {id:7,name:"Steel",tiles:al(T.STEEL),hard:1.7,hp:78,dmg:22,tint:0x9aa7b4},
  {id:8,name:"Energy",tiles:al(T.ENERGY),hard:1.0,hp:26,dmg:42,tint:0x35e0d4,boom:true},
  {id:9,name:"Bedrock",tiles:al(T.ROCK),hard:Infinity,hp:Infinity,dmg:0,tint:0x3a3a40},
  {id:10,name:"Water",tiles:al(T.WATER),hard:0.1,hp:1,dmg:0,tint:0x2266cc,liquid:true},
  {id:11,name:"Coal Ore",tiles:al(T.COAL_ORE),hard:1.2,hp:30,dmg:10,tint:0x2a2a2e},
  {id:12,name:"Copper Ore",tiles:al(T.COPPER_ORE),hard:1.3,hp:36,dmg:11,tint:0xb87333},
  {id:13,name:"Iron Ore",tiles:al(T.IRON_ORE),hard:1.5,hp:40,dmg:13,tint:0x8c7d6b},
  {id:14,name:"Gold Ore",tiles:al(T.GOLD_ORE),hard:1.4,hp:38,dmg:12,tint:0xc8a02a},
  {id:15,name:"Diamond Ore",tiles:al(T.DIAMOND_ORE),hard:1.8,hp:48,dmg:16,tint:0x3ae0d4},
  {id:16,name:"Flint",tiles:al(T.FLINT),hard:0.9,hp:20,dmg:8,tint:0x4a4a52},
  {id:17,name:"Furnace",tiles:{px:T.FURNACE,nx:T.FURNACE,pz:T.FURNACE,nz:T.FURNACE,py:T.STONE,ny:T.STONE},hard:1.0,hp:30,dmg:8,tint:0x6a5a50},
  {id:18,name:"Chest",tiles:al(T.CHEST),hard:0.8,hp:20,dmg:6,tint:0x8b6030},
  {id:19,name:"Torch",tiles:al(T.TORCH),hard:0.1,hp:2,dmg:0,tint:0xffa020,light:true},
  {id:20,name:"Craft Table",tiles:al(T.CRAFT_TABLE),hard:0.8,hp:20,dmg:6,tint:0xa0703a},
  {id:21,name:"Gunpowder Block",tiles:al(T.GUNPOWDER),hard:0.6,hp:18,dmg:30,tint:0x2a1e0a,boom:true},
];

/* ============================================
   ITEMS
   ============================================ */
const ITEMS={
  100:{id:100,name:"Coal",icon:"coal",tint:0x2a2a30},
  101:{id:101,name:"Copper",icon:"cube",tint:0xb87333},
  102:{id:102,name:"Iron",icon:"cube",tint:0xa08a78},
  103:{id:103,name:"Gold",icon:"cube",tint:0xd4aa22},
  104:{id:104,name:"Diamond",icon:"gem",tint:0x44eedd},
  105:{id:105,name:"Flint",icon:"chip",tint:0x666677},
  106:{id:106,name:"Stick",icon:"stick",tint:0x9a6030},
  107:{id:107,name:"String",icon:"string",tint:0xddddcc},
  108:{id:108,name:"Feather",icon:"feat",tint:0xeeeeff},
  109:{id:109,name:"Meat",icon:"cube",tint:0xe07070},
  110:{id:110,name:"Leather",icon:"cube",tint:0x8a5a30},
  111:{id:111,name:"Fish",icon:"fish",tint:0x6699cc},
  112:{id:112,name:"Gunpowder",icon:"powder",tint:0x3a3a2a},
  113:{id:113,name:"Dragon Scale",icon:"gem",tint:0x8a2a2a},
  300:{id:300,name:"Water Bucket",icon:"cube",tint:0x2266cc},
  200:{id:200,name:"Wood Pickaxe",toolType:"pickaxe",tint:0xb27f47,speed:1.5},
  201:{id:201,name:"Stone Pickaxe",toolType:"pickaxe",tint:0x8b8b90,speed:2.2},
  202:{id:202,name:"Copper Pickaxe",toolType:"pickaxe",tint:0xb87333,speed:2.8},
  203:{id:203,name:"Iron Pickaxe",toolType:"pickaxe",tint:0xc8c8d8,speed:3.5},
  204:{id:204,name:"Gold Pickaxe",toolType:"pickaxe",tint:0xd4aa22,speed:4.5},
  205:{id:205,name:"Diamond Pickaxe",toolType:"pickaxe",tint:0x44eedd,speed:6.0},
  210:{id:210,name:"Wood Axe",toolType:"axe",tint:0xb27f47,speed:1.5},
  211:{id:211,name:"Stone Axe",toolType:"axe",tint:0x8b8b90,speed:2.0},
  212:{id:212,name:"Iron Axe",toolType:"axe",tint:0xc8c8d8,speed:3.2},
  213:{id:213,name:"Diamond Axe",toolType:"axe",tint:0x44eedd,speed:5.0},
  220:{id:220,name:"Wood Shovel",toolType:"shovel",tint:0xb27f47,speed:1.4},
  221:{id:221,name:"Iron Shovel",toolType:"shovel",tint:0xc8c8d8,speed:3.0},
  230:{id:230,name:"Hoe",toolType:"hoe",tint:0x8b8b90,speed:1.0},
  240:{id:240,name:"Shears",toolType:"shears",tint:0xc8c8d8,speed:2.5},
  250:{id:250,name:"Bucket",toolType:"bucket",tint:0xc8c8d8,speed:1.0},
  260:{id:260,name:"Fishing Rod",toolType:"fishingrod",tint:0xb27f47,speed:1.0},
  270:{id:270,name:"Gun",toolType:"gun",tint:0x5a5a6a,speed:1.0},
};
function isItm(id){return id>=100;}
const HOTBAR=[3,4,2,1,6,7,8,200,240];

/* ============================================
   ATLAS (texture)
   ============================================ */
let rs=987654321;
function rnd(){rs=(rs*1664525+1013904223)&0x7fffffff;return rs/0x7fffffff;}
function makeAtlas(){
  const cv=document.createElement("canvas");cv.width=ACOL*TILE;cv.height=AROW*TILE;
  const g=cv.getContext("2d");g.imageSmoothingEnabled=false;
  const P=4;
  function at(i){return[(i%ACOL)*TILE,Math.floor(i/ACOL)*TILE];}
  function fill(i,c){const[a,b]=at(i);g.fillStyle=c;g.fillRect(a,b,TILE,TILE);}
  function px(i,x,y,c,w,h){const[a,b]=at(i);g.fillStyle=c;g.fillRect(a+x*P,b+y*P,(w||1)*P,(h||1)*P);}
  function ns(i,cs,d){for(let y=0;y<16;y++)for(let x=0;x<16;x++)if(rnd()<d)px(i,x,y,cs[(rnd()*cs.length)|0]);}
  fill(T.GRASS_TOP,"#4a9e38");ns(T.GRASS_TOP,["#5cb045","#3d8a2e","#6dcc55"],0.75);
  fill(T.GRASS_SIDE,"#7a5334");ns(T.GRASS_SIDE,["#8a5f3c","#6a462c"],0.6);
  for(let x=0;x<16;x++){const h=3+((rnd()*2)|0);for(let y=0;y<h;y++)px(T.GRASS_SIDE,x,y,y===h-1?"#4a9e38":"#5cb045");}
  fill(T.DIRT,"#7a5334");ns(T.DIRT,["#8a5f3c","#6a462c","#5d3d26"],0.8);
  fill(T.STONE,"#6a7080");ns(T.STONE,["#7a8090","#5a6070","#8090a0"],0.7);
  for(let k=0;k<6;k++){const x=(rnd()*13)|0,y=(rnd()*13)|0;px(T.STONE,x,y,"#4a5060",2,2);}
  fill(T.PLANK,"#c09060");ns(T.PLANK,["#d0a070","#b08050"],0.35);
  for(let y=0;y<16;y+=4)for(let x=0;x<16;x++)px(T.PLANK,x,y,"#806040");
  fill(T.LEAF,"#2a6a22");ns(T.LEAF,["#38802e","#1f5019","#46963a"],0.9);
  fill(T.SAND,"#e8d8a0");ns(T.SAND,["#f0e4b0","#d8c890"],0.7);
  fill(T.STEEL,"#7080a0");ns(T.STEEL,["#8090b0","#60708a"],0.4);
  for(let x=0;x<16;x++){px(T.STEEL,x,0,"#a0b0cc");px(T.STEEL,0,x,"#90a0bc");px(T.STEEL,x,15,"#405070");px(T.STEEL,15,x,"#4a5a7a");}
  fill(T.ENERGY,"#100820");ns(T.ENERGY,["#180c30","#0c0618"],0.6);
  for(let x=2;x<14;x++){px(T.ENERGY,x,2,"#00ffcc");px(T.ENERGY,x,13,"#00ffcc");}
  for(let y=2;y<14;y++){px(T.ENERGY,2,y,"#00ffcc");px(T.ENERGY,13,y,"#00ffcc");}
  px(T.ENERGY,6,6,"#80ffee",4,4);px(T.ENERGY,7,7,"#ffffff",2,2);
  fill(T.ROCK,"#2a2a30");ns(T.ROCK,["#363640","#1e1e22"],0.85);
  fill(T.WATER,"#0a3870");ns(T.WATER,["#0e4288","#08306a","#1256a0"],0.5);
  for(let x=0;x<16;x+=2)for(let y=0;y<16;y++)if((x+y)%4<2)px(T.WATER,x,y,"#1466aa");
  for(let x=2;x<14;x+=5)px(T.WATER,x,5,"#2288cc",3,1);
  const oreCfg=[[T.COAL_ORE,"#111114"],[T.COPPER_ORE,"#c27a3a"],[T.IRON_ORE,"#c0a882"],[T.GOLD_ORE,"#d4b022"],[T.DIAMOND_ORE,"#44eedd"]];
  for(const[ot,oc] of oreCfg){fill(ot,"#6a7080");ns(ot,["#7a8090","#5a6070"],0.5);for(let k=0;k<7;k++){const x=(rnd()*13)|0,y=(rnd()*13)|0;px(ot,x,y,oc,2,2);}}
  fill(T.FLINT,"#3a3a42");ns(T.FLINT,["#45454e","#2d2d34"],0.85);
  fill(T.FURNACE,"#5a5060");ns(T.FURNACE,["#6a6070"],0.5);
  px(T.FURNACE,4,4,"#cc4422",8,6);px(T.FURNACE,5,5,"#ff6622",6,4);px(T.FURNACE,6,6,"#ffaa00",4,2);
  fill(T.CHEST,"#8a5a20");ns(T.CHEST,["#9a6a30","#7a4a10"],0.4);
  px(T.CHEST,6,7,"#7a5010",4,2);px(T.CHEST,7,7,"#c89030",2,2);
  fill(T.TORCH,"#3a2810");px(T.TORCH,7,0,"#ff8800",2,8);px(T.TORCH,7,0,"#ffcc44",2,3);px(T.TORCH,7,0,"#ffffff",2,1);
  fill(T.CRAFT_TABLE,"#8a602a");ns(T.CRAFT_TABLE,["#9a7040","#7a5020"],0.35);
  for(let y=0;y<16;y+=8)for(let x=0;x<16;x++)px(T.CRAFT_TABLE,x,y,"#604010");
  fill(T.GUNPOWDER,"#1a1008");ns(T.GUNPOWDER,["#261810","#0e0804"],0.7);
  for(let k=0;k<10;k++){const x=(rnd()*14)|0,y=(rnd()*14)|0;px(T.GUNPOWDER,x,y,"#3a3020",1,1);}
  for(let k=0;k<4;k++){const x=(rnd()*14)|0,y=(rnd()*14)|0;px(T.GUNPOWDER,x,y,"#c89020",1,1);}
  const tex=new THREE.CanvasTexture(cv);tex.magFilter=THREE.NearestFilter;tex.minFilter=THREE.NearestMipmapLinearFilter;tex.generateMipmaps=true;tex.encoding=THREE.sRGBEncoding;
  return{tex,canvas:cv};
}
const ATLAS=makeAtlas();
function tileUV(t){const c=t%ACOL,r=Math.floor(t/ACOL),e=0.0009;return{u0:c/ACOL+e,u1:(c+1)/ACOL-e,v0:1-(r+1)/AROW+e,v1:1-r/AROW-e};}

/* ============================================
   ITEM ICONS
   ============================================ */
function iconFor(id){
  const cv=document.createElement("canvas");cv.width=32;cv.height=32;const g=cv.getContext("2d");g.imageSmoothingEnabled=false;
  if(id>=100){
    const itm=ITEMS[id];if(!itm)return cv;
    const tc=itm.tint||0x888888;
    g.fillStyle="rgb("+((tc>>16)&255)+","+((tc>>8)&255)+","+(tc&255)+")";
    const ic=itm.icon;
    if(ic==="stick"){g.fillRect(14,2,4,28);}
    else if(ic==="gem"||ic==="chip"){g.save();g.translate(16,16);g.rotate(Math.PI/4);g.fillRect(-8,-8,16,16);g.restore();}
    else if(ic==="fish"){g.beginPath();g.ellipse(14,16,10,6,0,0,Math.PI*2);g.fill();g.beginPath();g.moveTo(4,16);g.lineTo(0,10);g.lineTo(0,22);g.closePath();g.fill();}
    else if(ic==="feat"){g.fillRect(14,4,4,24);g.fillStyle="rgba(255,255,255,0.5)";g.fillRect(15,4,2,20);}
    else if(ic==="string"){for(let i=0;i<3;i++)g.fillRect(9+i*5,2,2,28);}
    else if(ic==="powder"){g.fillRect(5,5,22,22);g.fillStyle="rgba(200,160,48,0.8)";for(let k=0;k<12;k++){const x=6+Math.floor(rnd()*18),y=6+Math.floor(rnd()*18);g.fillRect(x,y,2,2);}}
    else if(ic==="gun"){g.fillStyle="#4a4a5a";g.fillRect(4,12,22,8);g.fillStyle="#6a6a8a";g.fillRect(16,8,6,12);g.fillStyle="#2a2a3a";g.fillRect(4,14,18,4);g.fillStyle="#8a8aaa";g.fillRect(22,12,6,4);g.fillStyle="#3a2a1a";g.fillRect(8,20,8,6);}
    else{g.fillRect(5,5,22,22);}
    return cv;
  }
  if(!B[id])return cv;
  const t=B[id].tiles.py,c=t%ACOL,r=Math.floor(t/ACOL);
  g.drawImage(ATLAS.canvas,c*TILE,r*TILE,TILE,TILE,0,0,32,32);
  g.fillStyle="rgba(0,0,0,.22)";g.fillRect(0,24,32,8);
  return cv;
}
function toolIconFor(id){
  const cv=document.createElement("canvas");cv.width=32;cv.height=32;const g=cv.getContext("2d");g.imageSmoothingEnabled=false;
  const itm=ITEMS[id];if(!itm)return cv;
  const tc=itm.tint||0x888888;
  const ts="rgb("+((tc>>16)&255)+","+((tc>>8)&255)+","+(tc&255)+")";
  const td="rgb("+Math.max(0,((tc>>16)&255)-60)+","+Math.max(0,((tc>>8)&255)-60)+","+Math.max(0,(tc&255)-60)+")";
  g.fillStyle="#9a6030";g.fillRect(18,14,3,16);g.fillStyle=ts;
  const typ=itm.toolType;
  if(typ==="pickaxe"){g.fillRect(4,8,24,6);g.fillStyle=td;g.fillRect(4,11,24,3);g.fillRect(4,8,5,6);}
  else if(typ==="axe"){g.fillRect(4,5,16,13);g.fillStyle=td;g.fillRect(4,11,16,7);}
  else if(typ==="shovel"){g.fillRect(13,3,6,12);g.fillRect(10,13,12,4);g.fillStyle=td;g.fillRect(10,15,12,2);}
  else if(typ==="hoe"){g.fillRect(4,5,17,6);g.fillRect(4,5,5,11);g.fillStyle=td;g.fillRect(4,9,17,2);}
  else if(typ==="shears"){g.save();g.translate(16,14);g.rotate(-Math.PI/5);g.fillRect(-10,-2,10,5);g.restore();g.save();g.translate(16,14);g.rotate(Math.PI/5);g.fillRect(0,-2,10,5);g.restore();}
  else if(typ==="bucket"){g.fillRect(9,12,14,12);g.fillStyle=td;g.fillRect(9,12,14,3);g.fillStyle="#1a4a8a";g.fillRect(11,17,10,6);}
  else if(typ==="fishingrod"){g.fillStyle="#9a6030";g.fillRect(14,2,3,24);g.fillStyle="#ccccaa";g.fillRect(16,2,1,24);g.fillRect(16,25,7,1);}
  else if(typ==="gun"){g.fillStyle="#3a3a4a";g.fillRect(4,14,22,8);g.fillStyle=ts;g.fillRect(18,8,6,16);g.fillStyle=td;g.fillRect(4,16,18,4);g.fillStyle="#aaaacc";g.fillRect(24,14,6,4);g.fillStyle="#5a4a2a";g.fillRect(8,22,8,6);}
  else{g.fillRect(6,5,20,18);}
  return cv;
}

/* ============================================
   WORLD GENERATION
   ============================================ */
const world=new Uint8Array(WX*WY*WZ);
const damage=new Map();
const placed=new Set();
const ruinZones=[];
const CXc=WX/2,CZc=WZ/2;
const VI=(x,y,z)=>(y*WZ+z)*WX+x;
function inb(x,y,z){return x>=0&&x<WX&&y>=0&&y<WY&&z>=0&&z<WZ;}
function getV(x,y,z){return inb(x,y,z)?world[VI(x,y,z)]:AIR;}
function isSolid(x,y,z){const v=getV(x,y,z);return v!==AIR&&!B[v]?.liquid;}
function isWater(x,y,z){return getV(x,y,z)===10;}
function isRuinZone(x,z){for(const rz of ruinZones){if(Math.hypot(x-rz.cx,z-rz.cz)<rz.r)return true;}return false;}
function h2(x,z){const n=Math.sin(x*127.1+z*311.7)*43758.5453;return n-Math.floor(n);}
function vnoise(x,z){const xi=Math.floor(x),zi=Math.floor(z),xf=x-xi,zf=z-zi;const u=xf*xf*(3-2*xf),v=zf*zf*(3-2*zf);const a=h2(xi,zi),b=h2(xi+1,zi),c=h2(xi,zi+1),d=h2(xi+1,zi+1);return a*(1-u)*(1-v)+b*u*(1-v)+c*(1-u)*v+d*u*v;}
function fbm(x,z){let s=0,a=1,f=1,tot=0;for(let i=0;i<4;i++){s+=vnoise(x*f,z*f)*a;tot+=a;a*=0.5;f*=2.1;}return s/tot;}
function tH(x,z){const d=Math.hypot(x-CXc,z-CZc);let h=8+fbm(x*0.04,z*0.04)*18;const mBoost=Math.max(0,(d-18)/12);h+=mBoost*fbm(x*0.08,z*0.08)*14;const fl=1-Math.min(1,Math.max(0,(d-14)/12));h=h*(1-fl)+11*fl;return Math.max(4,Math.min(WY-14,Math.round(h)));}

function genWorld(){
  world.fill(0);damage.clear();placed.clear();ruinZones.length=0;
  for(let x=0;x<WX;x++)for(let z=0;z<WZ;z++){
    const h=tH(x,z);const beach=h<=7;
    for(let y=0;y<=h;y++){let b=3;if(y===0)b=9;else if(y===h)b=beach?6:1;else if(y>h-4)b=beach?6:2;world[VI(x,y,z)]=b;}
    if(h<7)for(let y=h+1;y<=7;y++)world[VI(x,y,z)]=10;
  }
  for(let x=0;x<WX;x++)for(let z=0;z<WZ;z++){if(x<2||x>WX-3||z<2||z>WZ-3){const h=tH(x,z);for(let y=0;y<=h+6;y++)world[VI(x,y,z)]=9;}}
  const ores=[{id:11,my:1,mxy:10,n:55},{id:12,my:1,mxy:8,n:38},{id:13,my:1,mxy:6,n:32},{id:14,my:1,mxy:4,n:22},{id:15,my:1,mxy:3,n:16},{id:16,my:2,mxy:12,n:28}];
  for(const o of ores)for(let k=0;k<o.n;k++){const x=3+((rnd()*(WX-6))|0),z=3+((rnd()*(WZ-6))|0),y=o.my+((rnd()*(o.mxy-o.my))|0);const h=tH(x,z);if(y<h-1&&world[VI(x,y,z)]===3){const vs=1+((rnd()*3)|0);for(let v=0;v<vs;v++){const dx=(rnd()*3|0)-1,dz=(rnd()*3|0)-1,ny=y+v;if(inb(x+dx,ny,z+dz)&&world[VI(x+dx,ny,z+dz)]===3)world[VI(x+dx,ny,z+dz)]=o.id;}}}
  for(let k=0;k<55;k++){const x=4+((rnd()*(WX-8))|0),z=4+((rnd()*(WZ-8))|0);const y=2+((rnd()*6)|0);if(inb(x,y,z)&&world[VI(x,y,z)]===3)world[VI(x,y,z)]=21;}
  for(let i=0;i<90;i++){const x=5+((rnd()*(WX-10))|0),z=5+((rnd()*(WZ-10))|0);if(Math.hypot(x-CXc,z-CZc)<16)continue;const h=tH(x,z);if(getV(x,h,z)!==1)continue;const th=4+((rnd()*3)|0);for(let y=1;y<=th;y++)world[VI(x,h+y,z)]=4;for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let dy=-1;dy<=2;dy++){const r=Math.abs(dx)+Math.abs(dz)+Math.abs(dy);if(r>3||(dx===0&&dz===0&&dy<=0))continue;const X=x+dx,Y=h+th+dy,Z=z+dz;if(inb(X,Y,Z)&&world[VI(X,Y,Z)]===AIR)world[VI(X,Y,Z)]=5;}}
  for(let i=0;i<32;i++){const x=6+((rnd()*(WX-12))|0),z=6+((rnd()*(WZ-12))|0);if(Math.hypot(x-CXc,z-CZc)<10)continue;const h=tH(x,z);world[VI(x,h,z)]=rnd()<0.25?8:7;}
  for(let ri=0;ri<8;ri++){const ang=ri*(Math.PI*2/8)+(rnd()-0.5)*0.5;const dist=18+rnd()*14;const rx=Math.round(CXc+Math.cos(ang)*dist);const rz=Math.round(CZc+Math.sin(ang)*dist);if(rx<5||rx>WX-6||rz<5||rz>WZ-6)continue;buildRuin(rx,rz);ruinZones.push({cx:rx,cz:rz,r:7});}
  carveRiver();
}
function buildRuin(cx,cz){
  const h=tH(cx,cz)+1;const sz=4+((rnd()*3)|0);
  for(let dx=-sz;dx<=sz;dx++)for(let dz=-sz;dz<=sz;dz++){const isWall=(Math.abs(dx)===sz||Math.abs(dz)===sz);if(!isWall)continue;const wallH=2+((rnd()*3)|0);for(let dy=0;dy<wallH;dy++){if(rnd()<0.35)continue;const X=cx+dx,Y=h+dy,Z=cz+dz;if(inb(X,Y,Z))world[VI(X,Y,Z)]=3;}}
  for(let dx=-sz+1;dx<sz;dx++)for(let dz=-sz+1;dz<sz;dz++){if(rnd()<0.25)continue;const X=cx+dx,Y=h,Z=cz+dz;if(inb(X,Y,Z))world[VI(X,Y,Z)]=3;}
  for(let k=0;k<3;k++){const dx=(rnd()*sz*2|0)-sz,dz=(rnd()*sz*2|0)-sz;const X=cx+dx,Y=h,Z=cz+dz;if(inb(X,Y,Z)&&rnd()<0.5)world[VI(X,Y,Z)]=21;}
}
function carveRiver(){
  let x=Math.round(CXc-20+rnd()*10);let z=5;const targetZ=WZ-6;
  while(z<targetZ){const w=1+Math.round(rnd()*2);for(let dx=-w;dx<=w;dx++){const X=x+dx;if(X<3||X>WX-4)continue;const h=tH(X,z);const waterH=Math.min(7,h+1);for(let dy=h;dy>waterH-2;dy--){if(inb(X,dy,z))world[VI(X,dy,z)]=AIR;}for(let dy=waterH-1;dy<=waterH;dy++){if(inb(X,dy,z))world[VI(X,dy,z)]=10;}}z++;if(rnd()<0.3)x+=rnd()<0.5?1:-1;x=Math.max(6,Math.min(WX-7,x));}
}

/* ============================================
   RENDERER
   ============================================ */
const canvas=document.getElementById("c");
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.autoClear=false;
const scene=new THREE.Scene();scene.fog=new THREE.Fog(0xa9c8e6,38,120);
const camera=new THREE.PerspectiveCamera(74,innerWidth/innerHeight,0.08,500);
const SUNDIR=new THREE.Vector3(0.48,0.72,0.34).normalize();
const sun=new THREE.DirectionalLight(0xfff0d8,1.45);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.near=1;sun.shadow.camera.far=170;sun.shadow.camera.left=-50;sun.shadow.camera.right=50;sun.shadow.camera.top=50;sun.shadow.camera.bottom=-50;sun.shadow.bias=-0.0009;sun.shadow.normalBias=0.035;scene.add(sun);scene.add(sun.target);
scene.add(new THREE.HemisphereLight(0xbcd7ef,0x4a4033,0.72));scene.add(new THREE.AmbientLight(0xffffff,0.18));
const skyMat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{top:{value:new THREE.Color(0x1a3a8a)},bot:{value:new THREE.Color(0x9ab8e0)},sun:{value:SUNDIR}},vertexShader:"varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",fragmentShader:"varying vec3 vP;uniform vec3 top,bot,sun;void main(){vec3 d=normalize(vP);float h=clamp(d.y*1.05+0.05,0.0,1.0);vec3 col=mix(bot,top,pow(h,0.55));float s=max(dot(d,normalize(sun)),0.0);col+=vec3(1.0,0.8,0.5)*pow(s,90.0)*2.5;col+=vec3(1.0,0.7,0.4)*pow(s,6.0)*0.3;gl_FragColor=vec4(col,1.0);}"});
const sky=new THREE.Mesh(new THREE.SphereGeometry(300,24,16),skyMat);sky.frustumCulled=false;scene.add(sky);
const cloudG=new THREE.Group();scene.add(cloudG);
(function(){const m=new THREE.MeshPhongMaterial({color:0xf0f4fc,transparent:true,opacity:0.88,fog:false,flatShading:true});for(let i=0;i<28;i++){const c=new THREE.Mesh(new THREE.BoxGeometry(10+rnd()*24,3+rnd()*3,10+rnd()*20),m);c.position.set(-160+rnd()*320,60+rnd()*22,-160+rnd()*320);cloudG.add(c);}})();
const waterMat=new THREE.MeshPhongMaterial({color:0x1a4a9a,transparent:true,opacity:0.72,side:THREE.DoubleSide,shininess:80});
const waterSurfaces=new THREE.Group();scene.add(waterSurfaces);
const terrainMat=new THREE.MeshLambertMaterial({map:ATLAS.tex,vertexColors:true});

/* ============================================
   ZONE VISUAL RING
   ============================================ */
let zoneMesh=null,zoneOutMesh=null;
function buildZoneRing(radius,color,opacity){
  const geo=new THREE.CylinderGeometry(radius,radius,60,64,1,true);
  const mat=new THREE.MeshBasicMaterial({color,transparent:true,opacity,side:THREE.DoubleSide,depthWrite:false});
  const mesh=new THREE.Mesh(geo,mat);mesh.position.set(CXc,WY/2-10,CZc);mesh.frustumCulled=false;return mesh;
}
function rebuildZoneMeshes(){
  if(zoneMesh){scene.remove(zoneMesh);zoneMesh.geometry.dispose();zoneMesh.material.dispose();}
  if(zoneOutMesh){scene.remove(zoneOutMesh);zoneOutMesh.geometry.dispose();zoneOutMesh.material.dispose();}
  zoneMesh=buildZoneRing(battleZoneRadius,0x4adc6f,0.18);
  zoneOutMesh=buildZoneRing(Math.min(WX,WZ)/2-1,0xe2483d,0.12);
  scene.add(zoneMesh);scene.add(zoneOutMesh);
}

/* ============================================
   CHUNK MESHING
   ============================================ */
const FACES=[
 {key:"nx",dir:[-1,0,0],corners:[{pos:[0,1,0],uv:[0,1]},{pos:[0,0,0],uv:[0,0]},{pos:[0,1,1],uv:[1,1]},{pos:[0,0,1],uv:[1,0]}]},
 {key:"px",dir:[1,0,0],corners:[{pos:[1,1,1],uv:[0,1]},{pos:[1,0,1],uv:[0,0]},{pos:[1,1,0],uv:[1,1]},{pos:[1,0,0],uv:[1,0]}]},
 {key:"ny",dir:[0,-1,0],corners:[{pos:[1,0,1],uv:[1,0]},{pos:[0,0,1],uv:[0,0]},{pos:[1,0,0],uv:[1,1]},{pos:[0,0,0],uv:[0,1]}]},
 {key:"py",dir:[0,1,0],corners:[{pos:[0,1,1],uv:[1,1]},{pos:[1,1,1],uv:[0,1]},{pos:[0,1,0],uv:[1,0]},{pos:[1,1,0],uv:[0,0]}]},
 {key:"nz",dir:[0,0,-1],corners:[{pos:[1,0,0],uv:[0,0]},{pos:[0,0,0],uv:[1,0]},{pos:[1,1,0],uv:[0,1]},{pos:[0,1,0],uv:[1,1]}]},
 {key:"pz",dir:[0,0,1],corners:[{pos:[0,0,1],uv:[0,0]},{pos:[1,0,1],uv:[1,0]},{pos:[0,1,1],uv:[0,1]},{pos:[1,1,1],uv:[1,1]}]}
];
FACES.forEach(f=>{const d=f.dir,ax=[0,1,2].filter(a=>d[a]===0),a1=ax[0],a2=ax[1];f.corners.forEach(c=>{const s1=d.slice(),s2=d.slice(),co=d.slice();const v1=c.pos[a1]*2-1,v2=c.pos[a2]*2-1;s1[a1]+=v1;s2[a2]+=v2;co[a1]+=v1;co[a2]+=v2;c.ao=[s1,s2,co];});});
const AO=[0.42,0.63,0.82,1.0];
const chunks=[];for(let i=0;i<CXN*CZN;i++)chunks.push(null);
const dirty=new Set();
function chunkIdx(cx,cz){return cz*CXN+cx;}
function buildChunk(cx,cz){
  const pos=[],nor=[],uvs=[],col=[],idx=[];const x0=cx*CS,z0=cz*CS;
  for(let x=x0;x<x0+CS;x++)for(let z=z0;z<z0+CS;z++)for(let y=0;y<WY;y++){
    const v=world[VI(x,y,z)];if(v===AIR||B[v]?.liquid)continue;const def=B[v];
    for(let fi=0;fi<6;fi++){const f=FACES[fi],d=f.dir;const nv=getV(x+d[0],y+d[1],z+d[2]);if(nv!==AIR&&!B[nv]?.liquid)continue;const uv=tileUV(def.tiles[f.key]),base=pos.length/3;for(let ci=0;ci<4;ci++){const c=f.corners[ci];pos.push(x+c.pos[0],y+c.pos[1],z+c.pos[2]);nor.push(d[0],d[1],d[2]);uvs.push(c.uv[0]?uv.u1:uv.u0,c.uv[1]?uv.v1:uv.v0);const o=c.ao;const s1=isSolid(x+o[0][0],y+o[0][1],z+o[0][2])?1:0;const s2=isSolid(x+o[1][0],y+o[1][1],z+o[1][2])?1:0;const sc=isSolid(x+o[2][0],y+o[2][1],z+o[2][2])?1:0;const a=AO[(s1&&s2)?0:(3-(s1+s2+sc))];col.push(a,a,a);}idx.push(base,base+1,base+2,base+2,base+1,base+3);}
  }
  const ci=chunkIdx(cx,cz);if(chunks[ci]){scene.remove(chunks[ci]);chunks[ci].geometry.dispose();chunks[ci]=null;}if(!idx.length)return;
  const geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));geo.setAttribute("normal",new THREE.Float32BufferAttribute(nor,3));geo.setAttribute("uv",new THREE.Float32BufferAttribute(uvs,2));geo.setAttribute("color",new THREE.Float32BufferAttribute(col,3));geo.setIndex(idx);geo.computeBoundingSphere();
  const m=new THREE.Mesh(geo,terrainMat);m.castShadow=true;m.receiveShadow=true;scene.add(m);chunks[ci]=m;
}
function buildAll(){for(let cx=0;cx<CXN;cx++)for(let cz=0;cz<CZN;cz++)buildChunk(cx,cz);buildWaterSurfaces();}
function markDirty(x,z){const cx=Math.floor(x/CS),cz=Math.floor(z/CS);const add=(a,b)=>{if(a>=0&&a<CXN&&b>=0&&b<CZN)dirty.add(chunkIdx(a,b));};add(cx,cz);const lx=x-cx*CS,lz=z-cz*CS;if(lx===0)add(cx-1,cz);if(lx===CS-1)add(cx+1,cz);if(lz===0)add(cx,cz-1);if(lz===CS-1)add(cx,cz+1);}
function setVoxel(x,y,z,v){if(!inb(x,y,z))return;const i=VI(x,y,z);if(world[i]===v)return;world[i]=v;damage.delete(i);if(v===AIR)placed.delete(i);markDirty(x,z);}
function flushDirty(){if(!dirty.size)return;dirty.forEach(i=>buildChunk(i%CXN,Math.floor(i/CXN)));dirty.clear();}
function buildWaterSurfaces(){while(waterSurfaces.children.length)waterSurfaces.remove(waterSurfaces.children[0]);for(let x=0;x<WX;x++)for(let z=0;z<WZ;z++){if(world[VI(x,7,z)]===10&&!isSolid(x,8,z)){const pl=new THREE.Mesh(new THREE.PlaneGeometry(1,1),waterMat);pl.rotation.x=-Math.PI/2;pl.position.set(x+0.5,7.95,z+0.5);waterSurfaces.add(pl);}}}
const hl=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.003,1.003,1.003)),new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:0.5}));hl.visible=false;scene.add(hl);
const torchLights=[];

/* ============================================
   PARTICLES
   ============================================ */
const PMAX=900;const pMesh=new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.5,0),new THREE.MeshPhongMaterial({flatShading:true}),PMAX);pMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);pMesh.frustumCulled=false;
const _c=new THREE.Color();for(let i=0;i<PMAX;i++)pMesh.setColorAt(i,_c.setRGB(1,1,1));scene.add(pMesh);
const parts=[];let pHead=0;
const _m4=new THREE.Matrix4(),_q=new THREE.Quaternion(),_v3s=new THREE.Vector3(),_s3=new THREE.Vector3(),_eu=new THREE.Euler();
for(let i=0;i<PMAX;i++)parts.push({life:0,x:0,y:0,z:0,vx:0,vy:0,vz:0,s:0,max:1,rx:0,ry:0,g:1});
function burst(x,y,z,color,n,spread,size,grav){for(let k=0;k<n;k++){const p=parts[pHead];pHead=(pHead+1)%PMAX;p.x=x;p.y=y;p.z=z;p.vx=(Math.random()-0.5)*spread;p.vy=Math.random()*spread*0.85+0.6;p.vz=(Math.random()-0.5)*spread;p.max=p.life=0.5+Math.random()*0.7;p.s=size*(0.55+Math.random()*0.8);p.rx=Math.random()*6;p.ry=Math.random()*6;p.g=grav===undefined?1:grav;pMesh.setColorAt(pHead===0?PMAX-1:pHead-1,_c.set(color).offsetHSL(0,0,(Math.random()-0.5)*0.12));}if(pMesh.instanceColor)pMesh.instanceColor.needsUpdate=true;}
function updateParticles(dt){for(let i=0;i<PMAX;i++){const p=parts[i];if(p.life<=0){_m4.makeScale(0,0,0);pMesh.setMatrixAt(i,_m4);continue;}p.life-=dt;p.vy-=26*dt*p.g;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;if(isSolid(Math.floor(p.x),Math.floor(p.y),Math.floor(p.z))){p.y=Math.floor(p.y)+1.02;p.vy*=-0.24;p.vx*=0.6;p.vz*=0.6;}p.rx+=dt*4;p.ry+=dt*3;const t=Math.max(0,p.life/p.max),sc=p.s*(0.35+0.65*t);_eu.set(p.rx,p.ry,0);_q.setFromEuler(_eu);_m4.compose(_v3s.set(p.x,p.y,p.z),_q,_s3.set(sc,sc,sc));pMesh.setMatrixAt(i,_m4);}pMesh.instanceMatrix.needsUpdate=true;}

/* ============================================
   AUDIO
   ============================================ */
let actx=null;function A(){if(!actx){try{actx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}return actx;}
function tone(freq,dur,type,vol,slide){const a=A();if(!a)return;const o=a.createOscillator(),g=a.createGain();o.type=type||"square";o.frequency.setValueAtTime(freq,a.currentTime);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,slide),a.currentTime+dur);g.gain.setValueAtTime(0.0001,a.currentTime);g.gain.exponentialRampToValueAtTime(vol||0.12,a.currentTime+0.008);g.gain.exponentialRampToValueAtTime(0.0001,a.currentTime+dur);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+dur+0.02);}
function nzAudio(dur,vol,freq,q){const a=A();if(!a)return;const n=a.sampleRate*dur|0,buf=a.createBuffer(1,n,a.sampleRate),d=buf.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);const s=a.createBufferSource();s.buffer=buf;const f=a.createBiquadFilter();f.type="bandpass";f.frequency.value=freq||900;f.Q.value=q||1;const g=a.createGain();g.gain.value=vol||0.18;s.connect(f);f.connect(g);g.connect(a.destination);s.start();}
const SFX={
  tap:()=>tone(160+Math.random()*40,0.05,"square",0.05),
  brk:()=>{nzAudio(0.22,0.22,700,0.8);tone(110,0.14,"triangle",0.08,60);},
  place:()=>{tone(330,0.07,"square",0.08,220);nzAudio(0.07,0.09,500,1);},
  throw:()=>{nzAudio(0.18,0.1,1400,2);tone(520,0.12,"sine",0.05,180);},
  hit:()=>{tone(220,0.09,"square",0.12,90);nzAudio(0.1,0.16,1800,1.4);},
  kill:()=>{tone(180,0.22,"sawtooth",0.1,55);nzAudio(0.3,0.2,420,0.7);},
  hurt:()=>{tone(150,0.26,"sawtooth",0.15,60);nzAudio(0.2,0.14,320,0.6);},
  boom:()=>{nzAudio(0.62,0.32,180,0.5);tone(90,0.5,"sawtooth",0.18,30);},
  wave:()=>{[392,523,659].forEach((f,i)=>setTimeout(()=>tone(f,0.22,"square",0.09),i*110));},
  heal:()=>{[523,698,880].forEach((f,i)=>setTimeout(()=>tone(f,0.16,"sine",0.08),i*70));},
  swing:()=>nzAudio(0.12,0.07,2200,3),
  chop:()=>{tone(200,0.1,"square",0.1,100);nzAudio(0.1,0.12,800,1.5);},
  dig:()=>{nzAudio(0.14,0.15,500,0.8);tone(130,0.1,"triangle",0.06,80);},
  snip:()=>{tone(600,0.06,"square",0.07,800);nzAudio(0.05,0.05,2000,2);},
  splash:()=>{nzAudio(0.3,0.14,400,0.5);tone(200,0.2,"sine",0.08,100);},
  cast:()=>{tone(440,0.12,"sine",0.06,220);nzAudio(0.12,0.05,1200,2);},
  catch:()=>{[523,659,784].forEach((f,i)=>setTimeout(()=>tone(f,0.18,"sine",0.07),i*80));},
  animal:()=>tone(280+Math.random()*120,0.15,"sine",0.06,180),
  gunshot:()=>{nzAudio(0.08,0.4,2400,0.5);tone(120,0.18,"sawtooth",0.2,40);},
  zoneHurt:()=>{tone(180,0.15,"sawtooth",0.06,120);},
  zombie:()=>{tone(80+Math.random()*40,0.3,"sawtooth",0.08,50);},
  dragon:()=>{nzAudio(0.8,0.4,80,0.3);tone(60,0.6,"sawtooth",0.2,30);},
  dogBark:()=>{tone(600+Math.random()*200,0.08,"square",0.07,400);nzAudio(0.1,0.05,1600,2);},
};

/* ============================================
   LOW-POLY MODEL HELPERS
   ============================================ */
// Low-poly flat-shaded material
function lpm(color,emissive){
  return new THREE.MeshPhongMaterial({color,emissive:emissive||0x000000,flatShading:true,shininess:25});
}
// Reusable geo factories
function mkMesh(geo,mat){const m=new THREE.Mesh(geo,mat);m.castShadow=true;m.receiveShadow=true;return m;}
function box(w,h,d,mat){return mkMesh(new THREE.BoxGeometry(w,h,d),mat);}
function cone(r,h,seg,mat){return mkMesh(new THREE.ConeGeometry(r,h,seg),mat);}
function octa(r,mat){return mkMesh(new THREE.OctahedronGeometry(r,0),mat);}
function buildHPBar(){
  const hb=new THREE.Group();
  const bg=new THREE.Mesh(new THREE.PlaneGeometry(0.92,0.13),new THREE.MeshBasicMaterial({color:0x10151b}));
  const fg=new THREE.Mesh(new THREE.PlaneGeometry(0.86,0.08),new THREE.MeshBasicMaterial({color:0xe2483d}));
  fg.position.z=0.002;hb.add(bg);hb.add(fg);
  return{hb,fg};
}

/* ============================================
   LOW-POLY ZOMBIE MODEL
   ============================================ */
function buildZombieModel(variant){
  // variant: 'zombie' | 'brute_zombie' | 'skeleton' | 'bot_enemy' | 'bot_ally'
  const g=new THREE.Group();
  let skinCol,cloakCol,eyeCol,glowCol;
  if(variant==="skeleton"){
    skinCol=0xdde8d0;cloakCol=0x888880;eyeCol=0xff2200;glowCol=0xff3300;
  } else if(variant==="brute_zombie"){
    skinCol=0x2a5a1a;cloakCol=0x1a3a0a;eyeCol=0xffcc00;glowCol=0xff8800;
  } else if(variant==="bot_enemy"){
    skinCol=0x8a1010;cloakCol=0x3a0808;eyeCol=0xff4444;glowCol=0xff2222;
  } else if(variant==="bot_ally"){
    skinCol=0x104888;cloakCol=0x082240;eyeCol=0x44aaff;glowCol=0x22aaff;
  } else {
    // regular zombie
    skinCol=0x3a6a28;cloakCol=0x1e3a14;eyeCol=0xaaff44;glowCol=0x88ee00;
  }
  const mSkin=lpm(skinCol);
  const mCloak=lpm(cloakCol);
  const mEye=new THREE.MeshBasicMaterial({color:eyeCol});
  const isBrute=(variant==="brute_zombie");
  const sc=isBrute?1.6:1.0;
  // Legs (angular low-poly)
  const legs=[];
  for(const s of[-1,1]){
    const piv=new THREE.Group();piv.position.set(0.2*s,0.55*sc,0);
    const upper=box(0.22*sc,0.32*sc,0.22*sc,mCloak);upper.position.y=-0.16*sc;piv.add(upper);
    const lower=box(0.18*sc,0.3*sc,0.18*sc,mSkin);lower.position.y=-0.48*sc;piv.add(lower);
    // Foot (angular)
    const foot=box(0.22*sc,0.1*sc,0.3*sc,mCloak);foot.position.set(0,-0.64*sc,0.06*sc);piv.add(foot);
    g.add(piv);legs.push(piv);
  }
  // Torso (wider, more angular than MC)
  const torso=box(0.72*sc,0.82*sc,0.44*sc,mCloak);torso.position.y=0.96*sc;g.add(torso);
  // Shoulder pads
  for(const s of[-1,1]){
    const pad=box(0.18*sc,0.18*sc,0.42*sc,mSkin);pad.position.set(0.46*s,1.3*sc,0);g.add(pad);
  }
  // Arms (outstretched for zombie look)
  const arms=[];
  for(const s of[-1,1]){
    const piv=new THREE.Group();piv.position.set(0.52*s,1.22*sc,0);
    const upper=box(0.22*sc,0.38*sc,0.22*sc,mSkin);upper.position.y=-0.19*sc;piv.add(upper);
    const lower=box(0.18*sc,0.34*sc,0.18*sc,mCloak);lower.position.y=-0.58*sc;piv.add(lower);
    const hand=box(0.24*sc,0.18*sc,0.24*sc,mSkin);hand.position.y=-0.82*sc;piv.add(hand);
    // Zombie arms pre-angled forward
    if(variant==="zombie"||variant==="brute_zombie"){piv.rotation.x=-0.8;}
    g.add(piv);arms.push(piv);
  }
  // Head (angular, angular jaw)
  const headG=new THREE.Group();headG.position.y=(1.37+0.26)*sc;
  const skull=box(0.56*sc,0.5*sc,0.52*sc,mSkin);headG.add(skull);
  if(variant==="skeleton"){
    // Skull holes
    const h1=box(0.12*sc,0.12*sc,0.06*sc,new THREE.MeshBasicMaterial({color:0x000000}));h1.position.set(-0.12*sc,0.06*sc,-0.27*sc);headG.add(h1);
    const h2=h1.clone();h2.position.set(0.12*sc,0.06*sc,-0.27*sc);headG.add(h2);
  }
  // Eyes
  for(const s of[-1,1]){
    const eye=new THREE.Mesh(new THREE.PlaneGeometry(0.16*sc,0.1*sc),mEye);
    eye.position.set(0.14*s*sc,0.04*sc,-0.27*sc);eye.rotation.y=Math.PI;
    // Glow socket
    const glow=new THREE.Mesh(new THREE.PlaneGeometry(0.2*sc,0.14*sc),new THREE.MeshBasicMaterial({color:glowCol,transparent:true,opacity:0.4}));
    glow.position.set(0.14*s*sc,0.04*sc,-0.275*sc);glow.rotation.y=Math.PI;
    headG.add(eye);headG.add(glow);
  }
  // Jaw (undead detail)
  const jaw=box(0.44*sc,0.1*sc,0.08*sc,mCloak);jaw.position.set(0,-0.22*sc,-0.24*sc);headG.add(jaw);
  // Horns on brute
  if(variant==="brute_zombie"){
    for(const s of[-1,1]){
      const horn=cone(0.07,0.28,4,lpm(0x1a0a00));horn.position.set(0.2*s,0.32,-0.05);horn.rotation.z=s*0.4;headG.add(horn);
    }
  }
  // Skeleton: crown spikes
  if(variant==="skeleton"){
    for(let k=0;k<5;k++){
      const spike=cone(0.04,0.18,3,lpm(0xbbccb0));spike.position.set((-0.24+k*0.12)*sc,0.28*sc,0);headG.add(spike);
    }
  }
  g.add(headG);
  // HP bar
  const {hb,fg}=buildHPBar();
  hb.position.y=(1.37+0.5+0.4)*sc;
  g.add(hb);
  const parts=[torso,...legs.map(p=>p.children[0]),...arms.map(p=>p.children[0])];
  return{group:g,legs,arms,head:headG,hb,fg,parts,skinMat:mSkin,isSkeleton:variant==="skeleton"};
}

/* ============================================
   LOW-POLY ENEMY TYPES
   ============================================ */
const ETYPES={
  zombie:{name:"Zombie",hp:55,spd:1.9,dmg:10,w:0.38,h:1.75,score:12,reach:1.9,blockDps:20,variant:"zombie",col:0x3a6a28},
  brute_zombie:{name:"Brute Zombie",hp:180,spd:1.4,dmg:22,w:0.58,h:2.6,score:35,reach:2.4,blockDps:55,variant:"brute_zombie",col:0x2a5a1a},
  skeleton:{name:"Skeleton",hp:28,spd:5.0,dmg:7,w:0.28,h:1.55,score:18,reach:1.8,blockDps:14,variant:"skeleton",col:0xdde8d0},
};
const enemies=[];

function spawnEnemy(tk,x,z){
  const t=ETYPES[tk];
  const md=buildZombieModel(t.variant);
  let y=WY-1;while(y>0&&!isSolid(Math.floor(x),y,Math.floor(z)))y--;
  const e={t,key:tk,model:md,pos:new THREE.Vector3(x,y+1.2,z),vel:new THREE.Vector3(),w:t.w,h:t.h,onGround:false,hp:t.hp,maxhp:t.hp,dead:false,deadT:0,walk:0,atkCd:0,flash:0,spawnT:0,yaw:0,isPvpBot:false};
  scene.add(md.group);md.group.position.copy(e.pos);md.group.scale.setScalar(0.01);
  enemies.push(e);burst(x,y+1,z,0x44ff88,10,3.5,0.14,0.3);
  // zombie groan on spawn
  if(Math.random()<0.5)setTimeout(()=>SFX.zombie(),200);
  return e;
}

function damageEnemy(e,amt,kx,kz,crit){
  if(e.dead)return;e.hp-=amt;e.flash=1;e.vel.x+=(kx||0);e.vel.z+=(kz||0);
  burst(e.pos.x,e.pos.y+e.h*0.6,e.pos.z,e.t.col||0x44ff88,5,3.5,0.12);
  showDamage(e.pos.x,e.pos.y+e.h*0.8,e.pos.z,Math.round(amt),crit?"#00ffcc":"#ffaa44");
  hitmark();SFX.hit();
  if(e.hp<=0)killEnemy(e);
}

function killEnemy(e){
  e.dead=true;e.deadT=0;player.kills++;player.score+=e.t.score;
  burst(e.pos.x,e.pos.y+e.h*0.5,e.pos.z,e.t.col||0x44ff88,20,5.5,0.18);
  showDamage(e.pos.x,e.pos.y+e.h+0.4,e.pos.z,"+"+e.t.score,"#00ffcc");
  SFX.kill();
  if(e.isPvpBot)pvpBotDied(e);
  // Drops
  if(e.key==="brute_zombie"){give(7,3);}
  else if(e.key==="skeleton"){giveItem(105,1);giveItem(107,1);}
  else{give(3,1);}
  // Pet dog on kill: notify
  updatePetDog();
  updateHUD();
}

function eO(t){return 1-Math.pow(1-t,3);}

function updateEnemies(dt){
  const pFeet=player.pos;
  for(let i=enemies.length-1;i>=0;i--){
    const e=enemies[i],md=e.model;
    if(e.dead){
      e.deadT+=dt;
      md.group.rotation.x=Math.min(Math.PI/2,e.deadT*3.5);
      md.group.position.y-=dt*0.8;
      md.group.scale.multiplyScalar(Math.max(0,1-dt*1.6));
      md.hb.visible=false;
      if(e.deadT>0.65){scene.remove(md.group);disposeGroup(md.group);enemies.splice(i,1);}
      continue;
    }
    e.spawnT=Math.min(1,e.spawnT+dt*3.0);
    const scBase=e.t.h/1.75;
    md.group.scale.setScalar(scBase*(0.35+0.65*eO(e.spawnT)));
    const dx=pFeet.x-e.pos.x,dz=pFeet.z-e.pos.z;
    const dist=Math.hypot(dx,dz);
    const nx=dist>0.01?dx/dist:0,nz=dist>0.01?dz/dist:0;
    const want=e.t.spd*(playing?1:0.2);
    e.vel.x+=(nx*want-e.vel.x)*Math.min(1,12*dt);
    e.vel.z+=(nz*want-e.vel.z)*Math.min(1,12*dt);
    e.vel.y-=28*dt;
    const before={x:e.pos.x,z:e.pos.z};
    stepPhysics(e,dt);
    e.yaw=Math.atan2(nx,nz);
    const moved=Math.hypot(e.pos.x-before.x,e.pos.z-before.z);
    const bx=Math.floor(e.pos.x+nx*(e.w+0.45)),bz=Math.floor(e.pos.z+nz*(e.w+0.45)),by=Math.floor(e.pos.y+0.4);
    const bLow=isSolid(bx,by,bz),bHi=isSolid(bx,by+1,bz);
    if(moved<want*dt*0.4&&dist>e.t.reach){
      if(bLow&&!bHi&&e.onGround)e.vel.y=8.2;
      else if(bLow||bHi){hurtBlock(bx,bHi?by+1:by,bz,(e.t.blockDps||20)*dt);}
      if(md.arms){{md.arms[0].rotation.x=-1.4+Math.sin(time*16)*0.6;md.arms[1].rotation.x=-1.4+Math.sin(time*16+1.4)*0.6;}}
    }
    e.atkCd-=dt;
    if(dist<e.t.reach+player.w&&Math.abs(player.pos.y-e.pos.y)<2.2&&e.atkCd<=0){
      const canAtk=!battleMode||(battleMode&&battlePhase==="attack");
      if(canAtk){e.atkCd=1.1;hurtPlayer(e.t.dmg,nx,nz);}
    }
    // Pet dog: attack nearby enemy
    if(petDog&&!petDog.dead&&petDog.tamed){
      const ddx=e.pos.x-petDog.pos.x,ddz=e.pos.z-petDog.pos.z;
      const ddist=Math.hypot(ddx,ddz);
      if(ddist<2.2&&petDog.atkCd<=0&&(e.isEnemy||!e.isPvpBot)){
        petDog.atkCd=1.4;damageEnemy(e,12,ddx/ddist*2,ddz/ddist*2,false);SFX.dogBark();
      }
    }
    const sp2=Math.hypot(e.vel.x,e.vel.z);e.walk+=dt*(3+sp2*2);
    const sw=Math.sin(e.walk*2.2)*Math.min(1,sp2/e.t.spd)*0.8;
    if(md.legs){md.legs[0].rotation.x=sw;md.legs[1].rotation.x=-sw;}
    if(md.arms&&!(moved<want*dt*0.4&&(bLow||bHi))&&variant(e)!=="zombie"&&variant(e)!=="brute_zombie"){
      md.arms[0].rotation.x=-sw*0.7;md.arms[1].rotation.x=sw*0.7;
    }
    md.group.position.set(e.pos.x,e.pos.y,e.pos.z);md.group.rotation.y=e.yaw;
    md.group.position.y+=e.onGround?Math.abs(Math.sin(e.walk*2.2))*0.03*Math.min(1,sp2):0;
    if(md.head)md.head.rotation.x=Math.max(-0.5,Math.min(0.5,(player.pos.y+1.4-e.pos.y-e.h)*-0.2));
    // Flash on hit
    if(e.flash>0){
      e.flash=Math.max(0,e.flash-dt*4);
      md.parts.forEach(p=>{if(p.material&&p.material.emissive)p.material.emissive.setRGB(e.flash*0.8,e.flash*0.1,e.flash*0.05);});
    }
    md.hb.visible=e.hp<e.maxhp;md.hb.quaternion.copy(camera.quaternion);
    const fr=Math.max(0,e.hp/e.maxhp);md.fg.scale.x=fr;md.fg.position.x=-0.43*(1-fr);
    md.fg.material.color.setHex(fr>0.55?0x44dd44:(fr>0.25?0xffaa22:0xff2222));
    // Occasional zombie groan
    if(Math.random()<0.0003)SFX.zombie();
  }
}
function variant(e){return e.t?.variant||"";}
function disposeGroup(g){g.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});}

/* ============================================
   PVP BOTS (humanoid low-poly warriors)
   ============================================ */
const pvpBots=[];
let pvpBotsAlive=0,allyBotsAlive=0;

function spawnPvpBot(isEnemy,x,z){
  const vnt=isEnemy?"bot_enemy":"bot_ally";
  const md=buildZombieModel(vnt);
  const t={
    name:isEnemy?"Enemy Fighter":"Ally Fighter",
    hp:200,maxhp:200,spd:3.0,dmg:18,w:0.35,h:1.85,score:50,reach:2.0,blockDps:30,
    variant:vnt,col:isEnemy?0x8a1010:0x104888
  };
  let y=WY-1;while(y>0&&!isSolid(Math.floor(x),y,Math.floor(z)))y--;
  const e={t,key:isEnemy?"enemy_bot":"ally_bot",model:md,pos:new THREE.Vector3(x,y+1.5,z),vel:new THREE.Vector3(),w:t.w,h:t.h,onGround:false,hp:t.hp,maxhp:t.hp,dead:false,deadT:0,walk:0,atkCd:0,flash:0,spawnT:1,yaw:0,isPvpBot:true,isEnemy};
  scene.add(md.group);md.group.position.copy(e.pos);md.group.scale.setScalar(t.h/1.75);
  enemies.push(e);
  if(isEnemy)pvpBotsAlive++;else allyBotsAlive++;
  return e;
}
function pvpBotDied(e){
  if(e.isEnemy){pvpBotsAlive=Math.max(0,pvpBotsAlive-1);if(pvpBotsAlive<=0)battleVictory();}
  else allyBotsAlive=Math.max(0,allyBotsAlive-1);
}
function spawnPvpBots(){
  pvpBotsAlive=0;allyBotsAlive=0;
  const mode=window.selectedGameMode||"wave";
  const enemyCount=(mode==="party")?(window.pvpEnemySize||3):1;
  const allyBotCount=(mode==="party")?(window.pvpAllySize?window.pvpAllySize-1:2):0;
  for(let i=0;i<enemyCount;i++){const ang=Math.PI+i*(Math.PI*0.4)-0.2;const dist=16+i*4;spawnPvpBot(true,Math.max(5,Math.min(WX-6,CXc+Math.cos(ang)*dist))+0.5,Math.max(5,Math.min(WZ-6,CZc+Math.sin(ang)*dist))+0.5);}
  for(let i=0;i<allyBotCount;i++){const ang=i*(Math.PI*0.3)-0.2;const dist=6+i*3;spawnPvpBot(false,Math.max(5,Math.min(WX-6,CXc+Math.cos(ang)*dist))+0.5,Math.max(5,Math.min(WZ-6,CZc+Math.sin(ang)*dist))+0.5);}
}

/* ============================================
   LOW-POLY DOG MODEL
   ============================================ */
let petDog=null; // player's tamed companion

function buildDogModel(isTamed,isEnemy){
  const g=new THREE.Group();
  const fur=isTamed?(isEnemy?0x8a3020:0xc8823a):0x6a5030;
  const dark=isTamed?(isEnemy?0x4a1010:0x8a5020):0x3a2a10;
  const mFur=lpm(fur);const mDark=lpm(dark);
  // Body
  const body=box(0.6,0.42,0.9,mFur);body.position.y=0.42;g.add(body);
  // Chest (lighter)
  const chest=box(0.44,0.3,0.3,lpm(isEnemy?0x6a2010:0xdda060));chest.position.set(0,0.38,0.35);g.add(chest);
  // Head
  const hGrp=new THREE.Group();hGrp.position.set(0,0.62,0.5);
  const head=box(0.46,0.38,0.44,mFur);hGrp.add(head);
  // Snout
  const snout=box(0.28,0.2,0.28,mDark);snout.position.set(0,-0.04,0.26);hGrp.add(snout);
  // Nose
  const nose=box(0.1,0.08,0.06,new THREE.MeshBasicMaterial({color:0x110808}));nose.position.set(0,0.02,0.4);hGrp.add(nose);
  // Eyes
  for(const s of[-1,1]){
    const eyeC=isTamed?(isEnemy?0xff2222:0x44aaff):0xaa7700;
    const eye=new THREE.Mesh(new THREE.PlaneGeometry(0.1,0.08),new THREE.MeshBasicMaterial({color:eyeC}));
    eye.position.set(0.16*s,0.08,-0.23);eye.rotation.y=Math.PI;hGrp.add(eye);
  }
  // Ears (triangular low-poly)
  for(const s of[-1,1]){
    const ear=cone(0.1,0.24,3,mDark);ear.position.set(0.18*s,0.26,0);ear.rotation.z=s*0.25;hGrp.add(ear);
  }
  // Tamed collar
  if(isTamed){
    const collar=box(0.5,0.06,0.5,lpm(isEnemy?0xff2222:0x2255ff));collar.position.y=-0.18;hGrp.add(collar);
  }
  g.add(hGrp);
  // Legs
  const legs=[];
  const legPositions=[[-0.22,0,0.28],[-0.22,0,-0.28],[0.22,0,0.28],[0.22,0,-0.28]];
  for(const lp of legPositions){
    const piv=new THREE.Group();piv.position.set(lp[0],0.3,lp[2]);
    const upper=box(0.14,0.22,0.14,mFur);upper.position.y=-0.11;piv.add(upper);
    const lower=box(0.11,0.2,0.11,mDark);lower.position.y=-0.32;piv.add(lower);
    const paw=box(0.14,0.08,0.18,mFur);paw.position.set(0,-0.44,0.04);piv.add(paw);
    g.add(piv);legs.push(piv);
  }
  // Tail
  const tailG=new THREE.Group();tailG.position.set(0,0.52,-0.44);
  const tail1=box(0.08,0.08,0.28,mDark);tail1.position.set(0,0.1,-0.1);tailG.add(tail1);
  const tail2=box(0.06,0.06,0.2,mFur);tail2.position.set(0,0.24,-0.24);tail2.rotation.x=-0.5;tailG.add(tail2);
  g.add(tailG);
  const {hb,fg}=buildHPBar();hb.position.y=0.95;g.add(hb);
  return{group:g,legs,head:hGrp,tail:tailG,hb,fg,parts:[body,chest,...legs.map(p=>p.children[0])]};
}

function spawnWildDog(x,z,isEnemyDog){
  const md=buildDogModel(isEnemyDog,isEnemyDog);
  let y=WY-1;while(y>0&&!isSolid(Math.floor(x),y,Math.floor(z)))y--;
  const d={
    key:"dog",model:md,pos:new THREE.Vector3(x,y+0.4,z),vel:new THREE.Vector3(),
    w:0.28,h:0.85,onGround:false,
    hp:40,maxhp:40,dead:false,deadT:0,walk:0,atkCd:0,yaw:Math.random()*Math.PI*2,
    tamed:false,isEnemyDog,wander:0,wanderDir:new THREE.Vector2(1,0),fearT:0,
    owner:null
  };
  scene.add(md.group);dogs.push(d);return d;
}
const dogs=[];

function tameDog(d){
  // Replace model with tamed version
  scene.remove(d.model.group);disposeGroup(d.model.group);
  const newMd=buildDogModel(true,false);
  d.model=newMd;d.tamed=true;d.owner=player;
  scene.add(d.model.group);d.model.group.position.copy(d.pos);
  petDog=d;
  banner("DOG TAMED!","Your loyal companion joins the fight","#ffaa44");
  SFX.dogBark();SFX.heal();
  showDamage(d.pos.x,d.pos.y+1,d.pos.z,"🐕 TAMED!","#ffcc44");
}

function spawnDogs(){
  dogs.forEach(d=>scene.remove(d.model.group));dogs.length=0;petDog=null;
  // Wild dogs around map
  for(let i=0;i<6;i++){
    const ang=Math.random()*Math.PI*2,dist=14+Math.random()*18;
    const x=Math.max(5,Math.min(WX-6,CXc+Math.cos(ang)*dist));
    const z=Math.max(5,Math.min(WZ-6,CZc+Math.sin(ang)*dist));
    if(tH(x|0,z|0)>7)spawnWildDog(x,z,false);
  }
  // Enemy dogs (for pvp mode: spawned when bots spawn)
}

function updatePetDog(){
  if(petDog&&petDog.atkCd>0)petDog.atkCd=Math.max(0,petDog.atkCd-0.016);
}

function updateDogs(dt){
  for(let i=dogs.length-1;i>=0;i--){
    const d=dogs[i];
    if(d.dead){
      d.deadT=(d.deadT||0)+dt;
      d.model.group.position.y-=dt*0.4;
      d.model.group.scale.multiplyScalar(1-dt*1.8);
      if(d.deadT>0.6){scene.remove(d.model.group);disposeGroup(d.model.group);dogs.splice(i,1);if(petDog===d)petDog=null;}
      continue;
    }
    let tx=player.pos.x,tz=player.pos.z;
    let spd=1.2,afraid=false;
    if(d.tamed&&d.owner===player){
      // Follow player at distance
      const dx=player.pos.x-d.pos.x,dz=player.pos.z-d.pos.z;
      const dist=Math.hypot(dx,dz);
      if(dist>3){spd=4.5*(dist>8?1.6:1);tx=player.pos.x;tz=player.pos.z;}
      else{spd=0;}
      // Wag tail
      d.model.tail.rotation.y=Math.sin(time*8)*0.8;
    } else if(d.isEnemyDog){
      tx=player.pos.x;tz=player.pos.z;spd=4.0;
      // Attack player
      const dx=player.pos.x-d.pos.x,dz=player.pos.z-d.pos.z;
      const dist=Math.hypot(dx,dz);
      if(dist<1.6&&(d.atkCd||0)<=0){d.atkCd=1.2;hurtPlayer(12,dx/dist*3,dz/dist*3);SFX.dogBark();}
    } else {
      // Wild dog: wander, scared of player
      const dx=player.pos.x-d.pos.x,dz=player.pos.z-d.pos.z;
      const dist=Math.hypot(dx,dz);
      if(dist<5){afraid=true;spd=3.0;tx=d.pos.x-(dx/dist)*8;tz=d.pos.z-(dz/dist)*8;}
      else{
        d.wander=(d.wander||0)-dt;
        if(d.wander<=0){d.wander=2+Math.random()*3;const a=Math.random()*Math.PI*2;d.wanderDir.set(Math.cos(a),Math.sin(a));}
        tx=d.pos.x+d.wanderDir.x*4;tz=d.pos.z+d.wanderDir.y*4;spd=0.9;
      }
    }
    const ddx=tx-d.pos.x,ddz=tz-d.pos.z;const dl=Math.hypot(ddx,ddz);
    if(dl>0.2){d.vel.x+=(ddx/dl*spd-d.vel.x)*Math.min(1,10*dt);d.vel.z+=(ddz/dl*spd-d.vel.z)*Math.min(1,10*dt);d.yaw=Math.atan2(ddx,ddz);}
    else{d.vel.x*=0.7;d.vel.z*=0.7;}
    d.vel.y-=28*dt;
    if(d.onGround&&(d.vel.x||d.vel.z)){}
    d.onGround=false;
    stepPhysics(d,dt);
    const sp=Math.hypot(d.vel.x,d.vel.z);
    d.walk=(d.walk||0)+dt*(5+sp*3);
    const sw=Math.sin(d.walk*3.5)*Math.min(1,sp/2)*0.7;
    d.model.legs.forEach((l,li)=>l.rotation.x=(li%2===0?sw:-sw));
    d.model.group.position.copy(d.pos);d.model.group.rotation.y=d.yaw;
    if(d.atkCd)d.atkCd=Math.max(0,d.atkCd-dt);
    // HP bar
    d.model.hb.visible=d.hp<d.maxhp;d.model.hb.quaternion.copy(camera.quaternion);
    const fr=d.hp/d.maxhp;d.model.fg.scale.x=fr;d.model.fg.position.x=-0.43*(1-fr);
    d.model.fg.material.color.setHex(fr>0.5?0x44dd44:0xff4422);
  }
}

function hurtDog(d,dmg){
  if(d.dead)return;d.hp-=dmg;SFX.hit();SFX.dogBark();
  if(d.hp<=0){d.dead=true;d.deadT=0;burst(d.pos.x,d.pos.y+0.5,d.pos.z,0xaa6620,10,4,0.14);}
}

function rightClickDog(){
  // Try to tame or interact with nearest dog
  for(const d of dogs){
    if(d.dead||d.tamed||d.isEnemyDog)continue;
    const dist=Math.hypot(player.pos.x-d.pos.x,player.pos.z-d.pos.z);
    if(dist<2.5){
      const meat=player.inv[109]||0;
      if(meat>0){player.inv[109]--;drawHotbar();tameDog(d);}
      else{showDamage(d.pos.x,d.pos.y+1,d.pos.z,"Need Meat!","#ffaa44");}
      return true;
    }
  }
  return false;
}

/* ============================================
   LOW-POLY ANIMAL MODELS
   ============================================ */
// Animal types: safe zone + out-zone
const ATYPES={
  // Safe zone animals
  deer:{col:0xc8824a,col2:0xdda070,h:1.1,w:0.32,hp:18,loot:[{id:109,n:2},{id:110,n:1}],score:5,zone:"safe"},
  fox:{col:0xe85a18,col2:0xf0f0e0,h:0.7,w:0.2,hp:10,loot:[{id:109,n:1},{id:108,n:1}],score:4,zone:"safe"},
  rabbit:{col:0xe8e0d0,col2:0xd0c8b8,h:0.42,w:0.15,hp:5,loot:[{id:109,n:1}],score:2,zone:"safe"},
  // Out-zone dangerous animals
  bear:{col:0x6a4020,col2:0x3a2010,h:1.5,w:0.55,hp:90,dmg:22,loot:[{id:109,n:3},{id:110,n:2}],score:20,zone:"out",aggressive:true},
  wolf:{col:0x707880,col2:0x404850,h:0.95,w:0.32,hp:45,dmg:14,loot:[{id:110,n:1}],score:12,zone:"out",aggressive:true},
  vulture:{col:0x1a1a1a,col2:0x404040,h:0.6,w:0.28,hp:15,loot:[{id:108,n:3}],score:6,zone:"out",flies:true},
  serpent:{col:0x2a6a1a,col2:0x1a4a0a,h:0.45,w:0.18,hp:30,dmg:10,loot:[{id:107,n:2}],score:8,zone:"out",aggressive:true},
};
const animals=[];

function buildAnimalModel(key,t){
  const g=new THREE.Group();
  const mMain=lpm(t.col);const mAcc=lpm(t.col2);
  const legs=[];

  if(key==="deer"){
    const body=box(0.55,0.45,1.1,mMain);body.position.y=0.6;g.add(body);
    const neck=box(0.22,0.5,0.22,mMain);neck.position.set(0,0.96,0.38);neck.rotation.x=-0.4;g.add(neck);
    const head=box(0.3,0.26,0.36,mMain);head.position.set(0,1.22,0.54);g.add(head);
    const snout=box(0.16,0.14,0.22,mAcc);snout.position.set(0,1.14,0.7);g.add(snout);
    // Antlers
    for(const s of[-1,1]){const a=box(0.04,0.36,0.04,mAcc);a.position.set(0.1*s,1.5,0.44);g.add(a);const a2=box(0.04,0.22,0.04,mAcc);a2.position.set(0.18*s,1.6,0.44);a2.rotation.z=s*0.5;g.add(a2);}
    const lp=[[-0.22,0,0.32],[-0.22,0,-0.32],[0.22,0,0.32],[0.22,0,-0.32]];
    for(const l of lp){const piv=new THREE.Group();piv.position.set(l[0],0.45,l[2]);const leg=box(0.12,0.42,0.12,mAcc);leg.position.y=-0.21;piv.add(leg);const hoof=box(0.14,0.08,0.16,mAcc);hoof.position.set(0,-0.44,0.02);piv.add(hoof);g.add(piv);legs.push(piv);}
    return{group:g,legs,head};
  }
  if(key==="fox"){
    const body=box(0.38,0.3,0.65,mMain);body.position.y=0.35;g.add(body);
    // White belly
    const belly=box(0.28,0.2,0.5,mAcc);belly.position.set(0,0.28,0.02);g.add(belly);
    const head=box(0.32,0.24,0.34,mMain);head.position.set(0,0.55,0.35);g.add(head);
    const snout=box(0.14,0.12,0.2,lpm(0xc0501a));snout.position.set(0,0.5,0.5);g.add(snout);
    // Pointy ears
    for(const s of[-1,1]){const ear=cone(0.07,0.2,3,mMain);ear.position.set(0.11*s,0.74,0.3);g.add(ear);}
    const lp=[[-0.14,0,0.2],[-0.14,0,-0.2],[0.14,0,0.2],[0.14,0,-0.2]];
    for(const l of lp){const piv=new THREE.Group();piv.position.set(l[0],0.24,l[2]);const leg=box(0.09,0.22,0.09,mAcc);leg.position.y=-0.11;piv.add(leg);g.add(piv);legs.push(piv);}
    // Fluffy tail
    const tail=box(0.2,0.2,0.36,mAcc);tail.position.set(0,0.4,-0.42);tail.rotation.x=0.5;g.add(tail);
    return{group:g,legs,head};
  }
  if(key==="rabbit"){
    const body=box(0.3,0.28,0.4,mMain);body.position.y=0.28;g.add(body);
    const head=box(0.24,0.22,0.26,mMain);head.position.set(0,0.5,0.2);g.add(head);
    for(const s of[-1,1]){const ear=box(0.06,0.24,0.04,mAcc);ear.position.set(0.07*s,0.74,0.18);g.add(ear);}
    const lp=[[-0.1,0,0.1],[-0.1,0,-0.1],[0.1,0,0.1],[0.1,0,-0.1]];
    for(const l of lp){const piv=new THREE.Group();piv.position.set(l[0],0.18,l[2]);const leg=box(0.08,0.16,l[2]>0?0.16:0.1,mAcc);leg.position.y=-0.08;piv.add(leg);g.add(piv);legs.push(piv);}
    return{group:g,legs,head};
  }
  if(key==="bear"){
    const body=box(0.85,0.7,1.4,mMain);body.position.y=0.78;g.add(body);
    const head=box(0.7,0.52,0.64,mMain);head.position.set(0,1.1,0.65);g.add(head);
    const snout=box(0.38,0.28,0.28,mAcc);snout.position.set(0,1.0,0.84);g.add(snout);
    for(const s of[-1,1]){const ear=box(0.16,0.16,0.12,mMain);ear.position.set(0.26*s,1.38,0.5);g.add(ear);}
    const lp=[[-0.32,0,0.38],[-0.32,0,-0.38],[0.32,0,0.38],[0.32,0,-0.38]];
    for(const l of lp){const piv=new THREE.Group();piv.position.set(l[0],0.55,l[2]);const leg=box(0.24,0.52,0.24,mAcc);leg.position.y=-0.26;piv.add(leg);const paw=box(0.3,0.1,0.38,mMain);paw.position.set(0,-0.54,0.05);piv.add(paw);g.add(piv);legs.push(piv);}
    return{group:g,legs,head};
  }
  if(key==="wolf"){
    const body=box(0.55,0.42,0.9,mMain);body.position.y=0.5;g.add(body);
    const head=box(0.44,0.36,0.44,mMain);head.position.set(0,0.72,0.46);g.add(head);
    const snout=box(0.24,0.18,0.28,mAcc);snout.position.set(0,0.62,0.64);g.add(snout);
    for(const s of[-1,1]){const ear=cone(0.08,0.22,3,mAcc);ear.position.set(0.16*s,0.96,0.38);g.add(ear);}
    const lp=[[-0.2,0,0.28],[-0.2,0,-0.28],[0.2,0,0.28],[0.2,0,-0.28]];
    for(const l of lp){const piv=new THREE.Group();piv.position.set(l[0],0.34,l[2]);const leg=box(0.12,0.32,0.12,mAcc);leg.position.y=-0.16;piv.add(leg);g.add(piv);legs.push(piv);}
    return{group:g,legs,head};
  }
  if(key==="vulture"){
    const body=box(0.5,0.35,0.7,mMain);body.position.y=0.38;g.add(body);
    const head=box(0.28,0.24,0.28,lpm(0x880000));head.position.set(0,0.6,0.3);g.add(head);
    const beak=box(0.08,0.08,0.22,lpm(0xcc9900));beak.position.set(0,0.54,0.46);g.add(beak);
    // Wings (flat)
    for(const s of[-1,1]){const wing=box(0.8,0.06,0.5,mAcc);wing.position.set(0.6*s,0.4,0);wing.rotation.z=s*0.3;g.add(wing);}
    const lp=[[-0.12,0,0.04],[0.12,0,0.04]];
    for(const l of lp){const piv=new THREE.Group();piv.position.set(l[0],0.2,l[2]);const leg=box(0.06,0.18,0.06,lpm(0xcc9900));leg.position.y=-0.09;piv.add(leg);g.add(piv);legs.push(piv);}
    return{group:g,legs,head};
  }
  if(key==="serpent"){
    const segs=[];for(let s=0;s<5;s++){const seg=box(0.16-s*0.02,0.14-s*0.01,0.26,s%2===0?mMain:mAcc);seg.position.set(0,0.18,s*0.22-0.44);g.add(seg);segs.push(seg);}
    const head=box(0.22,0.18,0.28,mMain);head.position.set(0,0.22,0.68);g.add(head);
    const tongue=box(0.02,0.02,0.16,new THREE.MeshBasicMaterial({color:0xff2222}));tongue.position.set(0,0.2,0.84);g.add(tongue);
    // No legs for serpent
    return{group:g,legs:[],head,segs};
  }
  // Fallback
  const body=box(0.5,0.4,0.8,mMain);body.position.y=0.4;g.add(body);
  const head=box(0.35,0.3,0.35,mMain);head.position.set(0,0.65,0.3);g.add(head);
  return{group:g,legs:[],head};
}

function spawnAnimal(key,x,z){
  const t=ATYPES[key];const md=buildAnimalModel(key,t);
  let y=WY-1;while(y>0&&!isSolid(Math.floor(x),y,Math.floor(z)))y--;
  if(isWater(Math.floor(x),y,Math.floor(z)))return;
  const a={t,key,model:md,pos:new THREE.Vector3(x,y+0.3,z),vel:new THREE.Vector3(),w:t.w,h:t.h,onGround:false,hp:t.hp,maxhp:t.hp,dead:false,deadT:0,walk:0,yaw:Math.random()*Math.PI*2,wander:0,wanderDir:new THREE.Vector2(Math.random()-0.5,Math.random()-0.5).normalize(),fearT:0,atkCd:0};
  scene.add(md.group);animals.push(a);return a;
}

function spawnAnimals(){
  animals.forEach(a=>scene.remove(a.model.group));animals.length=0;
  const safeKeys=["deer","fox","rabbit"];
  for(let i=0;i<30;i++){
    const x=5+((rnd()*(WX-10))|0),z=5+((rnd()*(WZ-10))|0);
    if(Math.hypot(x-CXc,z-CZc)<14)continue;
    const h=tH(x,z);if(h<7||h>22)continue;
    if(getV(x,h,z)!==1)continue;
    spawnAnimal(safeKeys[(rnd()*safeKeys.length)|0],x+0.5,z+0.5);
  }
  // Out-zone dangerous animals
  const outKeys=["bear","wolf","wolf","vulture","serpent"];
  for(let i=0;i<18;i++){
    const ang=Math.random()*Math.PI*2;
    const dist=Math.min(WX,WZ)/2-4+Math.random()*4;
    const x=Math.max(4,Math.min(WX-5,CXc+Math.cos(ang)*dist));
    const z=Math.max(4,Math.min(WZ-5,CZc+Math.sin(ang)*dist));
    const h=tH(x|0,z|0);if(h<7)continue;
    spawnAnimal(outKeys[(Math.random()*outKeys.length)|0],x,z);
  }
}

function updateAnimals(dt){
  for(let i=animals.length-1;i>=0;i--){
    const a=animals[i];
    if(a.dead){a.deadT+=dt;a.model.group.position.y-=dt*0.5;a.model.group.scale.multiplyScalar(1-dt*2);if(a.deadT>0.5){scene.remove(a.model.group);disposeGroup(a.model.group);animals.splice(i,1);}continue;}
    const dx=player.pos.x-a.pos.x,dz=player.pos.z-a.pos.z;const dist=Math.hypot(dx,dz);
    let mx=0,mz=0;
    const isAgg=a.t.aggressive;
    if(isAgg&&dist<12&&dist>1.5){
      // Chase player
      mx=dx/dist*3.5;mz=dz/dist*3.5;a.fearT=2;
      // Attack
      a.atkCd=(a.atkCd||0)-dt;
      if(dist<1.8+(a.t.w||0.3)&&a.atkCd<=0){a.atkCd=1.4;hurtPlayer(a.t.dmg||10,dx/dist*2,dz/dist*2);}
    } else if(isAgg&&a.fearT>0){
      a.fearT=Math.max(0,a.fearT-dt);mx=dx/dist;mz=dz/dist;
    } else if(!isAgg&&dist<5){
      a.fearT=1.5;mx=-(dx/dist)*3.2;mz=-(dz/dist)*3.2;
    } else {
      a.fearT=Math.max(0,a.fearT-dt);
      a.wander-=dt;if(a.wander<=0){a.wander=2+Math.random()*3;const ang=Math.random()*Math.PI*2;a.wanderDir.set(Math.cos(ang),Math.sin(ang));}
      const spd=a.fearT>0?2.2:(a.t.flies?1.5:0.7);
      mx=a.wanderDir.x*spd;mz=a.wanderDir.y*spd;
    }
    a.vel.x+=(mx-a.vel.x)*Math.min(1,8*dt);a.vel.z+=(mz-a.vel.z)*Math.min(1,8*dt);
    if(!a.t.flies)a.vel.y-=28*dt;
    else{a.vel.y+=(3-a.pos.y+tH(a.pos.x|0,a.pos.z|0))*2*dt;}
    stepPhysics(a,dt);
    const sp=Math.hypot(a.vel.x,a.vel.z);if(sp>0.1)a.yaw=Math.atan2(a.vel.x,a.vel.z);
    a.walk+=dt*(4+sp*2);
    const sw=Math.sin(a.walk*3)*Math.min(1,sp/2)*0.6;
    a.model.legs.forEach((l,li)=>l.rotation.x=(li%2===0?sw:-sw));
    if(a.t.flies)a.model.group.rotation.z=Math.sin(time*3)*0.2;
    a.model.group.position.copy(a.pos);a.model.group.rotation.y=a.yaw;
    if(Math.random()<0.0005)SFX.animal();
  }
}
function hurtAnimal(a,dmg){
  if(a.dead)return;a.hp-=dmg;burst(a.pos.x,a.pos.y+a.h*0.5,a.pos.z,a.t.col,5,3,0.1);SFX.hit();
  if(a.hp<=0){a.dead=true;a.deadT=0;player.score+=a.t.score;a.t.loot.forEach(l=>giveItem(l.id,l.n));showDamage(a.pos.x,a.pos.y+0.6,a.pos.z,"+"+a.t.score,"#6fd34a");SFX.kill();updateHUD();}
}
function rayAnimal(o,d,maxD){let best=null;for(const a of animals){if(a.dead)continue;const c=new THREE.Vector3(a.pos.x,a.pos.y+a.h*0.5,a.pos.z);const to=c.clone().sub(o);const t=to.dot(d);if(t<0||t>maxD)continue;const perp=to.sub(d.clone().multiplyScalar(t)).length();if(perp<a.w+0.3){if(!best||t<best.d)best={a,d:t};}}return best;}

/* ============================================
   DRAGON BOSS
   ============================================ */
let dragon=null;

function buildDragonModel(){
  const g=new THREE.Group();
  const mBody=lpm(0x1a0a30,0x050015);
  const mWing=lpm(0x2a1050,0x0a0020);
  const mBelly=lpm(0x6a1010,0x300000);
  const mHorn=lpm(0x4a3010);
  const mEye=new THREE.MeshBasicMaterial({color:0xff4400});
  // Body (elongated, segmented)
  const body=box(1.1,0.9,2.4,mBody);body.position.y=2.2;g.add(body);
  const chest=box(0.9,0.7,1.0,mBelly);chest.position.set(0,2.1,0.8);g.add(chest);
  // Neck
  const neck=box(0.5,0.55,0.9,mBody);neck.position.set(0,2.5,1.4);neck.rotation.x=-0.4;g.add(neck);
  // Head (angular dragon skull)
  const headG=new THREE.Group();headG.position.set(0,2.8,2.1);
  const skull=box(0.8,0.62,1.0,mBody);headG.add(skull);
  // Jaw
  const jaw=box(0.72,0.22,0.9,mBody);jaw.position.set(0,-0.3,0.1);headG.add(jaw);
  // Snout
  const snout=box(0.5,0.3,0.7,mBody);snout.position.set(0,-0.05,0.68);headG.add(snout);
  // Eyes
  for(const s of[-1,1]){
    const eye=new THREE.Mesh(new THREE.OctahedronGeometry(0.1,0),mEye);eye.position.set(0.32*s,0.12,-0.46);headG.add(eye);
    const glow=new THREE.PointLight(0xff4400,0.8,4);glow.position.set(0.32*s,0.12,-0.46);headG.add(glow);
  }
  // Horns
  for(const s of[-1,1]){
    const horn=cone(0.1,0.6,4,mHorn);horn.position.set(0.3*s,0.5,0);horn.rotation.z=s*0.4;headG.add(horn);
    const horn2=cone(0.07,0.4,4,mHorn);horn2.position.set(0.42*s,0.3,-0.3);horn2.rotation.set(0.4,0,s*0.6);headG.add(horn2);
  }
  g.add(headG);
  // Wings (large flat angular)
  for(const s of[-1,1]){
    const wGrp=new THREE.Group();wGrp.position.set(0.55*s,2.4,0.2);
    // Main wing membrane (low-poly flat)
    const wBody=box(1.6,0.08,1.4,mWing);wBody.position.set(0.8*s,0,-0.2);wGrp.add(wBody);
    const wTip=box(0.8,0.06,0.8,mWing);wTip.position.set(1.6*s,-0.1,-0.6);wGrp.add(wTip);
    const wBone1=box(0.08,0.08,1.4,mBody);wBone1.position.set(0,0.06,-0.2);wGrp.add(wBone1);
    const wBone2=box(0.06,0.06,0.8,mBody);wBone2.position.set(0.8*s,0.06,-0.6);wGrp.add(wBone2);
    g.add(wGrp);
  }
  // Tail (segmented)
  const tailSegs=[];for(let t=0;t<5;t++){
    const seg=box(0.65-t*0.1,0.5-t*0.07,0.5,mBody);seg.position.set(0,2.1-t*0.1,-(1.2+t*0.52));g.add(seg);tailSegs.push(seg);
    const spike=cone(0.08,0.32,4,mHorn);spike.position.set(0,2.3-t*0.08,-(1.2+t*0.52));spike.rotation.x=0.5;g.add(spike);
  }
  // Legs
  const legs=[];
  for(const s of[-1,1]){
    const piv=new THREE.Group();piv.position.set(0.55*s,1.7,0.4);
    const upper=box(0.3,0.7,0.3,mBody);upper.position.y=-0.35;piv.add(upper);
    const lower=box(0.24,0.6,0.24,mBody);lower.position.y=-0.9;piv.add(lower);
    const claw=box(0.36,0.14,0.5,mHorn);claw.position.set(0,-1.24,0.1);piv.add(claw);
    g.add(piv);legs.push(piv);
  }
  // HP bar
  const {hb,fg}=buildHPBar();
  hb.position.y=4.2;hb.scale.setScalar(3);
  g.add(hb);
  return{group:g,headG,legs,tailSegs,hb,fg,parts:[body,chest,neck,skull]};
}

function spawnDragon(){
  if(dragon&&!dragon.dead)return;
  const ang=Math.random()*Math.PI*2;
  const dist=Math.min(WX,WZ)/2-6;
  const x=Math.max(6,Math.min(WX-7,CXc+Math.cos(ang)*dist));
  const z=Math.max(6,Math.min(WZ-7,CZc+Math.sin(ang)*dist));
  const md=buildDragonModel();
  let y=WY-1;while(y>0&&!isSolid(x|0,y,z|0))y--;
  dragon={
    model:md,pos:new THREE.Vector3(x,y+3,z),vel:new THREE.Vector3(),
    w:1.4,h:3.5,onGround:false,
    hp:800,maxhp:800,dead:false,deadT:0,
    yaw:Math.random()*Math.PI*2,walk:0,atkCd:0,
    fireBreathCd:0,wingFlap:0,phase:"fly",flyHeight:0
  };
  scene.add(md.group);md.group.position.copy(dragon.pos);
  banner("🐉 DRAGON APPEARS!","A massive beast has emerged in the DANGER ZONE","#ff4400");
  SFX.dragon();
}

function updateDragon(dt){
  if(!dragon)return;
  const d=dragon,md=d.model;
  if(d.dead){
    d.deadT+=dt;
    md.group.rotation.z=Math.min(Math.PI/2,d.deadT*2);
    md.group.position.y-=dt*0.5;
    md.group.scale.multiplyScalar(Math.max(0.01,1-dt*0.4));
    md.hb.visible=false;
    if(d.deadT>2.5){
      scene.remove(md.group);disposeGroup(md.group);
      dragon=null;
      giveItem(113,3);giveItem(109,5);
      banner("DRAGON SLAIN!","+3 Dragon Scales","#ffaa22");
    }
    return;
  }
  d.wingFlap+=dt*2.8;
  // Wing animation
  const flapAng=Math.sin(d.wingFlap)*0.6+0.2;
  md.group.children.forEach(c=>{
    if(c.userData&&c.userData.isWing)c.rotation.z=flapAng;
  });
  // Fly target: circle player + occasionally dive
  const dx=player.pos.x-d.pos.x,dz=player.pos.z-d.pos.z;
  const horiz=Math.hypot(dx,dz);
  const targetY=tH(d.pos.x|0,d.pos.z|0)+8+Math.sin(time*0.5)*3;
  // Move toward player (circling)
  const orbitR=16;const orbitAng=Math.atan2(dx,dz)+0.4;
  const tx=player.pos.x+Math.cos(orbitAng)*orbitR;
  const tz=player.pos.z+Math.sin(orbitAng)*orbitR;
  const ddx=tx-d.pos.x,ddz=tz-d.pos.z,ddy=targetY-d.pos.y;
  const dl=Math.hypot(ddx,ddz);
  const spd=5.5;
  if(dl>1){d.vel.x+=(ddx/dl*spd-d.vel.x)*Math.min(1,3*dt);d.vel.z+=(ddz/dl*spd-d.vel.z)*Math.min(1,3*dt);}
  d.vel.y+=(ddy-d.vel.y)*Math.min(1,2*dt);
  d.pos.x+=d.vel.x*dt;d.pos.y+=d.vel.y*dt;d.pos.z+=d.vel.z*dt;
  // Clamp to map
  d.pos.x=Math.max(4,Math.min(WX-5,d.pos.x));d.pos.z=Math.max(4,Math.min(WZ-5,d.pos.z));
  // Face player
  if(horiz>0.5)d.yaw=Math.atan2(dx,dz);
  md.group.position.copy(d.pos);md.group.rotation.y=d.yaw;
  // Slight body tilt
  md.group.rotation.x=Math.atan2(d.vel.y,Math.max(1,Math.abs(d.vel.x)+Math.abs(d.vel.z)))*0.4;
  // Tail wave
  d.model.tailSegs.forEach((s,i)=>s.rotation.y=Math.sin(time*2+i*0.7)*0.25);
  // Head look at player
  md.headG.rotation.x=Math.max(-0.4,Math.min(0.4,(player.pos.y-d.pos.y-2.5)*-0.05));
  // Fire breath attack
  d.fireBreathCd-=dt;
  if(horiz<20&&d.fireBreathCd<=0){
    d.fireBreathCd=4+Math.random()*3;
    // Fire projectile burst
    const dir=new THREE.Vector3(dx,player.pos.y-d.pos.y,dz).normalize();
    for(let k=0;k<6;k++){
      const spread=new THREE.Vector3(dir.x+(Math.random()-0.5)*0.3,dir.y+(Math.random()-0.5)*0.2,dir.z+(Math.random()-0.5)*0.3).normalize();
      burst(d.pos.x+dir.x*2,d.pos.y,d.pos.z+dir.z*2,0xff4400,8,2,0.2,0.3);
    }
    // Direct damage if close
    if(horiz<8)hurtPlayer(25,dx/horiz*3,dz/horiz*3);
    else if(horiz<16)hurtPlayer(10,dx/horiz*2,dz/horiz*2);
    SFX.dragon();shake(0.6);
  }
  // HP bar
  md.hb.visible=true;md.hb.quaternion.copy(camera.quaternion);
  const fr=d.hp/d.maxhp;md.fg.scale.x=fr;md.fg.position.x=-0.43*(1-fr);md.fg.material.color.setHex(fr>0.5?0xff4400:(fr>0.25?0xff8800:0xff0000));
}

function hurtDragon(amt){
  if(!dragon||dragon.dead)return;
  dragon.hp-=amt;
  burst(dragon.pos.x,dragon.pos.y+1,dragon.pos.z,0xff4400,12,6,0.2);
  showDamage(dragon.pos.x,dragon.pos.y+3.5,dragon.pos.z,Math.round(amt)+"🐉","#ff4400");
  SFX.hit();
  if(dragon.hp<=0){dragon.dead=true;dragon.deadT=0;player.kills++;player.score+=500;SFX.dragon();burst(dragon.pos.x,dragon.pos.y+2,dragon.pos.z,0xff2200,60,14,0.3,0.4);updateHUD();}
}

function rayDragon(o,d,maxD){
  if(!dragon||dragon.dead)return null;
  const c=new THREE.Vector3(dragon.pos.x,dragon.pos.y+1.8,dragon.pos.z);
  const to=c.clone().sub(o);const t=to.dot(d);if(t<0||t>maxD)return null;
  const perp=to.sub(d.clone().multiplyScalar(t)).length();
  if(perp<dragon.w)return{dragon,d:t};
  return null;
}

/* ============================================
   BLOCK DAMAGE / DROPS
   ============================================ */
function hurtBlock(x,y,z,amt){
  if(!inb(x,y,z))return;const v=getV(x,y,z);if(v===AIR||v===9)return;
  const i=VI(x,y,z);const dd=(damage.get(i)||0)+amt;
  if(dd>=B[v].hp){setVoxel(x,y,z,AIR);burst(x+0.5,y+0.5,z+0.5,B[v].tint,12,5,0.16);SFX.brk();if(v===19){const li=torchLights.findIndex(tl=>tl.x===x&&tl.y===y&&tl.z===z);if(li>=0){scene.remove(torchLights[li].light);torchLights.splice(li,1);}}}
  else{damage.set(i,dd);if(Math.random()<0.4)burst(x+0.5,y+0.7,z+0.5,B[v].tint,2,2,0.09);}
}
function give(id,n){if(!id||id<1)return;player.inv[id]=(player.inv[id]||0)+n;drawHotbar();}
function giveItem(id,n){if(!id)return;player.inv[id]=(player.inv[id]||0)+n;drawHotbar();}
function selId(){return HOTBAR[player.sel];}
function mineSpeed(blockId){const sid=selId();if(!isItm(sid))return 1;const tool=ITEMS[sid];if(!tool)return 1;const sp=tool.speed||1;const typ=tool.toolType;if(typ==="pickaxe"&&[3,7,9,11,12,13,14,15,16,21].includes(blockId))return sp;if(typ==="axe"&&[4,5].includes(blockId))return sp;if(typ==="shovel"&&[2,6,1].includes(blockId))return sp;if(typ==="shears"&&blockId===5)return sp*3;return 1;}
let mineTarget=null,mineProg=0;let fishState={active:false,timer:0};

/* ============================================
   PLAYER
   ============================================ */
const player={pos:new THREE.Vector3(CXc+0.5,0,CZc+0.5),vel:new THREE.Vector3(),w:0.3,h:1.78,eye:1.63,onGround:false,yaw:0,pitch:0,hp:200,maxhp:200,inv:{},sel:0,kills:0,score:0,blocksPlaced:0,blocksMined:0,inWater:false,inRuin:false,outOfZone:false,team:0};
function resetPlayer(){player.pos.set(CXc+0.5,tH(CXc|0,CZc|0)+2,CZc+0.5);player.vel.set(0,0,0);player.hp=player.maxhp=200;player.yaw=0;player.pitch=0;player.sel=0;player.kills=0;player.score=0;player.blocksPlaced=0;player.blocksMined=0;player.outOfZone=false;player.inRuin=false;player.inWater=false;player.inv={1:0,2:0,3:24,4:16,5:0,6:0,7:32,8:8,200:1,240:1,106:8,107:2,102:4,112:6,109:4};}

/* ============================================
   INPUT
   ============================================ */
const keys={};let craftOpen=false;
addEventListener("keydown",e=>{if(e.code==="Escape"){if(craftOpen){closeCraft();return;}if(running)pause();return;}if(e.code==="KeyE"&&running){e.preventDefault();craftOpen?closeCraft():openCraft();return;}keys[e.code]=true;if(!running)return;if(e.code.startsWith("Digit")){const n=+e.code.slice(5);if(n>=1&&n<=HOTBAR.length){player.sel=n-1;drawHotbar();}}if(e.code==="KeyF")throwBlock();if(e.code==="KeyG")fireGun();if(e.code==="Space")e.preventDefault();},{passive:false});
addEventListener("keyup",e=>{keys[e.code]=false;});
let mouseDown=false;
canvas.addEventListener("mousedown",e=>{if(!running||craftOpen)return;if(e.button===0){mouseDown=true;primary();}if(e.button===1){e.preventDefault();throwBlock();}if(e.button===2){rightAction();}});
addEventListener("mouseup",e=>{if(e.button===0)mouseDown=false;});
addEventListener("contextmenu",e=>e.preventDefault());
addEventListener("wheel",e=>{if(!running||craftOpen)return;player.sel=(player.sel+(e.deltaY>0?1:HOTBAR.length-1))%HOTBAR.length;drawHotbar();},{passive:true});
let locked=false;
document.addEventListener("pointerlockchange",()=>{locked=(document.pointerLockElement===canvas);if(!locked&&running&&!isTouch&&!craftOpen)pause();});
document.addEventListener("mousemove",e=>{if(!locked||craftOpen)return;player.yaw-=e.movementX*0.0022;player.pitch-=e.movementY*0.0022;player.pitch=Math.max(-1.53,Math.min(1.53,player.pitch));});
const isTouch=("ontouchstart" in window)||navigator.maxTouchPoints>0;
const touchMove={x:0,y:0};let lookId=null,lookX=0,lookY=0;
if(isTouch){document.getElementById("touch").classList.add("on");const stick=document.getElementById("stick"),knob=document.getElementById("knob");let sid=null;function sm(e){const t=[...e.touches].find(t=>t.identifier===sid);if(!t)return;const r=stick.getBoundingClientRect();let dx=t.clientX-(r.left+r.width/2),dy=t.clientY-(r.top+r.height/2);const d=Math.hypot(dx,dy),mx=r.width/2-24;if(d>mx){dx*=mx/d;dy*=mx/d;}knob.style.transform="translate("+dx+"px,"+dy+"px)";touchMove.x=dx/mx;touchMove.y=dy/mx;}stick.addEventListener("touchstart",e=>{e.preventDefault();sid=e.changedTouches[0].identifier;sm(e);},{passive:false});stick.addEventListener("touchmove",e=>{e.preventDefault();sm(e);},{passive:false});stick.addEventListener("touchend",()=>{sid=null;touchMove.x=touchMove.y=0;knob.style.transform="";});canvas.addEventListener("touchstart",e=>{const t=e.changedTouches[0];if(t.clientX>innerWidth*0.35){lookId=t.identifier;lookX=t.clientX;lookY=t.clientY;}},{passive:true});canvas.addEventListener("touchmove",e=>{for(const t of e.changedTouches)if(t.identifier===lookId){player.yaw-=(t.clientX-lookX)*0.006;player.pitch-=(t.clientY-lookY)*0.006;player.pitch=Math.max(-1.53,Math.min(1.53,player.pitch));lookX=t.clientX;lookY=t.clientY;}},{passive:true});canvas.addEventListener("touchend",e=>{for(const t of e.changedTouches)if(t.identifier===lookId)lookId=null;});const bind=(id,dn,up)=>{const el=document.getElementById(id);if(el){el.addEventListener("touchstart",e=>{e.preventDefault();dn();},{passive:false});el.addEventListener("touchend",e=>{e.preventDefault();if(up)up();},{passive:false});}};bind("bJump",()=>{keys.Space=true;},()=>{keys.Space=false;});bind("bMine",()=>{mouseDown=true;primary();},()=>{mouseDown=false;});bind("bPlace",()=>rightAction());bind("bThrow",()=>throwBlock());bind("bSprint",()=>{keys.ShiftLeft=true;},()=>{keys.ShiftLeft=false;});bind("bGun",()=>fireGun());bind("bCraft",()=>{if(running){craftOpen?closeCraft():openCraft();}});bind("bPause",()=>pause());}

/* ============================================
   PHYSICS
   ============================================ */
function moveAxis(e,ax,amt){if(amt===0)return;e.pos[ax]+=amt;const x0=Math.floor(e.pos.x-e.w),x1=Math.floor(e.pos.x+e.w),y0=Math.floor(e.pos.y+0.001),y1=Math.floor(e.pos.y+e.h-0.001),z0=Math.floor(e.pos.z-e.w),z1=Math.floor(e.pos.z+e.w);for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++){if(!isSolid(x,y,z))continue;if(ax==="x"){e.pos.x=amt>0?x-e.w-1e-3:x+1+e.w+1e-3;e.vel.x=0;}else if(ax==="z"){e.pos.z=amt>0?z-e.w-1e-3:z+1+e.w+1e-3;e.vel.z=0;}else{if(amt>0){e.pos.y=y-e.h-1e-3;e.vel.y=0;}else{e.pos.y=y+1+1e-3;e.vel.y=0;e.onGround=true;}}return true;}return false;}
function stepPhysics(e,dt){const sp=Math.max(Math.abs(e.vel.x),Math.abs(e.vel.y),Math.abs(e.vel.z))*dt;const n=Math.max(1,Math.ceil(sp/0.2));const d=dt/n;for(let i=0;i<n;i++){moveAxis(e,"x",e.vel.x*d);moveAxis(e,"z",e.vel.z*d);e.onGround=false;moveAxis(e,"y",e.vel.y*d);}if(e.pos.y<-8){e.pos.y=WY-2;e.vel.set(0,0,0);}}
function rayVoxel(o,d,maxD){let x=Math.floor(o.x),y=Math.floor(o.y),z=Math.floor(o.z);const sx=Math.sign(d.x)||1,sy=Math.sign(d.y)||1,sz=Math.sign(d.z)||1;const ddx=Math.abs(1/(d.x||1e-9)),ddy=Math.abs(1/(d.y||1e-9)),ddz=Math.abs(1/(d.z||1e-9));let tx=((sx>0?(x+1-o.x):(o.x-x))||1e-9)*ddx,ty=((sy>0?(y+1-o.y):(o.y-y))||1e-9)*ddy,tz=((sz>0?(z+1-o.z):(o.z-z))||1e-9)*ddz;let nx=0,ny=0,nz=0,t=0;for(let i=0;i<400;i++){if(inb(x,y,z)&&world[VI(x,y,z)]!==AIR)return{x,y,z,nx,ny,nz,d:t,hit:true};if(tx<ty&&tx<tz){t=tx;x+=sx;tx+=ddx;nx=-sx;ny=0;nz=0;}else if(ty<tz){t=ty;y+=sy;ty+=ddy;nx=0;ny=-sy;nz=0;}else{t=tz;z+=sz;tz+=ddz;nx=0;ny=0;nz=-sz;}if(t>maxD)break;}return{hit:false,d:maxD};}

/* ============================================
   ACTIONS
   ============================================ */
function primary(){
  const o=eyePos(),d=lookDir();
  const eHit=rayEnemy(o,d,4.5);const aHit=rayAnimal(o,d,4.5);const vx=rayVoxel(o,d,4.5);
  const drHit=rayDragon(o,d,80);
  const sid=selId();const toolDef=isItm(sid)?ITEMS[sid]:null;
  if(toolDef?.toolType==="fishingrod"){handAnim("cast");SFX.cast();fishState.active=true;fishState.timer=3+Math.random()*4;return;}
  if(toolDef?.toolType==="gun"){fireGun();return;}
  // Dragon hit
  if(drHit&&(!vx.hit||drHit.d<vx.d)){const dmg=(18+Math.random()*5)*(toolDef?1.6:1);hurtDragon(dmg);handAnim("swing");SFX.swing();return;}
  if(eHit&&(!vx.hit||eHit.d<vx.d)&&(!aHit||eHit.d<aHit.d)){handAnim("swing");SFX.swing();const dmg=(18+Math.random()*5)*(toolDef?1.6:1);damageEnemy(eHit.e,dmg,d.x*4.5,d.z*4.5);player.score+=2;updateHUD();return;}
  if(aHit&&(!vx.hit||aHit.d<vx.d)){const typ=toolDef?.toolType;handAnim(typ==="axe"?"chop":"swing");SFX.chop();hurtAnimal(aHit.a,14+Math.random()*6);return;}
  const animMap={pickaxe:"mine",axe:"chop",shovel:"dig",hoe:"hoe",shears:"snip",bucket:"place",fishingrod:"cast"};
  handAnim(toolDef?animMap[toolDef.toolType]||"swing":"swing");SFX.tap();
}
function rightAction(){
  const sid=selId();const toolDef=isItm(sid)?ITEMS[sid]:null;
  if(toolDef?.toolType==="bucket"){bucketAction();return;}
  // Try tame dog with meat
  if(sid===109||!toolDef){if(rightClickDog())return;}
  const o=eyePos(),d=lookDir();const r=rayVoxel(o,d,5.4);
  if(r.hit&&getV(r.x,r.y,r.z)===20){openCraft();return;}
  placeBlock();
}
function bucketAction(){const o=eyePos(),d=lookDir();const r=rayVoxel(o,d,5.4);if(r.hit&&getV(r.x,r.y,r.z)===10){setVoxel(r.x,r.y,r.z,AIR);giveItem(300,1);SFX.splash();buildWaterSurfaces();return;}if((player.inv[300]||0)>0&&r.hit){const x=r.x+r.nx,y=r.y+r.ny,z=r.z+r.nz;if(inb(x,y,z)&&getV(x,y,z)===AIR){setVoxel(x,y,z,10);player.inv[300]--;SFX.splash();buildWaterSurfaces();drawHotbar();return;}}placeBlock();}
function mineTick(dt){
  if(!mouseDown){mineTarget=null;mineProg=0;setMineUI(0);return;}
  const sid=selId();const toolDef=isItm(sid)?ITEMS[sid]:null;
  if(toolDef?.toolType==="bucket"||toolDef?.toolType==="fishingrod"||toolDef?.toolType==="gun"){setMineUI(0);return;}
  const o=eyePos(),d=lookDir();const r=rayVoxel(o,d,5.2);
  if(!r.hit||getV(r.x,r.y,r.z)===9){mineTarget=null;mineProg=0;setMineUI(0);return;}
  if(!mineTarget||mineTarget.x!==r.x||mineTarget.y!==r.y||mineTarget.z!==r.z){mineTarget={x:r.x,y:r.y,z:r.z};mineProg=0;}
  const v=getV(r.x,r.y,r.z);const spd=mineSpeed(v);mineProg+=dt*spd/B[v].hard;
  if(Math.random()<dt*14)burst(r.x+0.5+(Math.random()-0.5),r.y+0.5+(Math.random()-0.5),r.z+0.5+(Math.random()-0.5),B[v].tint,1,2,0.09);
  if(mineProg>=1){setVoxel(r.x,r.y,r.z,AIR);burst(r.x+0.5,r.y+0.5,r.z+0.5,B[v].tint,12,5,0.16);SFX.brk();const drops={1:[{id:2,n:1}],2:[{id:2,n:1}],5:[{id:4,n:1}],11:[{id:100,n:1}],12:[{id:101,n:1}],13:[{id:102,n:1}],14:[{id:103,n:1}],15:[{id:104,n:1}],16:[{id:105,n:1}],21:[{id:112,n:2}]};if(drops[v])drops[v].forEach(dp=>giveItem(dp.id,dp.n));else give(v,1);player.blocksMined++;player.score+=1;mineTarget=null;mineProg=0;updateHUD();}
  setMineUI(mineProg);
}
function placeBlock(){const id=selId();if(isItm(id)&&ITEMS[id]?.toolType){SFX.tap();return;}if(!player.inv[id]){SFX.tap();return;}const o=eyePos(),d=lookDir();const r=rayVoxel(o,d,5.4);if(!r.hit)return;const x=r.x+r.nx,y=r.y+r.ny,z=r.z+r.nz;if(!inb(x,y,z)||getV(x,y,z)!==AIR)return;if(x===Math.floor(player.pos.x)&&z===Math.floor(player.pos.z)&&y>=Math.floor(player.pos.y)&&y<=Math.floor(player.pos.y+player.h))return;for(const e of enemies){if(!e.dead&&x===Math.floor(e.pos.x)&&z===Math.floor(e.pos.z)&&y>=Math.floor(e.pos.y)&&y<=Math.floor(e.pos.y+e.h))return;}setVoxel(x,y,z,id);placed.add(VI(x,y,z));player.inv[id]--;player.blocksPlaced++;player.score+=1;burst(x+0.5,y+0.5,z+0.5,B[id].tint,4,2.2,0.1);if(id===19){const ptL=new THREE.PointLight(0xffaa30,1.5,6);ptL.position.set(x+0.5,y+0.5,z+0.5);scene.add(ptL);torchLights.push({light:ptL,x,y,z});}SFX.place();handAnim("place");drawHotbar();updateHUD();}

/* ============================================
   GUN
   ============================================ */
let gunCooldown=0;
function fireGun(){
  const sid=selId();if(!isItm(sid)||ITEMS[sid]?.toolType!=="gun")return;if(gunCooldown>0)return;
  gunCooldown=0.6;handAnim("swing");SFX.gunshot();
  const o=eyePos(),d=lookDir();burst(o.x+d.x*0.5,o.y+d.y*0.5,o.z+d.z*0.5,0xffcc44,14,3.5,0.08,0.5);
  // Dragon takes gun damage
  const drHit=rayDragon(o,d,80);
  const eHit=rayEnemy(o,d,60);const vx=rayVoxel(o,d,60);
  if(drHit&&(!vx.hit||drHit.d<vx.d)){hurtDragon(60+Math.random()*20);}
  else if(eHit&&(!vx.hit||eHit.d<vx.d)){damageEnemy(eHit.e,55+Math.random()*15,d.x*6,d.z*6,true);burst(eHit.e.pos.x,eHit.e.pos.y+eHit.e.h*0.6,eHit.e.pos.z,0xff4422,10,5,0.15);}
  else if(vx.hit){burst(vx.x+0.5,vx.y+0.5,vx.z+0.5,0xcccccc,8,3,0.1);hurtBlock(vx.x,vx.y,vx.z,20);}
  shake(0.2);player.vel.x-=d.x*1.5;player.vel.z-=d.z*1.5;
}

/* ============================================
   PROJECTILES
   ============================================ */
const projs=[];const geoCache={};
function blockGeo(id){const g=new THREE.BoxGeometry(1,1,1);const uv=g.attributes.uv,keys=["px","nx","py","ny","pz","nz"];for(let f=0;f<6;f++){const t=tileUV(B[id]?.tiles[keys[f]]||T.STONE);uv.setXY(f*4+0,t.u0,t.v1);uv.setXY(f*4+1,t.u1,t.v1);uv.setXY(f*4+2,t.u0,t.v0);uv.setXY(f*4+3,t.u1,t.v0);}uv.needsUpdate=true;return g;}
function getBlockGeo(id){return geoCache[id]||(geoCache[id]=blockGeo(id));}
const projMat=new THREE.MeshLambertMaterial({map:ATLAS.tex});
function throwBlock(){const id=selId();if(isItm(id)){SFX.tap();return;}if(!player.inv[id]){SFX.tap();return;}player.inv[id]--;drawHotbar();const d=lookDir(),o=eyePos().addScaledVector(d,0.6);const m=new THREE.Mesh(getBlockGeo(id),projMat);m.scale.setScalar(0.42);m.castShadow=true;m.position.copy(o);scene.add(m);projs.push({m,id,vel:d.clone().multiplyScalar(29).add(player.vel.clone().multiplyScalar(0.35)).add(new THREE.Vector3(0,3.1,0)),life:5,spin:new THREE.Vector3(Math.random()*8-4,Math.random()*8-4,Math.random()*8-4)});handAnim("throw");SFX.throw();updateHUD();}
function explode(x,y,z){SFX.boom();burst(x,y,z,0xff4400,40,12,0.22,0.55);burst(x,y,z,0xffcc44,14,15,0.16,0.35);shake(0.9);for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++)for(let dz=-2;dz<=2;dz++){const r=Math.hypot(dx,dy,dz);if(r>2.3)continue;hurtBlock(Math.floor(x)+dx,Math.floor(y)+dy,Math.floor(z)+dz,60*(1-r/2.6));}for(const e of enemies){if(e.dead)continue;const dd=e.pos.distanceTo(new THREE.Vector3(x,y,z));if(dd<4.4){const f=1-dd/4.4;damageEnemy(e,55*f,(e.pos.x-x)*1.6,(e.pos.z-z)*1.6,true);e.vel.y=6*f;}}if(dragon&&!dragon.dead){const dd=dragon.pos.distanceTo(new THREE.Vector3(x,y,z));if(dd<5)hurtDragon(30*(1-dd/5));}const pd=player.pos.distanceTo(new THREE.Vector3(x,y,z));if(pd<4.0)hurtPlayer(14*(1-pd/4.0),(player.pos.x-x)*0.4,(player.pos.z-z)*0.4);}
function updateProjs(dt){for(let i=projs.length-1;i>=0;i--){const p=projs[i];p.life-=dt;p.vel.y-=30*dt;const steps=3,dstep=dt/steps;let done=false;for(let s=0;s<steps&&!done;s++){p.m.position.addScaledVector(p.vel,dstep);const q=p.m.position;for(const e of enemies){if(e.dead)continue;const ex=q.x-e.pos.x,ez=q.z-e.pos.z,ey=q.y-(e.pos.y+e.h*0.55);if(Math.abs(ex)<e.w+0.35&&Math.abs(ez)<e.w+0.35&&Math.abs(ey)<e.h*0.62){if(B[p.id]?.boom)explode(q.x,q.y,q.z);else{const v=p.vel.length()/29;damageEnemy(e,B[p.id]?.dmg*(0.7+0.5*v)||10,p.vel.x*0.14,p.vel.z*0.14);burst(q.x,q.y,q.z,B[p.id]?.tint||0xffffff,8,4,0.12);}done=true;break;}}if(done)break;if(isSolid(Math.floor(q.x),Math.floor(q.y),Math.floor(q.z))){if(B[p.id]?.boom)explode(q.x,q.y,q.z);else{burst(q.x,q.y,q.z,B[p.id]?.tint||0xffffff,8,3.5,0.12);SFX.brk();hurtBlock(Math.floor(q.x),Math.floor(q.y),Math.floor(q.z),12);}done=true;}}p.m.rotation.x+=p.spin.x*dt;p.m.rotation.y+=p.spin.y*dt;p.m.rotation.z+=p.spin.z*dt;if(done||p.life<=0){scene.remove(p.m);projs.splice(i,1);}}}
function rayEnemy(o,d,maxD){let best=null;for(const e of enemies){if(e.dead)continue;const c=new THREE.Vector3(e.pos.x,e.pos.y+e.h*0.55,e.pos.z);const to=c.clone().sub(o);const t=to.dot(d);if(t<0||t>maxD)continue;const perp=to.sub(d.clone().multiplyScalar(t)).length();if(perp<Math.max(e.w,0.42)+0.28){if(!best||t<best.d)best={e,d:t};}}return best;}
function updateFishing(dt){if(!fishState.active)return;fishState.timer-=dt;if(fishState.timer<=0){fishState.active=false;const px=Math.floor(player.pos.x),pz=Math.floor(player.pos.z);let nw=false;for(let dx=-3;dx<=3&&!nw;dx++)for(let dz=-3;dz<=3&&!nw;dz++){if(isWater(px+dx,Math.floor(player.pos.y)-1,pz+dz))nw=true;}if(nw&&Math.random()<0.7){giveItem(111,1);SFX.catch();showDamage(player.pos.x,player.pos.y+1.5,player.pos.z,"Fish caught!","#6699cc");}}}

/* ============================================
   HAND / VIEWMODEL
   ============================================ */
const handScene=new THREE.Scene();const handCam=new THREE.PerspectiveCamera(58,1,0.01,10);handScene.add(new THREE.AmbientLight(0xffffff,0.72));const hl1=new THREE.DirectionalLight(0xfff3e0,0.95);hl1.position.set(0.6,1,0.8);handScene.add(hl1);
const armMat=lpm(0xcf9d76);const sleeveMat=lpm(0x2f4a63);const arm=new THREE.Group();
(function(){const fore=new THREE.Mesh(new THREE.BoxGeometry(0.13,0.13,0.44),armMat);fore.position.set(0,0,0.14);arm.add(fore);const sl=new THREE.Mesh(new THREE.BoxGeometry(0.15,0.15,0.22),sleeveMat);sl.position.set(0,0,0.3);arm.add(sl);const fist=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.16,0.14),armMat);fist.position.set(0,0,-0.1);arm.add(fist);})();
handScene.add(arm);let heldMesh=null,heldId=-1;
function buildToolMesh(id){const itm=ITEMS[id];if(!itm)return null;const g=new THREE.Group();const tc=itm.tint||0x888888;const hMat=lpm(0x8a5c2c);const headMat=lpm(tc);const typ=itm.toolType;if(typ==="pickaxe"){const h=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.05,0.5),hMat);h.position.z=-0.05;g.add(h);const hd=new THREE.Mesh(new THREE.BoxGeometry(0.32,0.08,0.08),headMat);hd.position.set(0,0,-0.3);g.add(hd);const t1=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.16,0.04),headMat);t1.position.set(-0.14,0,-0.3);g.add(t1);const t2=t1.clone();t2.position.set(0.14,0,-0.3);g.add(t2);}else if(typ==="axe"){const h=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.05,0.5),hMat);g.add(h);const hd=new THREE.Mesh(new THREE.BoxGeometry(0.18,0.28,0.08),headMat);hd.position.set(-0.06,0.04,-0.25);g.add(hd);}else if(typ==="shovel"){const h=new THREE.Mesh(new THREE.BoxGeometry(0.05,0.05,0.55),hMat);g.add(h);const bl=new THREE.Mesh(new THREE.BoxGeometry(0.14,0.22,0.04),headMat);bl.position.set(0,0,-0.3);g.add(bl);}else if(typ==="gun"){const bm=lpm(0x3a3a4a);const bm2=lpm(0x6a6a8a);const body=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.1,0.4),bm);body.position.set(0,0,-0.18);g.add(body);const barrel=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.04,0.28),bm2);barrel.position.set(0,0.04,-0.32);g.add(barrel);const grip=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.16,0.07),lpm(0x5a4a2a));grip.position.set(0,-0.1,-0.1);g.add(grip);}else{const bl=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.22,0.22),headMat);bl.position.set(0.02,0.08,-0.13);g.add(bl);}return g;}
function syncHeld(){const id=selId();if(id===heldId&&heldMesh)return;if(heldMesh){arm.remove(heldMesh);disposeGroup(heldMesh);}if(isItm(id)&&ITEMS[id]?.toolType){heldMesh=buildToolMesh(id);if(heldMesh){heldMesh.scale.setScalar(0.9);heldMesh.position.set(0.02,0.06,-0.18);heldMesh.rotation.set(0.2,0.5,0.1);arm.add(heldMesh);}}else if(!isItm(id)&&B[id]){heldMesh=new THREE.Mesh(getBlockGeo(id),new THREE.MeshLambertMaterial({map:ATLAS.tex}));heldMesh.scale.setScalar(0.22);heldMesh.position.set(0.02,0.08,-0.13);heldMesh.rotation.set(0.3,0.6,0.12);arm.add(heldMesh);}else heldMesh=null;heldId=id;}
arm.position.set(0.34,-0.3,-0.55);arm.rotation.set(-0.22,0.38,0.05);
let hAnim={t:0,type:null};function handAnim(type){hAnim.type=type;hAnim.t=0;}
function updateHand(dt,moving,sp){syncHeld();const bob=Math.sin(walkT*2.3)*0.013*sp,bob2=Math.cos(walkT*1.15)*0.016*sp;let px=0.34+bob2,py=-0.3+bob,pz=-0.55,rx=-0.22,ry=0.38,rz=0.05;if(hAnim.type){const spm={swing:4.1,place:5.4,throw:5.0,mine:3.8,chop:4.5,dig:4.2,snip:7,cast:4.0}[hAnim.type]||4;hAnim.t+=dt*spm;const t=Math.min(1,hAnim.t),s=Math.sin(t*Math.PI);if(hAnim.type==="swing"){rx-=s*1.5;py-=s*0.16;pz+=s*0.16;rz+=s*0.5;px-=s*0.08;}if(hAnim.type==="mine"){rx-=s*2.0;py-=s*0.22;pz+=s*0.22;}if(hAnim.type==="chop"){rz+=s*1.4;px-=s*0.18;py-=s*0.1;}if(hAnim.type==="dig"){rx-=s*1.2;pz+=s*0.3;rz-=s*0.3;}if(hAnim.type==="snip"){ry+=s*0.6;rz-=s*0.5;}if(hAnim.type==="place"){pz-=s*0.16;rx-=s*0.42;py-=s*0.05;}if(hAnim.type==="throw"){rx-=s*1.9;pz+=s*0.2;px+=s*0.06;rz-=s*0.4;}if(hAnim.type==="cast"){rx-=s*2.1;pz+=s*0.3;py-=s*0.08;}if(t>=1)hAnim.type=null;}arm.position.set(px,py,pz);arm.rotation.set(rx,ry,rz);if(heldMesh)heldMesh.rotation.y+=dt*0.25*(hAnim.type?3:1);}

/* ============================================
   HUD
   ============================================ */
const $=id=>document.getElementById(id);
const hotbarEl=$("hotbar");
function drawHotbar(){if(hotbarEl.children.length!==HOTBAR.length){hotbarEl.innerHTML="";HOTBAR.forEach((id,i)=>{const d=document.createElement("div");d.className="slot";d.innerHTML="<div class='kb'>"+(i+1)+"</div>";const icon=isItm(id)&&ITEMS[id]?.toolType?toolIconFor(id):iconFor(id);d.appendChild(icon);const c=document.createElement("div");c.className="ct";d.appendChild(c);d.title=(isItm(id)?ITEMS[id]?.name:B[id]?.name)||"?";d.addEventListener("click",()=>{player.sel=i;drawHotbar();});hotbarEl.appendChild(d);});}HOTBAR.forEach((id,i)=>{const s=hotbarEl.children[i],n=player.inv[id]||0;s.classList.toggle("on",i===player.sel);s.classList.toggle("empty",n===0);s.lastChild.textContent=n;});}
function updateHUD(){const f=Math.max(0,player.hp)/player.maxhp*100;$("hpfill").style.width=f+"%";$("hpghost").style.width=f+"%";$("hpnum").textContent=Math.max(0,Math.round(player.hp))+"/"+player.maxhp;$("waveVal").textContent=wave;$("scoreVal").textContent=player.score;}
function setMineUI(p){$("mine").style.opacity=p>0?1:0;$("mineFill").style.width=Math.min(100,p*100)+"%";}
let hmT=0;function hitmark(){hmT=0.22;$("hitmark").style.opacity="1";}
function showDamage(x,y,z,txt,color){const v=new THREE.Vector3(x,y,z).project(camera);if(v.z>1)return;const el=document.createElement("div");el.className="dmg";el.textContent=txt;el.style.color=color||"#ffaa44";el.style.left=((v.x*0.5+0.5)*innerWidth)+"px";el.style.top=((-v.y*0.5+0.5)*innerHeight)+"px";document.body.appendChild(el);setTimeout(()=>el.remove(),900);}
function banner(a,b,color){const el=$("banner");$("bannerA").textContent=a;$("bannerA").style.color=color||"#e8eef5";$("bannerB").textContent=b;el.style.animation="none";void el.offsetWidth;el.style.animation="bannerIn 2.6s ease-out forwards";}
let hurtT=0;
function hurtPlayer(dmg,kx,kz){if(!playing||dead)return;player.hp-=dmg;player.vel.x+=(kx||0)*5.5;player.vel.z+=(kz||0)*5.5;player.vel.y=Math.max(player.vel.y,3.4);hurtT=0.55;$("hurt").style.opacity="1";shake(0.55);SFX.hurt();updateHUD();if(player.hp<=0){player.hp=0;die();}}
let shakeAmt=0;function shake(a){shakeAmt=Math.min(1.4,shakeAmt+a);}

/* ============================================
   BATTLE ZONE SYSTEM
   ============================================ */
let battleMode=false,battlePhase="prepare",battleTimer=300,battleZoneRadius=Math.min(WX,WZ)/2-2;
let zoneHurtAccum=0,ruinHurtAccum=0,waterHurtAccum=0,zonePulseT=0,zoneRebuildTimer=0;
const PREPARE_TIME=300,ATTACK_TIME=120;
function formatTime(sec){const m=Math.floor(sec/60)|0,s=Math.floor(sec%60)|0;return m+":"+(s<10?"0":"")+s;}
function updateBattleZone(dt){
  if(!battleMode)return;zonePulseT+=dt;zoneRebuildTimer+=dt;
  if(zoneRebuildTimer>1){zoneRebuildTimer=0;if(zoneMesh)zoneMesh.scale.setScalar(battleZoneRadius/(Math.min(WX,WZ)/2-2));}
  battleTimer-=dt;
  if(battlePhase==="prepare"){
    $("phaseTimerBox").className="prepare";$("phaseLabel").textContent="PREPARE PHASE";$("phaseTimerVal").textContent=formatTime(Math.max(0,battleTimer));
    if(battleTimer<=0){battlePhase="attack";battleTimer=ATTACK_TIME;banner("ATTACK PHASE","FIGHT — ZONE SHRINKING","#e2483d");SFX.wave();}
  } else if(battlePhase==="attack"){
    $("phaseTimerBox").className="attack";$("phaseLabel").textContent="ATTACK PHASE";$("phaseTimerVal").textContent=formatTime(Math.max(0,battleTimer));
    const shrinkPct=1-Math.max(0,battleTimer/ATTACK_TIME);
    battleZoneRadius=Math.max(4,(Math.min(WX,WZ)/2-2)*(1-shrinkPct*0.85));
    if(zoneMesh){zoneMesh.geometry.dispose();zoneMesh.geometry=new THREE.CylinderGeometry(battleZoneRadius,battleZoneRadius,60,64,1,true);}
    if(battleTimer<=0){battlePhase="ended";battleVictory();}
  }
  const distFromCenter=Math.hypot(player.pos.x-CXc,player.pos.z-CZc);
  player.outOfZone=(distFromCenter>battleZoneRadius);
  if(player.outOfZone){$("zoneWarn").style.opacity="1";$("zonehurt").style.opacity=(0.3+0.2*Math.sin(zonePulseT*4)).toString();zoneHurtAccum+=dt;while(zoneHurtAccum>=1){zoneHurtAccum-=1;hurtPlayer(2,0,0);SFX.zoneHurt();}}
  else{$("zoneWarn").style.opacity="0";$("zonehurt").style.opacity="0";zoneHurtAccum=0;}
  const pInWater=isWater(Math.floor(player.pos.x),Math.floor(player.pos.y),Math.floor(player.pos.z));
  if(pInWater&&battlePhase==="attack"){waterHurtAccum+=dt;while(waterHurtAccum>=1){waterHurtAccum-=1;hurtPlayer(1,0,0);}}else waterHurtAccum=0;
  const pInRuin=isRuinZone(player.pos.x,player.pos.z);
  if(pInRuin&&battlePhase==="attack"){ruinHurtAccum+=dt;while(ruinHurtAccum>=1){ruinHurtAccum-=1;hurtPlayer(1,0,0);}}else ruinHurtAccum=0;
}
function battleVictory(){if(!battleMode||battlePhase==="ended")return;battlePhase="ended";const alive=enemies.filter(e=>e.isPvpBot&&e.isEnemy&&!e.dead).length;if(alive===0){banner("VICTORY!","ALL ENEMIES ELIMINATED","#4adc6f");SFX.heal();}else{banner("TIME'S UP","ZONE COLLAPSED","#e2483d");}}

/* ============================================
   MINIMAP
   ============================================ */
const minimapCanvas=$("minimapCanvas");const mmCtx=minimapCanvas.getContext("2d");const MM_SIZE=140;
let mmTerrain=null;let minimapTerrainReady=false;
function buildMinimapTerrain(){
  mmTerrain=mmCtx.createImageData(MM_SIZE,MM_SIZE);const data=mmTerrain.data;
  for(let px=0;px<MM_SIZE;px++)for(let pz=0;pz<MM_SIZE;pz++){
    const wx=Math.floor((px/MM_SIZE)*WX),wz=Math.floor((pz/MM_SIZE)*WZ);
    const h=tH(wx,wz);let r=50,g=100,b=40;
    if(h<7){r=20;g=60;b=140;}else if(h<9){r=200;g=190;b=130;}else if(h<14){r=55;g=128;b=48;}else{const hf=(h-14)/10;r=Math.round(90+hf*55);g=Math.round(88+hf*35);b=Math.round(80+hf*30);}
    if(isRuinZone(wx,wz)){r=70;g=70;b=70;}
    const idx=(pz*MM_SIZE+px)*4;data[idx]=r;data[idx+1]=g;data[idx+2]=b;data[idx+3]=255;
  }
}
function drawMinimap(){
  if(!minimapTerrainReady){buildMinimapTerrain();minimapTerrainReady=true;}
  mmCtx.putImageData(mmTerrain,0,0);
  if(battleMode){
    const maxR=Math.min(WX,WZ)/2-2;const safeR=(battleZoneRadius/maxR)*(MM_SIZE/2-4);const cx=MM_SIZE/2,cz=MM_SIZE/2;
    mmCtx.beginPath();mmCtx.arc(cx,cz,safeR,0,Math.PI*2);mmCtx.strokeStyle=battlePhase==="prepare"?"rgba(74,220,111,0.9)":"rgba(74,220,111,0.7)";mmCtx.lineWidth=2;mmCtx.stroke();
    mmCtx.save();mmCtx.globalAlpha=0.2+0.08*Math.sin(zonePulseT*3);mmCtx.fillStyle="#e2483d";mmCtx.beginPath();mmCtx.rect(0,0,MM_SIZE,MM_SIZE);mmCtx.arc(cx,cz,safeR,0,Math.PI*2,true);mmCtx.fill("evenodd");mmCtx.restore();
  }
  // Player
  const ppx=(player.pos.x/WX)*MM_SIZE,ppz=(player.pos.z/WZ)*MM_SIZE;
  mmCtx.save();mmCtx.translate(ppx,ppz);mmCtx.rotate(player.yaw);mmCtx.fillStyle="#ffffff";mmCtx.beginPath();mmCtx.moveTo(0,-6);mmCtx.lineTo(3,3);mmCtx.lineTo(-3,3);mmCtx.closePath();mmCtx.fill();mmCtx.strokeStyle="#000";mmCtx.lineWidth=0.8;mmCtx.stroke();mmCtx.restore();
  // Pet dog
  if(petDog&&!petDog.dead){const dx=(petDog.pos.x/WX)*MM_SIZE,dz=(petDog.pos.z/WZ)*MM_SIZE;mmCtx.beginPath();mmCtx.arc(dx,dz,3.5,0,Math.PI*2);mmCtx.fillStyle="#ffcc44";mmCtx.fill();}
  // Dragon
  if(dragon&&!dragon.dead){const drx=(dragon.pos.x/WX)*MM_SIZE,drz=(dragon.pos.z/WZ)*MM_SIZE;mmCtx.beginPath();mmCtx.arc(drx,drz,7,0,Math.PI*2);mmCtx.fillStyle="#ff3300";mmCtx.fill();mmCtx.font="8px sans-serif";mmCtx.fillStyle="#ff8800";mmCtx.fillText("🐉",drx-5,drz+3);}
  // Enemies
  for(const e of enemies){if(e.dead)continue;const ex=(e.pos.x/WX)*MM_SIZE,ez=(e.pos.z/WZ)*MM_SIZE;mmCtx.beginPath();mmCtx.arc(ex,ez,e.isPvpBot?4:e.key==="brute_zombie"?4.5:3,0,Math.PI*2);mmCtx.fillStyle=e.isPvpBot&&!e.isEnemy?"#55aaff":e.isPvpBot?"#ff3333":e.key==="zombie"?"#44dd44":"#ff8844";mmCtx.fill();}
  // Dogs on minimap
  for(const d of dogs){if(d.dead)continue;const dx=(d.pos.x/WX)*MM_SIZE,dz=(d.pos.z/WZ)*MM_SIZE;mmCtx.beginPath();mmCtx.arc(dx,dz,2.5,0,Math.PI*2);mmCtx.fillStyle=d.isEnemyDog?"#ff5555":"#ffaa55";mmCtx.fill();}
  mmCtx.strokeStyle="rgba(127,147,168,0.5)";mmCtx.lineWidth=1;mmCtx.strokeRect(0,0,MM_SIZE,MM_SIZE);
  const mode=window.selectedGameMode||"wave";
  $("minimapMode").textContent=battleMode?(mode==="party"?"PARTY BATTLE":"1v1 BATTLE"):"WAVE MODE";
}

/* ============================================
   CRAFTING
   ============================================ */
const craftGrid=Array(9).fill(null);let craftOutput=null;
const RECIPES=[
  {name:"Sticks",pat:[null,4,null,null,4,null,null,null,null],res:{id:106,n:4}},
  {name:"Wood Pickaxe",pat:[4,4,4,null,106,null,null,106,null],res:{id:200,n:1}},
  {name:"Wood Axe",pat:[4,4,null,4,106,null,null,106,null],res:{id:210,n:1}},
  {name:"Wood Shovel",pat:[null,4,null,null,106,null,null,106,null],res:{id:220,n:1}},
  {name:"Hoe",pat:[4,4,null,null,106,null,null,106,null],res:{id:230,n:1}},
  {name:"Stone Pickaxe",pat:[3,3,3,null,106,null,null,106,null],res:{id:201,n:1}},
  {name:"Copper Pickaxe",pat:[101,101,101,null,106,null,null,106,null],res:{id:202,n:1}},
  {name:"Iron Pickaxe",pat:[102,102,102,null,106,null,null,106,null],res:{id:203,n:1}},
  {name:"Gold Pickaxe",pat:[103,103,103,null,106,null,null,106,null],res:{id:204,n:1}},
  {name:"Diamond Pickaxe",pat:[104,104,104,null,106,null,null,106,null],res:{id:205,n:1}},
  {name:"Iron Axe",pat:[102,102,null,102,106,null,null,106,null],res:{id:212,n:1}},
  {name:"Iron Shovel",pat:[null,102,null,null,106,null,null,106,null],res:{id:221,n:1}},
  {name:"Diamond Axe",pat:[104,104,null,104,106,null,null,106,null],res:{id:213,n:1}},
  {name:"Shears",pat:[null,102,null,102,null,null,null,null,null],res:{id:240,n:1}},
  {name:"Bucket",pat:[102,null,102,null,102,null,null,null,null],res:{id:250,n:1}},
  {name:"Fishing Rod",pat:[null,null,106,null,106,107,106,null,107],res:{id:260,n:1}},
  {name:"Furnace",pat:[3,3,3,3,null,3,3,3,3],res:{id:17,n:1}},
  {name:"Chest",pat:[4,4,4,4,null,4,4,4,4],res:{id:18,n:1}},
  {name:"Torch x4",pat:[100,null,null,106,null,null,null,null,null],res:{id:19,n:4}},
  {name:"Craft Table",pat:[4,4,null,4,4,null,null,null,null],res:{id:20,n:1}},
  {name:"Planks x4",pat:[4,null,null,null,null,null,null,null,null],res:{id:4,n:4}},
  // Gun Blueprint: Iron x3 + Gunpowder x2 → Gun
  {name:"Gun Blueprint",pat:[102,102,102,null,112,null,112,null,null],res:{id:270,n:1}},
];
function matchRecipe(){for(const r of RECIPES){let ok=true;for(let i=0;i<9;i++){if((r.pat[i]===null?null:r.pat[i])!==(craftGrid[i]?craftGrid[i].id:null)){ok=false;break;}}if(ok)return r;}return null;}
function buildCraftUI(){const grid=$("craftGrid");grid.innerHTML="";for(let i=0;i<9;i++){const s=document.createElement("div");s.className="cslot";const cell=craftGrid[i];if(cell){const ic=isItm(cell.id)&&ITEMS[cell.id]?.toolType?toolIconFor(cell.id):iconFor(cell.id);s.appendChild(ic);const ct=document.createElement("span");ct.className="cct";ct.textContent=cell.count;s.appendChild(ct);}s.addEventListener("click",()=>{if(craftGrid[i]){giveItem(craftGrid[i].id,craftGrid[i].count);craftGrid[i]=null;buildCraftUI();checkCraftOutput();}});grid.appendChild(s);}buildInvDisplay();}
function buildInvDisplay(){const el=$("craftInvSlots");el.innerHTML="";Object.entries(player.inv).filter(([id,n])=>n>0&&+id>0).forEach(([id,n])=>{const iid=+id;const s=document.createElement("div");s.className="ismslot";const ic=isItm(iid)&&ITEMS[iid]?.toolType?toolIconFor(iid):iconFor(iid);s.appendChild(ic);const ct=document.createElement("span");ct.className="cct";ct.textContent=n;s.appendChild(ct);s.title=(isItm(iid)?ITEMS[iid]?.name:B[iid]?.name)||"?";s.addEventListener("click",()=>addToGrid(iid));el.appendChild(s);});}
function addToGrid(id){if(!player.inv[id]||player.inv[id]<=0)return;let tg=-1;for(let i=0;i<9;i++){if(craftGrid[i]&&craftGrid[i].id===id){tg=i;break;}}if(tg<0){for(let i=0;i<9;i++){if(!craftGrid[i]){tg=i;break;}}}if(tg<0)return;player.inv[id]--;if(craftGrid[tg])craftGrid[tg].count++;else craftGrid[tg]={id,count:1};buildCraftUI();checkCraftOutput();}
function checkCraftOutput(){const r=matchRecipe();craftOutput=r||null;const os=$("craftOutSlot");const on=$("craftOutName");os.innerHTML="";if(r){const ic=isItm(r.res.id)&&ITEMS[r.res.id]?.toolType?toolIconFor(r.res.id):iconFor(r.res.id);os.appendChild(ic);const ct=document.createElement("span");ct.className="cct";ct.textContent="x"+r.res.n;os.appendChild(ct);on.textContent=r.name;os.style.borderColor="rgba(53,224,212,.7)";}else{os.innerHTML="<span style='color:#4a5a6a;font-size:13px'>?</span>";on.textContent="-";os.style.borderColor="rgba(53,224,212,.4)";}}
$("craftOutSlot").addEventListener("click",()=>{if(!craftOutput)return;for(let i=0;i<9;i++){if(craftGrid[i]){craftGrid[i].count--;if(craftGrid[i].count<=0)craftGrid[i]=null;}}giveItem(craftOutput.res.id,craftOutput.res.n);if(craftOutput.res.id===270&&!HOTBAR.includes(270)){HOTBAR[HOTBAR.length-1]=270;}drawHotbar();buildCraftUI();checkCraftOutput();SFX.place();});
function buildRecipeChips(){const el=$("recipeList");el.innerHTML="";RECIPES.forEach(r=>{const ch=document.createElement("div");ch.className="rchip";ch.textContent=r.name;ch.addEventListener("click",()=>autoFill(r));el.appendChild(ch);});}
function autoFill(r){craftGrid.forEach((c,i)=>{if(c){giveItem(c.id,c.count);craftGrid[i]=null;}});const needed={};r.pat.forEach(id=>{if(id!==null)needed[id]=(needed[id]||0)+1;});for(const[id,n] of Object.entries(needed)){if((player.inv[+id]||0)<n){showDamage(player.pos.x,player.pos.y+1.5,player.pos.z,"Need more "+(isItm(+id)?ITEMS[+id]?.name:B[+id]?.name)||id,"#e2483d");buildCraftUI();checkCraftOutput();return;}}r.pat.forEach((id,i)=>{if(id!==null){player.inv[id]--;craftGrid[i]={id,count:1};}else craftGrid[i]=null;});buildCraftUI();checkCraftOutput();drawHotbar();}
function openCraft(){if(!running)return;craftOpen=true;$("craftScreen").classList.add("open");if(document.pointerLockElement)document.exitPointerLock();buildCraftUI();checkCraftOutput();}
function closeCraft(){craftOpen=false;$("craftScreen").classList.remove("open");craftGrid.forEach((c,i)=>{if(c){giveItem(c.id,c.count);craftGrid[i]=null;}});if(!isTouch)canvas.requestPointerLock();}
$("craftClose").addEventListener("click",closeCraft);

/* ============================================
   WAVE MODE
   ============================================ */
let wave=1,waveTimer=20,phase="build",spawnQueue=[],spawnTimer=0;
let running=false,playing=false,dead=false,time=0,walkT=0;
function startWave(){phase="fight";spawnQueue=[];const n=Math.min(20,3+Math.floor(wave*1.5));for(let i=0;i<n;i++){let k="zombie";const r=Math.random();if(wave>=3&&r<0.18)k="brute_zombie";else if(wave>=2&&r<0.45)k="skeleton";spawnQueue.push(k);}spawnTimer=0;banner("WAVE "+wave,n+" UNDEAD INCOMING","#e2483d");SFX.wave();$("timerKey").textContent="ENEMIES";}
function endWave(){wave++;phase="build";waveTimer=Math.max(10,22-wave);give(7,12);give(8,3);give(3,6);give(109,3);player.hp=Math.min(player.maxhp,player.hp+28);player.score+=100+wave*25;$("heal").style.opacity="1";setTimeout(()=>$("heal").style.opacity="0",380);banner("WAVE CLEARED","REBUILD — "+Math.round(waveTimer)+"s","#00ffcc");SFX.heal();$("timerKey").textContent="BUILD TIME";updateHUD();drawHotbar();if(wave%4===0)setTimeout(()=>spawnDragon(),3000);}
function updateWave(dt){
  if(battleMode)return;
  if(phase==="build"){waveTimer-=dt;$("timerVal").textContent=Math.max(0,Math.ceil(waveTimer));if(waveTimer<=0)startWave();}
  else{if(spawnQueue.length){spawnTimer-=dt;if(spawnTimer<=0){spawnTimer=0.6+Math.random()*0.5;const k=spawnQueue.pop();const a=Math.random()*Math.PI*2,rr=20+Math.random()*8;let x=Math.max(4,Math.min(WX-5,CXc+Math.cos(a)*rr));let z=Math.max(4,Math.min(WZ-5,CZc+Math.sin(a)*rr));spawnEnemy(k,x+0.5,z+0.5);}}const alive=enemies.filter(e=>!e.dead&&!e.isPvpBot).length;$("timerVal").textContent=alive+spawnQueue.length;if(alive===0&&spawnQueue.length===0)endWave();}
}

/* ============================================
   CAMERA / MOVEMENT
   ============================================ */
function lookDir(){return new THREE.Vector3(-Math.sin(player.yaw)*Math.cos(player.pitch),Math.sin(player.pitch),-Math.cos(player.yaw)*Math.cos(player.pitch)).normalize();}
function eyePos(){return new THREE.Vector3(player.pos.x,player.pos.y+player.eye,player.pos.z);}
function updatePlayer(dt){
  if(craftOpen)return 0;
  let ix=0,iz=0;if(keys.KeyW||keys.ArrowUp)iz-=1;if(keys.KeyS||keys.ArrowDown)iz+=1;if(keys.KeyA||keys.ArrowLeft)ix-=1;if(keys.KeyD||keys.ArrowRight)ix+=1;if(isTouch){ix+=touchMove.x;iz+=touchMove.y;}
  const l=Math.hypot(ix,iz);if(l>1){ix/=l;iz/=l;}
  const sprint=(keys.ShiftLeft||keys.ShiftRight)?1.55:1;
  const inW=isWater(Math.floor(player.pos.x),Math.floor(player.pos.y),Math.floor(player.pos.z));player.inWater=inW;
  const spd=inW?2.5*sprint:5.0*sprint;
  const sn=Math.sin(player.yaw),cs=Math.cos(player.yaw);
  player.vel.x+=((ix*cs-iz*sn)*spd-player.vel.x)*Math.min(1,15*(player.onGround?1:0.28)*dt);
  player.vel.z+=((-ix*sn-iz*cs)*spd-player.vel.z)*Math.min(1,15*(player.onGround?1:0.28)*dt);
  if(inW){player.vel.y*=0.85;if(keys.Space)player.vel.y=2.5;else player.vel.y-=4*dt;}
  else{if(keys.Space&&player.onGround)player.vel.y=9.1;player.vel.y-=29*dt;}
  if(player.vel.y<-48)player.vel.y=-48;
  stepPhysics(player,dt);
  const moving=l>0.05&&player.onGround;const sp=Math.min(1,Math.hypot(player.vel.x,player.vel.z)/5);
  if(moving)walkT+=dt*(7.5+sp*3);
  const e2=eyePos();let camY=e2.y+(moving?Math.sin(walkT)*0.035*sp:0);
  camera.position.set(e2.x+(moving?Math.cos(walkT*0.5)*0.022*sp:0),camY,e2.z);
  camera.rotation.order="YXZ";camera.rotation.y=player.yaw;camera.rotation.x=player.pitch;camera.rotation.z=(moving?Math.sin(walkT*0.5)*0.012*sp:0);
  if(shakeAmt>0.001){shakeAmt=Math.max(0,shakeAmt-dt*2.6);const s=shakeAmt*shakeAmt;camera.position.x+=(Math.random()-0.5)*0.34*s;camera.position.y+=(Math.random()-0.5)*0.34*s;camera.rotation.z+=(Math.random()-0.5)*0.07*s;}
  if(gunCooldown>0)gunCooldown=Math.max(0,gunCooldown-dt);
  updateHand(dt,moving,sp);return sp;
}

/* ============================================
   GAME FLOW
   ============================================ */
function newGame(){
  enemies.forEach(e=>{scene.remove(e.model.group);disposeGroup(e.model.group);});enemies.length=0;
  projs.forEach(p=>scene.remove(p.m));projs.length=0;
  parts.forEach(p=>p.life=0);
  torchLights.forEach(tl=>scene.remove(tl.light));torchLights.length=0;
  if(dragon){scene.remove(dragon.model.group);disposeGroup(dragon.model.group);dragon=null;}
  if(zoneMesh){scene.remove(zoneMesh);zoneMesh.geometry.dispose();zoneMesh.material.dispose();zoneMesh=null;}
  if(zoneOutMesh){scene.remove(zoneOutMesh);zoneOutMesh.geometry.dispose();zoneOutMesh.material.dispose();zoneOutMesh=null;}
  rs=(Date.now()&0x7fffffff)||12345;
  genWorld();buildAll();resetPlayer();spawnAnimals();spawnDogs();
  minimapTerrainReady=false;
  const mode=window.selectedGameMode||"wave";
  battleMode=(mode==="pvp"||mode==="party");
  battlePhase="prepare";battleTimer=PREPARE_TIME;battleZoneRadius=Math.min(WX,WZ)/2-2;
  zoneHurtAccum=0;ruinHurtAccum=0;waterHurtAccum=0;pvpBotsAlive=0;allyBotsAlive=0;
  wave=1;phase="build";waveTimer=20;spawnQueue=[];
  dead=false;craftOpen=false;$("craftScreen").classList.remove("open");
  if(battleMode){$("battlePhaseBar").classList.add("show");$("timerplate").style.display="none";$("waveplate").style.display="none";rebuildZoneMeshes();spawnPvpBots();banner("PREPARE PHASE","5 MINUTES — GATHER & BUILD","#4adc6f");}
  else{$("battlePhaseBar").classList.remove("show");$("timerplate").style.display="";$("waveplate").style.display="";$("timerKey").textContent="BUILD TIME";banner("BUILD","20s BEFORE WAVE 1","#ffaa44");}
  drawHotbar();updateHUD();running=true;playing=true;
  $("startscreen").classList.add("hide");$("deadscreen").classList.add("hide");$("pausescreen").classList.add("hide");
  if(!isTouch)canvas.requestPointerLock();A();
}
function pause(){if(!running||dead)return;running=false;playing=false;mouseDown=false;$("pausescreen").classList.remove("hide");if(document.pointerLockElement)document.exitPointerLock();}
function resume(){running=true;playing=true;$("pausescreen").classList.add("hide");if(!isTouch)canvas.requestPointerLock();}
function die(){dead=true;running=false;playing=false;shake(1.3);burst(player.pos.x,player.pos.y+1,player.pos.z,0xe2483d,26,8,0.2);$("dWave").textContent=battleMode?"Battle":wave;$("dKills").textContent=player.kills;$("dScore").textContent=player.score;$("dBlocks").textContent=player.blocksPlaced;setTimeout(()=>{$("deadscreen").classList.remove("hide");if(document.pointerLockElement)document.exitPointerLock();},700);}
$("playBtn").addEventListener("click",newGame);$("retryBtn").addEventListener("click",newGame);$("resumeBtn").addEventListener("click",resume);

/* ============================================
   MAIN LOOP
   ============================================ */
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();handCam.aspect=w/h;handCam.updateProjectionMatrix();}
addEventListener("resize",resize);resize();
genWorld();buildAll();resetPlayer();spawnAnimals();spawnDogs();drawHotbar();updateHUD();buildRecipeChips();
player.pos.set(CXc+0.5,tH(CXc|0,CZc|0)+2,CZc+0.5);
let waterT=0;
function animateWater(dt){waterT+=dt;waterSurfaces.children.forEach((w,i)=>{w.position.y=7.93+Math.sin(waterT*1.2+i*0.7)*0.03;w.material.opacity=0.62+Math.sin(waterT*0.8+i*0.4)*0.08;});}
function animateZoneRing(dt){if(!zoneMesh)return;zoneMesh.material.opacity=0.14+0.08*Math.sin(zonePulseT*2.2);if(zoneOutMesh)zoneOutMesh.material.opacity=0.08+0.04*Math.sin(zonePulseT*1.5);}
// Dragon spawn check: dragon spawns in out-zone after enough waves or in battle mode
let dragonSpawnTimer=180;
const clock=new THREE.Clock();let menuAngle=0;
function frame(){
  requestAnimationFrame(frame);let dt=Math.min(0.05,clock.getDelta());time+=dt;
  if(running&&!dead){
    const sp=updatePlayer(dt);mineTick(dt);updateEnemies(dt);updateProjs(dt);updateWave(dt);updateAnimals(dt);updateDogs(dt);updateFishing(dt);updateBattleZone(dt);updateDragon(dt);animateZoneRing(dt);
    // Spawn dragon periodically in out-zone or battle zone
    dragonSpawnTimer-=dt;
    if(dragonSpawnTimer<=0&&!dragon){dragonSpawnTimer=120+Math.random()*60;spawnDragon();}
    const r=rayVoxel(eyePos(),lookDir(),5.2);if(r.hit){hl.visible=true;hl.position.set(r.x+0.5,r.y+0.5,r.z+0.5);}else hl.visible=false;
    $("cross").classList.toggle("enemy",!!rayEnemy(eyePos(),lookDir(),4.5)||!!rayDragon(eyePos(),lookDir(),80));
    drawMinimap();
  } else if(dead){
    camera.position.y-=dt*0.35;player.pitch=Math.min(0.5,player.pitch+dt*0.5);camera.rotation.order="YXZ";camera.rotation.x=player.pitch;camera.rotation.z=Math.min(0.42,camera.rotation.z+dt*0.7);hl.visible=false;updateEnemies(dt);updateProjs(dt);updateAnimals(dt);updateDogs(dt);updateDragon(dt);
  } else {
    menuAngle+=dt*0.04;const rr2=28;camera.position.set(CXc+Math.cos(menuAngle)*rr2,24,CZc+Math.sin(menuAngle)*rr2);camera.rotation.order="YXZ";camera.rotation.set(-0.38,-menuAngle+Math.PI/2,0);hl.visible=false;updateEnemies(dt);updateAnimals(dt);updateDogs(dt);updateDragon(dt);drawMinimap();
  }
  flushDirty();updateParticles(dt);animateWater(dt);
  torchLights.forEach(tl=>{tl.light.intensity=1.4+Math.sin(time*12+tl.x)*0.2;});
  const cp=camera.position;sun.position.set(cp.x+SUNDIR.x*60,cp.y+SUNDIR.y*60,cp.z+SUNDIR.z*60);sun.target.position.set(cp.x,cp.y,cp.z);sun.target.updateMatrixWorld();sky.position.copy(cp);cloudG.position.x=(time*0.5)%80-40;
  if(hurtT>0){hurtT-=dt;if(hurtT<=0)$("hurt").style.opacity="0";}if(hmT>0){hmT-=dt;if(hmT<=0)$("hitmark").style.opacity="0";}
  renderer.clear();renderer.render(scene,camera);renderer.clearDepth();renderer.render(handScene,handCam);
}
frame();
})();
