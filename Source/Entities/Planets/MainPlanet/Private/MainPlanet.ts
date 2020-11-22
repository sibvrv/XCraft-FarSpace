import {Color, Mesh, MeshPhongMaterial, SphereGeometry} from 'three';

/**
 * @class MainPlanet
 */
export class MainPlanet extends Mesh {
  /**
   * Main Planet Constructor
   * @param radius
   * @param color
   */
  constructor(radius: number, color: Color) {
    super();

    this.geometry = new SphereGeometry(radius, 32, 32);
    this.material = new MeshPhongMaterial({color});

    this.castShadow = true;
    this.receiveShadow = true;
  }
}
