import Base from './Base.js';
import { Mesh, CylinderBufferGeometry, MeshPhongMaterial, Color } from 'three';

export default class ApparentWeight extends Base {
  constructor() {
    super(['cup/cup-body.gltf']);
    this.cup = null;

    // Water.
    this.water = new Mesh(
      new CylinderBufferGeometry(3.65, 3.65, 4, 20),
      this.colors.water
    );
    this.water.renderOrder = 0;

    // Weight.
    this.weight = new Mesh(
      new CylinderBufferGeometry(1, 1, 2.5, 15),
      new MeshPhongMaterial({ color: new Color('#ff0000') })
    );
    this.weight.receiveShadow = true;
    this.weight.castShadow = true;

    this.add(this.water, this.weight);

    this.weight.position.y = 7;
    this.water.position.y = this.water.geometry.parameters.height / 2 + 0.3;
    this.position.y = -4;
  }
  setWaterHeight(h) {
    // Update the vertices of the geometry to the new height.
    // Only change the height of the vertices that are in the top face. All
    // vertices that have a positive height are found in the top face.
    const geo = this.water.geometry;
    for (let i = 0; i < geo.attributes.position.count; i += 1) {
      if (geo.attributes.position.getY(i) > 0) {
        this.water.geometry.attributes.position.setY(
          i,
          geo.parameters.height / 2 + h
        );
      }
    }
    this.water.geometry.attributes.position.needsUpdate = true;
  }
  onLoad([cup]) {
    // Cup.
    this.cup = cup;
    this.cup.rotation.x = -Math.PI / 2;
    this.cup.traverse(obj => {
      if (obj.isMesh) {
        obj.renderOrder = 1;
        obj.material.transparent = true;
        obj.material.opacity = 0.5;
      }
    });
    this.add(this.cup);
  }
  destroy() {
    this.cup = null;
    this.water = null;
    this.dispose();
  }
}
