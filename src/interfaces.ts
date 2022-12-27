export interface SquashEvent {
  chatId: number;
  forwardChatId: Array<number>;
  poll: {
    question: string;
    options: Array<string>;
  };
}
