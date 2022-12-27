import fs from "fs";
import * as cdk from "aws-cdk-lib";
import * as events from "aws-cdk-lib/aws-events";
import * as eventsTargets from "aws-cdk-lib/aws-events-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { SquashEvent } from "../interfaces.js";

interface NotificationStackProps {
  messages: Array<{ cron: events.CronOptions; content: SquashEvent }>;
}

export class NotificationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: NotificationStackProps) {
    super(scope, id);

    const fn = new lambda.Function(this, "SenderLambda", {
      code: lambda.Code.fromInline(fs.readFileSync(new URL("../lambda/index.js", import.meta.url), "utf-8")),
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      timeout: cdk.Duration.seconds(5),
      environment: {
        BOT_TOKEN: process.env.BOT_TOKEN!,
      },
    });

    for (const [index, message] of Object.entries(props.messages)) {
      new events.Rule(this, "Message" + index, {
        targets: [new eventsTargets.LambdaFunction(fn, { event: events.RuleTargetInput.fromObject(message.content) })],
        schedule: events.Schedule.cron(message.cron),
      });
    }
  }
}
