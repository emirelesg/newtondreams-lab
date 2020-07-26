import Base from './Base.js';
import {
  Mesh,
  CylinderBufferGeometry,
  PlaneBufferGeometry,
  MeshPhongMaterial,
  Color,
  Group
} from 'three';

export default class ApparentWeightSystem extends Base {
  constructor() {
    super(['cup/cup-body.gltf', 'dynamometer/dynamometer.gltf']);
    this.cup = null;

    // Important dimensions.
    this.waterHeight = 5;
    this.weightHeight = 2.5;
    this.cupThickness = 0.3;
    this.gramsToUnits = 1 / 10;

    // The dyn group contains the complete dynamometer assembly.
    // It is composed of two groups (dynLabels and dynModel) and the weight model.
    // In this way, setting the y position changes all of childrens' position.
    // At y = 0, the weight is lays at floor level.
    this.dyn = new Group();
    this.dynLabels = new Group();
    this.dynModel = null;

    // Water. The water must be rendered before the cup for transparency to work.
    this.water = new Mesh(
      new CylinderBufferGeometry(3.65, 3.65, this.waterHeight, 20),
      this.colors.water
    );
    this.water.renderOrder = 0;

    // Weight. The
    this.weight = new Mesh(
      new CylinderBufferGeometry(1, 1, this.weightHeight, 15),
      new MeshPhongMaterial({ color: new Color('#ff0000') })
    );
    this.weight.receiveShadow = true;
    this.weight.castShadow = true;

    // Finally load font.
    this.loadFont().then(this.onFontLoad.bind(this));

    this.dyn.add(this.weight);
    this.add(this.water, this.dyn);

    // The weight is offset by half its height.
    this.weight.position.y += this.weightHeight / 2;

    // Offset water by half its height plus and the cup's thickness.
    this.water.position.y = this.waterHeight / 2 + this.cupThickness;

    // Move everything to floor level.
    this.position.y = -4;
  }
  setDynWeight(g) {
    const h = g * this.gramsToUnits;

    // Move the indicator and hooks down by the previously calculated amount.
    const parts = [
      'b_dyn_hook_small_001_',
      'b_dyn_hook_001_',
      'b_dyn_indicator_001_'
    ];
    this.dynModel.children
      .filter(obj => parts.indexOf(obj.name) > -1)
      .forEach(obj => {
        obj.position.z = -h * 10;
      });

    // Shift up the model by the same amount parts moved down. This fixes the weight
    // in the same position while everything else shifts up or down.
    // 3 is the default space beween hooks.
    this.dynModel.position.y = h + 3 + this.weightHeight;

    // Shift the text up by the same ammount.
    // this.dynLabels.position.y = this.dynModel.position.y + 9.5;
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
  onFontLoad() {
    // Create the title for the dynamometer.
    const units = this.getText(
      'Gramos',
      { size: 0.5 },
      this.colors.darkGray,
      'center'
    );
    units.position.y += 1;
    units.position.z += 0.5;
    this.dynLabels.add(units);

    // Create ticks and labels.
    for (let g = 0; g <= 80; g += 2) {
      const h = g * this.gramsToUnits;
      let tick = null;

      if (g % 10 === 0) {
        // Every 10 grams write the number and a wider tick.
        tick = new Mesh(
          new PlaneBufferGeometry(0.5, 0.05),
          this.colors.darkGray
        );
        const text = this.getText(
          `${g}`,
          { size: 0.6 },
          this.colors.gray,
          'left'
        );
        text.position.y -= h;
        text.position.x += 0.75;
        text.position.z += 0.5;
        this.dynLabels.add(text);
        tick.position.set(0, -h, 0.5);
      } else {
        // Smaller tick for the smaller increments.
        tick = new Mesh(new PlaneBufferGeometry(0.3, 0.05), this.colors.gray);
        tick.position.set(-0.1, -h, 0.5);
      }
      this.dynLabels.add(tick);
    }
    this.dynLabels.rotation.x += Math.PI / 2;
    this.dynLabels.scale.multiplyScalar(10);
    this.dynLabels.position.set(0, 0, 95);
  }
  onLoad([cup, dynamometer]) {
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

    // Dynamometer.
    this.dynModel = dynamometer;
    this.dynModel.rotation.x = -Math.PI / 2;

    // Remove shadows from the indicator and body.
    const indicator = this.dynModel.children.find(
      obj => obj.name === 'b_dyn_indicator_001_'
    );
    indicator.castShadow = false;
    indicator.receiveShadow = false;
    const body = this.dynModel.children.find(
      obj => obj.name === 'b_dyn_body_001_'
    );
    body.receiveShadow = false;

    // Create the hole where the indicator is supposed to slide.
    const bg = new Mesh(new PlaneBufferGeometry(2, 85), this.colors.darkGray);
    bg.rotation.x = Math.PI / 2;
    bg.position.set(-10, -7.5 + 2.5, 95 - 85 / 2 + 5 / 2);

    this.dyn.add(this.dynModel);
    this.dynModel.add(bg, this.dynLabels);
    this.add(this.cup);
  }
  destroy() {
    this.cup = null;
    this.water = null;
    this.dispose();
  }
}
