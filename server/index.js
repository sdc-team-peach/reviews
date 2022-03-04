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
    const { product_id, name, body, rating, summary, recommend, photos, characteristics } = req.body;
    const newReview = await pool.query(
      "INSERT INTO reviews (product_id, name, body, rating, summary, recommend, photos, characteristics) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [product_id, name, body, rating, summary, recommend, photos, characteristics]
    );
    res.json(newReview.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get reviews  --NOT DONE YET--
app.get("/reviews", async(req, res) => {
  try {
    const { count, sort, product_id } = req.body;
    const getReviews = await pool.query("SELECT  FROM reviews");
    res.json(getReviews.rows);
  } catch (err) {
    console.error(err.message)
  }
})

//put reviews (helpful, reported)



app.listen(5000, () => {
  console.log("server has started on port 5000");
});
