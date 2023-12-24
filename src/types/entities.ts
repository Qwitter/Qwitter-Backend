import { Hashtag, Url } from '@prisma/client';

export type Entities = {
  hashtags: Hashtag[];
  mentions: string[];
  urls: Url[];
  media: { type: string; value: string }[];
};
