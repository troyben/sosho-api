FROM node:21.7.1 AS build

WORKDIR /microservice/gatekeeper

COPY package*.json .
COPY yarn.lock .
COPY .env.development .
COPY .env.production .

RUN yarn install

COPY . .

RUN yarn run build

#Production stage
FROM node:21.7.1 AS production

WORKDIR /microservice/gatekeeper

COPY package*.json .
COPY yarn.lock .
COPY .env.development .
COPY .env.production .

RUN yarn --frozen-lockfile --production

COPY --from=build /microservice/gatekeeper/dist ./dist

EXPOSE 5001

CMD ["yarn", "start"]
