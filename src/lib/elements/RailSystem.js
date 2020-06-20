import { Object3D, Color } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { disposeRecursive } from '@/lib/utils';

export default class RailSystem extends Object3D {
  constructor() {
    super();
    this.models = [];
    this.car = null;
    this.rail = null;
    this.sensor = null;
    this.stopper = null;
    var loader = new GLTFLoader().setPath('models/main/');
    loader.load('rails/rails.gltf', this.loadRail.bind(this));
    loader.load('car/car.gltf', this.loadCar.bind(this));
    loader.load('sensor/sensor.gltf', this.loadSensor.bind(this));
    loader.load('stopper/stopper.gltf', this.loadStopper.bind(this));
  }
  preprocess({ scene }) {
    scene.scale.multiplyScalar(1 / 10);
    scene.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return scene;
  }
  loadRail(model) {
    this.rail = this.preprocess(model);
    this.rail.rotation.y = Math.PI / 2;
    this.rail.position.x = -50;
    this.add(this.rail);
  }
  loadCar(model) {
    this.car = this.preprocess(model);
    this.car.children[4].material.color = new Color('#aadd00');
    this.add(this.car);
  }
  loadSensor(model) {
    this.sensor = this.preprocess(model);
    this.sensor.rotation.y = Math.PI;
    this.sensor.position.x = -48;
    this.add(this.sensor);
  }
  loadStopper(model) {
    this.stopper = this.preprocess(model);
    this.stopper.rotation.y = Math.PI / 2;
    this.stopper.position.x = 50 - 0.5;
    this.add(this.stopper);
  }
  setInclination(angle) {
    this.rotation.z = (angle * Math.PI) / 180;
    this.position.y = 50 * Math.sin(-this.rotation.z);
    this.position.x = 50 - 50 * Math.cos(-this.rotation.z);
  }
  destroy() {
    disposeRecursive(this);
    this.car = null;
    this.rail = null;
    this.sensor = null;
    this.stopper = null;
  }
}
