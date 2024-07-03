# Storefront Backend Project

## Getting Started

This repo contains a basic Node and Express app to get you started in constructing an API. To get started, clone this repo and run `yarn` in your terminal at the project root.

## Required Technologies
Your application must make use of the following libraries:
- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Installation Instructions
`yarn install i` or `npm install i`

## Set up Database
install postgres 
`https://www.postgresql.org/download`
install DBeaver
`https://dbeaver.io/download/`

Connect to the dbeaver
create a user 
 - `CREATE USER postgres WITH PASSWORD '123456';`
create the dev and test database
    - `CREATE DATABASE postgres;`
    - `CREATE DATABASE test;`

- Connect to the databases and grant all privileges
    - Grant for dev database
        - `\c postgres`
        - `GRANT ALL PRIVILEGES ON DATABASE postgres TO postgres;`
    - Grant for test database
        - `\c test`
        - `GRANT ALL PRIVILEGES ON DATABASE test TO postgres;`

Create database test, postgres
Run `npm run migrate` 

```
> api-store@1.0.0 migrate
> db-migrate --env dev up && db-migrate up

received data: /* Replace with your SQL commands */
CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC NOT NULL,
    category VARCHAR(255)
);
[INFO] Processed migration 20240602084821-products-table
received data: /* Replace with your SQL commands */
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    userName VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
[INFO] Processed migration 20240602085030-users-table
received data: /* Replace with your SQL commands */
CREATE TABLE orders(
    -- id SERIAL PRIMARY KEY,
    -- product_id INTEGER,
    -- user_id INTEGER,
    -- quantity INTEGER DEFAULT 1,
    -- status VARCHAR(255)

     id      SERIAL PRIMARY KEY,
    --  user_id INTEGER NOT NULL REFERENCES users (id),
    user_id INTEGER,

     status VARCHAR(255)

);
[INFO] Processed migration 20240602085037-orders-table
received data: /* Replace with your SQL commands */
CREATE TABLE order_products (
  id SERIAL PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders (id),
  product_id INTEGER NOT NULL REFERENCES products (id),
  quantity   INTEGER DEFAULT 1 NOT NULL
);

```

## Enviromental Variables Set up
Bellow are the environmental variables that needs to be set in a `.env` file. This is the default setting that I used for development, but you can change it to what works for you. 

```
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456
BCRYPT_PASSWORD=*****
SALT_ROUNDS=10
TOKEN_SECRET= *****
POSTGRES_TEST_DB=test
ENV=dev
```

### Start App
`npm run start`

## Endpoint Access
All endpoints are described in the [REQUIREMENT.md](REQUIREMENTS.md) file. 

List thunder collecion in file `thunder-collection_Store_Udacity.json`

## Testing
Set ENV=test in .env

`npm run test`