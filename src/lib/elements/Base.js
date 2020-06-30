import { Object3D } from 'three';
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
    this.elements = elements;
    this.loader = new GLTFLoader().setPath('models/main/');
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
    this.add(...objs);
  }
  loadAll() {
    return Promise.all(this.elements.map(elements => this.loadOne(elements)));
  }
  loadOne(path) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        obj => resolve(preprocessGltf(obj)),
        undefined,
        reject
      );
    });
  }
  dispose() {
    this.loaded = false;
    disposeRecursive(this);
  }
}
