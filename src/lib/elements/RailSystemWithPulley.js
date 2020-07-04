import {
  Line,
  BufferGeometry,
  LineBasicMaterial,
  Color,
  Vector3,
  Matrix4,
  BufferAttribute,
  Mesh,
  CylinderBufferGeometry,
  MeshPhongMaterial
} from 'three';
import colors from 'vuetify/lib/util/colors';
import BaseSystem from './Base';

export default class RailSystemWithPulley extends BaseSystem {
  constructor() {
    super([
      'rails/rails-700.gltf',
      'car/car.gltf',
      'sensor/sensor.gltf',
      'pulley/pulley.gltf'
    ]);

    // Dimensions.
    this.pulleyPos = new Vector3(36, 0, 14);
    this.ROPE_HEIGHT = 2.8;
    this.PULLEY_WHEEL_TOP_X = 35 - 2 + 1.2 + 2.4;
    this.PULLEY_WHEEL_INNER_R = 1.4;
    this.PULLEY_WHEEL_OUTER_R = 1.5;

    // GLTF objects.
    this.car = null;
    this.rail = null;
    this.sensor = null;
    this.pulley = null;

    // Init weight.
    this.weight = new Mesh(
      new CylinderBufferGeometry(1, 1, 2, 10),
      new MeshPhongMaterial({ color: colors.red.base })
    );
    this.weight.position.x =
      this.PULLEY_WHEEL_TOP_X + this.PULLEY_WHEEL_INNER_R;
    this.weight.castShadow = true;
    this.weight.receiveShadow = true;

    // Init rope.
    this.rope = new Line(
      new BufferGeometry(),
      new LineBasicMaterial({ color: new Color('#242424') })
    );
    this.rope.geometry.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(3 * 10), 3)
    );
    // Wrap rope around pulley.
    for (let i = 0; i < 8; i += 1) {
      const theta = (Math.PI / 2) * (1 - i / 8);
      const x =
        this.PULLEY_WHEEL_TOP_X + this.PULLEY_WHEEL_OUTER_R * Math.cos(theta);
      const y =
        this.ROPE_HEIGHT -
        this.PULLEY_WHEEL_INNER_R +
        this.PULLEY_WHEEL_OUTER_R * Math.sin(theta);
      this.rope.geometry.attributes.position.setXYZ(i + 1, x, y, 0);
    }

    this.add(this.rope, this.weight);
  }
  updatePulley() {
    // Rotate wheel proportional to the amount the rope has moved.
    const wheel = this.getPulleyWheel();
    const angle =
      -(this.weight.position.y + 1) / (2 * Math.PI * this.PULLEY_WHEEL_INNER_R);
    wheel.rotation.set(0, 0, 0);
    wheel.position.set(0, 0, 0);
    wheel.position.sub(this.pulleyPos);
    wheel.applyMatrix4(new Matrix4().makeRotationY(angle));
    wheel.position.add(this.pulleyPos);
    this.rope.geometry.attributes.position.setXYZ(
      0,
      this.car.position.x - 2,
      this.ROPE_HEIGHT,
      0
    );
    this.rope.geometry.attributes.position.setXYZ(
      9,
      this.weight.position.x,
      this.weight.position.y,
      0
    );
    this.rope.geometry.attributes.position.needsUpdate = true;
    this.rope.visible = true;
  }
  onLoad([rail, car, sensor, pulley]) {
    // Rail.
    this.rail = rail;
    this.rail.rotation.y = Math.PI / 2;
    this.rail.position.x = -35;

    // Car.
    this.car = car;

    // Sensor.
    this.sensor = sensor;
    this.sensor.rotation.y = Math.PI;
    this.sensor.position.x = -35 + 2;

    // Pulley.
    this.pulley = pulley;
    this.pulley.rotation.x = -Math.PI / 2;
    this.pulley.position.y = 0.2;
    this.pulley.position.x = 35 - 2;
    const wheel = this.getPulleyWheel();
    wheel.receiveShadow = false;
    wheel.castShadow = false;

    this.add(this.rail, this.car, this.sensor, this.pulley);
  }
  getPulleyWheel() {
    return this.pulley.children.find(obj => obj.name === 'b_pulley_wheel_001_');
  }
  setCarColor(color) {
    const carBody = this.car.children.find(
      obj => obj.name === 'b_car_body_001_'
    );
    carBody.material.color.set(color);
  }
  setInclination(angle) {
    this.rotation.z = (angle * Math.PI) / 180;
    this.position.y = 35 * Math.sin(-this.rotation.z);
    this.position.x = 35 - 35 * Math.cos(-this.rotation.z);
  }
  destroy() {
    this.dispose();
    this.rope = null;
    this.car = null;
    this.rail = null;
    this.sensor = null;
    this.weight = null;
    this.pulley = null;
  }
}
