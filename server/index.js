const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//Routes//

//create review
app.post("/reviews", async(req, res) => {
  try {
    console.log('IN post; req.body: ', req.body);
    // const { product_id, name, body, rating, summary, recommend, photos, characteristics } = req.body;
    // const newReview = await pool.query(
    //   "INSERT INTO reviews (product_id, name, body, rating, summary, recommend, photos, characteristics) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    //   [product_id, name, body, rating, summary, recommend, photos, characteristics]
    // );
    // res.json(newReview.rows[0]);
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

// app.get("/reviews", async(req, res) => {
//   try {
//     const { count, sort, product_id } = req.params;

//     // const getReviews = await pool.query("SELECT json_build_object('product', $1, 'page', 0, 'count', $2, 'results', (SELECT json_agg()) ");

//     console.log(req.body);
//     const getReviews = await pool.query("SELECT * FROM reviews LIMIT 10");
//     res.json(getReviews);
//   } catch (err) {
//     console.error(err.message)
//   }
// })

//put reviews (helpful, reported)



app.listen(5000, () => {
  console.log("server has started on port 5000");
});
