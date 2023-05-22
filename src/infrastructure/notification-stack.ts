import { fileURLToPath } from "node:url";
import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as events from "aws-cdk-lib/aws-events";
import * as eventsTargets from "aws-cdk-lib/aws-events-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { SquashEvent } from "../interfaces.js";

interface NotificationStackProps {
  messages: Array<{ cron: events.CronOptions; enabled?: boolean; content: SquashEvent }>;
}

export class NotificationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: NotificationStackProps) {
    super(scope, id);

    const fn = new lambda.Function(this, "SenderLambda", {
      code: lambda.Code.fromAsset(fileURLToPath(new URL("../lambda", import.meta.url))),
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      timeout: cdk.Duration.seconds(30),
      environment: {
        BOT_TOKEN: process.env.BOT_TOKEN!,
      },
    });
    fn.addToRolePolicy(
      new iam.PolicyStatement({ actions: ["ssm:PutParameter", "ssm:GetParameter"], resources: ["*"] })
    );

    for (const [index, message] of Object.entries(props.messages)) {
      new events.Rule(this, "Message" + index, {
        enabled: message.enabled,
        targets: [new eventsTargets.LambdaFunction(fn, { event: events.RuleTargetInput.fromObject(message.content) })],
        // https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html#eb-cron-expressions
        schedule: events.Schedule.cron(message.cron),
      });
    }
  }
}
