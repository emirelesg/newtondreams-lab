import BaseSystem from './Base';
import {
  Vector3,
  MeshPhongMaterial,
  Color,
  Mesh,
  SphereBufferGeometry
} from 'three';

export default class ProjectileSystem extends BaseSystem {
  constructor() {
    super(['cannon/cannon.gltf', 'cannon/cannon-body.gltf']);
    this.offset = new Vector3(-50 - 0.75, 5.25, 0);
    this.cannon = null;
    this.cannonBody = null;
    this.projectile = new Mesh(
      new SphereBufferGeometry(1.5, 10, 10),
      new MeshPhongMaterial({
        color: new Color('#aaa')
      })
    );
    this.position.y = -2.5;
  }
  setInclination(angle) {
    const theta = (angle * Math.PI) / 180;
    this.cannonBody.rotation.z = theta;
  }
  onLoad([cannon, cannonBody]) {
    // Cannon body.
    this.cannonBody = cannonBody;
    this.cannonBody.position.copy(this.offset);

    // Cannon.
    this.cannon = cannon;
    this.cannon.rotation.x = -Math.PI / 2;
    this.cannon.position.x = -50;

    // Projectile.
    this.projectile.castShadow = true;
    this.projectile.receiveShadow = true;
    this.projectile.position.copy(this.offset);

    this.add(this.cannon, this.cannonBody, this.projectile);
  }
  destroy() {
    this.dispose();
    this.cannon = null;
    this.cannonBody = null;
    this.projectile = null;
  }
}
