import {Scene, WebGLRenderer} from 'three';

/**
 * Scene Wrapper
 */
export abstract class SceneWrapper extends Scene {
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
