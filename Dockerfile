
FROM registry.cn-hangzhou.aliyuncs.com/skylark/saler-nginx:1.18.0-alpine
COPY ./nginx.conf /etc/nginx/conf.d
COPY ./population_base /usr/share/nginx/html/population_base
WORKDIR /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]

