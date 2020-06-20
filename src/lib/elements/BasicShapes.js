import {
  Object3D,
  Mesh,
  MeshPhongMaterial,
  BoxBufferGeometry,
  CylinderBufferGeometry,
  SphereBufferGeometry,
  OctahedronBufferGeometry,
  Raycaster,
  Vector2,
  Vector3,
  Line,
  LineBasicMaterial,
  MeshBasicMaterial,
  BufferGeometry
} from 'three';
import { disposeRecursive } from '@/lib/utils';
import colors from 'vuetify/lib/util/colors';

export default class BasicShapes extends Object3D {
  constructor(appRef) {
    super();
    this.OPACITY = 0.75;
    this.shapes = [
      new Mesh(
        new OctahedronBufferGeometry(5, 0),
        new MeshPhongMaterial({
          color: colors.deepPurple.base,
          opacity: this.OPACITY,
          transparent: true
        })
      ),
      new Mesh(
        new CylinderBufferGeometry(5, 5, 10, 20),
        new MeshPhongMaterial({
          color: colors.blue.base,
          opacity: this.OPACITY,
          transparent: true
        })
      ),
      new Mesh(
        new BoxBufferGeometry(5, 5, 5),
        new MeshPhongMaterial({
          color: colors.green.base,
          opacity: this.OPACITY,
          transparent: true
        })
      ),
      new Mesh(
        new CylinderBufferGeometry(0, 5, 10, 20),
        new MeshPhongMaterial({
          color: colors.orange.base,
          opacity: this.OPACITY,
          transparent: true
        })
      ),
      new Mesh(
        new SphereBufferGeometry(5, 20, 20),
        new MeshPhongMaterial({
          color: colors.red.base,
          opacity: this.OPACITY,
          transparent: true
        })
      )
    ];

    this.movingPoint = new Mesh(
      new SphereBufferGeometry(0.5, 10, 10),
      new MeshBasicMaterial({ color: colors.teal.accent3 })
    );
    this.startPoint = new Mesh(
      new SphereBufferGeometry(0.5, 10, 10),
      new MeshBasicMaterial({ color: colors.red.accent3 })
    );
    this.endPoint = new Mesh(
      new SphereBufferGeometry(0.5, 10, 10),
      new MeshBasicMaterial({ color: colors.red.accent3 })
    );
    this.movingPoint.visible = false;
    this.startPoint.visible = false;
    this.endPoint.visible = false;

    this.guide = new Line(
      new BufferGeometry().setFromPoints([new Vector3(), new Vector3()]),
      new LineBasicMaterial({ color: colors.red.accent3 })
    );

    this.raycaster = new Raycaster();
    this.localPoint = new Vector3();
    this.closestPoint = new Vector3();
    this.distance = null;
    this.mouse = new Vector2();
    this.isMouseDown = false;

    this.appRef = appRef;
    this.events = ['mousemove', 'mouseup', 'mousedown'];
    this.bindListeners();

    this.shapes.forEach((obj, i) => {
      const { height, radius } = obj.geometry.parameters;
      obj.position.x = 25 * (i / 2 - 1);
      obj.position.y = height ? height / 2 : radius;
      obj.receiveShadow = true;
      obj.castShadow = true;
    });

    this.add(
      ...this.shapes,
      this.startPoint,
      this.endPoint,
      this.movingPoint,
      this.guide
    );
  }
  bindListeners() {
    this.events.forEach(e => {
      this[e] = this[e].bind(this);
      this.appRef.renderer.domElement.addEventListener(e, this[e]);
    });
  }
  destroy() {
    this.events.forEach(e => {
      this.appRef.renderer.domElement.removeEventListener(e, this[e]);
    });
    this.appRef = null;
    disposeRecursive(this);
  }
  mousedown() {
    this.isMouseDown = true;
  }
  mouseup() {
    if (this.movingPoint.visible) {
      if (
        (this.startPoint.visible && this.endPoint.visible) ||
        (!this.startPoint.visible && !this.endPoint.visible)
      ) {
        this.guide.visible = false;
        this.distance = null;
        this.startPoint.visible = true;
        this.endPoint.visible = false;
        this.startPoint.position.copy(this.movingPoint.position);
      } else {
        this.guide.visible = true;
        this.endPoint.visible = true;
        this.endPoint.position.copy(this.movingPoint.position);
        this.drawGuide();
      }
    }
    this.isMouseDown = false;
  }
  mousemove({ target, clientX, clientY }) {
    var rect = target.getBoundingClientRect();
    this.mouse.set(
      ((clientX - rect.left) / target.width) * 2 - 1,
      (-(clientY - rect.top) / target.height) * 2 + 1
    );
    this.raycaster.setFromCamera(this.mouse, this.appRef.camera);
    const intersects = this.raycaster.intersectObjects(this.shapes);
    if (intersects.length > 0 && !this.isMouseDown) {
      let point = this.getClosestPointToEdge(intersects[0]);
      this.movingPoint.visible = true;
      this.movingPoint.position.copy(point);
    } else {
      this.movingPoint.visible = false;
    }
  }
  drawGuide() {
    const pos = this.guide.geometry.attributes.position;
    pos.setXYZ(
      0,
      this.startPoint.position.x,
      this.startPoint.position.y,
      this.startPoint.position.z
    );
    pos.setXYZ(
      1,
      this.endPoint.position.x,
      this.endPoint.position.y,
      this.endPoint.position.z
    );
    this.distance = this.startPoint.position.distanceTo(this.endPoint.position);
    pos.needsUpdate = true;
  }
  getClosestPointToEdge({ point, object, face }) {
    const pos = object.geometry.attributes.position;

    this.localPoint.copy(point);
    object.worldToLocal(this.localPoint);

    const facePoints = [
      new Vector3().fromBufferAttribute(pos, face.a),
      new Vector3().fromBufferAttribute(pos, face.b),
      new Vector3().fromBufferAttribute(pos, face.c)
    ];

    let minDistanceSq = Infinity;
    facePoints.forEach(point => {
      const distSq = point.distanceToSquared(this.localPoint);
      if (distSq < minDistanceSq) {
        minDistanceSq = distSq;
        this.closestPoint.copy(point);
      }
    });

    // const faceLines = [
    //   new Line3(facePoints[0], facePoints[1]),
    //   new Line3(facePoints[0], facePoints[2]),
    //   new Line3(facePoints[1], facePoints[2])
    // ];

    // const closestPointToLine = new Vector3();
    // faceLines.forEach(line => {
    //   line.closestPointToPoint(this.localPoint, true, closestPointToLine);
    //   const distSq = closestPointToLine.distanceToSquared(this.localPoint);
    //   if (distSq < minDistanceSq) {
    //     minDistanceSq = distSq;
    //     this.closestPoint.copy(closestPointToLine);
    //   }
    // });

    object.localToWorld(this.closestPoint);
    return this.closestPoint.clone();
  }
}
