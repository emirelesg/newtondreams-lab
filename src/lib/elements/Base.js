import {
  Object3D,
  FontLoader,
  TextGeometry,
  BufferGeometry,
  Mesh,
  MeshPhongMaterial,
  Color
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { disposeRecursive } from '@/lib/utils';

function preprocessGltf({ scene }) {
  scene.scale.multiplyScalar(1 / 10);
  scene.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.castShadow = true;
  scene.receiveShadow = true;
  return scene;
}

export default class BaseSystem extends Object3D {
  constructor(elements) {
    super();
    this.loaded = false;
    this.elements = elements || [];
    this.font = null;
    this.loaderGLTF = new GLTFLoader().setPath('models/main/');
    this.loaderFont = new FontLoader().setPath('models/fonts/');
    this.colors = {
      lightGray: new MeshPhongMaterial({ color: new Color('#AAAAAA') }),
      gray: new MeshPhongMaterial({ color: new Color('#777777') }),
      darkGray: new MeshPhongMaterial({ color: new Color('#3a3a3a') })
    };
  }
  load() {
    return new Promise((resolve, reject) => {
      this.loadAll()
        .then(this.onLoad.bind(this))
        .then(() => {
          this.loaded = true;
        })
        .then(resolve)
        .catch(reject);
    });
  }
  onLoad(objs) {
    if (objs.length > 0) this.add(...objs);
  }
  loadAll() {
    return Promise.all(this.elements.map(elements => this.loadOne(elements)));
  }
  loadOne(path) {
    return new Promise((resolve, reject) => {
      this.loaderGLTF.load(
        path,
        obj => resolve(preprocessGltf(obj)),
        undefined,
        reject
      );
    });
  }
  loadFont() {
    return new Promise((resolve, reject) => {
      this.loaderFont.load(
        'helvetiker_regular.typeface.json',
        font => {
          this.font = font;
          return resolve(true);
        },
        undefined,
        reject
      );
    });
  }
  getTextGeo(text, opts) {
    if (!this.font) return undefined;
    const textGeo = new TextGeometry(text, {
      font: this.font,
      ...opts
    });
    textGeo.computeBoundingBox();
    return textGeo;
  }
  getText(text, opts, material, align) {
    if (!this.font) return undefined;
    const textGeo = this.getTextGeo(text, {
      size: 1,
      height: 0,
      curveSegments: 1,
      ...opts
    });
    const textObj = new Mesh(
      new BufferGeometry().fromGeometry(textGeo),
      material
    );
    let centerX =
      -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
    let centerY =
      -0.5 * (textGeo.boundingBox.max.y - textGeo.boundingBox.min.y);
    textObj.position.set(align === 'left' ? 0 : centerX, centerY, 0);
    return textObj;
  }
  dispose(obj) {
    this.loaded = false;
    Object.keys(this.colors).forEach(key => {
      this.colors[key].dispose();
      this.colors[key] = null;
    });
    this.colors = {};
    disposeRecursive(obj || this);
    this.font = null;
  }
}
