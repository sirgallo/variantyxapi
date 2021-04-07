FROM node:lts-alpine

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 2020-2030

CMD ["npm", "start"]