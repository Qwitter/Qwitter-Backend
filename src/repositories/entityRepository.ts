import { uploadImage } from '../middlewares/uploadMiddleware';
import prisma from '../client';
import { Entities } from '../types/entities';
import { getUserByUsername } from './userRepository';
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
export const getMessageEntities = async (messageId: string) => {
  let entities: any = { hashtags: [], mentions: [], urls: [], media: [] };
  const relations = await prisma.messageEntity.findMany({
    where: { messageId },
    include: {
      entity: {
        include: {
          Mention: {
            select: {
              mentionedUser: {
                select: {
                  userName: true,
                },
              },
            },
          },
          Hashtag: {
            select: {
              text: true,
              count: true,
            },
          },
          Url: {
            select: {
              text: true,
            },
          },
          Media: true,
        },
      },
    },
  });
  for (const relation of relations) {
    const entity = relation.entity;
    if (entity?.Mention) {
      entities.mentions.push(entity.Mention.mentionedUser.userName);
    } else if (entity?.Hashtag) {
      entities.hashtags.push(entity.Hashtag);
    } else if (entity?.Url) {
      entities.urls.push(entity.Url.text);
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
export const createEntityMessage = async (
  messageId: string,
  entity: string,
) => {
  const newRelation = await prisma.messageEntity.create({
    data: {
      messageId,
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
      count: 1,
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
export const createMedia = async (mediaName: string, folder: string) => {
  const createdEntity = await createEntity('media');
  const url = await uploadImage('public/imgs/' + folder, mediaName);
  const createdMedia = await prisma.media.create({
    data: {
      url: url,
      entityId: createdEntity.id,
      type: getFileTypeByExtension(mediaName),
    },
  });
  return createdMedia;
};
export const getImagePath = (fileName: string, domain: string) => {
  const url = process.env.url?.startsWith('http')
    ? process.env.URL
    : 'http://' + process.env.URL;
  return `${url}/imgs/${domain}/${fileName}`;
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

export const searchHastagsByWord = async (text: string | null) => {
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

export const extractEntities = async (text: string) => {
  // Extracting entities
  const hashtags = extractHashtags(text);
  const mentions = extractMentions(text);
  // const urls = extractUrls(text);
  // const media = req.body.media;

  // Creating entities and linking it with tweet

  let entitiesId: string[] = [];
  let hashmap = new Map<string, boolean>();
  // Processing Hashtags
  for (const hashtag of hashtags) {
    let entityId: string = '';
    const existingHashtag = await prisma.hashtag.findFirst({
      where: {
        text: hashtag,
      },
    });
    let isRepeated = false;
    if (hashmap.has(hashtag)) isRepeated = true;
    hashmap.set(hashtag, true);
    if (existingHashtag) {
      if (isRepeated) break;
      await incrementHashtagCount(hashtag);
      entityId = existingHashtag.entityId;
    } else {
      const newEntity = await createEntity('hashtag');
      entityId = newEntity.id;
      await createHashtag(entityId, hashtag);
    }
    if (!entitiesId.includes(entityId)) entitiesId.push(entityId);
  }

  // Processing Mentions

  for (const mention of mentions) {
    let entityId: string = '';
    const existingUser = await getUserByUsername(mention);
    if (!existingUser) continue;
    const existingMention = await getMention(existingUser.id);
    if (existingMention) {
      entityId = existingMention.entityId;
    } else {
      const newMention = await createMention(existingUser.id);
      entityId = newMention.entityId;
    }
    if (!entitiesId.includes(entityId)) entitiesId.push(entityId);
  }
  return entitiesId;
};

function extractHashtags(inputString: string): string[] {
  // Regular expression to find hashtags
  const hashtagRegex = /#(\w+)/g;
  // Use match() to find all occurrences of the hashtag pattern in the input string
  const hashtags = inputString.match(hashtagRegex);
  // If there are hashtags, return them; otherwise, return an empty array
  return hashtags ? hashtags : [];
}
function extractMentions(inputString: string): string[] {
  const mentionRegex = /@(\w+)/g;
  // Use match() to find all occurrences of the mention pattern in the input string
  const mentions = inputString.match(mentionRegex);
  // If there are mentions, return them; otherwise, return an empty array
  return mentions ? mentions : [];
}
