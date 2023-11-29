import prisma from '../client';
import { Entities } from '../types/entities';
export const getMention = async (userId: string) => {
  return await prisma.mention.findUnique({
    where: {
      userId: userId,
    },
  });
};
export const getTweetEntities = async (tweetId: string) => {
  let entities: Entities = { hashtags: [], mentions: [], urls: [], media: [] };
  const relations = await prisma.tweetEntity.findMany({
    where: {
      tweetId: tweetId,
    },
  });
  for (const relation of relations) {
    const entity = await prisma.entity.findUnique({
      where: {
        id: relation.entityId,
      },
      include: {
        Mention: true,
        Hashtag: true,
        Url: true,
        Media: true,
      },
    });
    if (entity?.Mention) {
      entities.mentions.push(entity.Mention);
    } else if (entity?.Hashtag) {
      entities.hashtags.push(entity.Hashtag);
    } else if (entity?.Url) {
      entities.urls.push(entity.Url);
    } else if (entity?.Media) {
      const newMedia = { value: entity.Media.url, type: entity.Media.type };
      entities.media.push(newMedia);
    }
  }
  return entities;
};

// export const getHashtag = async (type: string) => {};
// export const getUrl = async (type: string) => {};

export const createEntity = async (type: string) => {
  const newEntity = await prisma.entity.create({
    data: {
      type: type,
    },
  });
  return newEntity;
};
export const createEntityTweet = async (tweet: string, entity: string) => {
  const newRelation = await prisma.tweetEntity.create({
    data: {
      tweetId: tweet,
      entityId: entity,
    },
  });
  return newRelation;
};
export const createHashtag = async (entityId: string, text: string) => {
  const createdHashtag = await prisma.hashtag.create({
    data: {
      text: text,
      entityId: entityId,
      count: 0,
    },
  });
  return createdHashtag;
};
export const createMention = async (userId: string) => {
  const createdEntity = await createEntity('mention');
  const createdmention = await prisma.mention.create({
    data: {
      userId: userId,
      entityId: createdEntity.id,
    },
  });
  return createdmention;
};
export const createMedia = async (mediaName: string) => {
  const createdEntity = await createEntity('media');
  const url = process.env.url?.startsWith('http')
    ? process.env.URL
    : 'http://' + process.env.URL;
  const createdMedia = await prisma.media.create({
    data: {
      url: `${url}/imgs/tweet/${mediaName}`,
      entityId: createdEntity.id,
      type: getFileTypeByExtension(mediaName),
    },
  });
  return createdMedia;
};
function getFileTypeByExtension(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'image';
    case 'gif':
      return 'image/gif';
    case 'mp4':
    case 'mpeg':
      return 'video';
    default:
      return 'media'; // Unknown extension
  }
}
export const incrementHashtagCount = async (text: string) => {
  await prisma.hashtag.update({
    where: {
      text: text,
    },
    data: {
      count: { increment: 1 },
    },
  });
};

export const searchHastagsByWord = async (text: string) => {
  if (!text) {
    return await prisma.hashtag.findMany();
  }
  return await prisma.hashtag.findMany({
    where: {
      text: {
        contains: text,
        mode: 'insensitive',
      },
    },
  });
};
