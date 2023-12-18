// import prisma from '../client';

// prisma.$on('query',async (e)=>{
//   console.log("sdf")
//   if(e.model=='tweet' && e.action.startsWith('find'))
//   {

//     const tweetID=e.args?.where?.id
//     if(tweetID)
//     {
//       await prisma.tweet.update({
//         where:{
//           id:tweetID
//         },
//         data:{
//           readCount:{increment:1}
//         }
//       })
//     }
//   }
// })