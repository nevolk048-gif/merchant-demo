FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY index.html integration.html webhook.html ./

RUN echo 'server { \
    listen $PORT; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri.html $uri/ =404; \
    } \
}' > /etc/nginx/conf.d/default.conf.template && \
    rm /etc/nginx/conf.d/default.conf

CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
