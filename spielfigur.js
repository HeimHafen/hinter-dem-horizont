export function baueSpielfigur(THREE,scene){
  const root=new THREE.Group();
  scene.add(root);
  const material=(color,roughness=.86,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
  const cloth=material(0x222b34), folds=material(0x34414d), wrap=material(0x161c23);
  const leather=material(0x352d27,.69), sole=material(0x151819);
  const skin=material(0xb78c71,.73), eyes=material(0x292524,.43), clasp=material(0x8c7650,.39,.62);
  const sphere=new THREE.SphereGeometry(1,24,16);
  function oval(parent,mat,x,y,z,sx,sy,sz){
    const part=new THREE.Mesh(sphere,mat);
    part.position.set(x,y,z);part.scale.set(sx,sy,sz);
    part.castShadow=part.receiveShadow=true;
    parent.add(part);
    return part;
  }
  function joint(parent,x,y,z){
    const group=new THREE.Group();
    group.position.set(x,y,z);
    parent.add(group);
    return group;
  }
  const body=joint(root,0,.89,0);
  oval(body,cloth,0,.05,0,.221,.22,.14);
  oval(body,cloth,0,.335,-.01,.245,.33,.15);
  oval(body,folds,0,.474,.01,.253,.142,.153);
  oval(body,leather,0,.116,0,.227,.057,.147);
  oval(body,clasp,.065,.12,-.144,.064,.039,.013);
  oval(body,wrap,0,.633,0,.103,.107,.091);
  for(const side of [-1,1]){
    const lapel=oval(body,side===1?cloth:folds,side*.056,.371,-.133,.066,.235,.024);
    lapel.rotation.z=side*.33;
    const shoulderFold=oval(body,folds,side*.133,.492,.109,.064,.136,.037);
    shoulderFold.rotation.z=side*.62;
  }
  const head=joint(body,0,.735,0);
  oval(head,cloth,0,.055,.006,.124,.164,.113);
  oval(head,skin,0,.057,-.084,.101,.069,.043);
  oval(head,wrap,0,.023,-.101,.108,.052,.034);
  oval(head,folds,0,.105,-.077,.106,.033,.047);
  for(const side of [-1,1]){
    oval(head,eyes,side*.043,.072,-.121,.024,.007,.009);
    const brow=oval(head,wrap,side*.045,.087,-.121,.028,.005,.008);
    brow.rotation.z=side*.12;
  }
  const legs=[],arms=[];
  for(const side of [-1,1]){
    const thigh=joint(body,side*.112,-.015,0);
    oval(thigh,cloth,0,-.20,0,.106,.25,.10);
    const shin=joint(thigh,0,-.415,0);
    oval(shin,folds,0,-.181,0,.073,.206,.071);
    for(let i=0;i<4;i++)oval(shin,wrap,0,-.17-i*.049,0,.074-i*.003,.027,.072-i*.002);
    oval(shin,leather,0,-.391,-.061,.073,.058,.126);
    oval(shin,sole,0,-.422,-.062,.074,.031,.128);
    legs.push({thigh,shin});
    const arm=joint(body,side*.237,.468,0);
    arm.rotation.z=side*.12;
    oval(arm,cloth,side*.031,-.127,0,.094,.181,.092);
    const forearm=joint(arm,side*.046,-.271,0);
    oval(forearm,folds,0,-.121,0,.066,.156,.066);
    oval(forearm,leather,0,-.252,-.011,.056,.09,.055);
    arms.push({arm,forearm});
  }
  let cycle=0,amount=0;
  return {root,animate(dt,speed){
    amount=THREE.MathUtils.lerp(amount,Math.min(1,speed/2.8),1-Math.exp(-dt*11));
    cycle+=speed*dt*4;
    body.position.y=.9+Math.abs(Math.sin(cycle))*.028*amount;
    body.rotation.z=Math.sin(cycle)*.026*amount;
    head.rotation.z=-body.rotation.z*.65;
    for(let i=0;i<2;i++){
      const stride=Math.sin(cycle+i*Math.PI);
      legs[i].thigh.rotation.x=stride*.48*amount;
      legs[i].shin.rotation.x=-Math.max(0,stride)*.62*amount;
      arms[i].arm.rotation.x=-stride*.33*amount;
      arms[i].forearm.rotation.x=.12+Math.max(0,-stride)*.30*amount;
    }
  }};
}
