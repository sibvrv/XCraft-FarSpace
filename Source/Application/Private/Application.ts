import {PCFSoftShadowMap, Vector2, WebGLRenderer} from 'three';
import {isMobileDevice} from '../../AppFramework/Features/Devices/isMobileDevice';
import {IFeatures} from '../../AppFramework/Features/Interfaces/IFeatures';

/**
 * Application Template
 * @class App
 */
export class Application {
  public features: Partial<IFeatures> = {};
  public frameSize = new Vector2(0, 0);

//  private readonly scene = new Scene();

  private readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
  });

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
   * WebGL capabilities can vary quite dramatically between browsers and devices
   */
  private featureChecking() {
    if (isMobileDevice()) {
      this.features.isMobile = true;
      this.renderer.shadowMap.enabled = false;
    }
  }

  /**
   * Update the resolution of the renderer
   */
  private adjustCanvasSize() {
    const {width, height} = this.frameSize;
    if (width === innerWidth && height === innerHeight) {
      return;
    }
    this.renderer.setSize(innerWidth, innerHeight);

  }

  /**
   * Render loop
   */
  private render() {
    this.adjustCanvasSize();

    // this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());
  }
}
