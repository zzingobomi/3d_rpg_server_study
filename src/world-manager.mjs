import { world_client } from "./world-client.mjs";
import { world_entity } from "./world-entity.mjs";

export const world_manager = (() => {
  class WorldManager {
    _ids;
    _entities;

    constructor() {
      this._ids = 0;
      this._entities = [];
    }

    Add(client, params) {
      const e = new world_entity.WorldEntity({
        id: this._ids++,
        account: params,
      });

      const wc = new world_client.WorldNetworkClient(client, e);

      this._entities.push(wc);
    }
  }

  return {
    WorldManager: WorldManager,
  };
})();
