import "dotenv/config";
import { handler } from "./dist/lambda/index.js";

await handler({
  chatId: -1001602845818,
  forwardChatId: [-1001602845818],
  poll: { question: "Test", options: ["yes", "no"] },
});
