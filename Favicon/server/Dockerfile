FROM node:18

WORKDIR /home/node/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "main.js"]
