import { Hashtag, Media, Mention, Url } from '@prisma/client';

export type Entities = {
  hashtags: Hashtag[];
  mentions: Mention[];
  urls: Url[];
  media: Media[];
};
