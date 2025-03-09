FROM mcr.microsoft.com/devcontainers/javascript-node:18

# 추가 패키지 설치
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends redis-server

# Redis 설정
RUN sed -i 's/bind 127.0.0.1/bind 0.0.0.0/g' /etc/redis/redis.conf

# 전역 npm 패키지 설치
RUN npm install -g pnpm@latest