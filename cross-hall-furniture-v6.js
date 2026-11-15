/**
 * Hinter dem Horizont — Cross Hall · Real-3D-Furnishing phase 1.
 * Asset coordinate space: meters, Y-up, console top at 0.847m above its local floor.
 * This module places actual GLB geometry, not a photo-plane, decal or a box placeholder.
 * Existing doors, lighting, navigation and other scene assets are intentionally unchanged.
 */
const ROOT = './assets/crosshall/models/';

export const HISTORIC_CONSOLES_V6 = Object.freeze([
  {id:'Westliche Mahagoni-Konsole',kind:'walnut',decor:'vase',x:-6.75,z:7.11,orientation:Math.PI},
  {id:'Mahagoni-Konsole links',kind:'walnut',decor:'vase',x:-3.56,z:.87,orientation:0},
  {id:'Mahagoni-Konsole rechts',kind:'walnut',decor:'vase',x:3.65,z:.87,orientation:0},
  {id:'Vergoldete Blumenkonsole',kind:'gold',decor:'bouquet',x:10.80,z:.87,orientation:0},
  {id:'Vergoldete Fensterkonsole',kind:'gold',decor:'bouquet',x:6.75,z:7.11,orientation:Math.PI},
]);

/** Load each independently useful 3D model once; clones share geometry and PBR materials. */
export async function setzeHistorischeKonsolenV6(THREE, gltfLoader, root, obstacles, environment=null) {
  const filenames = {
    walnut:'console_walnut_3d.glb',
    gold:'console_gold_3d.glb',
    vase:'porcelain_urn_3d.glb',
    bouquet:'hydrangea_bouquet_3d.glb',
  };
  const models = {};
  await Promise.all(Object.entries(filenames).map(async ([name,filename])=>{
    try {
      const gltf = await gltfLoader.loadAsync(ROOT + filename);
      if (!gltf?.scene) throw new Error('No scene in '+filename);
      models[name] = gltf.scene;
    } catch(e) {
      console.error('[Cross Hall V6] 3D asset could not be loaded:',filename,e);
    }
  }));
  const display = new THREE.Group();
  display.name='CrossHall_Moebel_Echte_GLB_V6';
  root.add(display);
  const placed=[];
  const tableTopY=.847;
  const baseY=.913;
  for (const cfg of HISTORIC_CONSOLES_V6) {
    if (!models[cfg.kind] || !models[cfg.decor]) continue;
    const anchor = new THREE.Group();
    anchor.name = cfg.id;
    anchor.position.set(cfg.x,baseY,cfg.z);
    anchor.rotation.y = cfg.orientation;
    const table=models[cfg.kind].clone(true);
    table.name=cfg.kind==='gold'?'Vergoldete Konsole (GLB)':'Mahagoni-Konsole (GLB)';
    const item=models[cfg.decor].clone(true);
    item.name=cfg.decor==='bouquet'?'Hortensien mit 3D-Blütenblättern (GLB)':'Porzellanvase (GLB)';
    item.position.set(cfg.decor==='vase'?.03:0,tableTopY, -.014);
    anchor.add(table,item);
    // Preserve physically based materials and smooth mesh normals from the GLB.
    anchor.traverse(obj=>{
      if(!obj.isMesh) return;
      const thin = /cream|leaf|stem|centre/i.test(obj.name);
      obj.castShadow=!thin; // Thin flowers do not multiply iPhone shadow-map cost.
      obj.receiveShadow=!thin;
      obj.frustumCulled=true;
      if(environment){
        const materials=Array.isArray(obj.material)?obj.material:[obj.material];
        for(const m of materials){
          if(m?.isMeshStandardMaterial && m.metalness>.08){
            m.envMap=environment;
            m.envMapIntensity=.9;
            m.needsUpdate=true;
          }
        }
      }
    });
    display.add(anchor);
    // Exact physical console footprint; additional player clearance is applied in valid().
    obstacles.push({x:cfg.x,z:cfg.z,w:1.53,d:.68});
    placed.push(cfg.id);
  }
  console.info(`[Cross Hall V6] ${placed.length}/5 volumetric console groups loaded from GLB.`);
  return {group:display,placed};
}
