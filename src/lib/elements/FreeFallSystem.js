import Base from '@/lib/elements/Base';
import { Mesh, SphereBufferGeometry } from 'three';
import { constain } from '@/lib/utils.js';

export default class FreeFallSystem extends Base {
  constructor() {
    super(['gripper/gripper.gltf']);
    this.gripper = null;

    // Projectile.
    this.projectile = new Mesh(
      new SphereBufferGeometry(1.5, 15, 15),
      this.colors.lightGray
    );
    this.projectile.visible = false;
    this.projectile.castShadow = true;
    this.projectile.receiveShadow = true;
    this.add(this.projectile);

    // Floor is at -4 by default. Move the model to the floor and add the diameter of the sphere.
    // 0.3 cm are the thickness of the bottom plate.
    this.position.y = -4 + 0.3;
  }
  updateHeight(h) {
    const scaledH = h * 10;
    const elements = [
      'b_gripper_horizonal_rod_001_',
      'b_gripper_body_001_',
      'b_gripper_connector_block_001_',
      'b_gripper_arm_001_',
      'b_gripper_arm_001_001'
    ];
    this.gripper.children
      .filter(obj => elements.indexOf(obj.name) > -1)
      .forEach(obj => {
        obj.position.z = scaledH;
      });
  }
  gripperOpenPercent(k) {
    const girpperArmLeft = this.gripper.children.find(
      obj => obj.name === 'b_gripper_arm_001_'
    );
    const girpperArmRight = this.gripper.children.find(
      obj => obj.name === 'b_gripper_arm_001_001'
    );
    let percent = constain(k, 0, 1);
    girpperArmLeft.position.x = -5 * percent;
    girpperArmRight.position.x = 5 * percent;
  }
  onLoad([gripper]) {
    this.gripper = gripper;
    this.gripper.rotation.x = -Math.PI / 2;
    this.projectile.visible = true;
    this.add(this.gripper);
  }
  destroy() {
    this.dispose();
    this.gripper = null;
    this.projectile = null;
  }
}
