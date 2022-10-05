const { Pool, Client } = require('pg')
// pools will use environment variables
// for connection information
const pool = require('./db.js');
module.exports = {

  postReview: function(reqBody, cb) {
    const { product_id, reviewer_name, body, rating, summary, recommend } = reqBody;
    const postTime = new Date().getTime();
    pool
      .query('INSERT INTO reviews (product_id, reviewer_name, body, rating, summary, recommend, date) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [product_id, reviewer_name, body, rating, summary, recommend, postTime])
      .then((result) => {
        cb(null);
      })
      .catch((err) => {
        cb(err);
      })
  },

  getReviews: function(product_id, cb) {
    pool
      .query('SELECT body, date, helpfulness, rating, recommend, response, reviews.id AS review_id, reviewer_name, summary, p.photos FROM (SELECT array_agg(reviews_photos.url) AS photos, review_id FROM reviews_photos GROUP BY review_id) p JOIN reviews ON reviews.id = p.review_id WHERE reviews.product_id = $1', [product_id])
      .then((result) => {
        cb(null, result);
      })
      .catch((err) => {
        cb(err);
      })
  },

  getMeta: function(id, cb) {
    pool
    .query("SELECT json_agg( json_build_object( 'style_id', styles.style_id, 'name', styles.name, 'original_price', styles.original_price, 'sale_price', styles.sale_price, 'default?', styles.default,'photos', (SELECT coalesce(photos, '[]'::json) FROM (SELECT json_agg(json_build_object( 'thumbnail_url', photos.thumbnail_url,'url', photos.url) ) AS photos from photos WHERE photos.styleId = styles.style_id) as photos),'skus', (SELECT coalesce(skus, '{}'::json) FROM (SELECT json_object_agg(skus.id, json_build_object('quantity', skus.quantity,'size', skus.size)) AS skus from skus WHERE skus.styleId = styles.style_id) as skus))) AS results from styles where styles.productId = $1;", [id])
    .then((result) => {
      result.rows[0]['product_id'] = id;
      cb(null, result.rows[0]);
    })
    .catch((err) => {
      cb(err);
    })
  },

  putHelpful: function(review_id, cb) {
      pool
      .query('UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = $1', [review_id])
      .then ((result) => {
        cb(null);
      })
      .catch((err) => {
        cb(err);
      })
  },

  putReport: function(review_id, cb) {
    pool
    .query('UPDATE reviews SET reported = true WHERE id = $1', [review_id])
    .then ((result) => {
      cb(null);
    })
    .catch((err) => {
      cb(err);
    })
  }

}