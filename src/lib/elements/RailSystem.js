import BaseSystem from './Base';

export default class RailSystem extends BaseSystem {
  constructor() {
    super([
      'rails/rails.gltf',
      'car/car.gltf',
      'sensor/sensor.gltf',
      'stopper/stopper.gltf'
    ]);
    this.car = null;
    this.rail = null;
    this.sensor = null;
    this.stopper = null;
  }
  onLoad([rail, car, sensor, stopper]) {
    // Rail.
    this.rail = rail;
    this.rail.rotation.y = Math.PI / 2;
    this.rail.position.x = -50;

    // Car.
    this.car = car;

    // Sensor.
    this.sensor = sensor;
    this.sensor.rotation.y = Math.PI;
    this.sensor.position.x = -48;

    // Stopper.
    this.stopper = stopper;
    this.stopper.rotation.y = Math.PI / 2;
    this.stopper.position.x = 50 - 0.5;

    this.add(this.rail, this.car, this.sensor, this.stopper);
  }
  setCarColor(color) {
    const carBody = this.car.children.find(
      obj => obj.name === 'b_car_body_001_'
    );
    carBody.material.color.set(color);
  }
  setInclination(angle) {
    this.rotation.z = (angle * Math.PI) / 180;
    this.position.y = 50 * Math.sin(-this.rotation.z);
    this.position.x = 50 - 50 * Math.cos(-this.rotation.z);
  }
  destroy() {
    this.car = null;
    this.rail = null;
    this.sensor = null;
    this.stopper = null;
    this.dispose();
  }
}
