CREATE DATABASE moviess;

CREATE TABLE IF NOT EXISTS movies(
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) UNIQUE NOT NULL,
	description TEXT,
	duration DECIMAL(10,2) NOT NULL,
	price DECIMAL(10,2) NOT NULL
);

INSERT INTO 
		movies(name,description,duration,price)
VALUES
		('Exemplo','teste',NULL,74);
