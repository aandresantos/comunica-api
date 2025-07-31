FROM  node:20.19-alpine3.22 AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./

RUN pnpm install

COPY . .

RUN pnpm build


FROM node:20.19-alpine3.22 AS production

ENV NODE_ENV=production

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./

RUN pnpm install --prod

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/drizzle ./drizzle

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["node", "dist/server.js"]