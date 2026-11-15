export const hausEingang = 12.13;
export const burgFuss = hausEingang + 50;
export const aussicht = burgFuss - 8;

export async function ladeBurg(THREE, loader, scene) {
  const url = new URL('./burg_hohenzollern.glb', import.meta.url);
  const {scene: burg} = await loader.loadAsync(url.href);
  burg.name = 'Burg Hohenzollern';
  burg.scale.setScalar(.28);
  burg.rotation.y = 2.15;

  const bounds = new THREE.Box3().setFromObject(burg, true);
  const mitte = bounds.getCenter(new THREE.Vector3());
  burg.position.set(-mitte.x, -17 - bounds.min.y, burgFuss - bounds.min.z);
  scene.add(burg);

  const wegbeginn = 35;
  const weglaenge = burgFuss - 1.5 - wegbeginn;
  const weg = new THREE.Mesh(
    new THREE.PlaneGeometry(3.8, weglaenge),
    new THREE.MeshStandardMaterial({color: 0x9d8a6f, roughness: 1})
  );
  weg.rotation.x = -Math.PI / 2;
  weg.position.set(0, .032, wegbeginn + weglaenge / 2);
  weg.receiveShadow = true;
  scene.add(weg);
}
