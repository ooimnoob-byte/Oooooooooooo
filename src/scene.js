/**
 * scene.js - Three.js 場景建置（地板、牆壁、燈光、天空）
 */
import * as THREE from 'three';

const ARENA_SIZE = 40;

export function createScene(renderer) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // 天空藍
  scene.fog = new THREE.Fog(0x87ceeb, 30, 80);

  // 燈光
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffffff, 1.0);
  sun.position.set(10, 20, 10);
  scene.add(sun);

  // 地板
  const floorGeo = new THREE.PlaneGeometry(ARENA_SIZE, ARENA_SIZE);
  const floorMat = new THREE.MeshLambertMaterial({ color: 0x4a7c4e });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // 格紋地板線條
  const gridHelper = new THREE.GridHelper(ARENA_SIZE, 20, 0x000000, 0x000000);
  gridHelper.material.opacity = 0.2;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // 四面牆壁
  const wallMat = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
  const walls = [
    { pos: [0, 2, -ARENA_SIZE / 2], rot: [0, 0, 0], w: ARENA_SIZE, h: 4 },
    { pos: [0, 2,  ARENA_SIZE / 2], rot: [0, Math.PI, 0], w: ARENA_SIZE, h: 4 },
    { pos: [-ARENA_SIZE / 2, 2, 0], rot: [0, Math.PI / 2, 0], w: ARENA_SIZE, h: 4 },
    { pos: [ ARENA_SIZE / 2, 2, 0], rot: [0, -Math.PI / 2, 0], w: ARENA_SIZE, h: 4 },
  ];
  walls.forEach(({ pos, rot, w, h }) => {
    const geo = new THREE.PlaneGeometry(w, h);
    const mesh = new THREE.Mesh(geo, wallMat);
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    scene.add(mesh);
  });

  return { scene, ARENA_SIZE };
}
