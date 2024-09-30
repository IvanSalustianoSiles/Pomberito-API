import { Server } from "socket.io";

const initSocket = (httpServer) => {

  const socketServer = new Server(httpServer);

  socketServer.on("connection", (socketClient) => {
    console.log(`Cliente conectado; ID: ${socketClient.id}`);
  });

  return socketServer;
};

export default initSocket;
