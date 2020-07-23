import Base from './Base.js';
import {
  Color,
  Mesh,
  MeshPhongMaterial,
  PlaneBufferGeometry,
  CylinderBufferGeometry,
  Vector3,
  Group,
  DoubleSide,
  CubicBezierCurve3,
  CircleBufferGeometry
} from 'three';

export default class CalorimetrySystem extends Base {
  constructor({ hotPlateTemp, hotPlateMass, weightColor }) {
    super(['cup/cup.gltf', 'scale/scale.gltf']);

    // All objects and groups.
    this.hotPlate = null;
    this.cup = null;
    this.lcd = new Group();
    this.thermometer = new Group();
    this.add(this.lcd, this.thermometer);

    this.hotPlateTemp = hotPlateTemp;
    this.hotPlateMass = hotPlateMass;

    // Weight object.
    this.weight = new Mesh(
      new CylinderBufferGeometry(1, 1, 2.5, 15),
      new MeshPhongMaterial({ color: new Color(weightColor) })
    );
    this.weight.visible = false;
    this.weight.castShadow = true;
    this.weight.receiveShadow = true;
    this.add(this.weight);

    // Thermometer level object.
    this.thermometerProps = {
      height: 30,
      minHiehgt: 8,
      minTemp: 20,
      degStep: 1,
      heightPerDeg: 2
    };
    this.thermometerLevel = new Mesh(
      new PlaneBufferGeometry(0, 0),
      new MeshPhongMaterial({ color: new Color('#ff0000'), side: DoubleSide })
    );
    this.thermometerLevel.visible = false;
    this.thermometer.add(this.thermometerLevel);

    // Define the position of elements.
    this.cupPos = new Vector3(12, 0, 0);
    this.cupElemPos = new Vector3(0, 0.3, 0).add(this.cupPos);
    this.thermometerPos = new Vector3(0, 5, 0).add(this.cupPos);
    this.hotPlatePos = new Vector3(-12, 0.8, 1);
    this.hotPlateElemPos = new Vector3(0, 5.8, 0).add(this.hotPlatePos);
    this.hotPlateRotationX = ((135 - 180) * Math.PI) / 180;
    this.hotPlateLcdPos = new Vector3(
      0,
      // 1.5 from the height before the chamfer starts.
      // 1.25 from the chamfer edge to its center.
      // 0.2 sin x adjust for the recessed face.
      1.5 + 1.25 + 0.2 * Math.sin(this.hotPlateRotationX),
      // 10 from half the width of the device.
      // 1.25 from the center of the face.
      // 0.2 cos x adjust for the recessed face.
      10 - 1.25 - 0.2 * Math.cos(this.hotPlateRotationX)
    ).add(this.hotPlatePos);
    this.hotPlateLcdLeftPos = new Vector3(-5, 0, 0).add(this.hotPlateLcdPos);

    // Calculate the movements for the weight and lid.
    this.weightMovement = new CubicBezierCurve3(
      new Vector3(this.hotPlateElemPos.x, this.hotPlateElemPos.y, 0),
      new Vector3(this.hotPlateElemPos.x, 25, 0),
      new Vector3(this.cupElemPos.x + 5, 25, 0),
      new Vector3(this.cupElemPos.x, this.cupElemPos.y, 0)
    ).getPoints(50);
    this.lidMovement = new CubicBezierCurve3(
      new Vector3(0, 0, 0),
      new Vector3(0, 10, 0),
      new Vector3(15, 10, 0),
      new Vector3(15, 10, 0)
    ).getPoints(50);
    this.animationLength = Math.max(
      this.lidMovement.length * 2,
      this.weightMovement.length
    );

    // Finally load font.
    this.loadFont().then(this.onFontLoad.bind(this));

    // Move everything to the ground level.
    this.position.y = -4;
  }

  setWeightPos(i) {
    if (i < this.weightMovement.length) {
      this.weight.position.copy(this.weightMovement[i]);
      this.weight.position.y += this.weight.geometry.parameters.height / 2;
      this.weight.visible = true;
    }
  }

  setLidPos(i) {
    let v;
    if (i < this.lidMovement.length) {
      v = this.lidMovement[i];
    } else if (i < this.lidMovement.length * 2) {
      v = this.lidMovement[2 * this.lidMovement.length - i - 1];
    } else {
      return;
    }
    const elements = ['b_cup_termometer_001_', 'b_cup_lid_001_'];
    this.cup.children
      .filter(obj => elements.indexOf(obj.name) > -1)
      .forEach(obj => obj.position.set(0, v.x, v.y).multiplyScalar(10));
    this.thermometer.position.copy(this.thermometerPos).add(v);
  }

  setThermometerTemp(t) {
    // Calculate the height of the thermometer level.
    const { minHiehgt, minTemp, heightPerDeg } = this.thermometerProps;
    let h = minHiehgt + (t - minTemp) * heightPerDeg;

    // Update the vertices of the plane geometry.
    this.thermometerLevel.geometry.attributes.position.setXYZ(0, -0.1, h, 0);
    this.thermometerLevel.geometry.attributes.position.setXYZ(1, 0.1, h, 0);
    this.thermometerLevel.geometry.attributes.position.setXYZ(2, -0.1, 1, 0);
    this.thermometerLevel.geometry.attributes.position.setXYZ(3, 0.1, 1, 0);
    this.thermometerLevel.geometry.attributes.position.needsUpdate = true;
    this.thermometerLevel.visible = true;
  }

