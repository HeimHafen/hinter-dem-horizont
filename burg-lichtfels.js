export const hausEingang = 12.13;
export const burgTor = hausEingang + 50;

const furniture = [
  [-6.6,8.5],[-6.6,12],[6.6,13],[-5,23],[5,23],[0,26.7]
];

export function burgBlockiert(x, z) {
  const d = z - burgTor;
  if (Math.abs(x)>17.7 && d>-10 && d<33) return true;
  if (d < -.42) return Math.hypot(Math.abs(x)-12.8,d-1.85)<2.68;
  const a = Math.abs(x);
  if (d < 3.65 && a >= 1.77 && a < 15.35) return true;
  if (d >= 1 && d < 25.5 && Math.abs(a-14.1)<.57) return true;
  if (Math.hypot(a-14.1,d-24)<2.28 || Math.hypot(a-12.8,d-1.85)<2.68) return true;
  if (d > 29.42 && d < 30.62 && a<16.2) return true;
  if (Math.abs(d-18.4)<.60 && a>1.03 && a<9.5) return true;
  if (d>17.76 && d<29.61 && Math.abs(a-9.1)<.57) return true;
  if (Math.abs(d-29.05)<.57 && a<9.55) return true;
  if (x>8.8 && x<13.53 && d>23.1 && d<28.14) return true;
  for (const [tx,tz,r] of [[-7.1,22.3,2.2],[6.4,24.6,2],[2.1,28.1,1.6],[-9.35,17.7,1.25],[9.35,17.7,1.25],[7,9,1.52]]) {
    if (Math.hypot(x-tx,d-tz)<r+.23) return true;
  }
  return furniture.some(([cx,cz]) => Math.abs(x-cx)<1.45 && Math.abs(d-cz)<1.14);
}

export async function ladeBurg(THREE, loader, scene) {
  const {scene: castle} = await loader.loadAsync(new URL('./Burg-Lichtfels.glb',import.meta.url).href);
  castle.name = 'Burg Lichtfels';
  castle.position.set(0, .04, burgTor);
  castle.traverse(part => {
    if (!part.isMesh) return;
    part.castShadow = !part.name.startsWith('Hofpflaster');
    part.receiveShadow = true;
    if (part.name.startsWith('Burgbanner')) part.material.side = THREE.DoubleSide;
  });
  scene.add(castle);
  const path = new THREE.Mesh(
    new THREE.PlaneGeometry(3.8,27.2),
    new THREE.MeshStandardMaterial({color:0x9d8a6f,roughness:1})
  );
  path.rotation.x = -Math.PI/2;
  path.position.set(0,.032,burgTor-13.6);
  path.receiveShadow = true;
  scene.add(path);
}
