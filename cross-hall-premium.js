/**
 * Cross Hall, White House — historisch orientierter Ausbau (2026-11-15).
 * Quelle: White House Historical Association, NPS, archivierte White-House-Führungen.
 * Bewusst keine 1:1-Vermessung: detaillierte Maße und einzelne Kunstwerke sind angenähert.
 * Koordinaten sind an die bestehende Spielwelt angepasst (X: Längsachse, Z: Querrichtung).
 * Keine externen Foto-/Modell-Lizenzen, alle Details prozedural.
 */
export function baueCrossHallPremium(THREE, scene, exterior, renderer, obstacles) {
  const g = new THREE.Group();
  g.name = 'CrossHall_Premium_2026_11';
  exterior.add(g);
  const floorY = 0.91, ceilingY = 4.66;
  const white = new THREE.MeshStandardMaterial({ color: 0xf2eee4, roughness: 0.82 });
  const plaster = new THREE.MeshStandardMaterial({ color: 0xe4ddd0, roughness: 0.79 });
  const recess = new THREE.MeshStandardMaterial({ color: 0xcac7c0, roughness: 0.89 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xc5a15d, metalness: 0.70, roughness: 0.25 });
  const goldDark = new THREE.MeshStandardMaterial({ color: 0x75532e, metalness: 0.65, roughness: 0.37 });
  const bronze = new THREE.MeshStandardMaterial({ color: 0x654d38, metalness: 0.68, roughness: 0.33 });
  const brassLight = new THREE.MeshBasicMaterial({ color: 0xffe5af });
  const upholstery = new THREE.MeshStandardMaterial({ color: 0x8d2830, roughness: 0.92 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x483020, roughness: 0.65 });
  const crystal = new THREE.MeshPhysicalMaterial({ color: 0xe5f1fb, roughness: 0.12, metalness: 0.13, clearcoat: 1, clearcoatRoughness: 0.06, transparent: true, opacity: 0.90, depthWrite: false });
  function b(x,y,z,w,h,d,mat,shadow=false) {
    const o = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
    o.position.set(x,y,z); o.castShadow=shadow; o.receiveShadow=true; g.add(o); return o;
  }
  function cyl(x,y,z,rt,rb,h,mat,segments=16,shadow=false) {
    const o = new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,segments),mat);
    o.position.set(x,y,z); o.castShadow=shadow; o.receiveShadow=true;g.add(o);return o;
  }
  function line(points,radius,mat,segments=20) {
    const curve = new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve,segments,radius,5,false),mat);
    g.add(mesh);return mesh;
  }
  function tex(canvas) {
    const texture=new THREE.CanvasTexture(canvas);
    texture.colorSpace=THREE.SRGBColorSpace;
    texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    return texture;
  }
  let seed=9157;
  function rand(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
  function marbleTexture() {
    const c=document.createElement('canvas');c.width=c.height=512;
    const ctx=c.getContext('2d');
    ctx.fillStyle='#e6dfd5';ctx.fillRect(0,0,512,512);
    ctx.save();ctx.translate(256,256);ctx.rotate(Math.PI/4);
    const cell=122;
    for(let i=-4;i<=4;i++)for(let j=-4;j<=4;j++){
      const x=i*cell,y=j*cell;
      ctx.fillStyle=(i+j)%2===0?'#ded6cd':'#bdaba7';
      ctx.fillRect(x,y,cell-2,cell-2);
      ctx.save();ctx.beginPath();ctx.rect(x+2,y+2,cell-6,cell-6);ctx.clip();
      for(let n=0;n<19;n++){
        ctx.strokeStyle=(i+j)%2===0?'rgba(120,106,106,.08)':'rgba(103,88,89,.11)';
        ctx.lineWidth=.3+rand()*1.4;
        ctx.beginPath();let px=x+rand()*cell,py=y+rand()*cell;
        ctx.moveTo(px,py);
        for(let step=0;step<4;step++){
          px+=11+rand()*15;py+=(-9+rand()*18);
          ctx.lineTo(px,py);
        }ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
    for(let i=0;i<1700;i++){
      const v=rand()*200;
      ctx.fillStyle=`rgba(110,105,105,${(rand()*.045).toFixed(3)})`;
      ctx.fillRect(rand()*512,rand()*512,.3+v/200,.3+v/200);
    }
    return tex(c);
  }
  const check=marbleTexture();
  check.wrapS=check.wrapT=THREE.RepeatWrapping;
  check.repeat.set(7.5,1.65);
  const marbleFloor=new THREE.MeshPhysicalMaterial({map:check,roughness:.23,metalness:.02,clearcoat:.63,clearcoatRoughness:.15});
  // New upper floor hides the former large beige checked tiles, including below the colonnade.
  b(0,.902,3.94,35.86,.023,7.88,marbleFloor);
  b(0,.904,9.76,12.0,.025,4.77,marbleFloor);
  // Dark polished marble edge stripes, not overly thick.
  const edgeStone=new THREE.MeshStandardMaterial({color:0x5f6260,roughness:.28,metalness:.01});
  for(const z of [.25,7.65])b(0,.918,z,35.4,.007,.045,edgeStone);

  function carpetTexture() {
    const c=document.createElement('canvas');c.width=1024;c.height=192;
    const p=c.getContext('2d');
    p.fillStyle='#8f2229';p.fillRect(0,0,c.width,c.height);
    for(let i=0;i<35000;i++){
      const alpha=.025+rand()*.075;
      p.fillStyle=rand()>.5?`rgba(38,8,12,${alpha})`:`rgba(237,153,138,${alpha*.4})`;
      p.fillRect(rand()*1024,rand()*192,rand()*2+.3,.7);
    }
    for(const side of [0,1]){
      const y=side?175:17;
      p.fillStyle='#b89553';p.fillRect(0,y-9,1024,18);
      p.fillStyle='#6e2b28';p.fillRect(0,y-6,1024,12);
      p.strokeStyle='#e2bf77';p.lineWidth=2.2;
      p.beginPath();p.moveTo(0,y-8);p.lineTo(1024,y-8);p.moveTo(0,y+8);p.lineTo(1024,y+8);p.stroke();
      for(let x=16;x<1024;x+=27){
        p.strokeStyle='#c2a466';p.lineWidth=1.7;p.beginPath();
        p.moveTo(x-7,y);p.quadraticCurveTo(x,y-6,x+7,y);
        p.quadraticCurveTo(x,y+6,x-7,y);p.stroke();
        p.fillStyle='#c2a466';p.fillRect(x-1,y-1.3,2.5,2.5);
      }
    }
    return tex(c);
  }
  const runnerTexture=carpetTexture();
  const carpet=new THREE.MeshStandardMaterial({map:runnerTexture,roughness:.98});
  b(0,.926,3.97,32.55,.016,2.32,carpet);
  // Very fine high/low textile edges for readable material transitions at mobile resolution.
  for(const z of [2.794,5.146])b(0,.932,z,32.58,.005,.014,goldDark);

  // Ceiling: 1902-style restrained plaster bands and rectangular recessed panels.
  b(0,4.622,3.92,35.60,.064,7.37,white);
  const panels=[-14.4,-7.2,0,7.2,14.4];
  function ceilingFrame(cx,z,w,d) {
    const y=4.577;
    b(cx,y,z,w,.018,d,recess);
    for(const side of [-1,1]){
      b(cx+side*(w/2-.09),y-.017,z,.13,.055,d+.03,white);
      b(cx,y-.017,z+side*(d/2-.09),w-.08,.055,.13,white);
      b(cx+side*(w/2-.18),y-.046,z,.019,.012,d-.22,goldDark);
      b(cx,y-.046,z+side*(d/2-.19),w-.28,.012,.019,goldDark);
    }
  }
  for(const x of panels)ceilingFrame(x,3.9,6.54,6.72);
  for(const z of [.19,7.51]){
    b(0,4.51,z,35.7,.12,.19,white);
    b(0,4.41,z,35.7,.075,.09,plaster);
    b(0,4.35,z,35.7,.026,.13,white);
  }
  for(const x of [-17.65,17.65])b(x,4.49,3.9,.25,.14,7.7,white);
  // Modest plaster ceiling rosettes under chandelier centers.
  for(const x of [-8,8]){
    cyl(x,4.536,3.95,.40,.40,.07,white,32);
    cyl(x,4.488,3.95,.20,.20,.05,plaster,24);
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6;
      const rosette=cyl(x+Math.cos(a)*.3,4.482,3.95+Math.sin(a)*.3,.055,.03,.018,white,10);
    }
  }

  // Classical colonnade toward Entrance Hall. Source: NPS — six columns.
  const vein=document.createElement('canvas');vein.width=256;vein.height=512;
  const q=vein.getContext('2d');q.fillStyle='#d9d8d0';q.fillRect(0,0,256,512);
  for(let i=0;i<290;i++){
    const px=rand()*256,py=rand()*512;
    q.strokeStyle=`rgba(108,114,111,${.015+rand()*.075})`;q.lineWidth=.3+rand()*1.8;
    q.beginPath();q.moveTo(px,py);q.bezierCurveTo(px-24,py+10,px+40,py+36,px+rand()*35,py+60);q.stroke();
  }
  const marble= new THREE.MeshPhysicalMaterial({map:tex(vein),roughness:.35,metalness:0,clearcoat:.22});
  const marbleTrim=new THREE.MeshStandardMaterial({color:0xe9e6dc,roughness:.45});
  for(const x of [-5.25,-3.25,-1.55,1.55,3.25,5.25]){
    const z=7.75;
    const shaft=cyl(x,2.68,z,.233,.251,2.82,marble,48,true);
    shaft.geometry.computeVertexNormals();
    b(x,1.041,z,.70,.105,.69,marbleTrim,true);
    b(x,1.125,z,.59,.075,.59,marbleTrim);
    cyl(x,1.205,z,.30,.285,.12,marble,32);
    cyl(x,4.085,z,.285,.23,.13,marble,32);
    cyl(x,4.183,z,.332,.29,.072,marbleTrim,32);
    b(x,4.259,z,.68,.082,.66,marbleTrim);
    // Column collisions are deliberately narrow so navigation through bays stays possible.
    obstacles.push({x,z,w:.51,d:.51});
  }
  b(0,4.355,7.76,11.6,.21,.76,white);
  b(0,4.482,7.76,11.8,.097,.81,marbleTrim);
  for(const x of [-5.9,5.9]){
    b(x,2.80,7.72,.48,3.03,.70,marble);
    b(x,4.36,7.72,.65,.17,.89,white);
  }
  // A restrained continuation into the vestibule (the old game only had a narrow passage).
  for(const x of [-5.7,5.7]){
    b(x,2.40,10.4,.23,2.93,3.45,white);
    b(x,4.14,10.4,.30,.09,3.48,marbleTrim);
  }
  for(const z of [8.72,10.78]){
    b(0,4.53,z,11.4,.09,.09,white);
    b(0,4.54,z+1.05,11.4,.06,.06,plaster);
  }

  // Entrance frames on the state-room wall (five retained doors from the original game).
  for(const x of [-14.4,-7.2,0,7.2,14.4]){
    for(const side of [-1,1]){
      b(x+side*1.13,2.46,.205,.15,2.77,.24,marbleTrim);
      b(x+side*1.13,1.13,.231,.23,.16,.28,marbleTrim);
      b(x+side*1.13,3.85,.205,.23,.17,.29,marbleTrim);
    }
    b(x,3.88,.207,2.46,.155,.31,white);
    b(x,3.72,.246,2.28,.04,.06,goldDark);
    b(x,4.31,.22,3.44,.10,.19,white);
  }
  for(const x of [-17.85,17.85]){
    for(const z of [1.3,6.6])b(x,2.43,z,.19,3.3,.18,marbleTrim);
    b(x,4.29,3.93,.20,.11,7.26,white);
  }
  // End portals: the former featureless end walls now read as formal room entrances.
  // They are decorative and remain closed until neighboring state rooms are rebuilt.
  for(const side of [-1,1]){
    const wx=side*17.735;
    b(wx,2.40,3.93,.16,2.84,2.35,marbleTrim);
    b(wx-side*.089,2.40,3.93,.068,2.60,2.10,wood);
    for(const dz of [-.53,.53]){
      b(wx-side*.130,2.45,3.93+dz,.05,2.37,1.01,wood);
      for(const y of [1.74,2.54,3.19]){
        b(wx-side*.17,y,3.93+dz,.038,.42,.78,goldDark);
        b(wx-side*.192,y,3.93+dz,.028,.37,.73,wood);
      }
      const knz=3.93+dz+(dz>0?-.38:.38);
      cyl(wx-side*.214,2.20,knz,.037,.037,.08,gold,10);
    }
    b(wx-side*.068,3.93,3.93,.17,.20,2.66,white);
    b(wx-side*.052,4.07,3.93,.20,.08,2.78,goldDark);
  }

  // Shallow wall niches: their frames remain decorative (no fabricated bust identities).
  function arch(x,z,width=1.17,height=2.24){
    const left=x-width/2,right=x+width/2,bottom=1.31,archTop=bottom+height;
    b(left,2.13,z,.075,1.70,.08,white);
    b(right,2.13,z,.075,1.70,.08,white);
    const points=[];
    for(let i=0;i<=24;i++){
      const a=Math.PI-i*Math.PI/24;
      points.push([x+Math.cos(a)*width/2,archTop-height*.23+Math.sin(a)*width*.49,z]);
    }
    line(points,.047,marbleTrim,36);
    b(x,1.22,z,width+.16,.095,.19,white);
  }
  // Between doors, on the south wall, not on top of room entrances.
  for(const x of [-10.8,-3.6,3.6,10.8])arch(x,.185);

  function chandelier(x,z){
    // Main outline of Adam-style cut glass, two fixtures per historic documentation.
    cyl(x,4.34,z,.08,.08,.12,gold,12);
    line([[x,4.31,z],[x,3.47,z]],.015,goldDark,10);
    cyl(x,3.47,z,.14,.17,.18,gold,24);
    cyl(x,3.06,z,.10,.21,.46,crystal,24);
    cyl(x,2.74,z,.18,.10,.19,gold,24);
    for(const radius of [.4,.74]){
      for(let i=0;i<12;i++){
        const angle=i*Math.PI/6, dx=Math.cos(angle),dz=Math.sin(angle);
        const end=radius;
        line([[x,3.40,z],[x+dx*end*.45,3.16,z+dz*end*.45],
          [x+dx*end,3.29-(radius-.4)*.24,z+dz*end]],.018,gold,12);
        cyl(x+dx*end,3.31-(radius-.4)*.24,z+dz*end,.055,.049,.038,gold,12);
        if(radius>.5){
          const flame=new THREE.Mesh(new THREE.SphereGeometry(.033,9,8),brassLight);
          flame.position.set(x+dx*end,3.39-(radius-.4)*.24,z+dz*end);
          flame.scale.y=2.2;g.add(flame);
        }
      }
    }
    const glassGeom=new THREE.OctahedronGeometry(.042,0);
    const n=96;
    const glassDrops=new THREE.InstancedMesh(glassGeom,crystal,n);
    const transform=new THREE.Object3D();
    for(let i=0;i<n;i++){
      const ring=i<48?0:1;
      const a=i*Math.PI*2/48;
      const r=(ring? .74 : .38)*(.76+.2*Math.sin(i*.83));
      transform.position.set(x+Math.cos(a)*r,ring?3.03:3.13,z+Math.sin(a)*r);
      transform.scale.set(.6,1.8+(i%5)*.12,.6);
      transform.rotation.set(0,a,0);transform.updateMatrix();
      glassDrops.setMatrixAt(i,transform.matrix);
    }
    glassDrops.instanceMatrix.needsUpdate=true;g.add(glassDrops);
    const lamp=new THREE.PointLight(0xffebd2,12.4,12,2);
    lamp.position.set(x,3.13,z);scene.add(lamp);
    const fill=new THREE.PointLight(0xd4e4ff,2.1,7,2);
    fill.position.set(x,3.7,z+.5);scene.add(fill);
  }
  chandelier(-8,3.93);chandelier(8,3.93);

  function torch(x,z){
    const y=.93;
    cyl(x,y+.06,z,.22,.28,.12,bronze,24);
    const shaft=cyl(x,y+1.0,z,.045,.07,1.82,bronze,20);
    cyl(x,y+1.88,z,.11,.08,.17,goldDark,16);
    for(let i=0;i<5;i++){
      const angle=(i+.5)*Math.PI*2/5;
      const dx=Math.cos(angle),dz=Math.sin(angle);
      const lx=x+dx*.26,lz=z+dz*.26;
      line([[x,y+1.79,z],[x+dx*.13,y+2.01,z+dz*.13],[lx,y+2.10,lz]],.021,bronze,10);
      cyl(lx,y+2.12,lz,.095,.07,.07,goldDark,12);
      const bulb=new THREE.Mesh(new THREE.SphereGeometry(.045,9,7),brassLight);
      bulb.position.set(lx,y+2.22,lz);g.add(bulb);
    }
  }
  for(const x of [-12.6,-4.4,4.4,12.6]){
    torch(x,6.75);
    obstacles.push({x,z:6.75,w:.47,d:.47});
  }

  function gildedBench(x,z){
    b(x,1.35,z,1.62,.14,.55,upholstery,true);
    b(x,1.47,z-.20,1.59,.25,.11,upholstery,true);
    b(x,1.42,z-.27,1.70,.55,.08,gold,true);
    for(const side of [-1,1]){
      const ex=x+side*.76;
      b(ex,1.37,z,.065,.22,.62,gold,true);
      b(ex,1.67,z-.30,.055,.36,.10,gold);
      for(const dz of [-.19,.19]){
        cyl(ex,1.095,z+dz,.039,.049,.30,gold,10);
      }
    }
    b(x,1.255,z,1.64,.065,.61,gold);
    obstacles.push({x,z,w:1.71,d:.67});
  }
  for(const x of [-10.7,10.7])gildedBench(x,1.07);

  // Discreet historic portrait placeholders: no claim of likeness to specific presidents.
  function portraitTexture(index){
    const c=document.createElement('canvas');c.width=256;c.height=320;
    const p=c.getContext('2d');
    const grad=p.createLinearGradient(0,0,230,310);
    const hues=[['#5e5045','#1e2329'],['#6c5a43','#25251e'],['#4e585b','#242124'],['#605248','#24272a']][index%4];
    grad.addColorStop(0,hues[0]);grad.addColorStop(1,hues[1]);
    p.fillStyle=grad;p.fillRect(0,0,256,320);
    p.fillStyle='#2c2a2a';p.beginPath();p.ellipse(125,302,96,78,0,0,Math.PI*2);p.fill();
    p.fillStyle='#d2bfac';p.beginPath();p.ellipse(128,131,38,51,.05,0,Math.PI*2);p.fill();
    p.fillStyle='#77706a';p.beginPath();p.ellipse(128,99,40,24,0,Math.PI,Math.PI*2);p.fill();
    p.fillStyle='#d0c5b3';p.fillRect(119,177,19,37);
    p.fillStyle='#e2d7c5';p.beginPath();p.moveTo(106,194);p.lineTo(129,247);p.lineTo(150,194);p.fill();
    for(let i=0;i<800;i++){
      p.strokeStyle=`rgba(222,209,171,${(rand()*.027).toFixed(3)})`;
      p.beginPath();p.moveTo(rand()*256,rand()*320);p.lineTo(rand()*256,rand()*320);p.stroke();
    }
    return tex(c);
  }
  for(const [i,x] of [-14.5,-7.15,7.15,14.5].entries()){
    const z=7.55;
    // Frames are vertical and face the Cross Hall, against intact north side walls.
    if(Math.abs(x)<6.4)continue;
    b(x,2.83,z,1.18,1.42,.10,goldDark);
    b(x,2.83,z-.068,1.11,1.35,.05,gold);
    b(x,2.83,z-.100,.94,1.16,.04,wood);
    const art=new THREE.Mesh(new THREE.PlaneGeometry(.86,1.08),new THREE.MeshStandardMaterial({map:portraitTexture(i),roughness:.93}));
    art.position.set(x,2.83,z-.131);art.rotation.y=Math.PI;g.add(art);
  }
  return g;
}
