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
    color.multiplyScalar(.84+noise(x/4,z/4)*.23).lerp(haze,fog*.66);
    color.toArray(colors,i*3);
  }
  terrain.setAttribute('color',new THREE.BufferAttribute(colors,3));
  terrain.computeVertexNormals();
  group.add(new THREE.Mesh(terrain,new THREE.MeshStandardMaterial({
    vertexColors:true,roughness:1
  })));

  const canopy=new THREE.IcosahedronGeometry(1,1);
  const vertices=canopy.getAttribute('position');
  for(let i=0;i<vertices.count;i++){
    const x=vertices.getX(i),y=vertices.getY(i),z=vertices.getZ(i);
    const r=.86+.27*hash(x*9+y*3,z*7);
    vertices.setXYZ(i,x*r,y*r,z*r);
  }
  canopy.computeVertexNormals();
  const cells=87;
  const leaves=new THREE.InstancedMesh(canopy,new THREE.MeshStandardMaterial({roughness:1}),cells*cells*2);
  const tree=new THREE.Object3D();
  const leafA=new THREE.Color(0x334a32),leafB=new THREE.Color(0x6a7748);
  let count=0;
  for(let a=0;a<cells;a++)for(let b=0;b<cells;b++){
    const x=(a-cells/2+hash(a,b))*4.45;
    const z=27+(b-cells/2+hash(b+41,a))*4.45;
    const distance=Math.hypot(x,z-27);
    const density=forest(x,z);
    if(distance<29||distance>209||density<.43+hash(a+9,b+3)*.13)continue;
    const h=2.3+hash(a+5,b+6)*3.1;
    const radius=h*(.33+.16*hash(b+11,a));
    const y=terrainHeight(x,z);
    const fog=smooth(Math.min(1,distance/230));
    for(let crown=0;crown<2;crown++){
      const offset=crown?1:0;
      if(offset&&distance>110)continue;
      tree.position.set(x+offset*radius*.43,y+h*(offset?.86:.65),z-offset*radius*.33);
      tree.scale.set(radius*(offset?.68:1),h*(offset?.32:.51),radius*(offset?.73:.94));
      tree.rotation.set(0,hash(a,b+13)*Math.PI*2+offset*.75,0);
      tree.updateMatrix();
      leaves.setMatrixAt(count,tree.matrix);
      color.copy(leafA).lerp(leafB,hash(b+4,a+crown)).lerp(haze,fog*.75);
      leaves.setColorAt(count,color);
      count++;
    }
  }
  leaves.count=count;
  leaves.computeBoundingSphere();
  group.add(leaves);
  scene.add(group);
}
