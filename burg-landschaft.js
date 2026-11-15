const span = 440;
const mix = (a,b,t) => a+(b-a)*t;
const smooth = t => t*t*(3-2*t);
function hash(x,z){
  const value=Math.sin(x*127.1+z*311.7+43.78)*43758.5453;
  return value-Math.floor(value);
}
function noise(x,z){
  const a=Math.floor(x),b=Math.floor(z);
  const u=smooth(x-a),v=smooth(z-b);
  return mix(mix(hash(a,b),hash(a+1,b),u),mix(hash(a,b+1),hash(a+1,b+1),u),v);
}
function terrainHeight(x,z){
  const distance=Math.hypot(x*.86,(z-27)*1.04);
  const inner=Math.min(1,Math.max(0,(distance-34)/57));
  const folds=noise(x/98+2,z/89+7)*28+noise(x/41,z/53+3)*12;
  const valleys=Math.sin(x*.039+z*.024)*3.8+Math.sin(z*.046+x*.018)*2.4;
  const bergsporn=17*Math.exp(-((x/22)**2+((z-24)/39)**2));
  return -19+bergsporn+inner*(folds-11+valleys)+noise(x/12,z/13)*3;
}
function forest(x,z){
  return noise(x/55+8,z/53+4)*.78+noise(x/16,z/18)*.22;
}
export function baueBurgLandschaft(THREE, scene, hofX){
  const group=new THREE.Group();
  group.position.x=hofX;

  const terrain=new THREE.PlaneGeometry(span,span,180,180);
  terrain.rotateX(-Math.PI/2);
  terrain.translate(0,0,27);
  const positions=terrain.getAttribute('position');
  const colors=new Float32Array(positions.count*3);
  const green=new THREE.Color(0x52634a), meadow=new THREE.Color(0x89905c);
  const haze=new THREE.Color(0x99a9a5), color=new THREE.Color();
  for(let i=0;i<positions.count;i++){
    const x=positions.getX(i),z=positions.getZ(i);
    positions.setY(i,terrainHeight(x,z));
    const growth=Math.min(1,Math.max(0,(forest(x,z)-.34)*3.1));
    const fog=smooth(Math.min(1,Math.hypot(x,z-27)/265));
    color.copy(meadow).lerp(green,growth);
    color.multiplyScalar(.76+noise(x/4,z/4)*.29+noise(x/18,z/17)*.14).lerp(haze,fog*.66);
    color.toArray(colors,i*3);
  }
  terrain.setAttribute('color',new THREE.BufferAttribute(colors,3));
  terrain.computeVertexNormals();
  group.add(new THREE.Mesh(terrain,new THREE.MeshStandardMaterial({
    vertexColors:true,roughness:1
  })));

  const canopy=new THREE.SphereGeometry(1,11,8);
  const vertices=canopy.getAttribute('position');
  const foliageColors=new Float32Array(vertices.count*3);
  for(let i=0;i<vertices.count;i++){
    const x=vertices.getX(i),y=vertices.getY(i),z=vertices.getZ(i);
    const r=.83+.22*noise(x*3.2+y*1.4,z*3.4)+.19*noise(x*6+4,z*6+y*2);
    const shade=.61+.29*(y*.5+.5)+.22*noise(x*7+y*2,z*7);
    foliageColors.set([shade,shade,shade*.94],i*3);
    vertices.setXYZ(i,x*r,y*r,z*r);
  }
  canopy.computeVertexNormals();
  canopy.setAttribute('color',new THREE.BufferAttribute(foliageColors,3));
  const cells=87;
  const leaves=new THREE.InstancedMesh(canopy,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}),cells*cells*3);
  const tree=new THREE.Object3D();
  const leafA=new THREE.Color(0x334a32),leafB=new THREE.Color(0x6a7748);
  const trunks=new THREE.InstancedMesh(
    new THREE.CylinderGeometry(.58,1,1,6),
    new THREE.MeshStandardMaterial({color:0x645244,roughness:1}),cells*cells);
  let count=0,trunkCount=0;
  for(let a=0;a<cells;a++)for(let b=0;b<cells;b++){
    const x=(a-cells/2+hash(a,b))*4.45;
    const z=27+(b-cells/2+hash(b+41,a))*4.45;
    const distance=Math.hypot(x,z-27);
    const density=forest(x,z);
    if(distance<13||distance>209||density<.38+hash(a+9,b+3)*.13)continue;
    const h=2.3+hash(a+5,b+6)*3.1;
    const radius=h*(.33+.19*hash(b+11,a));
    const y=terrainHeight(x,z);
    const fog=smooth(Math.min(1,distance/230));
    if(distance<115){
      tree.position.set(x,y+h*.22-.18,z);
      tree.scale.set(h*.061,h*.58,h*.061);
      tree.rotation.set(0,hash(a,b)*6.28,0);
      tree.updateMatrix();
      trunks.setMatrixAt(trunkCount++,tree.matrix);
    }
    const crowns=distance<76?3:distance<129?2:1;
    for(let crown=0;crown<crowns;crown++){
      const angle=hash(a+9,b)*6.28+crown*2.4;
      const shift=crown?radius*.46:0;
      tree.position.set(x+Math.cos(angle)*shift,y+h*(crown?.79:.66),z+Math.sin(angle)*shift);
      tree.scale.set(radius*(crown?.73:1),h*(crown?.35:.47),radius*(crown?.77:.91));
      tree.rotation.set(.07*Math.sin(angle),angle,.09*Math.cos(angle));
      tree.updateMatrix();
      leaves.setMatrixAt(count,tree.matrix);
      color.copy(leafA).lerp(leafB,hash(b+4,a+crown)).lerp(haze,fog*.75);
      leaves.setColorAt(count,color);
      count++;
    }
  }
  trunks.count=trunkCount;
  trunks.computeBoundingSphere();
  group.add(trunks);
  leaves.count=count;
  leaves.computeBoundingSphere();
  group.add(leaves);
  scene.add(group);
}
