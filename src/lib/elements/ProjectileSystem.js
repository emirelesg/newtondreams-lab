import BaseSystem from './Base';
import {
  MeshPhongMaterial,
  Color,
  Mesh,
  SphereBufferGeometry,
  BufferGeometry,
  LineBasicMaterial,
  Line,
  BufferAttribute
} from 'three';
import colors from 'vuetify/lib/util/colors';

export default class ProjectileSystem extends BaseSystem {
  constructor() {
    super(['cannon/cannon.gltf', 'cannon/cannon-body.gltf']);
    this.cannon = null;
    this.cannonBody = null;
    this.pathGeometry = new BufferGeometry();
    this.path = new Line(
      new BufferGeometry(),
      new LineBasicMaterial({ color: colors.pink.accent4 })
    );
    this.path.geometry.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(3 * 75), 3)
    );
    this.projectile = new Mesh(
      new SphereBufferGeometry(1.5, 15, 15),
      new MeshPhongMaterial({
        color: new Color('#aaaaaa')
      })
    );
    this.position.set(-50, -2.5, 0);
  }
  setPath(data) {
    data.forEach(({ x, y }, i) => {
      this.path.geometry.attributes.position.setXYZ(i, x * 100, y * 100, 0);
    });
    this.path.geometry.setDrawRange(0, data.length);
    this.path.geometry.attributes.position.needsUpdate = true;
  }
  setPathDisplayLimit(i) {
    this.path.geometry.setDrawRange(0, i);
  }
  setInclination(angle) {
    const theta = (angle * Math.PI) / 180;
    this.cannonBody.rotation.z = theta;
  }
  onLoad([cannon, cannonBody]) {
    // Cannon body.
    this.cannonBody = cannonBody;
    this.cannonBody.position.set(-0.75, 5.25, 0);

    // Cannon.
    this.cannon = cannon;
    this.cannon.rotation.x = -Math.PI / 2;

    // Projectile.
    this.projectile.castShadow = true;
    this.projectile.receiveShadow = true;

    this.add(this.cannon, this.cannonBody, this.projectile, this.path);
  }
  destroy() {
    this.dispose();
    this.cannon = null;
    this.cannonBody = null;
    this.projectile = null;
    this.path = null;
  }
}
