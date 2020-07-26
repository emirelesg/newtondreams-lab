import Base from './Base.js';
import {
  Mesh,
  CylinderBufferGeometry,
  MeshPhongMaterial,
  Color,
  Group
} from 'three';

export default class PendulumSystem extends Base {
  constructor() {
    super(['pendulum/pendulum.gltf']);
    this.base = null;

    // Group that contains the rodRef and weightRef.
    this.rod = new Group();
    this.rodRef = null;
    this.weightRef = new Mesh(
      new CylinderBufferGeometry(1, 1, 2, 10),
      new MeshPhongMaterial({
        color: new Color('#CDB06A')
      })
    );
    this.weightRef.visible = false;
    this.weightRef.castShadow = true;
    this.weightRef.receiveShadow = true;
    this.rod.add(this.weightRef);
    this.add(this.rod);

    // Floor is at -4 by default. Move the model to the floor and add the diameter of the sphere.
    // 0.3 cm are the thickness of the bottom plate.
    this.position.y = -4 + 0.3;
  }
  setHeight(h) {
    // Remove the previous rod if it exists.
    if (this.rodRef) {
      this.rod.remove(this.rodRef);
      this.rodRef.material.dispose();
      this.rodRef.geometry.dispose();
      this.rodRef = null;
    }

    // Create a new rod and add it to the group.
    // Also extend the rod by 2 so that it comes out of the support. The position must
    // be shifted by half this amount.
    this.rodRef = new Mesh(
      new CylinderBufferGeometry(0.25, 0.25, h + 2, 15),
      new MeshPhongMaterial({ color: new Color('#cccccc') })
    );
    this.rodRef.castShadow = true;
    this.rodRef.receiveShadow = true;
    this.rod.add(this.rodRef);

    // The rod position (group) is centered at the rotation point. Thereby all of its
    // children will rotate around this point.
    this.rod.position.y = 4 + h;

    // Shift the rod by half its height down and add half of the extended amount.
    // Shift weight by the rod's height down.
    this.rodRef.position.y = -h / 2 + 1;
    this.weightRef.position.y = -h;

    // Move elements from the base to the desired height.
    const elements = [
      'b_gripper_horizonal_rod_001_',
      'b_pendulum_rotation_body_001_',
      'b_gripper_connector_block_001_'
    ];
    this.base.children
      .filter(obj => elements.indexOf(obj.name) > -1)
      .forEach(obj => {
        obj.position.z = h * 10;
      });
  }
  onLoad([base]) {
    // Base.
    this.base = base;
    this.base.rotation.x = -Math.PI / 2;
    this.weightRef.visible = true;
    this.add(this.base);
  }
  destroy() {
    this.base = null;
    this.rodRef = null;
    this.weightRef = null;
    this.dispose(this.rod);
    this.rod = null;
    this.dispose();
  }
}
