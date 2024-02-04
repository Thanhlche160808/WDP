// ** Service
import commentService from "./comment.service";

class SocketService {
  connection(socket) {
      socket.on("comment",  async (data) => {
        const comment = await commentService.newComment(data);
        socket.emit('comment', comment);
      });
  }
}

export default new SocketService();
