FROM node:18 AS build

WORKDIR /app

COPY ./package.json ./package-lock.json /app/

RUN npm install

COPY . /app

RUN ls -a

RUN npm run build 

# 프로덕션 스테이지
FROM nginx:1.21.4-alpine

# nginx 실행 전 default.conf 파일 수정
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 이미지에서 생성된 dist 폴더를 nginx 이미지로 복사
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
