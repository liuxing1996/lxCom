FROM nginx:1.19.6
COPY dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
EXPOSE 80/tcp
ENTRYPOINT ["/usr/sbin/nginx"]
CMD ["-g","daemon off;"]
