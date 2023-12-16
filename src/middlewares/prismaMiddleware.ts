import prisma from '../client';

prisma.$use(async (params,next)=>{
    if((params.action=="findMany" ||params.action=="findUnique" || params.action=="findFirst")&& params.model=="Tweet"){
      console.log(params)
    }
    next(params)
  })
