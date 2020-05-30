import {
  BoxGeometry,
  MeshLambertMaterial,
  Color,
  Mesh,
  Object3D,
  AxesHelper
} from 'three';

class Box extends Object3D {
  constructor() {
    super();

    this.carGeometry = new BoxGeometry(7, 3, 4);
    this.carMaterial = new MeshLambertMaterial({
      color: new Color('rgb(0, 200, 255)')
    });
    this.car = new Mesh(this.carGeometry, this.carMaterial);
    this.car.position.y = 1.5;

    this.geometry = new BoxGeometry(100, 0.3, 5);
    this.material = new MeshLambertMaterial({
      color: new Color('rgb(200, 0, 255)')
    });
    this.mesh = new Mesh(this.geometry, this.material);

    this.add(this.car);
    this.add(this.mesh);
    this.add(new AxesHelper(4));

    this.position.y = 0.1;
  }
}

export default Box;
