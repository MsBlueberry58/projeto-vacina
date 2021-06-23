FROM node:alpine

WORKDIR /home/projeto-vacina/

RUN mkdir barramento

COPY ./ ./barramento

RUN cd barramento && npm install

EXPOSE 1000

WORKDIR /home/projeto-vacina/barramento

CMD ["npm", "run", "start-prod"]