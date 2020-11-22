import {
  AmbientLight,
  Clock,
  Color,
  DirectionalLight,
  GridHelper,
  HemisphereLight,
  OrthographicCamera,
  PerspectiveCamera,
  Vector3,
  WebGLRenderer,
} from 'three';
import {IFeatures} from '@Root/AppFramework/Features/Interfaces/IFeatures';
import {MainPlanet} from '@Content/Entities/Planets/MainPlanet/Private/MainPlanet';
import {SceneWrapper} from '@Engine/Helpers/SceneWrapper';
import {FlyControls} from 'three/examples/jsm/controls/FlyControls';
import {PlanetContainer} from '@Engine/Helpers/PlanetContainer';
import {MainMoon} from '@Content/Entities/Planets/MainMoon/Private/MainMoon';

/**
 * Tiny Planet System
 *
 * Objects:
 *  - Planet
 *  - Moon
 *  - SpaceStation
 */
export class TinyPlanetSystem extends SceneWrapper {

  private readonly camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 10000);
  private readonly controls: FlyControls;
  private clock = new Clock();
  private planets: PlanetContainer[] = [];

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
    controls.movementSpeed = 500;
    controls.rollSpeed = 0.5;
    controls.autoForward = false;
    controls.dragToLook = true;

    this.addPlanet(new MainPlanet(
      100,
      {
        color: new Color(0x00ff00),
      },
      ),
    );

    for (let i = 10; --i >= 0;) {
      this.addPlanet(new MainMoon(10 + Math.random() * 10, {color: new Color(0x555555)})).position.set(350 + i * (30 + Math.random() * 20), 0, 0);
    }

    this.initHelpers();
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

    // this.controls.movementSpeed = 0.33 * d;
    this.controls.update(delta);

    for (const planet of this.planets) {
      planet.rotateY(0.03 * delta);
    }
  }

  public render(renderer: WebGLRenderer) {
    renderer.render(this, this.camera);
  }

  /**
   * Initialize Scene Helpers
   */
  private initHelpers() {
    const gridHelper = new GridHelper(320, 32);
    this.add(gridHelper);
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
