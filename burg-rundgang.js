import {burgFuss} from './burg-hohenzollern.js';

export const tor = burgFuss - 1.5;
export const hofX = 480;
export const hofStart = 2.7;
export const saalFront = 21;
export const saalEnde = 31;
const hindernisse = [
  [-10,15.5,.8,31],[10,15.5,.8,31],
  [-5.7,0,8.6,1],[5.7,0,8.6,1],
  [-5.7,saalFront,8.15,.8],[5.7,saalFront,8.15,.8],
  [-9.55,26,.8,10],[9.55,26,.8,10],[0,saalEnde,20,.8],
  [-4.6,10,2.4,2.4],[5.8,10,1.8,.7],[-5,26,3.8,1.35],[5,26,3.8,1.35]
];

export function imHof(x,z) {
  const local=x-hofX;
  if(Math.abs(local)>9.55||z<.4||z>saalEnde-.4)return false;
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
  wall(0,saalEnde,20,6.1,.8);
  block(0,6.14,26,20.6,.3,10.8,slate);
  for(const x of [-5,5]){
    block(x,.85,26,3.8,.18,1.35,oak);
    for(const dx of [-1.55,1.55]) block(x+dx,.4,26,.2,.8,1.1,oak);
  }
  const basin=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.2,.95,12),stone[3]);
  basin.position.set(-4.6,.475,10);group.add(basin);
  const water=new THREE.Mesh(new THREE.CylinderGeometry(.86,.86,.035,12),mat(0x42696b));
  water.position.set(-4.6,.965,10);group.add(water);
  block(5.8,.47,10,1.8,.2,.7,oak);
  for(const x of [-2.7,2.7])lamp(x,saalFront-.46);
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

  const courtLight=new THREE.PointLight(0xffd8a3,65,26,2);
  courtLight.position.set(hofX,4.6,25);
  scene.add(courtLight);
}
