import "dotenv/config";
import * as cdk from "aws-cdk-lib";
import { NotificationStack } from "./notification-stack.js";

const app = new cdk.App();

new NotificationStack(app, "StagingNotificationsStack", {
  messages: [
    {
      cron: { hour: "*", weekDay: "2", minute: "30" },
      content: {
        chatId: -842671953,
        poll: {
          question: "Works",
          options: ["yes", "no"],
        },
        forwardChatId: [],
      },
    },
  ],
});
