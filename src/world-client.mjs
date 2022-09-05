export const world_client = (() => {
  class WorldClient {}

  class WorldNetworkClient extends WorldClient {}

  return {
    WorldNetworkClient: WorldNetworkClient,
  };
})();
