FROM node:alpine

WORKDIR /home/projeto-vacina/

RUN mkdir alerta

COPY ./ ./alerta

RUN cd alerta && npm install

EXPOSE 2000

WORKDIR /home/projeto-vacina/alerta

CMD ["npm", "run", "start"]