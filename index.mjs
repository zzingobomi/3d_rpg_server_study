import * as http from "http";
import * as socket_io from "socket.io";

function Main() {
  const port = process.env.PORT || 11000;

  const server = http.createServer();
  const io = new socket_io.Server(server, {
    cors: {
      origin: "*",
    },
  });

  server.listen(port, () => {
    console.log("listening on: *", port);
  });
}

Main();
