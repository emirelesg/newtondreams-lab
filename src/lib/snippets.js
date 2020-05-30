initScene() {
  this.scene.background = new Color('#454e61');

  // this.scene.background = new Color(
  //   `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
  //     Math.random() * 255
  //   )}, ${Math.floor(Math.random() * 255)})`
  // );

  this.scene.fog = new Fog(this.scene.background, 1, 10);

  // Configure plane.
  var floor = new Mesh(
    new PlaneBufferGeometry(50, 50),
    new MeshPhongMaterial({ color: 0x252a34 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  this.scene.add(floor);

  const dirLight = new DirectionalLight(new Color('hsl(300, 50%, 55%)'), 0.5);
  dirLight.position.set(-1, 1.75, 1);
  dirLight.position.multiplyScalar(5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  var d = 10;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = -0.0001;
  this.scene.add(dirLight);

  const dirLightHeper = new DirectionalLightHelper(dirLight, 10);
  this.scene.add(dirLightHeper);

  // var grid = new GridHelper(50, 50, 0x444444, 0x444444);
  // this.scene.add(grid);

  // Add default lights.
  // this.camera.add(new PointLight(0xffffff, 0.75, 100));
  // this.scene.add(this.camera);
  this.scene.add(new AmbientLight(0xffffff, 0.5));
}