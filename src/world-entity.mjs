import { quat, vec3 } from "gl-matrix";

export const world_entity = (() => {
  class WorldEntity {
    _id;
    _state;
    _characterDefinition;
    _characterInfo;
    _position;
    _rotation;
    _gridClient;
    _accountInfo;

    constructor(params) {
      this._id = params.id;
      this._state = "idle";
      this._position = vec3.clone(params.position);
      this._rotation = quat.clone(params.rotation);

      this._characterDefinition = params.character.definition;
      this._characterInfo = {
        class: params.character.class,
      };

      this._grid = params.grid;
      this._gridClient = this._grid.NewClient(
        [this._position[0], this._position[2]],
        [10, 10]
      );
      this._gridClient.entity = this;

      this._accountInfo = {
        name: params.account.accountName,
      };
    }

    Destroy() {
      this._grid.Remove(this._gridClient);
      this._gridClient = null;
    }

    get ID() {
      return this._id;
    }

    GetDescription() {
      return {
        account: this._accountInfo,
        character: this._characterInfo,
      };
    }

    _CreateTransformPacket() {
      return [[...this._position], [...this._rotation]];
    }

    _CreatePlayerPacket() {
      return {
        id: this.ID,
        desc: this.GetDescription(),
        transform: this._CreateTransformPacket(),
      };
    }

    FindNear(radius, includeSelf) {
      let nearby = this._grid
        .FindNear([this._position[0], this._position[2]], [radius, radius])
        .map((c) => c.entity);

      if (!includeSelf) {
        const _Filter = (e) => {
          return e.ID != this.ID;
        };
        nearby = nearby.filter(_Filter);
      }
      return nearby;
    }
  }

  return {
    WorldEntity: WorldEntity,
  };
})();
