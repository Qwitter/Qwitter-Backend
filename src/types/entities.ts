import { Hashtag, Mention, Url } from '@prisma/client';

export type Entities = {
  hashtags: Hashtag[];
  mentions: Mention[];
  urls: Url[];
  media: { type: string; value: string }[];
};
