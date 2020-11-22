import {Mesh} from 'three';
import {IPlanetOptions} from '@Engine/Interfaces/IPlanetOptions';

/**
 * Planet Container
 */
export class PlanetContainer extends Mesh {
  /**
   * Planet Container
   * @param radius
   * @param options
   */
  constructor(public radius: number, public options: Partial<IPlanetOptions>) {
    super();
  }
}
