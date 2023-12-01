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
            let tempUser=await prisma.user.findUnique({where:{userName:user.toLowerCase()},select:{id:true,name:true}});
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
                    type:"direct",
                    UserConversations:{ 
                        some:{
                            userId:usersIDs[0].id
                        }
                    }},
                    {
                        type:"direct",
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
                    type:"direct",
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
                    type:"group",
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

    }

)