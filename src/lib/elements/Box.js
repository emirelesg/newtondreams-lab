import { Object3D, Color } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { disposeRecursive } from '@/lib/utils';

class Box extends Object3D {
  constructor() {
    super();

    this.car = null;
    this.rail = null;

    const self = this;
    var loader = new GLTFLoader().setPath('models/main/');
    loader.load('rails/rails.gltf', function({ scene }) {
      scene.scale.multiplyScalar(1 / 10);
      scene.rotation.y = Math.PI / 2;
      scene.position.x = -50;
      scene.traverse(function(child) {
        if (child.isMesh) {
          child.material.color = new Color('#bbbbbb');
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      self.rail = scene;
      self.add(scene);
    });

    loader.load('car/car.gltf', function({ scene }) {
      scene.scale.multiplyScalar(1 / 10);
      scene.position.y = 2;
      // scene.children[0].material.color = new Color('#ccc');
      // scene.children[3].material.color = new Color('#cccc00');
      scene.traverse(function(child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      self.car = scene;
      self.add(scene);
    });
  }
  destroy() {
    disposeRecursive(this);
    this.car = null;
    this.rail = null;
  }
}

export default Box;
