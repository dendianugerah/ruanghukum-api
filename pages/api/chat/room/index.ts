import { Server } from "socket.io";
import { createServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";

const httpServer = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.write("WebSocket server is active");
  res.end();
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (data) => {
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

interface ChatRoomApiRequest extends NextApiRequest {
  body: {
    message: string;
  };
}

httpServer.listen(3001, () => {
  console.log("Socket server listening on *:3000");
});

export default async function handler(
  req: ChatRoomApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    const { message } = req.body;

    io.emit("message", { message });

    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
