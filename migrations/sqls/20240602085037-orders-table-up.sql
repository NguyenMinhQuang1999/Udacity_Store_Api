/* Replace with your SQL commands */
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