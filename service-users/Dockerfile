FROM node:21.7.1

WORKDIR /usr/src/app

COPY package*.json ./
COPY .env.development ./

RUN yarn install

COPY . .

RUN yarn run build

EXPOSE 8081

CMD [ "yarn", "start"]
