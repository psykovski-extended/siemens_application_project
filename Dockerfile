FROM node:16

WORKDIR /usr/src/app

COPY . .

WORKDIR /usr/src/app/webserver

EXPOSE 80

RUN npm install

WORKDIR /usr/src/app/c_binary_reader

RUN apt-get -y install gcc

RUN gcc ./read_binary.c -o ./build/read_binary

WORKDIR /usr/src/app/webserver

CMD ["node", "./index.js"]
