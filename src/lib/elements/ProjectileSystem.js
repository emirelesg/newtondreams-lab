import BaseSystem from './Base';
import {
  MeshPhongMaterial,
  Color,
  Mesh,
  SphereBufferGeometry,
  BufferGeometry,
  LineBasicMaterial,
  Line,
  BufferAttribute,
  Group,
  PlaneBufferGeometry
} from 'three';

import colors from 'vuetify/lib/util/colors';

export default class ProjectileSystem extends BaseSystem {
  constructor() {
    super(['cannon/cannon.gltf', 'cannon/cannon-body.gltf']);
    this.cannon = null;
    this.cannonBody = null;

    // Path.s
    this.path = new Line(
      new BufferGeometry(),
      new LineBasicMaterial({ color: colors.pink.accent4 })
    );
    this.path.geometry.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(3 * 75), 3)
    );

    // Projectile.
    this.projectile = new Mesh(
      new SphereBufferGeometry(1.5, 15, 15),
      new MeshPhongMaterial({
        color: new Color('#aaaaaa')
      })
    );

    // Ruler.
    this.ruler = new Group();
    this.rulerMaterial = new MeshPhongMaterial({
      color: new Color('#777777')
    });
    this.ruler.position.y = -1.49;
    this.ruler.rotation.x = -Math.PI / 2;
    this.add(this.ruler);
    this.loadFont().then(this.drawRuler.bind(this));

    this.position.set(-35, -2.5, 0);
  }
  drawRuler() {
    for (let i = 2; i < 15; i += 1) {
      // Position where a tick will be drawn.
      const x = i * 5;

      // Create a text geometry and compute its bounding box to center it later.
      const textGeo = this.getTextGeo(`${x} cm`, { size: 0.9, height: 0 });

      // Build the meshes for the tick and geomtery.
      const tick = new Mesh(
        new PlaneBufferGeometry(0.2, 5),
        this.rulerMaterial
      );
      const text = new Mesh(
        new BufferGeometry().fromGeometry(textGeo),
        this.rulerMaterial
      );

      // Position text below tick. Also space ticks using the previously calculated
      // position.
      var textCenterOffset =
        -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
      tick.position.x = x - 0.1;
      text.position.x = tick.position.x + textCenterOffset;
      text.position.y = -4;

      this.ruler.add(tick, text);
    }
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
    this.rulerMaterial.dispose();
    this.rulerMaterial = null;
    this.ruler = null;
    this.cannon = null;
    this.cannonBody = null;
    this.projectile = null;
    this.path = null;
  }
}
