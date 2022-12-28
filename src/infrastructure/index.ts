import "dotenv/config";
import * as cdk from "aws-cdk-lib";
import { NotificationStack } from "./notification-stack.js";

const app = new cdk.App();

new NotificationStack(app, "StagingNotificationsStack", {
  messages: [
    // {
    //   cron: { weekDay: "WED", hour: "*", minute: "48" },
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
      cron: { weekDay: "TUE", hour: "16", minute: "00" },
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
      cron: { weekDay: "FRI", hour: "16", minute: "00" },
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
