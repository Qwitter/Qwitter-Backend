import { uploadImage } from '../middlewares/uploadMiddleware';
import prisma from '../client';
import { Entities } from '../types/entities';
import { getUserByUsername } from './userRepository';
/**
 * returns mention object of the user
 */
export const getMention = async (userId: string) => {
  return await prisma.mention.findUnique({
    where: {
      userId: userId,
    },
  });
};

// export const getTweetEntities2 = async (tweetId: string) => {
//   let entities: Entities = { hashtags: [], mentions: [], urls: [], media: [] };
//   const relations =
//     (await prisma.tweetEntity.findMany({
//       where: {
//         tweetId: tweetId,
//       },
//     })) || [];
//   for (const relation of relations) {
//     const entity = await prisma.entity.findUnique({
//       where: {
//         id: relation.entityId,
//       },
//       include: {
//         Mention: {
//           include: {
//             mentionedUser: {
//               select: {
//                 userName: true,
//               },
//             },
//           },
//         },
//         Hashtag: true,
//         Url: true,
//         Media: true,
//       },
//     });
//     if (entity?.Mention) {
//       entities.mentions.push(entity.Mention.mentionedUser.userName as string);
//     } else if (entity?.Hashtag) {
//       entities.hashtags.push(entity.Hashtag);
//     } else if (entity?.Url) {
//       entities.urls.push(entity.Url);
//     } else if (entity?.Media) {
//       const newMedia = { value: entity.Media.url, type: entity.Media.type };
//       entities.media.push(newMedia);
//     }
//   }
//   return entities;
// };

/**
 * get all entities of a tweet
 */
export const getTweetEntities = async (tweetId: string) => {
  let entities: Entities = { hashtags: [], mentions: [], urls: [], media: [] };
  const relations =
    (await prisma.tweetEntity.findMany({
      where: {
        tweetId: tweetId,
      },
    })) || [];
  const entitiesIds = relations.map((relation) => {
    return relation.entityId;
  }) as string[];
  const relationEntities =
    (await prisma.entity.findMany({
      where: {
        id: {
          in: entitiesIds,
        },
      },
      include: {
        Mention: {
          include: {
            mentionedUser: {
              select: {
                userName: true,
              },
            },
          },
        },
        Hashtag: true,
        Url: true,
        Media: true,
      },
    })) || [];
  for (const entity of relationEntities) {
    if (entity?.Mention) {
      entities.mentions.push(entity.Mention.mentionedUser.userName as string);
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

/**
 * get all message entities by message id
 */
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

/**
 * check if tweet is retweeted ot not
 * @param {*} type - entity type {"mention" | "media" | "url" | "hashtag"}
 */
export const createEntity = async (type: string) => {
  const newEntity = await prisma.entity.create({
    data: {
      type: type,
    },
  });
  return newEntity;
};

/**
 * create a relation of entity for a tweet
 * @param {*} tweet - Tweet Id
 * @param {*} entity - Entity Id
 */
export const createEntityTweet = async (tweet: string, entity: string) => {
  const newRelation = await prisma.tweetEntity.create({
    data: {
      tweetId: tweet,
      entityId: entity,
    },
  });
  return newRelation;
};

/**
 * create a relation of entity for a message
 * @param {*} messageId - message Id
 * @param {*} entity - Entity Id
 */
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

/**
 * create a hashtag entity
 * @param {*} entityId - Entity Id
 * @param {*} text - hashtag text
 */
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

/**
 * create a mention entity
 * @param {*} userId - User Id
 */
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

/**
 * create a media entity
 * @param {*} mediaName - Media name
 * @param {*} folder - folder name
 */
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

/**
 * get image path
 * @param {*} fileName - file name
 * @param {*} domain - domain of imgs server
 */
export const getImagePath = (fileName: string, domain: string) => {
  const url = process.env.url?.startsWith('http')
    ? process.env.URL
    : 'http://' + process.env.URL;
  return `${url}/imgs/${domain}/${fileName}`;
};

/**
 * get file type from the extention
 * @param {*} filename - File name
 */
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

/**
 * increment hashtag count by hashtag text
 * @param {*} text - hashtag text
 */
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

/**
 * search hashtags by word return hashtag object array
 * @param {*} text - hashtag text (if not defined will return all hashtags)
 */
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

/**
 * extract entities from a string return entities id array
 * @param {*} text - string to be searched
 */
export const extractEntities = async (text: string) => {
  // Extracting entities
  const hashtags = extractHashtags(text);
  const mentions = extractMentions(text);
  // const urls = extractUrls(text);
  // const media = req.body.media;

  // Creating entities and linking it with tweet

  let entitiesId: string[] = [];
  // Processing Hashtags
  for (const hashtag of hashtags) {
    let entityId: string = '';
    const existingHashtag = await prisma.hashtag.findFirst({
      where: {
        text: hashtag,
      },
    });
    if (existingHashtag) {
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

  for (let mention of mentions) {
    let entityId: string = '';
    mention = mention.toLocaleLowerCase().substring(1);
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

/**
 * extract hashtags from a string return hashtags text array
 * @param {*} inputString - string to be searched
 */
function extractHashtags(inputString: string): string[] {
  // Regular expression to find hashtags
  const hashtagRegex = /#(\w+)/g;
  // Use match() to find all occurrences of the hashtag pattern in the input string
  let hashtags = inputString.match(hashtagRegex) as string[];
  // If there are hashtags, return them; otherwise, return an empty array
  hashtags = hashtags?.map((el) => {
    return el.toLocaleLowerCase();
  });
  return [...new Set(hashtags)];
}

/**
 * extract mentions from a string return mentions text array
 * @param {*} inputString - string to be searched
 */
function extractMentions(inputString: string): string[] {
  const mentionRegex = /@(\w+)/g;
  // Use match() to find all occurrences of the mention pattern in the input string
  let mentions = inputString.match(mentionRegex) as string[];
  // If there are mentions, return them; otherwise, return an empty array
  mentions = mentions?.map((el) => {
    return el.toLocaleLowerCase();
  });
  return [...new Set(mentions)];
}
