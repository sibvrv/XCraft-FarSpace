import {Application} from './Public';

const application = new Application();

import('../Content/Scenes/TinyPlanetSystem/Public').then(({default: SceneObject}) => {
  const {renderer, features} = application;
  const scene = new SceneObject(renderer, features);
  application.setScene(scene);
});
