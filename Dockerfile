FROM nginx:alpine

# Remove default nginx config and content
RUN rm /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/eai-website.conf

# Copy static website files
COPY index.html /usr/share/nginx/html/
COPY index-light.html /usr/share/nginx/html/
COPY index-dark.html /usr/share/nginx/html/
COPY news.html /usr/share/nginx/html/
COPY news-article.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY news-loader.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY styles-light.css /usr/share/nginx/html/
COPY styles-dark.css /usr/share/nginx/html/
COPY logo.svg /usr/share/nginx/html/
COPY logo-light.svg /usr/share/nginx/html/
COPY favicon.svg /usr/share/nginx/html/
COPY icon-academy.png /usr/share/nginx/html/
COPY icon-incubator.png /usr/share/nginx/html/
COPY favicon-transparent.png /usr/share/nginx/html/
COPY hero-bg.png /usr/share/nginx/html/
COPY stat-icon-ph.png /usr/share/nginx/html/
COPY stat-icon-learn.png /usr/share/nginx/html/
COPY stat-icon-builder.png /usr/share/nginx/html/
COPY news/ /usr/share/nginx/html/news/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
