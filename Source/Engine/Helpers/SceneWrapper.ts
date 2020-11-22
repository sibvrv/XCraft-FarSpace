import {Scene, WebGLRenderer} from 'three';
import {IFeatures} from '@Root/AppFramework/Features/Interfaces/IFeatures';

/**
 * Scene Wrapper
 */
export abstract class SceneWrapper extends Scene {
  /**
   * Scene Wrapper Constructor
   * @param renderer
   * @param features
   */
  constructor(renderer: WebGLRenderer, public features: Partial<IFeatures>) {
    super();
  }

  /**
   * Update camera aspect ratio or other elements
   * @param width
   * @param height
   */
  public abstract resize(width: number, height: number): void;

  /**
   * Render Scene Flow
   * @param renderer
   */
  public abstract render(renderer: WebGLRenderer): void;

  /**
   * Update Scene
   */
  public abstract update(): void;
}
