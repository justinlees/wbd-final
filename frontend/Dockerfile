FROM node:18 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve the build using nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

# Replace default nginx.conf with a custom one
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
