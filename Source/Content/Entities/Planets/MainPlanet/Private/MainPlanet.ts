import {MeshPhongMaterial, SphereGeometry} from 'three';
import {PlanetContainer} from '@Engine/Helpers/PlanetContainer';
import {IPlanetOptions} from '@Engine/Interfaces/IPlanetOptions';

/**
 * @class MainPlanet
 */
export class MainPlanet extends PlanetContainer {
  /**
   * Main Planet Constructor
   * @param radius
   * @param options
   */
  constructor(radius: number, options: Partial<IPlanetOptions>) {
    super(radius, options);

    const {color} = options;

    this.geometry = new SphereGeometry(radius, 32, 32);
    this.material = new MeshPhongMaterial({color});

    this.castShadow = true;
    this.receiveShadow = true;
  }
}
