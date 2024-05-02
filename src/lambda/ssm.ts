import { ParameterNotFound, ParameterType, SSM } from "@aws-sdk/client-ssm";

const ssmClient = new SSM({ region: process.env.AWS_REGION });

export async function getLastMessage(chatId: number) {
  try {
    const lastMessage = await ssmClient.getParameter({ Name: `/PinnedMessage/${chatId}` });
    const value = lastMessage.Parameter?.Value;
    return value ? parseInt(value, 10) : undefined;
  } catch (error) {
    if (error instanceof ParameterNotFound) {
      return undefined;
    }
    throw error;
  }
}

export async function setLastMessage(chatId: number, messageId: number) {
  await ssmClient.putParameter({
    Name: `/PinnedMessage/${chatId}`,
    Value: `${messageId}`,
    Type: ParameterType.STRING,
    Overwrite: true,
  });
}
