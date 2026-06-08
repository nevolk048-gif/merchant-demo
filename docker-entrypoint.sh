#!/bin/sh
set -e

# Replace PORT placeholder in nginx config
if [ -n "$PORT" ]; then
    sed -i "s/\${PORT:-80}/$PORT/g" /etc/nginx/conf.d/default.conf
fi

# Start nginx
exec nginx -g 'daemon off;'
