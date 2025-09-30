# Stage 1: build the application client
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

#Stage 2: Serve the application with NGINX
FROM nginx:alpine
COPY --from=build /app/dist/soap-client/browser /usr/share/nginx/html
COPY soapjournal.org /etc/nginx/conf.d/default.conf
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]