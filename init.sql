CREATE TYPE enum_type AS ENUM('c', 'd');

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    customer_limit INT NOT NULL,
    version INT NOT NULL DEFAULT 0,
    balance INT
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    value INT NOT NULL,
    type enum_type NOT NULL,
    description VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

DO $$
BEGIN
  INSERT INTO customers (name, customer_limit)
  VALUES
    ('Vinicius Abreu', 1000 * 100),
    ('zanfranceschi', 800 * 100),
    ('nodejs kit met', 10000 * 100),
    ('BunJS', 100000 * 100),
    ('vinicin kit bota', 5000 * 100);
END; $$;