import { login_queue } from "./login-queue.mjs";
import { world_manager } from "./world-manager.mjs";

export const world_server = (() => {
  class SocketWrapper {
    _socket;
    _onMessage;

    constructor(params) {
      this._socket = params.socket;
      this._onMessage = null;
      this.SetupSocket();
    }

    get ID() {
      return this._socket.id;
    }

    SetupSocket() {
      this._socket.on("user-connected", () => {
        console.log("socket.id: " + socket.id);
      });
      this._socket.on("disconnect", () => {
        console.log("Client disconnected.");
      });
      // 서버에서는 안쓰는거 같은데..? 맞나?
      this._socket.onAny((e, d) => {
        try {
          if (!this._onMessage(e, d)) {
            console.log("Unknown command (" + e + "), disconnected.");
            this.Disconnect();
          }
        } catch (err) {
          console.error(err);
          this.Disconnect();
        }
      });
    }

    Disconnect() {
      this._socket.disconnect(true);
    }

    Send(msg, data) {
      this._socket.emit(msg, data);
    }
  }

  class WorldServer {
    _loginQueue;
    _worldMgr;

    constructor(io) {
      this._loginQueue = new login_queue.LoginQueue((c, p) => {
        this._OnLogin(c, p);
      });

      this._worldMgr = new world_manager.WorldManager({ parent: this });

      this._SetupIO(io);
    }

    _SetupIO(io) {
      io.on("connection", (socket) => {
        this._loginQueue.Add(new SocketWrapper({ socket: socket }));
      });
    }

    _OnLogin(client, params) {
      this._worldMgr.Add(client, params);
    }

    Run() {}
  }

  return {
    WorldServer: WorldServer,
  };
})();
