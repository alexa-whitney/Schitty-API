const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/server');
const dbHandler = require('./db-handler');

chai.use(chaiHttp);
const expect = chai.expect;

describe('/api/characters', () => {
  // Set up test environment
  before(async () => await dbHandler.connect());
  afterEach(async () => await dbHandler.clearDatabase());
  after(async () => await dbHandler.closeDatabase());

  it('should get all characters', async () => {
    const res = await chai.request(app).get('/api/characters');

    expect(res).to.have.status(200);
    expect(res.body.characters.length).to.be.greaterThan(0);
  });

  it('should create a new character', async () => {
    const newCharacter = {
      name: 'Test Character',
      occupation: 'Test Occupation',
      bio: 'Test Bio',
      imageUrl: 'https://example.com/test.jpg',
    };

    const res = await chai.request(app).post('/api/characters').send(newCharacter);

    expect(res).to.have.status(201);
    expect(res.body.character.name).to.equal(newCharacter.name);
  });

  it('should get a character by ID', async () => {
    const newCharacter = {
      name: 'Test Character',
      occupation: 'Test Occupation',
      bio: 'Test Bio',
      imageUrl: 'https://example.com/test.jpg',
    };

    const createResponse = await chai.request(app).post('/api/characters').send(newCharacter);
    const characterId = createResponse.body.character.id;

    const res = await chai.request(app).get(`/api/characters/${characterId}`);

    expect(res).to.have.status(200);
    expect(res.body.character.name).to.equal(newCharacter.name);
  });

  it('should update a character by ID', async () => {
    const newCharacter = {
      name: 'Test Character',
      occupation: 'Test Occupation',
      bio: 'Test Bio',
      imageUrl: 'https://example.com/test.jpg',
    };

    const createResponse = await chai.request(app).post('/api/characters').send(newCharacter);
    const characterId = createResponse.body.character.id;

    const updatedCharacter = {
      name: 'Updated Character',
      occupation: 'Updated Occupation',
      bio: 'Updated Bio',
      imageUrl: 'https://example.com/updated.jpg',
    };

    const res = await chai.request(app).put(`/api/characters/${characterId}`).send(updatedCharacter);

    expect(res).to.have.status(200);
    expect(res.body.character.name).to.equal(updatedCharacter.name);
  });

  it('should delete a character by ID', async () => {
    const newCharacter = {
      name: 'Test Character',
      occupation: 'Test Occupation',
      bio: 'Test Bio',
      imageUrl: 'https://example.com/test.jpg',
    };

    const createResponse = await chai.request(app).post('/api/characters').send(newCharacter);
    const characterId = createResponse.body.character.id;

    const res = await chai.request(app).delete(`/api/characters/${characterId}`);

    expect(res).to.have.status(200);
    expect(res.body.message).to.equal(`Character with ID ${characterId} successfully deleted.`);
  });
});
