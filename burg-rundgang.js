import {baueBurgLandschaft} from './burg-landschaft.js';
import {burgMaterialien} from './burg-materialien.js?v=2';
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
  const mat=burgMaterialien(THREE);
  const iron=new THREE.MeshStandardMaterial({color:0x37322c,roughness:.52,metalness:.52});
  const stone=[0xa99e8b,0xb5a78e,0xaa9b85,0x8d8578,0xc0b29a].map(mat);
  const mortar=mat(0x62594e), oak=mat(0x654631,'oak'), slate=mat(0x39444d);
  const brass=mat(0xbb904c), banner=mat(0x34456d,'cloth');
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
        const brick=group.children.at(-1);
        brick.position.y+=Math.sin(i*4.66+r*6.18)*.014;
        brick.rotation.y=Math.sin(i*11.8+r*3.09)*.013;
      }
    }
  }
  function arch(x,z,bottom,r) {
    const pieces=17;
    for(let i=0;i<pieces;i++){
      const shape=new THREE.Shape();
      const low=i*Math.PI/pieces+.004, high=(i+1)*Math.PI/pieces-.004;
      shape.moveTo(Math.cos(low)*r,Math.sin(low)*r);
      shape.absarc(0,0,r,low,high,false);
      shape.lineTo(Math.cos(high)*(r+.45),Math.sin(high)*(r+.45));
      shape.absarc(0,0,r+.45,high,low,true);
      shape.closePath();
      const geometry=new THREE.ExtrudeGeometry(shape,{depth:.79,bevelEnabled:true,bevelThickness:.018,bevelSize:.016,bevelSegments:1,steps:1,curveSegments:5});
      geometry.translate(x,bottom,z-.4);
      const piece=new THREE.Mesh(geometry,stone[(i+1)%5]);
      piece.castShadow=piece.receiveShadow=true;
      group.add(piece);
    }
  }
  function lamp(x,z,y=2.55) {
    block(x,y-.23,z,.26,.075,.25,iron);
    block(x,y,z,.17,.32,.17,glow);
    for(const dx of [-.101,.101])for(const dz of [-.101,.101])
      block(x+dx,y,z+dz,.024,.42,.024,iron);
    block(x,y+.225,z,.29,.065,.29,iron);
    block(x,y+.29,z,.19,.08,.19,iron);
    block(x,y+.37,z,.047,.12,.047,iron);
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
      block(x,-.038,row+.35,1,.079,.965,stone[(row*13+column*7)%5]);
      group.children.at(-1).rotation.y=Math.sin(column*3.38+row*9.7)*.025;
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
  // Pitched roof and recessed Gothic ornament visible from the court.
  const gable=new THREE.Shape();
  gable.moveTo(-10.3,0);gable.lineTo(10.3,0);gable.lineTo(0,4.55);gable.closePath();
  for(const z of [saalFront+.05,saalEnde-.27]){
    const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(gable,{depth:.42,bevelEnabled:false}),stone[2]);
    mesh.position.set(0,6.18,z);mesh.castShadow=mesh.receiveShadow=true;group.add(mesh);
  }
  for(const side of [-1,1]){
    block(side*5.22,8.49,26,11.67,.19,11.14,slate);
    group.children.at(-1).rotation.z=-side*.415;
    for(let i=0;i<16;i++){
      const x=side*(.35+i*.65);
      block(x,10.85-Math.abs(x)*.442,26,.18,.12,11.18,slate);
      group.children.at(-1).rotation.z=-side*.415;
    }
  }
  for(const x of [-8.5,-4.6,4.6,8.5]){
    block(x,3.56,saalFront-.52,.41,4.6,.48,stone[4]);
    block(x,.89,saalFront-.58,.62,.23,.65,stone[2]);
    block(x,5.85,saalFront-.56,.64,.27,.64,stone[1]);
  }
  for(const x of [-2.9,0,2.9]){
    block(x,7.18+(x===0?.6:0),saalFront-.018,.76,1.37,.12,iron);
    arch(x,saalFront+.01,7.77+(x===0?.6:0),.35);
    block(x,7.18+(x===0?.6:0),saalFront-.13,.045,1.35,.07,brass);
  }
  for(const x of [-5,5]){
    block(x,.85,26,3.8,.18,1.35,oak);
    for(const dx of [-1.55,1.55]) block(x+dx,.4,26,.2,.8,1.1,oak);
  }
  // Exposed roof framing and warm, low chandeliers in the Great Hall.
  for(const z of [22.6,25.9,29]){
    block(0,5.71,z,18.3,.29,.34,oak);
    for(const x of [-8.45,8.45]){
      block(x,5.18,z,1.52,.19,.23,oak);
      group.children.at(-1).rotation.z=Math.sign(x)*.57;
    }
    block(0,4.72,z,.034,1.68,.034,iron);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.7,.024,6,20),iron);
    ring.rotation.x=Math.PI/2;ring.position.set(0,3.91,z);
    group.add(ring);
    for(let k=0;k<8;k++){
      const angle=k*Math.PI/4;
      const x=.69*Math.cos(angle),d=z+.69*Math.sin(angle);
      block(x,4.01,d,.065,.21,.065,brass);
      block(x,4.14,d,.036,.065,.036,glow);
    }
  }
  for(const x of [-9.06,9.06]){
    for(const z of [22.2,25.4,28.9]){
      block(x,.22,z,.48,.41,.65,stone[3]);
      block(x,2.93,z,.28,5.02,.35,stone[4]);
      block(x,5.37,z,.5,.23,.61,stone[1]);
    }
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
    for(const x of [-1.85,1.85]){
      block(x,h+.39,z,.34,.78,.5,stone[(i+1)%5]);
      block(x,h+.8,z,.43,.11,.51,stone[4]);
    }
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
  for(let row=0;row<3;row++)for(let col=0;col<11;col++){
    block((col-5)*.61,.18+hoehe+row*.32,58.75,.58,.30,.11,stone[(row*3+col)%5]);
  }
  block(0,hoehe+1.04,59,7.05,.16,.6,stone[4]);
  for(const x of [-3.36,3.36])block(x,hoehe+1.06,56,.48,.15,6.03,stone[4]);
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
    blocks.castShadow=blocks.receiveShadow=true;
    blocks.computeBoundingSphere();
    group.add(blocks);
  }

  baueBurgLandschaft(THREE,scene,hofX);

  const courtLight=new THREE.PointLight(0xffce92,49,17,2);
  courtLight.position.set(hofX,4.6,25);
  scene.add(courtLight);
  for(const z of [22.6,29]){
    const light=new THREE.PointLight(0xffbc76,23,9,2);
    light.position.set(hofX,3.87,z);
    scene.add(light);
  }
  for(const {x,start} of raeume){
    const light=new THREE.PointLight(0xffcb87,14,6,2);
    light.position.set(hofX+x*7.6,2.5,start+.7);
    scene.add(light);
  }
}
