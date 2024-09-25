FROM node:20-alpine AS BUILDER

WORKDIR /cccat18_1

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build -o cccat18_1 .

FROM scratch 
COPY --from=builder ./cccat18_1 /cccat18_1
CMD ["./cccat18_1"]