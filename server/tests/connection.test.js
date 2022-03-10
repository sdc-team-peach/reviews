const app = require('../index.js');
const supertest = require('supertest');

const request = supertest(app);


describe('GET /reviews', function() {
  it ('responds with json', async () => {
    const res = await request.get('/reviews/1');
    expect(res.status).toBe(200);
  })
})
