FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Stage: Install dependencies
FROM base AS install
COPY package.json bun.lockb /usr/src/app/
RUN bun install --frozen-lockfile --production

# Stage: Release
FROM base AS release
COPY --from=install /usr/src/app/node_modules /usr/src/app/node_modules
COPY . .

USER bun

ENTRYPOINT ["bun", "run", "./src/server.ts"]
