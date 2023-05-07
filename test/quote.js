const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/server');
const dbHandler = require('./db-handler');

const { expect } = chai;

chai.use(chaiHttp);

describe('Quotes API', () => {
  before(async () => await dbHandler.connect());

  beforeEach(async () => await dbHandler.clearDatabase());

  after(async () => await dbHandler.closeDatabase());

  describe('GET /api/quotes', () => {
    it('should get all quotes', async () => {
      const response = await chai.request(app).get('/api/quotes');

      expect(response).to.have.status(200);
      expect(response.body.quotes).to.have.lengthOf(0);
    });
  });

  describe('POST /api/quotes', () => {
    it('should create a new quote', async () => {
      const newQuote = {
        text: 'Test Quote',
        book: 'Test Book',
        characterID: 'Test Character ID',
      };

      const response = await chai.request(app)
        .post('/api/quotes')
        .send(newQuote);

      expect(response).to.have.status(201);
      expect(response.body.quote.text).to.equal(newQuote.text);
    });
  });

  describe('GET /api/quotes/:id', () => {
    it('should get a quote by ID', async () => {
      const newQuote = {
        text: 'Test Quote',
        book: 'Test Book',
        characterID: 'Test Character ID',
      };

      const createResponse = await chai.request(app)
        .post('/api/quotes')
        .send(newQuote);

      const quoteId = createResponse.body.quote._id;

      const response = await chai.request(app).get(`/api/quotes/${quoteId}`);

      expect(response).to.have.status(200);
      expect(response.body.quote.text).to.equal(newQuote.text);
    });
  });

  describe('PUT /api/quotes/:id', () => {
    it('should update a quote by ID', async () => {
      const newQuote = {
        text: 'Test Quote',
        book: 'Test Book',
        characterID: 'Test Character ID',
      };

      const createResponse = await chai.request(app)
        .post('/api/quotes')
        .send(newQuote);

      const quoteId = createResponse.body.quote._id;

      const updatedQuote = {
        text: 'Updated Quote',
        book: 'Updated Book',
      };

      const response = await chai.request(app)
        .put(`/api/quotes/${quoteId}`)
        .send(updatedQuote);

      expect(response).to.have.status(200);
      expect(response.body.quote.text).to.equal(updatedQuote.text);
    });
  });

  describe('DELETE /api/quotes/:id', () => {
    it('should delete a quote by ID', async () => {
      const newQuote = {
        text: 'Test Quote',
        book: 'Test Book',
        characterID: 'Test Character ID',
      };

      const createResponse = await chai.request(app)
        .post('/api/quotes')
        .send(newQuote);

      const quoteId = createResponse.body.quote._id;

      const response = await chai.request(app).delete(`/api/quotes/${quoteId}`);

      expect(response).to.have.status(200);
      expect(response.body.message).to.equal(`Quote with ID ${quoteId} successfully deleted.`);
    });
  });
});
