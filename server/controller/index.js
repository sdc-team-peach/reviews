const db = require('../models');

module.exports = {
    postReview : function(req, res) {
        db.postReview(req.body, (err) => {
          if (err) {
            res.status(404).send();
          } else {
            res.sendStatus(201);
          }
        })
      },

    getReviews: function (req, res) {
      const { count, sort, product_id } = req.query;
      db.getReviews(product_id, (err, result) => {
        if (err) {
          res.status(404).send();
        } else {
          const resultObj = {
            product: product_id,
            page: 0,
            count: result.rowCount,
            results: result.rows,
          };
          res.json(resultObj);
        }
      })
    },

    getMeta: function(req, res) {
      const { product_id } = req.params;
      db.getMeta(product_id, (err, result) => {
        if (err) {
          res.status(404).send();
        } else {
          res.send(result);
        }
      })
    },

    putHelpful: function(req, res) {
      const { review_id } = req.params;
      db.putHelpful(review_id, (err, result) => {
        if (err) {
          res.status(404).send();
        } else {
          res.sendStatus(204);
        }
      })
    },

    putReport: function(req, res) {
      const { review_id } = req.params;
      db.putReport(review_id, (err, result) => {
        if (err) {
          res.status(404).send();
        } else {
          res.sendStatus(204);
        }
      })
    }

}