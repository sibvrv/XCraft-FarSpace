import {Geometry, Object3D, Points, PointsMaterial, Vector3} from 'three';

/**
 * Stars Field
 */
export class Stars extends Object3D {
  materialsSet = [
    {color: 0x858585, size: 2.7},
    {color: 0x555575, size: 1.8},
    {color: 0x535333, size: 2.7},
    {color: 0x3a3a3a, size: 1.8},
    {color: 0x1a1a1a, size: 2.7},
    {color: 0x1a1a1a, size: 1.8},
  ];

  constructor(radius: number) {
    super();

    const starsMaterials: PointsMaterial[] = this.materialsSet.map(item => new PointsMaterial({
      sizeAttenuation: false,
      depthWrite: false,
      ...item,
    }));

    const starsGeometry = [
      new Geometry(),
      new Geometry(),
    ];

    const rnd = () => Math.random() * 2 - 1;

    for (let i = 2000; --i >= 0;) {
      starsGeometry[0].vertices.push(new Vector3(rnd() * radius, rnd() * radius, rnd() * radius));
    }
    for (let i = 5000; --i >= 0;) {
      starsGeometry[0].vertices.push(new Vector3(rnd() * radius, rnd() * radius, rnd() * radius));
    }

    for (let i = 18; --i >= 0;) {
      const stars = new Points(starsGeometry[i % 2], starsMaterials[i % 6]);
      stars.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6);

      this.add(stars);
    }
  }
}
