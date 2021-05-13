FROM node:14

# create & set working directory
WORKDIR /app

# copy source files
COPY . /app

# install dependencies
RUN npm install

RUN npm install pm2 -g

# start app
EXPOSE 8080

CMD ["pm2-runtime", "start", "server.js", "-i", "max"]
