
DROP DATABASE IF EXISTS sdcreviews;

CREATE DATABASE sdcreviews;

\c sdcreviews;

DROP TABLE IF EXISTS reviews, reviews_photos, characteristic_reviews;

CREATE TABLE reviews(
  id INTEGER NOT NULL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  rating INTEGER NULL DEFAULT NULL,
  date VARCHAR NOT NULL,
  summary VARCHAR NOT NULL,
  body VARCHAR NULL DEFAULT NULL,
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name VARCHAR NOT NULL,
  reviewer_email VARCHAR,
  response VARCHAR NULL DEFAULT NULL,
  helpfulness INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE reviews_photos(
  id INTEGER NOT NULL PRIMARY KEY,
  review_id INTEGER NOT NULL,
  url VARCHAR
);

CREATE TABLE characteristic_reviews(
  id INTEGER NOT NULL PRIMARY KEY,
  characteristic_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  value INTEGER NOT NULL
);

CREATE TABLE characteristics(
  id INTEGER NOT NULL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  name VARCHAR NOT NULL
);

--  Not using for now
ALTER TABLE reviews ADD FOREIGN KEY (id_photos) REFERENCES reviews_photos (id);
ALTER TABLE reviews ADD FOREIGN KEY (id_characteristics) REFERENCES characteristic_reviews (id);

\copy reviews FROM '/Users/rizztown/Desktop/SDC/reviews.csv' DELIMITER ',' null as 'null' CSV header;
\copy reviews_photos FROM '/Users/rizztown/Desktop/SDC/reviews_photos.csv' DELIMITER ',' CSV header;
\copy characteristic_reviews FROM '/Users/rizztown/Desktop/SDC/characteristic_reviews.csv' DELIMITER ',' CSV header;
\copy characteristics FROM '/Users/rizztown/Desktop/SDC/characteristics.csv' DELIMITER ',' CSV header;

-- Building

SELECT
  body,
  date,
  helpfulness,
  array_agg(reviews_photos.url) AS photos
FROM
  reviews
JOIN reviews_photos ON (reviews.id = reviews_photos.review_id)