import {
  AmbientLight,
  Clock,
  Color,
  DirectionalLight,
  HemisphereLight,
  MeshPhongMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';
import {IFeatures} from '@Root/AppFramework/Features/Interfaces/IFeatures';
import {MainPlanet} from '@Content/Entities/Planets/MainPlanet/Private/MainPlanet';
import {SceneWrapper} from '@Engine/Helpers/SceneWrapper';
import {FlyControls} from 'three/examples/jsm/controls/FlyControls';
import {PlanetContainer} from '@Engine/Helpers/PlanetContainer';
import {MainMoon} from '@Content/Entities/Planets/MainMoon/Private/MainMoon';
import {Stars} from '@Content/Entities/Enviroment/Stars/Public';

/**
 * Tiny Planet System
 *
 * Objects:
 *  - Planet
 *  - Moon
 *  - SpaceStation
 */
export class TinyPlanetSystem extends SceneWrapper {

  private static DEFAULT_SPEED = 500;
  private static MIN_SPEED = 10;

  private readonly camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 20000);
  private readonly controls: FlyControls;
  private clock = new Clock();
  private planets: PlanetContainer[] = [];
  private cameraRadius = 5;
  private cameraMaxDistance = 1;

  /**
   * TinyPlanetSystem Constructor
   * @param renderer
   * @param features
   */
  constructor(renderer: WebGLRenderer, public features: Partial<IFeatures>) {
    super(renderer, features);
    this.camera.position.set(800, 800, -800);
    this.camera.lookAt(new Vector3(0, 0, 0));

    const controls = this.controls = new FlyControls(this.camera, renderer.domElement);
    controls.domElement = renderer.domElement;
    controls.movementSpeed = TinyPlanetSystem.DEFAULT_SPEED;
    controls.rollSpeed = 0.5;
    controls.autoForward = false;
    controls.dragToLook = true;

    const mainPlanet = this.addPlanet(new MainPlanet(
      100,
      {
        color: new Color(0x00ff00),
      },
      ),
    );

    this.cameraMaxDistance = mainPlanet.radius * 2 * 10;

    this.add(new Stars(8000));

    let planetOffset = 200;
    for (let i = 10; --i >= 0;) {
      const planetRadius = 10 + Math.random() * 10;
      const planetRotation = (Math.random() * Math.PI * 2) * (Math.random() < 0.5 ? -1 : 1);

      planetOffset += Math.sqrt(planetOffset) + planetRadius * 2.0 + Math.random() * 100;

      this.addPlanet(new MainMoon(planetRadius, {
        color: new Color(0x555555),
        offset: planetOffset,
        rotation: planetRotation,
        rotationSpeed: Math.random() / 50000,
        rotationY: 0.5 + Math.random() * 3,
      }))
        .position.set(Math.sin(planetRotation) * planetOffset, 0, Math.cos(planetRotation) * planetOffset);
    }

    const loader = new TextureLoader();
    loader.load('/Images/2k_mercury.jpg', (texture) => {
      for (const planet of this.planets) {
        if (!Array.isArray(planet.material)) {
          (planet.material as MeshPhongMaterial).map = texture;
          (planet.material as MeshPhongMaterial).needsUpdate = true;
        }
      }
    });

    this.initLightSystem();
  }

  /**
   * Add planet to scene
   * @param planet
   */
  addPlanet(planet: PlanetContainer) {
    this.planets.push(planet);
    this.add(planet);
    return planet;
  }

  public resize(width: number, height: number) {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  /**
   * Update Scene
   */
  public update() {
    const delta = this.clock.getDelta();

    const movementSpeed = TinyPlanetSystem.DEFAULT_SPEED;

    let minDistance = Number.MAX_SAFE_INTEGER;
    let planetIndex = 0;
    for (let index = this.planets.length; --index >= 0;) {
      const planet = this.planets[index];
      const distance = planet.position.distanceToSquared(this.camera.position) - planet.radius ** 2;
      if (distance < minDistance) {
        minDistance = Math.max(0, distance);
        planetIndex = index;
      }
    }

    this.controls.movementSpeed = Math.max(TinyPlanetSystem.MIN_SPEED, Math.min(movementSpeed, Math.sqrt(minDistance / 5)));
    this.controls.update(delta);

    const currentTime = this.clock.oldTime - this.clock.startTime;

    for (const planet of this.planets) {
      const {rotation = 0, offset = 0, rotationSpeed = 1} = planet.options;
      const rotationDelta = rotation + Math.sign(rotation) * rotationSpeed * currentTime;

      planet.position.set(Math.sin(rotationDelta) * offset, 0, Math.cos(rotationDelta) * offset);
      planet.rotateY(0.03 * delta);
    }

    this.cameraDistanceLimit();
    this.cameraCollisions();
  }

  /**
   * Camera
   * - distance limit
   */
  public cameraDistanceLimit() {
    const planet = this.planets[0];

    let distance = this.camera.position.distanceTo(planet.position);
    distance -= planet.radius + this.cameraRadius;

    if (distance > this.cameraMaxDistance) {
      const planetPosition = planet.position.clone();
      this.camera.position
        .subVectors(this.camera.position, planet.position)
        .normalize()
        .multiplyScalar(this.cameraMaxDistance + planet.radius + this.cameraRadius)
        .add(planetPosition);
    }
  }

  /**
   * Camera
   * - simple collision detection and response
   */
  public cameraCollisions() {
    for (const planet of this.planets) {
      const distance = this.camera.position.distanceTo(planet.position);
      if (distance < this.cameraRadius + planet.radius) {
        const planetPosition = planet.position.clone();
        this.camera.position
          .subVectors(this.camera.position, planet.position)
          .normalize()
          .multiplyScalar(planet.radius + this.cameraRadius)
          .add(planetPosition);
      }
    }
  }

  /**
   * Render Scene
   * @param renderer
   */
  public render(renderer: WebGLRenderer) {
    renderer.render(this, this.camera);
  }

  /**
   * Initialize Light System
   */
  private initLightSystem() {
    if (!this.features.isMobile) {
      const directionalLight = new DirectionalLight(0xffffff, 1.1);
      directionalLight.position.set(300, 1000, 500);
      directionalLight.target.position.set(0, 0, 0);
      directionalLight.castShadow = true;

      const d = 300;
      directionalLight.shadow.camera = new OrthographicCamera(-d, d, d, -d, 500, 1600);
      directionalLight.shadow.bias = 0.0001;
      directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 1024;
      this.add(directionalLight);

      const light = new AmbientLight(0xffffff, 0.3);
      this.add(light);
    } else {
      const hemisphereLight = new HemisphereLight(0xffffff, 1);
      this.add(hemisphereLight);

      const light = new AmbientLight(0xffffff, 0.15);
      this.add(light);
    }
  }
}
