# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# アプリケーションコードをコピー
COPY . .

# ビルド
RUN npm run build

# アプリケーションを起動
EXPOSE 3000

CMD ["npm", "start"]