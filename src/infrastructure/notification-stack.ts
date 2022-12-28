import { fileURLToPath } from "node:url";
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
      code: lambda.Code.fromAsset(fileURLToPath(new URL("../lambda", import.meta.url).toString())),
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
        // https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html#eb-cron-expressions
        schedule: events.Schedule.cron(message.cron),
      });
    }
  }
}