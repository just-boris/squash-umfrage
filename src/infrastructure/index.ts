import "dotenv/config";
import * as cdk from "aws-cdk-lib";
import { NotificationStack } from "./notification-stack.js";

const app = new cdk.App();

new NotificationStack(app, "StagingNotificationsStack", {
  messages: [
    {
      enabled: false,
      cron: { weekDay: "THU", hour: "*", minute: "*/10" },
      content: {
        chatId: -1001602845818,
        poll: {
          question: "Works %P3D%",
          options: ["yes", "no"],
        },
        forwardChatId: [],
      },
    },
  ],
});

new NotificationStack(app, "ProdNotificationsStack", {
  messages: [
    {
      enabled: true,
      cron: { weekDay: "MON", hour: "16", minute: "00" },
      content: {
        chatId: -1001519346484,
        poll: {
          question: "Squash Wednesday %P2D%, 10:00, Lichtenberg",
          options: ["Yes", "No"],
        },
        // forwardChatId: [],
        forwardChatId: [-1001886657069],
      },
    },
    {
      cron: { weekDay: "WED", hour: "13", minute: "00" },
      content: {
        chatId: -1001886657069,
        poll: {
          question: "Squash Saturday %P3D%, Lichtenberg",
          options: ["11:45", "12:30", "Skip"],
        },
        // forwardChatId: [],
        forwardChatId: [-1001519346484],
      },
    },
    {
      cron: { weekDay: "THU", hour: "14", minute: "00" },
      content: {
        chatId: -1001519346484,
        poll: {
          question: "Сквош Lichtenberg в воскресенье %P3D%, 18:30",
          options: ["Буду", "Нет"],
        },
        forwardChatId: [],
      },
    },
  ],
});
