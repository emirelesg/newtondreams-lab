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
  Vector3,
  Raycaster
} from 'three';
import { state, mutations } from '@/store/index';
import { disposeRecursive } from '@/lib/utils';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class App {
  constructor(container, opts) {
    this.opts = {
      onMousemove: null,
      onMouseup: null,
      onMousedown: null,
      onResize: null,
      onClick: null
    };
    Object.assign(this.opts, opts);

    this.windowEvents = ['resize', 'orientationchange'];
    this.events = ['mousedown', 'mouseup', 'mousemove', 'touchstart', 'click'];

    this.container = container;
    this.size = new Vector2();
    this.camera = new PerspectiveCamera(20, 1, 0.1, 1000);
    this.scene = new Scene();

    this.raycaster = new Raycaster();

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
    this.controls.dampingFactor = 0.2;

    this.controls.enablePan = false;
    this.controls.screenSpacePanning = false;

    // Limit the rotation of the horizontal (-x) axis to 90 deg.
    this.controls.maxPolarAngle = Math.PI / 2;

    // // Limit the rotation on the vertical (-y) axis to 180 deg.
    // this.controls.maxAzimuthAngle = Math.PI / 2;
    // this.controls.minAzimuthAngle = -Math.PI / 2;

    // // Limit the amount fo zoom.
    this.controls.minDistance = 70;
    this.controls.maxDistance = 275;

    this.mouse = {
      pos: new Vector2(),
      forRaycasting: new Vector2(),
      isDown: false
    };

    this.floor = new Mesh(
      new PlaneBufferGeometry(500, 500),
      new MeshPhongMaterial()
    );

    // Init scene.
    this.home();
    this.initScene();
    this.setCallbacks();
  }
  initScene() {
    this.scene.background = new Color('#F5F7FA');
    this.scene.fog = new Fog(
      this.scene.background,
      this.controls.maxDistance,
      this.controls.maxDistance * 1.7
    );

    // Lights up the scene globally.
    const hemiLight = new HemisphereLight(
      new Color('#ffffff'),
      new Color('#242424'),
      0.75
    );
    hemiLight.position.set(0, 50, 0);

    // Spotlight lights up the scene from the from.
    const spotLight = new SpotLight(new Color('#ffffff'), 0.5);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0000001;
    spotLight.shadow.mapSize.width = 1024 * 4;
    spotLight.shadow.mapSize.height = 1024 * 4;
    spotLight.position.set(0, 150, this.controls.maxDistance);

    // The floor receives shadows. Gives sense of depth.
    this.floor.material.color = this.scene.background;
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -4;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    this.scene.add(spotLight, hemiLight);
  }
  setCallbacks() {
    this.windowEvents.forEach(e => {
      this[e] = this[e].bind(this);
      window.addEventListener(e, this[e], false);
    });
    this.events.forEach(e => {
      this[e] = this[e].bind(this);
      this.renderer.domElement.addEventListener(e, this[e]);
    });
    this.resize(true);
  }
  clearCallbacks() {
    this.windowEvents.forEach(e => {
      window.removeEventListener(e, this[e]);
    });
    this.events.forEach(e => {
      this.renderer.domElement.removeEventListener(e, this[e]);
    });
    Object.keys(this.opts).forEach(key => {
      this.opts[key] = null;
    });
  }
  home() {
    this.camera.position.set(0, 40, 200);
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
    this.floor = null;

    // Clear as soon as possible all callbacks.
    this.clearCallbacks();
    this.controls.dispose();

    // Remove all links to the outside.
    this.container.removeChild(this.renderer.domElement);
    this.container = null;

    // Clear camera, scene, and renderer.
    this.raycaster = null;
    this.camera = null;
    this.scene.dispose();
    this.scene = null;
    this.renderer.setAnimationLoop(null);
    this.renderer = null;
  }
  setMousePosition({ target, clientX, clientY }) {
    var rect = target.getBoundingClientRect();
    this.mouse.pos.set(clientX - rect.left, clientY - rect.top);
    this.mouse.forRaycasting.set(
      (this.mouse.pos.x / (target.width / window.devicePixelRatio)) * 2 - 1,
      (-this.mouse.pos.y / (target.height / window.devicePixelRatio)) * 2 + 1
    );
    this.raycaster.setFromCamera(this.mouse.forRaycasting, this.camera);
  }
  exec(f, ...args) {
    if (f && typeof f === 'function') f(...args);
  }
  resize(force) {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (force || this.size.x !== width || this.size.y !== height) {
      this.size.set(width, height);
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
    this.exec(this.opts.onResize);
  }
  orientationchange() {
    this.resize();
  }
  mousemove(e) {
    this.setMousePosition(e);
    this.exec(this.opts.onMousemove);
  }
  mousedown(e) {
    this.setMousePosition(e);
    this.mouse.isDown = true;
    this.exec(this.opts.onMousedown);
  }
  mouseup(e) {
    this.setMousePosition(e);
    this.mouse.isDown = false;
    this.exec(this.opts.onMouseup);
  }
  touchstart(e) {
    if (e.targetTouches) {
      e.preventDefault();
      this.setMousePosition(e.targetTouches[0]);
      this.exec(this.opts.onClick, true);
    }
  }
  click(e) {
    this.setMousePosition(e);
    this.exec(this.opts.onClick);
  }
}

export default App;
