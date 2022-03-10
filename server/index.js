require("dotenv").config();
const express = require("express");
const app = express();
// Do I need cors?
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;


// Since this is a micro service, would it be better to have all this in one file or should it be split into mvc? (models, controller)
// I thought since we are deploying it would be better not to have extra stuff... but let me know if I should use models and controller


//Routes//

app.post("/reviews", async (req, res) => {
  try {
    console.log('IN post; req.body: ', req.body);
    const { product_id, reviewer_name, body, rating, summary, recommend, photos, characteristics, } = req.body;
    const nowTime = new Date().getTime();
    const newReview = await pool.query(
      'INSERT INTO reviews (product_id, reviewer_name, body, rating, summary, recommend, date) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [product_id, reviewer_name, body, rating, summary, recommend, nowTime]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err.message);
  }
});


// How should I format query strings? I've learned you shouldnt use template literals because of security concerns (injecting scripts)
// The query string is just super long now though on one line. Should I just concatenate multiple strings together?

app.get("/reviews", async (req, res) => {
  try {
    const { count, sort, product_id } = req.query;

    const infoStuff = await pool.query('SELECT body, date, helpfulness, rating, recommend, response, reviews.id AS review_id, reviewer_name, summary, p.photos FROM (SELECT array_agg(reviews_photos.url) AS photos, review_id FROM reviews_photos GROUP BY review_id) p JOIN reviews ON reviews.id = p.review_id WHERE reviews.product_id = $1', [product_id]);

    const resultObj = {
      product: product_id,
      page: 0,
      count: infoStuff.rowCount,
      results: infoStuff.rows,
    };
    res.json(resultObj);
  } catch (err) {
    console.error(err.message)
  }
})


// Is it better to use req.query or req.params?
// (query way) app.get("/reviews/meta", async (req, res) => {...
// (query way) const { product_id } = req.params;

app.get("/reviews/meta/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params;

    const reviewData = await pool.query('SELECT cvalue, cid, reviews.id, recommend, product_id, rating FROM (SELECT ARRAY_AGG(characteristic_reviews.value) AS cvalue, ARRAY_AGG(characteristic_reviews.characteristic_id) AS cid, review_id FROM characteristic_reviews GROUP BY review_id) cr JOIN reviews on cr.review_id = reviews.id WHERE product_id = $1', [product_id]);

    const characteristicNames = await pool.query('select id, name from characteristics where product_id = $1', [product_id]);

    const resultObj = {
      product_id: product_id,
      ratings: {1:0, 2:0, 3:0, 4:0, 5:0},
      recommended: {false:0, true:0},
      characteristics: {},
    };

    const characteristicsObj = {};
    for (let i = 0; i < reviewData.rows.length; i++) {
      // ratings
      resultObj.ratings[reviewData.rows[i].rating]++;
      // recommended
      resultObj.recommended[reviewData.rows[i].recommend]++;
      // characteristics
      for (let k = 0; k < reviewData.rows[i].cid.length; k++) {
        if (characteristicsObj[reviewData.rows[i].cid[k]]) {
          characteristicsObj[reviewData.rows[i].cid[k]] = characteristicsObj[reviewData.rows[i].cid[k]] + reviewData.rows[i].cvalue[k];
        } else {
          characteristicsObj[reviewData.rows[i].cid[k]] = reviewData.rows[i].cvalue[k];
        }
      }
    }
    // characteristics
    for (let i = 0; i < characteristicNames.rows.length; i++) {
      resultObj.characteristics[characteristicNames.rows[i].name] = {
        id: characteristicNames.rows[i].id,
        value: characteristicsObj[characteristicNames.rows[i].id] / reviewData.rows.length,
      }
    }
    res.json(resultObj);
  } catch (err) {
    console.error(err.message)
  }
})


app.put("/reviews/:review_id/helpful", async (req, res) => {
  try {
    const { review_id } = req.params;
    const infoStuff = await pool.query('UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = $1', [review_id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err.message)
  }
})


app.put("/reviews/:review_id/report", async (req, res) => {
  try {
    const { review_id } = req.params;
    const infoStuff = await pool.query('UPDATE reviews SET reported = true WHERE id = $1', [review_id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err.message)
  }
})


app.listen(port, () => {
  console.log(`server has started on port ${port}`);
});
