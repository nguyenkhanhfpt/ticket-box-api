##################
# BUILD BASE IMAGE
##################

FROM node:20-alpine AS base

# Set the working directory
FROM base AS development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

FROM base AS build

WORKDIR /app

COPY package*.json ./
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/src ./src
COPY --from=development /app/tsconfig.json ./tsconfig.json
COPY --from=development /app/tsconfig.build.json ./tsconfig.build.json
COPY --from=development /app/nest-cli.json ./nest-cli.json

RUN npm run build

RUN npm prune --production
RUN npm install --production

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

CMD ["node", "dist/main"]