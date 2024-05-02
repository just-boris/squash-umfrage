import { fileURLToPath } from "node:url";
import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as events from "aws-cdk-lib/aws-events";
import * as eventsTargets from "aws-cdk-lib/aws-events-targets";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { SquashEvent } from "../interfaces.js";

interface NotificationStackProps {
  messages: Array<{
    startPollCron: events.CronOptions;
    stopPollCron?: events.CronOptions;
    enabled?: boolean;
    content: SquashEvent;
  }>;
}

export class NotificationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: NotificationStackProps) {
    super(scope, id);

    const code = lambda.Code.fromAsset(fileURLToPath(new URL("../lambda", import.meta.url)));

    const startPollFn = new lambda.Function(this, "SendPollLambda", {
      code,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.sendPollHandler",
      timeout: cdk.Duration.seconds(30),
      environment: {
        BOT_TOKEN: process.env.BOT_TOKEN!,
      },
    });
    startPollFn.addToRolePolicy(
      new iam.PolicyStatement({ actions: ["ssm:PutParameter", "ssm:GetParameter"], resources: ["*"] })
    );

    const stopPollFn = new lambda.Function(this, "StopPollLambda", {
      code,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.stopPollHandler",
      timeout: cdk.Duration.seconds(30),
      environment: {
        BOT_TOKEN: process.env.BOT_TOKEN!,
      },
    });
    stopPollFn.addToRolePolicy(new iam.PolicyStatement({ actions: ["ssm:GetParameter"], resources: ["*"] }));

    for (const [index, message] of Object.entries(props.messages)) {
      new events.Rule(this, "StartPollCron" + index, {
        enabled: message.enabled,
        targets: [
          new eventsTargets.LambdaFunction(startPollFn, { event: events.RuleTargetInput.fromObject(message.content) }),
        ],
        // https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html#eb-cron-expressions
        schedule: events.Schedule.cron(message.startPollCron),
      });

      if (message.stopPollCron) {
        new events.Rule(this, "StopPollCron" + index, {
          enabled: message.enabled,
          targets: [
            new eventsTargets.LambdaFunction(stopPollFn, {
              event: events.RuleTargetInput.fromObject(message.content),
            }),
          ],
          schedule: events.Schedule.cron(message.stopPollCron),
        });
      }
    }
  }
}
