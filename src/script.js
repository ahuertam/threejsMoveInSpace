import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import mountainFragment from "./shaders/mountains.fragment.glsl";
import mountainVertex from "./shaders/mountains.vertex.glsl";

const canvas = document.querySelector("#webgl01");
// Cursor
const cursor = { x: 0, y: 0 };
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.heigth - 0.5);
});

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xccddff);
scene.fog = new THREE.FogExp2(0xf0fff0, 0.004);
// Ambient lights.
const ambient = new THREE.AmbientLight(0xffffff);
scene.add(ambient);

// Objects

// bgs and more
let planetMesh;
const planet = (posX, posY, posZ) => {
  const geometryPlanet = new THREE.SphereGeometry(100, 1000, 1000);
  const materialPlanet = new THREE.MeshPhongMaterial();
  THREE.ImageUtils.crossOrigin = "";
  materialPlanet.map = THREE.ImageUtils.loadTexture(
    "http://s3-us-west-2.amazonaws.com/s.cdpn.io/1206469/earthmap1k.jpg"
  );
  planetMesh = new THREE.Mesh(geometryPlanet, materialPlanet);
  planetMesh.position.set(posX, posY, posZ);
  planetMesh.rotation.x += 0.5;
  scene.add(planetMesh);
};
let ringMesh;
const ring = (posX, posY, posZ) => {
  const torusGeometry = new THREE.TorusGeometry(7, 1, 6, 12);
  const phongMaterial = new THREE.MeshPhongMaterial({ color: 0xff9500 });
  ringMesh = new THREE.Mesh(torusGeometry, phongMaterial);
  ringMesh.position.set(posX, posY, posZ);
  scene.add(ringMesh);
};

// Player
const geometry2 = new THREE.ConeGeometry(1, 1, 3);
const material = new THREE.MeshBasicMaterial({ color: "orange" });
const mesh = new THREE.Mesh(geometry2, material);
mesh.position.set(0.7, 1, 1);
mesh.scale.set(0.3, 0.7, 0.3);
mesh.rotation.x = -Math.PI * 0.5;
scene.add(mesh);

// floor
function createFloor() {
  const grassTexture = new THREE.TextureLoader().load(
    "../assets/grass_texture.jpg"
  );
  grassTexture.wrapS = THREE.RepeatWrapping;
  grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(200, 200);
  const geometry = new THREE.PlaneBufferGeometry(128, 128, 512, 512);
  const material = new THREE.RawShaderMaterial({
    fragmentShader: mountainFragment,
    vertexShader: mountainVertex,
    uniforms: {
      grassTexture: {
        value: grassTexture
      }
    },
    side: 2
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.map = THREE.ImageUtils.loadTexture(
    "https://www.onlygfx.com/wp-content/uploads/2016/02/green-paint-1024x714.jpg"
  );
  plane.rotation.x = (-1 * Math.PI) / 2;
  plane.position.y = 0;
  scene.add(plane);
}
//controls
const speed = { x: 0.02, y: 0.02, z: 1.5 };
const moving = {
  right: false,
  left: false,
  up: false,
  down: false,
  upward: false
};

const onDocumentKeyDown = (event) => {
  const keyCode = event.key;
  if (keyCode === "w") {
    moving.top = true;
  }
  if (keyCode === "a") {
    moving.left = true;
  }
  if (keyCode === "s") {
    moving.down = true;
  }
  if (keyCode === "d") {
    moving.right = true;
  }
  if (keyCode === " ") {
    moving.upward = true;
  }
};
const onDocumentKeyUp = (event) => {
  const keyCode = event.key;
  if (keyCode === "w") {
    moving.top = false;
  }
  if (keyCode === "a") {
    moving.left = false;
  }
  if (keyCode === "s") {
    moving.down = false;
  }
  if (keyCode === "d") {
    moving.right = false;
  }
  if (keyCode === " ") {
    // space
    moving.upward = false;
  }
};
document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyUp, false);

// Axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Sizes
const sizes = {
  width: window.innerWidth,
  heigth: window.innerHeight
};
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.heigth = window.innerHeight;
  camera.aspect = sizes.width / sizes.heigth;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.heigth);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const hemisphereLight = new THREE.HemisphereLight(0xdddddd, 0x000000, 0.5);
scene.add(hemisphereLight);

window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullScreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitFullScreenElement) {
      canvas.webkitFullScreenElement(); // Safari compat
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullScreen) {
      document.webkitExitFullScreen();
    }
  }
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.heigth,
  0.1,
  1000
);
camera.position.z = 2.5;
camera.position.y = 0;

scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.heigth);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// CLOCK
const clock = new THREE.Clock();

// Animations
const loop = () => {
  // Time
  const elapsedTime = clock.getElapsedTime();
  planetMesh.rotation.y += 0.005;
  ringMesh.rotation.z += 0.009;
  controls.update();

  if (moving.top) {
    mesh.translateY(speed.y * elapsedTime);
  }
  if (moving.down) {
    mesh.translateY(-speed.y * elapsedTime);
  }
  if (moving.left) {
    mesh.translateX(-speed.x * elapsedTime);
  }
  if (moving.right) {
    mesh.translateX(speed.x * elapsedTime);
  }
  if (moving.upward) {
    mesh.translateZ(speed.z * elapsedTime);
  }
  if (mesh.position.z > 1) {
    mesh.translateZ(-0.08 * elapsedTime);
  }
  const target = mesh.position.clone();
  camera.lookAt(mesh.position);
  target.z += 2;
  target.y += 1.5;

  camera.position.lerp(target, elapsedTime * 0.01);

  // render * 0.01
  renderer.render(scene, camera);
  // loop
  window.requestAnimationFrame(loop);
};
planet(30, 10, -400);
ring(0, 2, -60);
createFloor();
loop();
