# Multi-stage build for Vite + React app
FROM node:24.8.0-alpine AS builder

WORKDIR /app

ARG VITE_BASE_PATH=/dms-ui
ENV VITE_BASE_PATH=$VITE_BASE_PATH

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm ci

# Copy source and build the app
COPY . .
RUN npm run build

# Runtime image
FROM nginx:1.27-alpine AS runner

# Serve SPA with history API fallback
RUN cat <<'EOF' > /etc/nginx/conf.d/default.conf
server {
	listen 3000;
	server_name _;

	root /usr/share/nginx/html;
	index index.html;

	# Never rewrite static assets to index.html.
	# If an asset is missing, return 404 so the issue is visible immediately.
	location ^~ /assets/ {
		try_files $uri =404;
	}

	location ^~ /dms-ui/assets/ {
		rewrite ^/dms-ui/assets/(.*)$ /assets/$1 break;
		try_files $uri =404;
	}

	# Root deployment support
	location / {
		try_files $uri $uri/ /index.html;
	}

	# Prefix deployment support (e.g. /dms-ui/) when upstream keeps the prefix
	location = /dms-ui {
		return 301 /dms-ui/;
	}

	location /dms-ui/ {
		rewrite ^/dms-ui/(.*)$ /$1 break;
		try_files $uri $uri/ /index.html;
	}

	location = /50x.html {
		root /usr/share/nginx/html;
	}
}
EOF

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
