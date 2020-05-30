import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Color,
  Vector2,
  AmbientLight,
  Vector3,
  PointLight,
  GridHelper
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
    this.camera = new PerspectiveCamera(100, 1, 0.1, 1000);
    this.scene = new Scene();

    // Load renderer from store or create a new one.
    if (state.renderer) {
      this.renderer = state.renderer;
    } else {
      this.renderer = new WebGLRenderer({
        antialias: true
      });
      mutations.setRenderer(this.renderer);
    }

    // Append the renderer to the dom.
    this.container.appendChild(this.renderer.domElement);

    // Configure controls.
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.maxPolarAngle = Math.PI / 2;
    this.camera.position.set(15, 20, 25);
    this.controls.target = new Vector3(0, 0.1, 0);
    this.controls.update();

    // Init scene.
    this.initScene();
    this.setCallbacks();
  }
  initScene() {
    this.scene.background = new Color('#fff');
    this.camera.add(new PointLight(0xffffff, 0.5, 100));
    this.scene.add(this.camera);
    this.scene.add(new AmbientLight(0xffffff, 0.5));
    this.scene.add(new GridHelper(100, 100, 0xececec, 0xececec));
  }
  setCallbacks() {
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize, false);
    this.onWindowResize(true);
  }
  clearCallbacks() {
    window.removeEventListener('resize', this.onWindowResize, false);
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
