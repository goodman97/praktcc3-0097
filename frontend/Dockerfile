##FROM nginx:alpine

##COPY . /usr/share/nginx/html

##RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf

##EXPOSE 8080

##CMD ["nginx", "-g", "daemon off;"]

FROM node:18-alpine
WORKDIR /frontend/
COPY public/ /frontend/public
COPY src/ /frontend/src
COPY package.json /frontend/
RUN npm install
CMD ["npm", "start"]