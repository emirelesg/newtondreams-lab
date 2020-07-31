import Base from './Base.js';
import Fire from '@/lib/fire.js';
import {
  Mesh,
  CylinderBufferGeometry,
  MeshPhongMaterial,
  Points,
  Group,
  PlaneBufferGeometry,
  Color,
  Vector3
} from 'three';

export default class ThermalExpansionSystem extends Base {
  constructor(app) {
    super(['heater/heater.gltf', 'gauge/gauge.gltf']);
    this.heater = null;
    this.gauge = null;
    this.gaugeText = null;
    this.gaugeValue = null;

    // App.
    this.appRef = app;
    this.onResize = this.onResize.bind(this);
    this.appRef.opts.onResize = this.onResize;

    // Position
    this.rodPos = new Vector3(-1, 4, 0);
    this.gaugePos = new Vector3(-19, 4, -1);

    // Rod.
    this.rod = new Mesh(
      new CylinderBufferGeometry(0.15, 0.15, 18, 15),
      new MeshPhongMaterial()
    );
    this.rod.castShadow = true;
    this.rod.receiveShadow = true;
    this.rod.position.copy(this.rodPos);
    this.rod.rotation.z = Math.PI / 2;

    // Fire.
    this.fires = new Group();
    const fireRadius = 0.1;
    const fireHeight = 3;
    const particleCount = 50;
    for (let i = 0; i < 9; i += 1) {
      this.fires.add(
        new Points(
          new Fire.Geometry(fireRadius, fireHeight, particleCount),
          new Fire.Material({ color: 0xff2200 })
        )
      );
      this.fires.children[i].position.x = -4 + i * 1;
    }
    this.fires.position.y = 2 + 0.75 / 2;
    this.fires.visible = false;
    this.rescaleFires();

    this.add(this.rod, this.fires);
    this.loadFont();

    // Move scene to the floor.
    this.position.y = -4;
    // Gauge-base is shifted 60 mm to the left, thereby shift it 60 here to the
    // right to center it horizontally.
    this.position.x = 6;
  }

  setGauge(value) {
    // Only set gauge if the font has loaded and the value has changed.
    if (this.font && this.gaugeValue !== value) {
      // Dipose the previous gaugeText safely.
      if (this.gaugeText) {
        this.gaugeText.geometry.dispose();
        this.gaugeText.material = '';
        this.remove(this.gaugeText);
        this.gaugeText = null;
      }

      // Update the gauge value and create new geometry.
      this.gaugeValue = value;
      this.gaugeText = this.getText(
        `${value} μm`,
        { size: 0.7 },
        this.colors.darkGray,
        'center'
      );
      this.gaugeText.position.add(this.gaugePos);
      this.gaugeText.position.y += 0.1;
      this.gaugeText.position.z += 3 - 0.3 + 0.05 * 2;
      this.add(this.gaugeText);
    }
  }

  onLoad([heater, gauge]) {
    // Heater.
    this.heater = heater;
    this.heater.rotation.x = -Math.PI / 2;
    this.heater.rotation.z = -Math.PI / 2;

    // Gauge.
    this.gauge = gauge;
    const gaugePanel = this.gauge.children.find(
      obj => obj.name === 'b_gauge_panel_001_'
    );
    const lcdPanel = new Mesh(
      new PlaneBufferGeometry(40, 18),
      new MeshPhongMaterial({ color: new Color('#CBCEA5') })
    );
    lcdPanel.position.z = 30 - 3 + 0.5;
    this.gauge.add(lcdPanel);
    gaugePanel.receiveShadow = false;
    gaugePanel.castShadow = false;
    this.gauge.position.copy(this.gaugePos);
    this.add(this.heater, this.gauge);
  }

  onResize() {
    this.rescaleFires();
  }

  updateFires(delta, opacity) {
    if (!this.fires.visible) this.fires.visible = true;
    this.fires.traverse(obj => {
      if (obj.material && obj.material.update) {
        obj.material.setOpacity(opacity);
        obj.material.update(delta);
      }
    });
  }

  rescaleFires() {
    this.fires.traverse(obj => {
      if (obj.material && obj.material.setPerspective) {
        obj.material.setPerspective(this.appRef.camera.fov, this.appRef.size.y);
      }
    });
  }

  destroy() {
    this.heater = null;
    this.gauge = null;
    this.appRef.opts.onResize = null;
    this.appRef = null;
    this.dispose(this.fires);
    this.fires = null;
    this.rod = null;
    this.dispose();
  }
}
