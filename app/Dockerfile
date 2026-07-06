# Vype Lounge — Node/Docker deploy (replaces the Cloudflare Workers target).
# Build with bun (this repo's package manager: bun.lock, workspace:* deps in
# packages/*), run with plain Node — better-sqlite3 needs a real node_modules
# on disk, which the Workers runtime never had.

FROM node:22-bookworm-slim AS deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates unzip python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"
WORKDIR /app
COPY package.json bun.lock bunfig.toml ./
COPY packages/fnf/package.json packages/fnf/package.json
COPY packages/fnf-react/package.json packages/fnf-react/package.json
COPY packages/quanta/package.json packages/quanta/package.json
RUN bun install --frozen-lockfile

FROM deps AS build
WORKDIR /app
COPY . .
RUN bun run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/package.json ./package.json

ENV DB_PATH=/data/vype.db
ENV UPLOADS_DIR=/data/uploads
ENV MIGRATIONS_DIR=/app/migrations
ENV PORT=3000
VOLUME ["/data"]
EXPOSE 3000

CMD ["node", "server/node-entry.mjs"]
