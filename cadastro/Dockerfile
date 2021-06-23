FROM node:alpine

WORKDIR /home/projeto-vacina/

RUN mkdir cadastro

COPY ./ ./cadastro

RUN cd cadastro && npm install

EXPOSE 3000

WORKDIR /home/projeto-vacina/cadastro

CMD ["npm", "run", "start-prod"]