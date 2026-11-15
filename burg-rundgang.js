import {burgFuss} from './burg-hohenzollern.js';

export const tor = burgFuss - 1.5;
export const hofX = 480;
export const hofStart = 2.7;
export const saalFront = 21;
export const saalEnde = 31;
const burgEnde = 59;
const treppenStart = 33;
const treppenEnde = 49;
const stufen = 32;
const hoehe = 5.12;
const raeume = [
  {x:-1, start:3, ende:8, name:'Wachstube'},
  {x:1, start:4, ende:9, name:'Küche'},
  {x:-1, start:13, ende:19, name:'Kapelle'},
  {x:1, start:12, ende:19, name:'Archiv'}
];

const raumwaende = raeume.flatMap(({x,start,ende}) => [
  [x*7.9,start,3.4,.5],[x*7.9,ende,3.4,.5],
  [x*6.2,start+.55,.5,1.1],[x*6.2,ende-.55,.5,1.1]
]);
const hindernisse = [
  [-10,15.5,.8,31],[10,15.5,.8,31],
  [-5.7,0,8.6,1],[5.7,0,8.6,1],
  [-5.7,saalFront,8.15,.8],[5.7,saalFront,8.15,.8],
  [-9.55,26,.8,10],[9.55,26,.8,10],
  [-5.85,saalEnde,8.3,.8],[5.85,saalEnde,8.3,.8],
  [-4.1,10,2.4,2.4],[4.8,10.5,1.8,.7],[-5,26,3.8,1.35],[5,26,3.8,1.35],
  ...raumwaende,
  ...raeume.map(({x,start,ende})=>[x*8.75,(start+ende)/2,1.2,1.4])
];

export function burgBoden(z) {
  const fortschritt=(z-treppenStart)/(treppenEnde-treppenStart);
  return .03+Math.max(0,Math.min(stufen,Math.ceil(fortschritt*stufen)))*hoehe/stufen;
}

export function burgOrt(x,z){
  const local=x-hofX;
  const raum=raeume.find(({x,start,ende})=>local*x>6.25&&z>start&&z<ende);
  if(raum)return raum.name;
  if(z>=53)return 'Aussichtsturm';
  if(z>=treppenEnde)return 'Wehrgang';
  if(z>saalEnde)return 'Turmtreppe';
  return z>saalFront?'Große Halle':'Innenhof';
}

export function imHof(x,z) {
  const local=x-hofX;
  const breite=z<=saalEnde+.6?9.55:z<53?1.48:3.05;
  if(Math.abs(local)>breite||z<.4||z>burgEnde-.47)return false;
  if(z>52.77&&z<53.38&&Math.abs(local)>1.42)return false;
  return !hindernisse.some(([cx,cz,w,d])=>Math.abs(local-cx)<w/2+.22&&Math.abs(z-cz)<d/2+.22);
}

