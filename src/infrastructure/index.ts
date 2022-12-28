import "dotenv/config";
import * as cdk from "aws-cdk-lib";
import { NotificationStack } from "./notification-stack.js";

const app = new cdk.App();

new NotificationStack(app, "StagingNotificationsStack", {
  messages: [
    // {
    //   cron: { hour: "*", weekDay: "WED", minute: "48" },
    //   content: {
    //     chatId: -842671953,
    //     poll: {
    //       question: "Works",
    //       options: ["yes", "no"],
    //     },
    //     forwardChatId: [],
    //   },
    // },
  ],
});

new NotificationStack(app, "ProdNotificationsStack", {
  messages: [
    {
      cron: { hour: "16", weekDay: "TUE", minute: "00" },
      content: {
        chatId: -1519346484,
        poll: {
          question: "Сквош Lichtenberg в среду, 10:00",
          options: ["Буду", "Нет"],
        },
        forwardChatId: [],
      },
    },
    {
      cron: { hour: "16", weekDay: "FRI", minute: "00" },
      content: {
        chatId: -1519346484,
        poll: {
          question: "Сквош у деда в воскресенье, 18:00",
          options: ["Буду", "Нет"],
        },
        forwardChatId: [],
      },
    },
  ],
});
