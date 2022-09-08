export const world_client = (() => {
  class WorldClient {
    _entity;
    _client;

    constructor(client, entity) {
      this._entity = entity;

      this._client = client;
      this._client._onMessage = (e, d) => this._OnMessage(e, d);
      this._client.Send("world.player", this._entity._CreatePlayerPacket());

      // Hack
      entity._parent = this;
    }

    _OnMessage(evt, data) {
      if (evt == "chat.msg") {
        this._OnChatMessage(data);
        return true;
      }
    }

    _OnChatMessage(message) {
      const chatMessage = {
        name: this._entity._accountInfo.name,
        text: message,
      };

      this.BroadcastChat(chatMessage);
    }

    BroadcastChat(chatMessage) {
      const nearby = this._entity.FindNear(50, true);
      for (let i = 0; i < nearby.length; ++i) {
        const n = nearby[i];
        n._parent._client.Send("chat.message", chatMessage);
      }
    }
  }

  class WorldNetworkClient extends WorldClient {
    constructor(client, entity) {
      super(client, entity);
    }
  }

  return {
    WorldNetworkClient: WorldNetworkClient,
  };
})();
