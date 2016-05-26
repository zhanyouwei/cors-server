FROM node

# Build app
RUN mkdir -p /usr/src/app-home
WORKDIR /usr/src/app-home
COPY . /usr/src/app-home

RUN npm install

EXPOSE 9000

CMD npm start
