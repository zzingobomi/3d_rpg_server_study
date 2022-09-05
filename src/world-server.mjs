export const world_server = (() => {
  class SocketWrapper {
    socket_;
    onMessage;

    constructor(params) {
      this.socket_ = params.socket;
      this.onMessage = null;
      this.SetupSocket_();
    }

    get ID() {
      return this.socket_.id;
    }

    SetupSocket_() {
      this.socket_.on("user-connected", () => {
        console.log("socket.id: " + socket.id);
      });
      this.socket_.on("disconnect", () => {
        console.log("Client disconnected.");
      });
      // 서버에서는 안쓰는거 같은데..? 맞나?
      this.socket_.onAny((e, d) => {
        try {
          if (!this.onMessage(e, d)) {
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
      this.socket_.disconnect(true);
    }

    Send(msg, data) {
      this.socket_.emit(msg, data);
    }
  }

  class WorldServer {
    loginQueue_;
    worldMgr_;

    constructor(io) {
      this.SetupIO_(io);
    }

    SetupIO_(io) {
      io.on("connection", (socket) => {
        console.log(socket);
      });
    }
  }

  return {
    WorldServer: WorldServer,
  };
})();
