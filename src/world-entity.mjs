export const world_entity = (() => {
  class WorldEntity {
    _id;
    _accountInfo;

    constructor(params) {
      this._id = params.id;

      this._accountInfo = {
        name: params.account.accountName,
      };
    }

    get ID() {
      return this._id;
    }
  }

  return {
    WorldEntity: WorldEntity,
  };
})();
