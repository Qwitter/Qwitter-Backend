FROM node 

WORKDIR /app
COPY package.json /app
RUN npm install 
COPY . .
EXPOSE 3000
CMD ["sh", "-c", "npm run prisma:generate && npm run prisma:migrate && npm run build && npm start"]