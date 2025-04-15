FROM mcr.microsoft.com/devcontainers/javascript-node:18

# 필요한 시스템 패키지 설치
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    gnupg \
    curl \
    wget \
    redis-server

# MongoDB 도구 설치 - mongodb-clients 대신 mongodb-database-tools 사용
# 또는 mongodb-org-tools로 시도
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    mongodb-database-tools || echo "mongodb-database-tools를 찾을 수 없습니다. MongoDB Shell만 설치합니다."

# MongoDB Shell(mongosh) 설치 - 공식 MongoDB 리포지토리 사용
RUN curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
    gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor && \
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/debian bullseye/mongodb-org/6.0 main" | \
    tee /etc/apt/sources.list.d/mongodb-org-6.0.list && \
    apt-get update && \
    apt-get install -y mongodb-mongosh

# Redis 설정
RUN sed -i 's/bind 127.0.0.1/bind 0.0.0.0/g' /etc/redis/redis.conf

# 전역 npm 패키지 설치
RUN npm install -g pnpm@latest

# SvelteKit 및 MongoDB 관련 패키지 설치 준비
RUN npm install -g npm-check-updates
