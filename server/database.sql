
DROP DATABASE IF EXISTS SDCreviews;

CREATE DATABASE SDCreviews;

\c SDCreviews;

DROP TABLE IF EXISTS reviews, reviews_photos, characteristic_reviews;

CREATE TABLE reviews(
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  product_id INTEGER NOT NULL,
  rating INTEGER NULL DEFAULT NULL,
  date TIMESTAMP NOT NULL,
  summary VARCHAR NOT NULL,
  body VARCHAR NULL DEFAULT NULL,
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name VARCHAR NOT NULL,
  reviewer_email VARCHAR,
  response VARCHAR NULL DEFAULT NULL,
  helpfulness INTEGER NOT NULL DEFAULT 0,
);

CREATE TABLE reviews_photos(
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  review_id INTEGER NOT NULL,
  url VARCHAR,
);

CREATE TABLE characteristic_reviews(
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  characteristic_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  value INTEGER NOT NULL,
);

-- probably need foreign keys, just dont know which ones yet
-- ALTER TABLE reviews ADD FOREIGN KEY (id_photos) REFERENCES reviews_photos (id);

\copy reviews FROM '../reviews.csv' DELIMITER ',' null as 'null' CSV header;
\copy reviews_photos FROM '../reviews_photos.csv' DELIMITER ',' CSV header;
\copy characteristic_reviews FROM '../characteristic_reviews.csv' DELIMITER ',' CSV header;
