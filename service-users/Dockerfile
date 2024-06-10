FROM node:21.7.1-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn run build

EXPOSE 8081

CMD [ "yarn", "start"]
