export const world_client = (() => {
  class WorldClient {
    _entity;
    constructor(client, entity) {
      this._entity = entity;
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
      // const nearby = this.entity_.FindNear(50, true);
      // for (let i = 0; i < nearby.length; ++i) {
      //   const n = nearby[i];
      //   n.parent_.client_.Send('chat.message', chatMessage);
      // }
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
