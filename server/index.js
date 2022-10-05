require('newrelic');

const express = require('express');
const controller = require('./controller');
const app = express();
const PORT = 3000 || process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/reviews', controller.postReview);
app.get('/reviews', controller.getReviews);
app.get('/reviews/meta/:product_id', controller.getMeta);
app.put('/reviews/:review_id/helpful', controller.putHelpful);
app.put('/reviews/:review_id/report', controller.putReport);

// app.get('/loaderio-9e9a098d04135d01f1ec85c14cc6db12', (req, res) => {
//   res.sendStatus('loaderio-9e9a098d04135d01f1ec85c14cc6db12');
// })

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;