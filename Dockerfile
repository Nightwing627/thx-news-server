FROM node:16.17.0

WORKDIR /app

COPY package*.json

RUN npm i

COPY . .

ENV PORT=4000
ENV MONGO_URI=mongodb+srv://Vp12ChzI7CPg:5f1MSQM3grj9PYhQUcHZPa@thxnews.ecnpe4i.mongodb.net/thxData?retryWrites=true&w=majority
ENV SECRET=qgYC0tbVvPHF7Nqd0xuGGXfWgn2q
ENV NODE_ENV='production'

EXPOSE 4000

CMD ["npm" , "run start"]