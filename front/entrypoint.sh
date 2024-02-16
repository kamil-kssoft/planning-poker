#!/bin/sh

# Replace API_URL placeholder in JS files with the actual API URL passed via environment variable
find /usr/share/nginx/html/static/js -type f -name "*.js" -exec sed -i "s,API_URL_PLACEHOLDER,${API_URL},g" {} +

# Start nginx
nginx -g 'daemon off;'