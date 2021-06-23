FROM node:alpine

WORKDIR /home/projeto-vacina/

RUN mkdir censo

COPY ./package.json ./censo
COPY ./js ./censo/js

RUN cd censo && npm install

EXPOSE 4000

WORKDIR /home/projeto-vacina/censo

CMD ["npm", "run", "start-prod"]