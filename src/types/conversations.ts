export type Message = {
  isMessage: boolean;
  id: string;
  text: string;
  date: string;
  userName: string;
  profileImageUrl: string;
  replyToMessage: Message;
  entities: {
    hasthtags: { text: string; count: 15 }[];
    media: { value: string; type: string; id: string }[];
    mentions: string[];
  };
};

export type conversation = {
  seen: boolean;
  id?: string;
  name: string;
  photo: string;
  isGroup: boolean;
  users: conversationWithUser[];
  lastMessage?: Message;
  messages: Message[];
};

export type conversationWithUser = {
  name: string;
  userName: string;
  profileImageUrl: string;
};
