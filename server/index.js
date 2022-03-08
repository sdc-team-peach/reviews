require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

//Routes//

//create review --NOT DONE YET--
app.post("/reviews", async(req, res) => {
  try {
    console.log('IN post; req.body: ', req.body);
    const { product_id, name, body, rating, summary, recommend, photos, characteristics, } = req.body;
    const nowTime = new Date().getTime();
    const newReview = await pool.query(
      "INSERT INTO reviews (product_id, reviewer_name, body, rating, summary, recommend, characteristics, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [product_id, name, body, rating, summary, recommend, characteristics, nowTime]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err.message);
  }
});


//get reviews  --NOT DONE YET--

app.get("/reviews", async(req, res) => {
  try {
    console.log('In get reviews;req: ', req.query);
    // console.log('In get reviews;req.params: ', req.params);
    // console.log('In get reviews;req.body: ', req.body);
    const { count, sort, product_id } = req.query;
    const infoStuff = await pool.query(`
    SELECT
      body,
      date,
      helpfulness,
      rating,
      recommend,
      response,
      reviews.id AS review_id,
      reviewer_name,
      summary,
      p.photos
      FROM (
        SELECT
        array_agg(reviews_photos.url) AS photos,
        review_id
        FROM
        reviews_photos
        GROUP BY review_id
      ) p JOIN reviews ON reviews.id = p.review_id
    WHERE reviews.product_id = $1
    `, [product_id]);
    // console.log(infoStuff.rows);
    // console.log('infoStuff: ', infoStuff);
    // result object to send to front end
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


//get review meta data --NOT DONE YET--

app.get("/reviews/meta", async(req, res) => {
  try {
    console.log('In get reviews/meta;req: ', req.query);
    // console.log('In get reviews;req.params: ', req.params);
    // console.log('In get reviews;req.body: ', req.body);
    const { product_id } = req.query;
    const infoStuff = await pool.query(`
    SELECT
      rating,
      recommend,
      reviews.id AS review_id,
      c.id,
      c.product_id,
      c.name
      FROM (
        SELECT
        *
        FROM
        characteristics
        GROUP BY product_id
      ) c JOIN reviews ON reviews.product_id = c.product_id
    WHERE reviews.product_id = $1
    `, [product_id]);
    console.log(infoStuff);
    // console.log(infoStuff.rows);
    // console.log('infoStuff: ', infoStuff);
    // result object to send to front end
    const resultObj = {
      product_id: product_id,
      ratings: {
        1: 23
      },
      recommend: {
        false: 123,
        true: 323
      },
      characteristics: {
        fit: {
          id: 1234321,
          value: 3
        }
      },
    };
    res.json(resultObj);
  } catch (err) {
    console.error(err.message)
  }
})



//put reviews (helpful, reported) -- Should be done --

app.put("/reviews/:review_id/helpful", async(req, res) => {
  try {
    // console.log('In put reviews;req.query: ', req.query);
    console.log('In put reviews helpful;req.params: ', req.params);
    // console.log('In get reviews;req.body: ', req.body);
    const { review_id } = req.params;
    const infoStuff = await pool.query('UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = $1', [review_id]);
    // console.log(infoStuff.rows);
    // console.log('infoStuff: ', infoStuff);
    res.sendStatus(204);
  } catch (err) {
    console.error(err.message)
  }
})

app.put("/reviews/:review_id/report", async(req, res) => {
  try {
    // console.log('In put reviews;req.query: ', req.query);
    console.log('In put reviews report;req.params: ', req.params);
    // console.log('In get reviews;req.body: ', req.body);
    const { review_id } = req.params;
    const infoStuff = await pool.query('UPDATE reviews SET reported = true WHERE id = $1', [review_id]);
    // console.log(infoStuff.rows);
    // console.log('infoStuff: ', infoStuff);
    res.sendStatus(204);
  } catch (err) {
    console.error(err.message)
  }
})


app.listen(port, () => {
  console.log(`server has started on port ${port}`);
});
