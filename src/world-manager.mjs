import { quat, vec3 } from "gl-matrix";

import { spatial_hash_grid } from "./spatial-hash-grid.mjs";
import { world_client } from "./world-client.mjs";
import { world_entity } from "./world-entity.mjs";
import { defs } from "./defs.mjs";

export const world_manager = (() => {
  class WorldManager {
    _ids;
    _entities;
    _grid;

    constructor() {
      this._ids = 0;
      this._entities = [];
      this._grid = new spatial_hash_grid.SpatialHashGrid(
        [
          [-4000, -4000],
          [4000, 4000],
        ],
        [1000, 1000]
      );
    }

    Add(client, params) {
      const models = ["guard", "sorceror", "paladin"];
      const randomClass = models[Math.floor(Math.random() * models.length)];

      const e = new world_entity.WorldEntity({
        id: this._ids++,
        position: vec3.fromValues(
          -60 + (Math.random() * 2 - 1) * 20,
          0,
          (Math.random() * 2 - 1) * 20
        ),
        rotation: quat.fromValues(0, 0, 0, 1),
        grid: this._grid,
        character: {
          definition: defs.CHARACTER_MODELS[randomClass],
          class: randomClass,
        },
        account: params,
      });

      const wc = new world_client.WorldNetworkClient(client, e);

      this._entities.push(wc);

      wc.BroadcastChat({
        name: "",
        server: true,
        text: "[" + params.accountName + " has entered the game]",
      });
    }
  }

  return {
    WorldManager: WorldManager,
  };
})();
