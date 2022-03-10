
DROP DATABASE IF EXISTS sdcreviews;

CREATE DATABASE sdcreviews;

\c sdcreviews;

DROP TABLE IF EXISTS reviews, reviews_photos, characteristic_reviews, characteristics;

CREATE TABLE reviews(
  id INTEGER SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  rating INTEGER NULL DEFAULT NULL,
  date VARCHAR(250) NOT NULL,
  summary VARCHAR(250) NOT NULL,
  body VARCHAR(500) NULL DEFAULT NULL,
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name VARCHAR(250) NOT NULL,
  reviewer_email VARCHAR(250),
  response VARCHAR(500) NULL DEFAULT NULL,
  helpfulness INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE reviews_photos(
  id INTEGER SERIAL PRIMARY KEY,
  review_id INTEGER NOT NULL,
  url VARCHAR(500)
);

CREATE TABLE characteristic_reviews(
  id INTEGER SERIAL PRIMARY KEY,
  characteristic_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  value INTEGER NOT NULL
);

CREATE TABLE characteristics(
  id INTEGER SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  name VARCHAR(250) NOT NULL
);

--  Not using for now (should I be using these?)
-- ALTER TABLE reviews ADD FOREIGN KEY (id_photos) REFERENCES reviews_photos (id);
-- ALTER TABLE reviews ADD FOREIGN KEY (id_characteristics) REFERENCES characteristic_reviews (id);

\copy reviews FROM '/Users/rizztown/Desktop/SDC/reviews.csv' DELIMITER ',' null as 'null' CSV header;
\copy reviews_photos FROM '/Users/rizztown/Desktop/SDC/reviews_photos.csv' DELIMITER ',' CSV header;
\copy characteristic_reviews FROM '/Users/rizztown/Desktop/SDC/characteristic_reviews.csv' DELIMITER ',' CSV header;
\copy characteristics FROM '/Users/rizztown/Desktop/SDC/characteristics.csv' DELIMITER ',' CSV header;

CREATE INDEX reviews_product_id_idx ON reviews (product_id);
CREATE INDEX reviews_review_id_idx ON reviews (id);
CREATE INDEX reviews_photos_url_idx ON reviews_photos (url);
CREATE INDEX characteristic_reviews_review_id_idx ON characteristic_reviews (review_id);
CREATE INDEX characteristics_product_id_idx ON characteristics (product_id);

-- Should INDEXES be before the loading of csv files? That way the indexes are already there before import?
