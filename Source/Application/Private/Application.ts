import {PCFSoftShadowMap, Vector2, WebGLRenderer} from 'three';
import {isMobileDevice} from '@Root/AppFramework/Features/Devices/isMobileDevice';
import {IFeatures} from '@Root/AppFramework/Features/Interfaces/IFeatures';
import {SceneWrapper} from '@Engine/Helpers/SceneWrapper';

/**
 * Application Template
 * @class App
 */
export class Application {
  public features: Partial<IFeatures> = {};
  public frameSize = new Vector2(0, 0);

  public readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
  });

  private scene: SceneWrapper = null!;

  /**
   * App Constructor
   */
  constructor() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setClearColor(0x282828);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    this.featureChecking();
    this.render();
  }

  /**
   * Set Scene
   * @param scene
   */
  public setScene(scene: SceneWrapper) {
    this.scene = scene;
  }

  /**
   * WebGL capabilities can vary quite dramatically between browsers and devices
   */
  private featureChecking() {
    if (isMobileDevice()) {
      this.features.isMobile = true;
      this.renderer.shadowMap.enabled = false;
    }
  }

  /**
   * Update the resolution of the renderer and update scene entities
   */
  private adjustCanvasSize() {
    const {width, height} = this.frameSize;
    if (width === innerWidth && height === innerHeight) {
      return;
    }

    this.frameSize.set(innerWidth, innerHeight);

    this.renderer.setSize(innerWidth, innerHeight);
    if (this.scene) {
      this.scene.resize(innerWidth, innerHeight);
    }
  }

  /**
   * Render loop
   */
  private render() {
    this.adjustCanvasSize();

    if (this.scene) {
      this.scene.update();
      this.scene.render(this.renderer);
    }

    requestAnimationFrame(() => this.render());
  }
}
