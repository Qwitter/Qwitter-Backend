import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import prisma from '../client';
import { AppError } from '../utils/appError';
import { User } from '@prisma/client';


export const createConversation=catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{
        const users=req.body.users as Array<string>
        let usersIDs=[]
        const authUser=req.user as User
        let newConv
        for(var user of users)
        {
            let tempUser=await prisma.user.findUnique({where:{userName:user.toLowerCase(),deletedAt:null},select:{id:true,name:true}});
            if(!tempUser)
                return next(new AppError("not all users are found", 401));
            if(tempUser.id==authUser.id)
                return next(new AppError("can't create conversation with yourself", 402));
            usersIDs.push(tempUser);
        }
        if (users.length==1)
        {
            let tempConv=await prisma.conversation.findFirst({
                where:{AND:
                    [{
                    isGroup:false,
                    UserConversations:{ 
                        some:{
                            userId:usersIDs[0].id
                        }
                    }},
                    {
                        isGroup:false,
                        UserConversations:{ 
                            some:{
                                userId:(authUser).id
                            }
                        }}    
                ]
                }
            })
            if(tempConv)
                return next(new AppError("Conversation already exists", 404));
             newConv=await prisma.conversation.create({
                data:{
                    name:authUser.name+", "+usersIDs[0].name,
                    isGroup:true,
                    lastActivity:new Date(),
                    UserConversations:{
                        create:[
                            {userId:authUser.id,seen:true},
                            {userId:usersIDs[0].id,seen:false},
                        ]
                    }
                }
            })

        }
        else{
            newConv=await prisma.conversation.create({
                data:{
                    name:req.body.conversation_name,
                    lastActivity:new Date(),
                    isGroup:true,
                    UserConversations:{
                        create:[{userId:authUser.id,seen:true}]
                    }
                }
            })
            for(var tempUser of usersIDs)
               await prisma.userConversations.create({
                    data:{
                        conversationId:newConv.id,
                        userId:tempUser.id,
                        seen:false
                    }
                })
        }   
        res.json(newConv).status(200)
        next()

    }
)



export const deleteConversation=catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{
        const authUser=req.user as User
        const conv=await prisma.conversation.findUnique({
            where:{
                id:req.params.id,
                UserConversations:{
                    some:{
                        userId:authUser.id
                    }
                }
            }
        })
        if(!conv)
         return next(new AppError("conversation not found", 401));
        
        const deletedConv=await prisma.userConversations.delete({
            where:{
                userId_conversationId:{userId:authUser.id,conversationId:conv.id}
            }
        })
        if(deletedConv)
         res.json({operation_success:true}).status(200)
        else
        res.json({operation_success:false}).status(404)
        next()
    }
)




export const getConversation=catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{
        const authUser=req.user as User
        const { page = '1', limit = '10' } = req.query;
        const parsedPage = parseInt(page as string, 10);
        const parsedLimit = parseInt(limit as string, 10);    
        const skip = (parsedPage - 1) * parsedLimit;
        let convs=await prisma.conversation.findMany({
            where:{
                UserConversations:{
                    some:{
                        userId:authUser.id,
                    },
                    
                }
            },
            select:{
                id:true,
                Message:{
                    orderBy:{
                        date:'desc'
                    },
                    take:1,
                    select:{
                        id:true,
                        text:true,
                        date:true,
                        sender:{
                            select:{
                                userName:true,
                                profileImageUrl:true,
                            }
                        },
                    }
                },
                name:true,
                lastActivity:true,
                
            },
            orderBy:{
                lastActivity:'desc'
            },
            skip:skip,
            take: parsedLimit,
        })
        res.json(convs).status(200)
        next()
    }
)