export function baueBurgRundgang(THREE,scene) {
  const group=new THREE.Group();
  scene.add(group);
  const mat=(color)=>new THREE.MeshStandardMaterial({color,roughness:.92});
  const stone=[0xa69b86,0xb8ab95,0xb3a891,0x988e7d,0xc2b59f].map(mat);
  const mortar=mat(0x62594e), oak=mat(0x5b3928), slate=mat(0x39444d);
  const brass=mat(0xbb904c), banner=mat(0x293b58);
  const glow=new THREE.MeshStandardMaterial({color:0xffb55c,emissive:0xf58b28,emissiveIntensity:1.2});
  const cube=new THREE.BoxGeometry(1,1,1);
  function block(x,y,z,w,h,d,m) {
    const mesh=new THREE.Mesh(cube,m);
    mesh.position.set(x,y,z);mesh.scale.set(w,h,d);
    group.add(mesh);
  }
  function wall(x,z,w,h,d) {
    block(x,h/2,z,w,h,d,mortar);
    const side=d>w, length=side?d:w;
    const count=Math.ceil(length/1.16), width=length/count;
    const rows=Math.ceil(h/.55), rowHeight=h/rows;
    for(let r=0;r<rows;r++){
      for(let i=0;i<=count;i++){
        const left=Math.max(0,(i-(r%2)*.5)*width);
        const right=Math.min(length,(i+1-(r%2)*.5)*width);
        if(right-left<.09)continue;
        const t=(left+right)/2-length/2;
        block(x+(side?0:t),(r+.5)*rowHeight,z+(side?t:0),
          side?w+.055:right-left-.035,rowHeight-.033,side?right-left-.035:d+.055,
          stone[(r*7+i*3+(x>0?2:0))%stone.length]);
      }
    }
  }
  function arch(x,z,bottom,r) {
    for(let i=0;i<=12;i++){
      const angle=i*Math.PI/12;
      const m=new THREE.Mesh(cube,stone[i%5]);
      m.position.set(x+Math.cos(angle)*r,bottom+Math.sin(angle)*r,z);
      m.rotation.z=angle;m.scale.set(.48,.36,.83);
      group.add(m);
    }
  }
  function lamp(x,z,y=2.55) {
    block(x,y-.25,z,.29,.12,.25,oak);
    block(x,y,z,.21,.4,.21,glow);
    block(x,y+.25,z,.32,.14,.30,oak);
  }
  function flag(x,z,y) {
    block(x,y,z,1.25,2.35,.08,banner);
    block(x,y+1.19,z,1.62,.08,.14,brass);
    block(x,y,z-.05,.11,1.06,.025,brass);
    block(x,y+.19,z-.05,.59,.11,.025,brass);
  }
  // Außenportal am Fuß des Scans.
  for(const x of [-2.45,2.45]){
    wall(x,tor,1.85,3.3,.85);
    block(x,3.38,tor,2.05,.23,1.06,stone[4]);
    lamp(x,tor-.5);
  }
  arch(0,tor,2.73,1.58);

  // Spielbarer Hof mit Torbogen, Brunnen und angrenzender Halle.
  const base=group.children.length;
  block(0,-.22,15.5,25,.4,35,stone[3]);
  for(let row=0;row<31;row++){
    for(let column=0;column<19;column++){
      const x=(column-9)*1.03+(row%2?.19:0);
      block(x,-.035,row+ .35,1,.075,.96,stone[(row*13+column*7)%5]);
    }
  }
  for(const x of [-10,10]){
    wall(x,15.5,.8,5.7,31);
    block(x,5.78,15.5,1.03,.22,31,stone[4]);
    for(let z=1;z<31;z+=1.65)block(x,6.17,z,1.02,.76,.78,stone[2]);
  }
  for(const x of [-5.7,5.7]){
    wall(x,0,8.6,5.7,1);
    wall(x,saalFront,8.15,6.1,.8);
    flag(x,saalFront-.46,3.65);
    lamp(x,saalFront+.5);
  }
  arch(0,.1,2.8,1.48);
  arch(0,saalFront,2.85,1.65);
  block(0,5.4,0,3.1,2.1,.9,stone[1]);
  block(0,5.5,saalFront,3.35,1.7,.8,stone[2]);
  for(const x of [-5.85,5.85])wall(x,saalEnde,8.3,6.1,.8);
  arch(0,saalEnde,2.78,1.55);
  block(0,5.28,saalEnde,3.5,1.65,.8,stone[2]);
  for(const x of [-2.2,2.2])lamp(x,saalEnde-.5);
  block(0,6.14,26,20.6,.3,10.8,slate);
  for(const x of [-5,5]){
    block(x,.85,26,3.8,.18,1.35,oak);
    for(const dx of [-1.55,1.55]) block(x+dx,.4,26,.2,.8,1.1,oak);
  }
  const basin=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.2,.95,12),stone[3]);
  basin.position.set(-4.1,.475,10);group.add(basin);
  const water=new THREE.Mesh(new THREE.CylinderGeometry(.86,.86,.035,12),mat(0x42696b));
  water.position.set(-4.1,.965,10);group.add(water);
  block(4.8,.47,10.5,1.8,.2,.7,oak);
  for(const x of [-2.7,2.7])lamp(x,saalFront-.46);
  for(const [x,z,w,d] of raumwaende)wall(x,z,w,3.75,d);
  for(const {x,start,ende,name} of raeume){
    const mid=(start+ende)/2;
    block(x*7.9,3.82,mid,3.7,.27,ende-start+.45,slate);
    block(x*6.2,3.49,mid,.54,.57,ende-start,stone[4]);
    lamp(x*7.2,start+.48,2.32);
    const shelf=x*8.75;
    if(name==='Archiv'){
      for(const y of [.26,.68,1.10,1.52,1.94]){
        block(shelf,y,mid,1.2,.095,1.4,oak);
        for(let i=0;i<8;i++)block(shelf,y+.21,mid+(i-3.5)*.15,.47,.32,.13,[banner,oak,brass][(i+Math.round(y*10))%3]);
      }
      for(const d of [-.67,.67])block(shelf,1.13,mid+d,.99,2.11,.08,oak);
    }else if(name==='Kapelle'){
      block(shelf,.47,mid,1.2,.95,1.4,stone[4]);
      block(shelf,1.05,mid,1.33,.17,1.52,stone[1]);
      block(shelf+.18,2.37,mid,.13,1.23,.11,brass);
      block(shelf+.18,2.57,mid,.13,.11,.70,brass);
    }else{
      block(shelf,.52,mid,1.2,.93,1.4,oak);
      block(shelf,1.01,mid,1.26,.14,1.47,stone[2]);
      if(name==='Küche'){
        const pot=new THREE.Mesh(new THREE.CylinderGeometry(.26,.19,.31,10),slate);
        pot.position.set(shelf,1.23,mid);group.add(pot);
      }else{
        for(const z of [mid-.42,mid+.42])block(shelf,1.23,z,.42,.26,.35,brass);
      }
    }
  }

  // Continuous staircase, upper wall walk and lookout.
  block(0,-.22,32,3.6,.44,2.8,stone[2]);
  for(let i=0;i<stufen;i++){
    const z=treppenStart+(i+.5)*.5;
    const h=(i+1)*hoehe/stufen;
    block(0,h/2-.01,z,3.65,h+.02,.5,stone[i%5]);
    for(const x of [-1.85,1.85])block(x,h+.38,z,.29,.76,.50,stone[3]);
    if(i%8===2)lamp(-1.85,z,h+1);
  }
  block(0,hoehe-.18,51,3.65,.36,4.4,stone[2]);
  for(const x of [-1.85,1.85])block(x,hoehe+.46,51,.32,.91,4.45,stone[3]);
  block(0,hoehe-.27,56,7,.54,6.4,stone[2]);
  for(const x of [-3.36,3.36]){
    block(x,hoehe+.52,56,.37,1.04,6,stone[3]);
    for(let z=53.3;z<59;z+=1)block(x,hoehe+1.25,z,.48,.49,.48,stone[4]);
  }
  block(0,hoehe+.51,59,7,1.02,.46,stone[3]);
  for(const x of [-2.45,2.45]){
    block(x,hoehe+1.63,53,.72,3.25,.8,stone[1]);
    block(x,hoehe+1.63,58.7,.72,3.25,.8,stone[1]);
    flag(x,58.87,hoehe+2.57);
  }
  for(let x=-3;x<=3;x++)block(x,hoehe+1.28,59,.47,.49,.55,stone[4]);
  for(let i=base;i<group.children.length;i++)group.children[i].position.x+=hofX;

  // Reuse one draw call per block material.
  const batches=new Map();
  for(const part of [...group.children]){
    if(part.geometry!==cube)continue;
    part.updateMatrix();
    if(!batches.has(part.material))batches.set(part.material,[]);
    batches.get(part.material).push(part.matrix);
    group.remove(part);
  }
  for(const [material,matrices] of batches){
    const blocks=new THREE.InstancedMesh(cube,material,matrices.length);
    matrices.forEach((matrix,index)=>blocks.setMatrixAt(index,matrix));
    blocks.computeBoundingSphere();
    group.add(blocks);
  }

  // Distant hills establish a horizon for the lookout.
  const hills=new THREE.Group();
  hills.position.x=hofX;
  const ridgeGeometry=new THREE.ConeGeometry(1,1,7);
  const ridgeMaterials=[mat(0x667b67),mat(0x516a5a),mat(0x82927d)];
  for(let i=0;i<25;i++){
    const angle=i*Math.PI*2/25;
    const radius=75+17*(i%4);
    const hill=new THREE.Mesh(ridgeGeometry,ridgeMaterials[i%3]);
    hill.position.set(Math.cos(angle)*radius,-11,27+Math.sin(angle)*radius);
    hill.scale.set(25+5*(i%4),19+5*(i%5),21+4*(i%6));
    hill.rotation.y=i*1.72;
    hills.add(hill);
  }
  const valley=new THREE.Mesh(new THREE.CircleGeometry(190,48),mat(0x687956));
  valley.rotation.x=-Math.PI/2;
  valley.position.set(0,-19,27);
  hills.add(valley);
  scene.add(hills);

  const courtLight=new THREE.PointLight(0xffd8a3,65,26,2);
  courtLight.position.set(hofX,4.6,25);
  scene.add(courtLight);
  for(const {x,start} of raeume){
    const light=new THREE.PointLight(0xffcb87,14,6,2);
    light.position.set(hofX+x*7.6,2.5,start+.7);
    scene.add(light);
  }
}
