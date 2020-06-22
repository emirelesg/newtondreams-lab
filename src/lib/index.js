import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Color,
  Fog,
  Vector2,
  HemisphereLight,
  SpotLight,
  PlaneBufferGeometry,
  MeshPhongMaterial,
  Mesh,
  PCFSoftShadowMap,
  // AmbientLight,
  Vector3
  // PointLight,
  // GridHelper
} from 'three';
import { state, mutations } from '@/store/index';
import { disposeRecursive } from '@/lib/utils';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class App {
  constructor(container, opts) {
    this.opts = {};
    Object.assign(this.opts, opts);
    this.container = container;
    this.size = new Vector2();
    this.camera = new PerspectiveCamera(20, 1, 0.1, 1000);
    this.scene = new Scene();

    // Load renderer from store or create a new one.
    if (state.renderer) {
      this.renderer = state.renderer;
    } else {
      this.renderer = new WebGLRenderer({
        antialias: true
      });
      this.renderer.shadowMap.type = PCFSoftShadowMap;
      this.renderer.shadowMap.enabled = true;
      mutations.setRenderer(this.renderer);
    }

    // Append the renderer to the dom.
    this.container.appendChild(this.renderer.domElement);

    // Configure controls.
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;

    this.controls.enablePan = false;
    this.controls.screenSpacePanning = false;

    // Limit the rotation of the horizontal (-x) axis to 90 deg.
    this.controls.maxPolarAngle = Math.PI / 2;

    // // Limit the rotation on the vertical (-y) axis to 180 deg.
    // this.controls.maxAzimuthAngle = Math.PI / 2;
    // this.controls.minAzimuthAngle = -Math.PI / 2;

    // // Limit the amount fo zoom.
    this.controls.minDistance = 100;
    this.controls.maxDistance = 250;

    // Init scene.
    this.home();
    this.initScene();
    this.setCallbacks();
  }
  initScene() {
    // this.scene.background = new THREE.Color('#444');
    this.scene.background = new Color('#F5F7FA');

    // Fog mixes the floor with the background.
    this.scene.fog = new Fog(this.scene.background, 250, 400);

    // Lights up the scene globally.
    const hemiLight = new HemisphereLight(
      new Color('#ffffff'),
      new Color('#242424'),
      0.75
    );
    hemiLight.position.set(0, 50, 0);

    // const ambientLight = new THREE.AmbientLight(new THREE.Color('#ffffff'), 0);

    // Spotlight lights up the scene from the from.
    const spotLight = new SpotLight(new Color('#ffffff'), 0.5);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0000001;
    spotLight.shadow.mapSize.width = 1024 * 4;
    spotLight.shadow.mapSize.height = 1024 * 4;
    spotLight.position.set(0, 150, this.controls.maxDistance);

    // The floor receives shadows. Gives sense of depth.
    const floor = new Mesh(
      new PlaneBufferGeometry(500, 500),
      new MeshPhongMaterial({ color: this.scene.background })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4;
    floor.receiveShadow = true;
    this.scene.add(floor);

    this.scene.add(spotLight, hemiLight);
  }
  setCallbacks() {
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize, false);
    this.onWindowResize(true);
  }
  clearCallbacks() {
    window.removeEventListener('resize', this.onWindowResize, false);
  }
  home() {
    this.camera.position.set(0, 40, 150);
    this.controls.target = new Vector3(0, 0, 0);
    this.camera.lookAt(0, 0, 0);
    this.controls.update();
  }
  zoom(scale) {
    let pos = this.camera.position.clone();
    let length = pos.length();
    pos.normalize().multiplyScalar(length * scale);
    this.camera.position.copy(pos);
    this.camera.updateProjectionMatrix();
    this.controls.update();
  }
  handleControls(action) {
    switch (action) {
      case 'zoomIn':
        this.zoom(0.9);
        break;
      case 'zoomOut':
        this.zoom(1.1);
        break;
      case 'home':
        this.home();
        break;
    }
  }
  destroy() {
    // Clear all objects in the scene.
    this.scene.children.forEach(disposeRecursive);

    // Clear as soon as possible all callbacks.
    this.clearCallbacks();
    this.controls.dispose();

    // Remove all links to the outside.
    this.container.removeChild(this.renderer.domElement);
    this.opts.onRender = null;
    this.container = null;

    // Clear camera, scene, and renderer.
    this.camera = null;
    this.scene.dispose();
    this.scene = null;
    this.renderer.setAnimationLoop(null);
    this.renderer = null;
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  onWindowResize(force) {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (force || this.size.x !== width || this.size.y !== height) {
      this.size.set(width, height);
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }
}

export default App;