  makeThermometer() {
    const {
      minHiehgt,
      minTemp,
      height,
      heightPerDeg,
      degStep
    } = this.thermometerProps;

    // Draw temperature ticks.
    for (let h = minHiehgt; h < height; h += heightPerDeg * degStep) {
      // Given the height h, calculate the temperature.
      const temp = minTemp + (h - minHiehgt) / heightPerDeg;

      // Create a tick using a plane geometry and the text.
      const tick = new Mesh(
        new PlaneBufferGeometry(0.5, 0.1),
        this.colors.darkGray
      );
      const text = this.getText(
        `${temp} °C`,
        { size: 0.9 },
        this.colors.gray,
        'left'
      );

      // Position tick and text.
      tick.position.y = h;
      tick.position.z = 0.05;

      // Move text to the right of the thermometer.
      text.position.y += h;
      text.position.x += 1;

      this.thermometer.add(tick, text);
    }
  }

  setHotPlateMass(mass) {
    this.hotPlateMass = mass;

    // Find if mesh has already been made and dispose it.
    // The material is not disposed since its shared.
    let text = this.lcd.children.find(obj => obj.name === 'mass');
    if (text) {
      text.geometry.dispose();
      text.material = '';
      this.lcd.remove(text);
      text = null;
    }

    // If the font is already loaded make a the text mesh and
    // add it to the lcd.
    if (this.font) {
      text = this.getText(
        `${mass} g`,
        { size: 1 },
        this.colors.darkGray,
        'center'
      );

      // This label allows us to find it later.
      text.name = 'mass';

      // Position text above lcd planes.
      text.position.z += 0.05 * 3;

      // Position text on the left lcd with a slight shift to the left and top.
      text.position.x += -4 - 0.1;
      text.position.y += 0.2;
      this.lcd.add(text);
    }
  }

  setHotPlateTemp(temp) {
    this.hotPlateTemp = temp;

    // Find if mesh has already been made and dispose it.
    // The material is not disposed since its shared.
    let text = this.lcd.children.find(obj => obj.name === 'temp');
    if (text) {
      text.geometry.dispose();
      text.material = '';
      this.lcd.remove(text);
      text = null;
    }

    // If the font is already loaded make a the text mesh and
    // add it to the lcd.
    if (this.font) {
      text = this.getText(
        `${temp} °C`,
        { size: 1 },
        this.colors.darkGray,
        'center'
      );

      // This label allows us to find it later.
      text.name = 'temp';

      // Position text above lcd planes.
      text.position.z += 0.05 * 3;

      // Position text on the right lcd, with a slight shift to the left.
      text.position.x += 4 - 0.2;
      this.lcd.add(text);
    }
  }

  makeLCD() {
    const controlsBg = new Mesh(
      new PlaneBufferGeometry(19, 2.5),
      this.colors.gray
    );
    controlsBg.receiveShadow = true;

    const lcdPlaneRight = new Mesh(
      new PlaneBufferGeometry(5, 1.8),
      new MeshPhongMaterial({ color: new Color('#CBCEA5') })
    );

    const lcdPlaneLeft = new Mesh(
      new PlaneBufferGeometry(5, 1.8),
      new MeshPhongMaterial({ color: new Color('#CBCEA5') })
    );

    this.setHotPlateTemp(this.hotPlateTemp);
    this.setHotPlateMass(this.hotPlateMass);

    // Layer elements.
    controlsBg.position.z += 0.05;
    lcdPlaneRight.position.z += 0.05 * 2;
    lcdPlaneRight.position.x = 4;
    lcdPlaneLeft.position.z += 0.05 * 2;
    lcdPlaneLeft.position.x = -4;

    // Move lcd to its position.
    this.lcd.add(controlsBg, lcdPlaneLeft, lcdPlaneRight);
  }

  onFontLoad() {
    // Thermometer.
    this.makeThermometer();
    this.thermometer.position.copy(this.thermometerPos);

    // Lcd.
    this.makeLCD();
    this.lcd.rotation.x = this.hotPlateRotationX;
    this.lcd.position.copy(this.hotPlateLcdPos);
  }

  onLoad([cup, hotPlate]) {
    // Hot Plate.
    this.hotPlate = hotPlate;
    this.hotPlate.rotation.x = -Math.PI / 2;
    this.hotPlate.position.copy(this.hotPlatePos);

    // Cup.
    this.cup = cup;
    this.cup.position.copy(this.cupPos);
    this.cup.rotation.x = -Math.PI / 2;
    this.cup.rotation.z = -Math.PI / 2;

    // Make thermometer transparent.
    let termometer = this.cup.children.find(
      obj => obj.name === 'b_cup_termometer_001_'
    );
    termometer.material.transparent = true;
    termometer.material.opacity = 0.5;

    // Place a circle plane insde the cup to fake it has water.
    const water = new Mesh(
      new CircleBufferGeometry(39.5, 10),
      new MeshPhongMaterial({
        color: new Color('#20a4d4'),
        transparent: true,
        opacity: 0.5
      })
    );
    water.position.z = 50;
    this.cup.add(water);

    this.add(this.cup, this.hotPlate);
  }

  destroy() {
    this.dispose(this.lcd);

    // Thermometer. Remove reference to the level and dispose group.
    this.thermometerLevel = null;
    this.dispose(this.thermometer);

    this.cup = null;
    this.hotPlate = null;
    this.lcd = null;
    this.thermometer = null;
    this.dispose();
  }
}
