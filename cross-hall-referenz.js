/**
 * Hinter dem Horizont — Cross Hall | Referenzbild-Ausbau V2 (15.11.2026).
 * Geometrische, spielbare Annäherung an die vom Nutzer freigegebene Bildvorlage.
 * KEINE zentimetergenaue Vermessung des realen Weißen Hauses und kein Foto-Hintergrund.
 * Halle: X = Längsachse, Z = Breite; Hallenfußboden bei Y = 0.89.
 * Benötigt Three.js r170; 2 zugeschnittene Bildtexturen aus dem Referenzbild.
 */
export function baueCrossHallReferenz(THREE, scene, exterior, renderer, obstacles) {
  const hall = new THREE.Group();
  hall.name='CrossHall_Referenz_V2_20261115';
  exterior.add(hall);
  const F=.90, C=4.62, minX=-17.82, maxX=17.82;
  const white=new THREE.MeshStandardMaterial({color:0xf5ebe0,roughness:.79});
  const ivory=new THREE.MeshStandardMaterial({color:0xe8ddd0,roughness:.70});
  const bright=new THREE.MeshStandardMaterial({color:0xfff6e6,roughness:.54});
  const inset=new THREE.MeshStandardMaterial({color:0xd7c9b9,roughness:.77});
  const chalk=new THREE.MeshStandardMaterial({color:0xf9f0df,roughness:.73});
  const darkMarble=new THREE.MeshPhysicalMaterial({color:0x877676,roughness:.25,clearcoat:.3});
  const walnut=new THREE.MeshStandardMaterial({color:0x4b2e1d,roughness:.48});
  const blackWood=new THREE.MeshStandardMaterial({color:0x251a16,roughness:.36});
  const brass=new THREE.MeshStandardMaterial({color:0xaf7b35,metalness:.70,roughness:.25});
  const gold=new THREE.MeshStandardMaterial({color:0xe3b75d,metalness:.64,roughness:.22});
  const antiqueGold=new THREE.MeshStandardMaterial({color:0x86612c,metalness:.66,roughness:.36});
  const brocade=new THREE.MeshStandardMaterial({color:0x972e3e,roughness:.85});
  const lampGlass=new THREE.MeshStandardMaterial({color:0xffe9b4,emissive:0xffd09a,emissiveIntensity:.67,roughness:.27});
  const cutGlass=new THREE.MeshPhysicalMaterial({color:0xf0f5fc,roughness:.05,metalness:.10,transparent:true,opacity:.85,clearcoat:1,clearcoatRoughness:.04,depthWrite:false});
  const volute=new THREE.MeshStandardMaterial({color:0xddcdbb,roughness:.59});
  let rng=17309;
  const rand=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/4294967296;};
  // Batch box details by material into instanced geometry to keep GPU draw calls low on iPhone.
  const boxBatches=new Map();
  const sq=(x,y,z,w,h,d,m,sh=false)=>{
    let pack=boxBatches.get(m);
    if(!pack){pack={plain:[],shadow:[]};boxBatches.set(m,pack);}
    (sh?pack.shadow:pack.plain).push([x,y,z,w,h,d]);
  };
  const cylinderBatches=new Map();
  const rod=(x,y,z,rTop,rBottom,height,m,segments=16,sh=false)=>{
    // Same taper & segment count share geometry; each instance scales separately.
    const ratio=(rTop/rBottom).toFixed(4);
    const key=segments+':'+ratio;
    let finish=cylinderBatches.get(m);
    if(!finish){finish=new Map();cylinderBatches.set(m,finish);}
    let pack=finish.get(key);
    if(!pack){pack={ratio:rTop/rBottom,segments,plain:[],shadow:[]};finish.set(key,pack);}
    (sh?pack.shadow:pack.plain).push([x,y,z,rBottom,height]);
  };
  const path=(pts,r,m,segments=20)=>{
    const points=pts.map(p=>new THREE.Vector3(...p));
    const mesh=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),segments,r,6,false),m);hall.add(mesh);return mesh;
  };
  const sphereBatches=new Map();
  const oval=(x,y,z,rx,ry,rz,m,segments=18)=>{
    let p=sphereBatches.get(m);if(!p){p=new Map();sphereBatches.set(m,p);}
    let a=p.get(segments);if(!a){a=[];p.set(segments,a);}
    a.push([x,y,z,rx,ry,rz]);
  };
  const ring=(x,y,z,r,t,m)=>{
    const o=new THREE.Mesh(new THREE.TorusGeometry(r,t,8,32),m);
    o.rotation.x=-Math.PI/2;o.position.set(x,y,z);hall.add(o);return o;
  };
  function texture(canvas) {
    const t=new THREE.CanvasTexture(canvas);
    t.colorSpace=THREE.SRGBColorSpace;
    t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    return t;
  }
  // Marble is shaded per tile with separate thin, curved veining; no photographic tiling seam.
  function stoneTileMap() {
    const can=document.createElement('canvas');can.width=1536;can.height=512;
    const c=can.getContext('2d');
    const nx=18, nz=8, tw=can.width/nx, th=can.height/nz;
    for(let iy=0;iy<nz;iy++) for(let ix=0;ix<nx;ix++) {
      const px=ix*tw, py=iy*th;
      const pale=(ix+iy)%2===0;
      const base=pale?['#e8dfd9','#e4dcd3','#e7dfdb']:['#bcb1b1','#c4b7b2','#c1b6ad'];
      c.fillStyle=base[Math.floor(rand()*base.length)];c.fillRect(px,py,tw,th);
      c.save();c.beginPath();c.rect(px+.8,py+.8,tw-1.6,th-1.6);c.clip();
      for(let k=0;k<20;k++){
        const x=px+rand()*tw,y=py+rand()*th;
        c.strokeStyle=rand()>.4?(pale?'rgba(99,91,95,.12)':'rgba(105,98,102,.17)'):'rgba(255,249,242,.30)';
        c.lineWidth=.4+rand()*1.1;
        c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x+rand()*32-8,y-16,x+rand()*35,y+16,x+tw*.40,y+rand()*30);c.stroke();
      }
      c.restore();
      c.strokeStyle='rgba(117,104,101,.33)';c.lineWidth=1.15;c.strokeRect(px+.75,py+.75,tw-1.5,th-1.5);
      c.fillStyle='rgba(255,255,255,.20)';c.fillRect(px+2,py+2,tw-4,2);
    }
    return texture(can);
  }
  const stoneMap=stoneTileMap();
  stoneMap.wrapS=stoneMap.wrapT=THREE.RepeatWrapping;
  stoneMap.repeat.set(2.3,1.1);
  const polishedStone=new THREE.MeshPhysicalMaterial({map:stoneMap,roughness:.22,metalness:0,clearcoat:.74,clearcoatRoughness:.13});
  // Mask the old hall floor, including the carpet underneath.
  sq(0,.912,3.95,35.78,.032,7.89,polishedStone);
  sq(0,.912,9.9,11.62,.032,4.18,polishedStone);
  for(const z of [.12,7.79]) sq(0,.937,z,35.66,.006,.065,darkMarble);

  // Dense red cut-pile pattern in the 2D inspiration, projected as independent 3D carpet.
  function runnerMap(){
    const cv=document.createElement('canvas');cv.width=2048;cv.height=256;
    const p=cv.getContext('2d');
    p.fillStyle='#9d2031';p.fillRect(0,0,2048,256);
    for(let i=0;i<36000;i++){
      const v=rand();p.fillStyle=v>.45?'rgba(242,132,118,.075)':'rgba(31,1,15,.075)';
      p.fillRect(rand()*2048,rand()*256,1+rand()*3,.5+rand());
    }
    // Two continuous gilt bands, vine tendrils and petal medallions.
    for(const edge of [22,234]){
      p.fillStyle='#b88b4f';p.fillRect(0,edge-19,2048,38);
      p.fillStyle='#702232';p.fillRect(0,edge-14,2048,28);
      p.fillStyle='#d7b979';p.fillRect(0,edge-18,2048,2);p.fillRect(0,edge+16,2048,2);
      p.fillStyle='#dcb96b';p.fillRect(0,edge-11,2048,1.4);p.fillRect(0,edge+10,2048,1.4);
      for(let x=8;x<2048;x+=25){
        p.save();p.translate(x,edge);p.strokeStyle='#d8b573';p.lineWidth=1.6;
        p.beginPath();p.moveTo(-10,0);p.bezierCurveTo(-3,-9,3,9,10,0);p.stroke();
        for(let a=0;a<6;a++){const t=a*Math.PI/3;p.beginPath();p.ellipse(Math.cos(t)*3.2,Math.sin(t)*3.2,2.0,3.6,t,0,Math.PI*2);p.stroke();}
        p.fillStyle='#edd299';p.beginPath();p.arc(0,0,1.3,0,Math.PI*2);p.fill();p.restore();
      }
    }
    return texture(cv);
  }
  const fabric=runnerMap();
  const runnerMat=new THREE.MeshStandardMaterial({map:fabric,roughness:.97,metalness:0});
  sq(0,.955,3.95,34.82,.021,2.64,runnerMat);
  for(const z of [2.62,5.28])sq(0,.969,z,34.84,.008,.023,antiqueGold);

  function plasterMarbleTexture(){
    const cv=document.createElement('canvas');cv.width=512;cv.height=512;
    const p=cv.getContext('2d');
    p.fillStyle='#e8dfd5';p.fillRect(0,0,512,512);
    for(let j=0;j<180;j++){
      const x=rand()*540-20,y=rand()*520-10;
      p.beginPath();p.moveTo(x,y);p.bezierCurveTo(x-22,y+28,x+38,y+64,x+rand()*42,y+125);
      p.strokeStyle=rand()>.42?'rgba(119,105,101,.12)':'rgba(255,255,255,.42)';
      p.lineWidth=.3+rand()*1.6;p.stroke();
    }
    return texture(cv);
  }
  const wallTex=plasterMarbleTexture();
  const stoneWall=new THREE.MeshPhysicalMaterial({map:wallTex,roughness:.52,metalness:0,clearcoat:.14});
  const columnMap=wallTex.clone();columnMap.needsUpdate=true;
  const columnMat=new THREE.MeshPhysicalMaterial({map:columnMap,color:0xf0e8dd,roughness:.41,clearcoat:.3});

  // Mask fictional green/red/navy south-room facades, leaving the original real navigable doors open.
  // Each blank span is a true 3D front layer in front of the original painted wall.
  const doors=[-14.4,-7.2,0,7.2,14.4], breaks=[-17.90];
  const spans=[];let cursor=-17.88;
  for(const door of doors){
    const a=door-1.115,b=door+1.115;
    spans.push([cursor,a]);cursor=b;
  }
  spans.push([cursor,17.88]);
  for(const [a,b] of spans){
    const w=b-a,cx=(a+b)/2;
    sq(cx,2.77,.245,w,3.69,.095,stoneWall);
    sq(cx,1.30,.313,w,.13,.14,white);
    sq(cx,1.60,.300,w,.09,.12,ivory);
    sq(cx,1.02,.325,w,.22,.15,chalk);
    // Formal lower raised panels.
    if(w>1.4){
      sq(cx,1.33,.310,w-.30,.50,.020,inset);
      sq(cx,1.33,.332,w-.39,.41,.018,white);
      for(const side of [-1,1]){
        sq(cx+side*(w-.52)/2,1.33,.359,.024,.37,.025,antiqueGold);
      }
    }
  }
  for(const d of doors){
    // Headpiece covers the old overly dark room-coloured lintel.
    sq(d,4.11,.262,2.25,1.02,.11,stoneWall);
    for(const side of [-1,1]){
      sq(d+side*1.13,2.29,.365,.23,2.66,.34,columnMat);
      sq(d+side*1.13,1.05,.418,.32,.26,.44,chalk);
      sq(d+side*1.13,3.60,.414,.33,.18,.43,chalk);
      sq(d+side*1.13,3.77,.382,.29,.10,.37,ivory);
      sq(d+side*.94,2.39,.432,.055,2.31,.06,antiqueGold);
    }
    sq(d,3.69,.413,2.45,.17,.46,chalk);
    sq(d,3.81,.440,2.64,.08,.51,white);
    sq(d,3.91,.409,2.95,.075,.25,ivory);
    // Wood panel beyond the doorway, not a blocking slab.
  }
  // North side, only on solid sections. The central six-column bay is intentionally open.
  for(const [a,b] of [[-17.9,-5.25],[5.25,17.9]]){
    const c=(a+b)/2,w=b-a;
    sq(c,2.76,7.68,w,3.67,.094,stoneWall);
    sq(c,1.22,7.606,w,.14,.16,chalk);
    sq(c,1.63,7.608,w,.08,.14,white);
    sq(c,1.04,7.592,w,.21,.15,chalk);
  }
  // Long moulded cornice. Three profiles plus dentils define a continuous neoclassical room.
  for(const z of [.34,7.62]){
    sq(0,4.43,z,35.82,.20,.32,ivory);
    sq(0,4.54,z,35.84,.095,.42,white);
    sq(0,4.37,z,35.82,.065,.43,chalk);
    sq(0,4.245,z,35.82,.05,.21,antiqueGold);
    sq(0,1.02,z,35.82,.065,.17,white);
  }
  // Cornice dentils: instanced = no hundreds of draw calls.
  const dentils=new THREE.InstancedMesh(new THREE.BoxGeometry(.15,.085,.13),white,2*132);
  const dummy=new THREE.Object3D();let did=0;
  for(const z of [.39,7.57])for(let i=0;i<132;i++){
    dummy.position.set(-17.57+i*.269,4.314,z);dummy.rotation.set(0,0,0);dummy.scale.set(1,1,1);dummy.updateMatrix();dentils.setMatrixAt(did++,dummy.matrix);
  }
  dentils.instanceMatrix.needsUpdate=true;hall.add(dentils);
  // Raised wall panels and repeated engaged Ionic shafts. Keep door passages clear.
  function wallPanel(x,z,w,h,y=2.72){
    if(w<.5)return;
    const side=z<4?1:-1;
    const face=z+side*.012;
    sq(x,y,face,w,h,.040,inset);
    sq(x,y,face+side*.033,w-.105,h-.10,.033,stoneWall);
    const zw=face+side*.062;
    for(const sign of [-1,1]){
      sq(x+sign*(w-.20)/2,y,zw,.028,h-.19,.035,white);
      sq(x,y+sign*(h-.20)/2,zw,w-.18,.028,.035,white);
    }
  }
  for(const [a,b] of spans){
    const w=b-a;
    if(w>=2.5) wallPanel((a+b)/2,.322,Math.min(w-.6,2.2),1.31,2.68);
  }
  for(const x of [-15.9,-12,-9.6,-4.7,-2.6,2.6,4.7,9.6,12,15.9]){
    // Reduced projection so doors remain useable.
    const z=.405;
    sq(x,2.65,z,.30,3.10,.32,columnMat);
    sq(x,1.03,z,.42,.24,.44,bright);
    sq(x,4.21,z,.42,.19,.48,bright);
    for(const dx of [-.10,-.04,.04,.10])sq(x+dx,2.70,z+.17,.022,2.74,.020,ivory);
  }

  // Coherent coffer ceiling (instead of dark flat rectangles seen in the current build).
  sq(0,4.576,3.96,35.79,.103,7.31,white);
  const coffers=[-14.5,-7.3,0,7.3,14.5];
  for(const cx of coffers){
    // field and perimeter frames, approx 6.8m along X, 6.3m across.
    const wy=4.502;
    sq(cx,wy,3.96,6.88,.040,6.66,ivory);
    for(const [off,m,dep] of [[.08,white,.14],[.23,inset,.050],[.31,chalk,.045]]){
      for(const s of [-1,1]){
        sq(cx+s*(6.88/2-off),wy-.028*(off*10),3.96,.085,dep,6.66-off*2,m);
        sq(cx,wy-.028*(off*10),3.96+s*(6.66/2-off),6.88-off*2,dep,.085,m);
      }
    }
  }
  // Plaster mouldings & carved details around chandelier medallions.
  function medallion(x,z){
    ring(x,4.432,z,.66,.042,white);
    ring(x,4.414,z,.48,.025,ivory);
    ring(x,4.404,z,.25,.036,white);
    rod(x,4.403,z,.145,.145,.07,chalk,24);
    for(let i=0;i<16;i++){
      const a=i*Math.PI/8;
      const xx=x+Math.sin(a)*.53,zz=z+Math.cos(a)*.53;
      oval(xx,4.404,zz,.055,.014,.104,white,10);
      path([[xx-.04,4.394,zz-.02],[xx,4.390,zz+.04],[xx+.04,4.394,zz-.02]],.012,ivory,7);
    }
  }
  medallion(-8.05,3.95);medallion(8.05,3.95);
  // Floral ceiling ornaments for readability at walking distance.
  for(const x of coffers)for(const z of [1.3,6.6]) {
    ring(x,4.490,z,.105,.018,chalk);
    for(let i=0;i<7;i++){
      const a=i*Math.PI*2/7;oval(x+.075*Math.cos(a),4.475,z+.075*Math.sin(a),.045,.015,.03,white,8);
    }
  }

  // Full depth of the north opening — six pale marble columns and decorated capitals.
  function column(x,z,height=2.89,r=.24){
    const cy=F+.22+height/2;
    sq(x,F+.07,z,.72,.13,.72,bright);
    sq(x,F+.17,z,.58,.065,.58,ivory);
    rod(x,F+.26,z,r*1.22,r*1.33,.17,white,28);
    rod(x,cy,z,r,r*1.09,height,columnMat,36,true);
    // Narrow grooves imitate fluting (no flat cylindrical 'concrete' posts).
    for(let j=0;j<16;j++){
      const a=j*2*Math.PI/16,dx=Math.cos(a),dz=Math.sin(a);
      rod(x+dx*(r+.004),cy,z+dz*(r+.004),.014,.014,height-.15,white,7);
    }
    rod(x,F+.27+height+.075,z,r*1.22,r*.98,.17,white,28);
    rod(x,F+.27+height+.17,z,r*1.49,r*1.32,.06,chalk,28);
    sq(x,F+.27+height+.22,z,.72,.095,.65,ivory);
    for(const s of [-1,1]){
      const tor=new THREE.Mesh(new THREE.TorusGeometry(.105,.022,6,22,Math.PI*1.75),volute);
      tor.position.set(x+s*.205,F+.27+height+.09,z+.16);hall.add(tor);
    }
    obstacles.push({x,z,w:.56,d:.56});
  }
  for(const x of [-5.2,-3.25,-1.55,1.55,3.25,5.2])column(x,7.75,2.83,.235);
  sq(0,4.38,7.73,11.5,.21,.81,ivory);
  sq(0,4.50,7.73,11.7,.105,.91,bright);
  // Return columns on the two long walls are pilasters, not blocking the central runner.
  for(const x of [-12.1,-7.8,-3.8,3.8,7.8,12.1]){
    const z=7.42;
    if(Math.abs(x)<5.3)continue;
    sq(x,2.70,z,.37,3.06,.29,columnMat);
    sq(x,1.13,z,.54,.14,.44,white);
    sq(x,4.25,z,.60,.17,.47,ivory);
  }

  // Ends of corridor: classical framed portals. On X=-18 the old solid wall
  // was split in the index.html; therefore this aperture reveals a real 3D vista.
  function xPortal(x,z=3.95,face=1) {
    const s=face;
    for(const side of [-1,1]){
      sq(x+s*.09,2.32,z+side*1.24,.32,2.86,.27,columnMat);
      sq(x+s*.10,1.06,z+side*1.24,.39,.17,.34,ivory);
      sq(x+s*.10,3.80,z+side*1.24,.38,.16,.32,chalk);
    }
    sq(x+s*.10,3.79,z,.32,.19,2.85,bright);
    sq(x+s*.10,3.95,z,.36,.10,3.06,ivory);
    sq(x+s*.10,4.05,z,.32,.08,3.29,chalk);
  }
  xPortal(-17.73,3.95,1);
  // Scene behind the end doorway (3D), never a photo plane.
  sq(-19.15,.92,3.94,3.0,.024,3.55,polishedStone);
  for(const z of [2.54,5.34])sq(-19.45,2.70,z,3.0,3.48,.14,stoneWall);
  sq(-20.84,2.69,3.94,.13,3.58,2.77,stoneWall);
  sq(-19.5,4.55,3.94,3.15,.09,3.55,white);
  const curtain=new THREE.MeshStandardMaterial({color:0xa97b42,roughness:.86,side:THREE.DoubleSide});
  const windowGlass=new THREE.MeshBasicMaterial({color:0x9ac6da});
  sq(-20.76,2.70,3.94,.020,2.29,1.70,windowGlass);
  for(const z of [3.07,4.80])sq(-20.72,2.75,z,.045,2.38,.15,white);
  for(const y of [1.94,3.4])sq(-20.71,y,3.94,.045,.09,1.80,white);
  for(const z of [2.96,4.92]){
    for(let j=0;j<5;j++){
      const dz=(j-2)*.085;
      sq(-20.65,2.74,z+dz,.045,2.35,.07,curtain);
    }
  }
  sq(-20.63,3.95,3.94,.06,.34,2.3,curtain);
  // Floral centrepiece at the end: porcelain urn, leaves, small hydrangea clusters.
  const ceramic=new THREE.MeshStandardMaterial({color:0xe1e2dc,roughness:.27,metalness:.03});
  const foliage=new THREE.MeshStandardMaterial({color:0x3a5a36,roughness:.91});
  const flowers=new THREE.MeshStandardMaterial({color:0xf5f1e3,roughness:.87});
  rod(-19.84,1.27,3.93,.36,.31,.70,walnut,28);
  sq(-19.84,1.61,3.93,.78,.06,.78,antiqueGold);
  rod(-19.84,1.82,3.93,.18,.13,.37,ceramic,24);
  for(let i=0;i<18;i++){
    const a=i*Math.PI*2/18,h=2.00+rand()*.29,r=.12+rand()*.30;
    oval(-19.84+Math.cos(a)*r,h,3.93+Math.sin(a)*r,.14,.12,.14,i%3?flowers:foliage,10);
  }
  // Match formal entrances at the opposite end as well (no dead generic blank wall).
  xPortal(17.73,3.95,-1);
  // Thick dark walnut doors remain decorative at the positive end, not over the new distant vista.
  sq(17.58,2.38,3.95,.075,2.57,2.31,walnut);
  for(const zz of [3.41,4.48])for(const y of [1.66,2.38,3.11]){
    sq(17.51,y,zz,.045,.48,.79,antiqueGold);
    sq(17.48,y,zz,.040,.40,.71,walnut);
  }
  // Main room doors: detailed dark walnut panels, but BEHIND the wall openings.
  // They read as partially open doors yet do not obstruct walking into the five rooms.
  for(const d of doors){
    for(const side of [-1,1]){
      const z=-.20;
      sq(d+side*.75,2.15,z,.105,2.43,.16,walnut);
      for(const y of [1.48,2.20,2.92]){
        sq(d+side*.75,y,z+.10,.065,.54,.10,antiqueGold);
        sq(d+side*.75,y,z+.16,.045,.45,.07,walnut);
      }
      oval(d+side*.57,2.16,z+.18,.035,.035,.022,brass);
    }
  }

  // Historical-inspired crystal chandeliers: 480 instanced glass jewels per fixture.
  const jewelGeom=new THREE.OctahedronGeometry(.036,0);
  const globeGeom=new THREE.SphereGeometry(.034,8,6);
  function chandelier(x,z){
    rod(x,4.42,z,.086,.078,.22,brass,16);
    path([[x,4.36,z],[x,3.77,z]],.020,antiqueGold,8);
    ring(x,3.73,z,.10,.03,gold);
    rod(x,3.57,z,.12,.14,.32,cutGlass,22);
    for(const radius of [.26,.54,.91]){
      ring(x,3.50-(radius*.29),z,radius,.026,gold);
    }
    const jewels=new THREE.InstancedMesh(jewelGeom,cutGlass,480);
    const obj=new THREE.Object3D();let id=0;
    for(let j=0;j<24;j++) {
      const a=j*Math.PI*2/24,dx=Math.sin(a),dz=Math.cos(a);
      for(let k=0;k<16;k++){
        const t=k/15;
        const r=.06+(.86-.06)*t;
        const height=3.62-.38*t-.28*Math.sin(t*Math.PI);
        obj.position.set(x+dx*r,height,z+dz*r);
        obj.scale.set(.55+.15*t,1.6+.18*Math.sin(t*6),.55+.1*t);
        obj.rotation.set(0,a,0);obj.updateMatrix();jewels.setMatrixAt(id++,obj.matrix);
      }
    }
    for(let k=0;k<96;k++){
      const a=k*Math.PI*2/96,r=.21+.32*rand();
      obj.position.set(x+Math.cos(a)*r,2.92+rand()*.16,z+Math.sin(a)*r);
      obj.scale.set(.56,1.25+rand(),.56);obj.updateMatrix();jewels.setMatrixAt(id++,obj.matrix);
    }
    jewels.instanceMatrix.needsUpdate=true;hall.add(jewels);
    // Sculpted curved bronze arms; twelve warm, candle-shaped LED bulbs.
    const flames=new THREE.InstancedMesh(globeGeom,lampGlass,16);
    for(let i=0;i<16;i++){
      const a=i*2*Math.PI/16,dx=Math.cos(a),dz=Math.sin(a);
      const r=1.02;
      path([[x,3.39,z],[x+dx*.50,3.06,z+dz*.50],
        [x+dx*.76,3.07,z+dz*.76],[x+dx*r,3.27,z+dz*r]],.022,gold,16);
      rod(x+dx*r,3.27,z+dz*r,.055,.059,.10,antiqueGold,11);
      rod(x+dx*r,3.37,z+dz*r,.034,.032,.16,white,10);
      obj.position.set(x+dx*r,3.48,z+dz*r);obj.scale.set(.55,1.7,.55);obj.updateMatrix();flames.setMatrixAt(i,obj.matrix);
    }
    flames.instanceMatrix.needsUpdate=true;hall.add(flames);
    rod(x,3.055,z,.18,.13,.29,cutGlass,24);
    oval(x,2.86,z,.10,.18,.10,cutGlass,14);
    const point=new THREE.PointLight(0xffe2b5,8.8,11,2);
    point.position.set(x,3.32,z);scene.add(point);
  }
  chandelier(-8.05,3.95);chandelier(8.05,3.95);

  function torchiere(x,z,handed=1) {
    const y=F;
    rod(x,y+.09,z,.19,.24,.18,blackWood,24);
    rod(x,y+.27,z,.13,.165,.22,brass,20);
    rod(x,y+.98,z,.040,.070,1.22,blackWood,16);
    rod(x,y+1.68,z,.080,.048,.24,antiqueGold,20);
    for(let i=0;i<3;i++){
      const a=i*Math.PI*2/3;
      const xx=x+Math.cos(a)*.23,zz=z+Math.sin(a)*.23;
      path([[x,y+1.68,z],[xx,y+1.77,zz]],.022,antiqueGold,9);
      rod(xx,y+1.83,zz,.092,.080,.057,brass,12);
      oval(xx,y+1.92,zz,.079,.10,.079,lampGlass,12);
    }
    obstacles.push({x,z,w:.40,d:.42});
  }
  // Floor lamps stay on polished stone, never in front of doorways or in the runner.
  for(const x of [-13.25,-5.6,5.6,13.25])torchiere(x,6.90);
  for(const x of [-11.0,10.8])torchiere(x,.80);

  // Rich carved benches with visibly cushioned upholstery against walls.
  function settee(x,z,side=1){
    sq(x,1.26,z,1.73,.12,.55,gold,true);
    sq(x,1.36,z,1.65,.22,.51,brocade,true);
    sq(x,1.67,z-side*.21,1.57,.53,.16,brocade,true);
    sq(x,1.80,z-side*.265,1.72,.09,.14,gold);
    for(const s of [-1,1]){
      sq(x+s*.78,1.40,z,.11,.36,.65,gold,true);
      oval(x+s*.78,1.69,z-side*.05,.11,.13,.27,gold,13);
      for(const zz of [z-.23,z+.23]){
        rod(x+s*.68,1.06,zz,.041,.046,.27,gold,12);
      }
    }
    for(const xx of [x-.48,x,x+.48])path([[xx,1.42,z-side*.20],[xx,1.57,z-side*.11]],.006,antiqueGold,7);
    obstacles.push({x,z,w:1.76,d:.72});
  }
  settee(10.65,7.06,-1);settee(-10.4,7.04,-1);
  // Golden side table and ceramic hydrangeas on the right-hand wall.
  const tableX=10.2,tableZ=.82;
  sq(tableX,1.64,tableZ,1.28,.09,.52,antiqueGold);
  sq(tableX,1.72,tableZ,1.25,.045,.51,gold);
  sq(tableX,1.69,tableZ+.20,1.07,.10,.05,walnut);
  for(const ix of [-.50,.50])for(const iz of [-.19,.19]){
    rod(tableX+ix,1.25,tableZ+iz,.026,.042,.66,gold,12);
    rod(tableX+ix,1.02,tableZ+iz,.055,.045,.08,antiqueGold,12);
  }
  rod(tableX,1.91,tableZ,.17,.12,.31,ceramic,20);
  for(let i=0;i<14;i++) {
    const a=i*2*Math.PI/14;
    oval(tableX+Math.cos(a)*(.14+.16*rand()),2.10+.15*rand(),tableZ+Math.sin(a)*(.14+.16*rand()),.12,.13,.12,flowers,10);
  }
  obstacles.push({x:tableX,z:tableZ,w:1.32,d:.60});

  // Photo-derived painting surfaces, generated from the user's supplied reference screenshot.
  // Art is kept separate from frames so the photo cannot replace any functional 3D geometry.
  const photos=['./assets/crosshall/portrait_links.jpg','./assets/crosshall/portrait_rechts.jpg'];
  function painting(x,z,front,asset,width=1.12,height=1.68){
    const sign=front?1:-1;
    const depth=z+sign*.05;
    sq(x,2.83,depth,width+.25,height+.25,.12,antiqueGold);
    sq(x,2.83,depth+sign*.075,width+.16,height+.17,.07,gold);
    sq(x,2.83,depth+sign*.111,width+.07,height+.08,.035,blackWood);
    const material=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.93});
    const photo=new THREE.Mesh(new THREE.PlaneGeometry(width,height),material);
    photo.position.set(x,2.83,depth+sign*.141);
    photo.rotation.y=front?0:Math.PI;
    hall.add(photo);
    const t=new THREE.TextureLoader().load(photos[asset],tt=>{
      tt.colorSpace=THREE.SRGBColorSpace;tt.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
      material.map=tt;material.needsUpdate=true;
    });
    // Material is dark wood until JPG arrives; no async render blocker.
    for(const s of [-1,1]){
      sq(x+s*(width/2+.102),2.83,depth+sign*.148,.055,height+.24,.055,antiqueGold);
      sq(x,2.83+s*(height/2+.1),depth+sign*.148,width+.24,.05,.055,antiqueGold);
    }
  }
  // If you're facing down the X axis from x>0, left wall is positive Z.
  painting(12.85,7.51,false,0,1.12,1.65);
  painting(-12.4,7.51,false,0,.95,1.35);
  painting(12.9,.43,true,1,1.09,1.65);
  painting(-12.5,.43,true,1,.92,1.31);
  // Side doors on north wall are modelled as recesses only where the north wall is solid.
  for(const x of [-9.10,9.10]){
    sq(x,2.30,7.49,1.44,2.56,.07,walnut);
    for(const y of [1.67,2.32,3.02]){
      sq(x,y,7.40,1.16,.49,.04,antiqueGold);
      sq(x,y,7.37,1.07,.42,.03,walnut);
    }
    for(const side of [-1,1])sq(x+side*.83,2.35,7.40,.15,2.82,.23,chalk);
    sq(x,3.76,7.39,1.85,.14,.29,white);
  }
  // Freeze decorative boxes into one draw call per finish. This is crucial for Safari/WebGL.
  const boxGeometry=new THREE.BoxGeometry(1,1,1);
  for(const [finish,pack] of boxBatches){
    for(const [casts,boxes] of [[false,pack.plain],[true,pack.shadow]]){
      if(!boxes.length)continue;
      const instance=new THREE.InstancedMesh(boxGeometry,finish,boxes.length);
      const unit=new THREE.Object3D();
      for(let i=0;i<boxes.length;i++){
        const [x,y,z,w,h,d]=boxes[i];
        unit.position.set(x,y,z);unit.scale.set(w,h,d);unit.updateMatrix();
        instance.setMatrixAt(i,unit.matrix);
      }
      instance.instanceMatrix.needsUpdate=true;
      instance.castShadow=casts;instance.receiveShadow=true;
      hall.add(instance);
    }
  }
  // Shared cylinder & cushion primitives (reduces draw calls compared with independent meshes).
  for(const [finish,mats] of cylinderBatches) for(const pack of mats.values()) {
    const geometry=new THREE.CylinderGeometry(pack.ratio,1,1,pack.segments);
    for(const [shadow,items] of [[false,pack.plain],[true,pack.shadow]]) {
      if(!items.length)continue;
      const batch=new THREE.InstancedMesh(geometry,finish,items.length),unit=new THREE.Object3D();
      items.forEach(([x,y,z,r,height],i)=>{unit.position.set(x,y,z);unit.scale.set(r,height,r);unit.updateMatrix();batch.setMatrixAt(i,unit.matrix)});
      batch.castShadow=shadow;batch.receiveShadow=true;batch.instanceMatrix.needsUpdate=true;hall.add(batch);
    }
  }
  for(const [finish,groups] of sphereBatches)for(const [segments,items] of groups){
    const batch=new THREE.InstancedMesh(new THREE.SphereGeometry(1,segments,12),finish,items.length);
    const unit=new THREE.Object3D();
    items.forEach(([x,y,z,rx,ry,rz],i)=>{unit.position.set(x,y,z);unit.scale.set(rx,ry,rz);unit.updateMatrix();batch.setMatrixAt(i,unit.matrix)});
    batch.instanceMatrix.needsUpdate=true;hall.add(batch);
  }
  // Safety: keep original navigational geometry untouched beyond the real east/west ends.
  return hall;
}
