
\c sdcreviews;
DROP TABLE IF EXISTS reviews, reviews_photos, characteristic_reviews, characteristics;

CREATE TABLE reviews(
  id INTEGER SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  rating INTEGER NULL DEFAULT NULL,
  review_date VARCHAR(250) NOT NULL,
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
  photo_url VARCHAR(500)
);

CREATE TABLE characteristic_reviews(
  id INTEGER SERIAL PRIMARY KEY,
  characteristic_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  characteristic_reviews_value INTEGER NOT NULL
);

CREATE TABLE characteristics(
  id INTEGER SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  characteristics_name VARCHAR(250) NOT NULL
);

\copy reviews FROM 'server/csv/reviews.csv' DELIMITER ',' null as 'null' CSV header;
\copy reviews_photos FROM 'server/csv/reviews_photos.csv' DELIMITER ',' CSV header;
\copy characteristic_reviews FROM 'server/csv/characteristic_reviews.csv' DELIMITER ',' CSV header;
\copy characteristics FROM 'server/csv/characteristics.csv' DELIMITER ',' CSV header;

CREATE INDEX ON reviews (product_id);
CREATE INDEX ON reviews (id);
CREATE INDEX ON reviews_photos (photo_url);
CREATE INDEX ON characteristic_reviews (review_id);
CREATE INDEX ON characteristics (product_id);
