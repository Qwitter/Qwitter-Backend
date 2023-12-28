import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().$extends({
  name: 'incrementReadCount',
  query: {
    tweet: {
      async findUnique({ args, query }: { args: any; query: any }) {
        if (args.where?.id)
          await prisma.tweet.update({
            where: {
              id: args.where?.id as string,
            },
            data: {
              readCount: { increment: 1 },
            },
          });
        return await query(args);
      },
    },
  },
});
export default prisma;
