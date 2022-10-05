var { expect } = require('chai');
const { Pool, Client } = require('pg')
var request = require('supertest');
const pool = require('../models');
var app = require('../');
var controller = require('../controller');
var schema = require('../models');
// var port = 4568;

const sendPostReview = async () => {
  return await request(app)
    .post(`/reviews/1`)
    .send({
      product_id: 1,
      reviewer_name: 'superTestReview',
      body: 'body; Testing',
      rating: 2,
      summary: 'summary; Testing',
      recommend: true
    })
    .set('Accept', 'application/json')
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      return done();
    });
};

const sendGetReviews = async (id) => {
  return await request(app)
    .get(`/reviews`)
    .send();
}

const sendReviewMetaRequest = async (id) => {
  return await request(app)
    .get(`/reviews/meta/${id}`)
    .send();
}

describe('Reviews Micro-Service', function() {

  after(function() { app.close(); });

  describe('/reviews', function() {

    beforeEach(() => {});

    it('send status 201', async function() {
      const response = await sendPostReview();
      expect(response.status).to.eql(201);
    });
    it('send status 200', async function() {
      const response = await sendGetReviews();
      expect(response.status).to.eql(200);
    });

  });

  describe('/reviews/meta/:product_id', function() {

    beforeEach(() => {});

    it('send status 200 and object', async function() {
      const response = await sendReviewMetaRequest(1);
      expect(response.status).to.eql(200);
      expect(response.body).to.be.an('Object');
    });

  });

});