# Stage 1: Build the React application
FROM node:21 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
ARG API_URL
ENV REACT_APP_API_URL=${API_URL}
RUN REACT_APP_API_URL=${API_URL} npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 80
CMD ["/entrypoint.sh"]