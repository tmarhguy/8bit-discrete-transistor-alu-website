import * as THREE from 'three';

/**
 * Logs scene statistics to help identifying performance bottlenecks.
 */
export const logSceneStats = (scene: THREE.Scene) => {
  let meshes = 0;
  let vertices = 0;
  let triangles = 0;
  let materials = 0;

  scene.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) {
      meshes++;
      const mesh = object as THREE.Mesh;
      const geometry = mesh.geometry;
      if (geometry) {
        vertices += geometry.attributes.position.count;
        if (geometry.index) {
          triangles += geometry.index.count / 3;
        } else {
          triangles += geometry.attributes.position.count / 3;
        }
      }
      
      if (Array.isArray(mesh.material)) {
        materials += mesh.material.length;
      } else {
        materials++;
      }
    }
  });

  console.group('Scene Statistics');
  console.log(`Meshes: ${meshes}`);
  console.log(`Vertices: ${vertices.toLocaleString()}`);
  console.log(`Triangles: ${triangles.toLocaleString()}`);
  console.log(`unique Materials (approx): ${materials}`);
  console.groupEnd();
};

/**
 * Disposes of a 3D object and all its children to free memory.
 */
export const disposeObject = (obj: THREE.Object3D) => {
  if (!obj) return;

  obj.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.geometry?.dispose();
      
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(m => m.dispose());
      } else {
        (mesh.material as THREE.Material)?.dispose();
      }
    }
  });
};
