import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import log from 'npmlog';
import app from '../../../serverProd';
import fakeData from '../testUtils/fakeData';
import db from '../../models';
import seeder from '../testUtils/seeder';


chai.use(chaiHttp);
const request = chai.request(app),
  adminUser = fakeData.validAdmin,
  regulerUser1 = fakeData.regulerUser1,
  regulerUser2 = fakeData.regulerUser2,
  emtptyTitleDocument = fakeData.emtptyTitleDocument,
  emptyContentDocument = fakeData.emptyContentDocument,
  privateDocument1 = fakeData.generateRandomDocument('private'),
  publicDocument1 = fakeData.generateRandomDocument('public'),
  publicDocument2 = fakeData.generateRandomDocument('public'),

  roleDocument1 = fakeData.generateRandomDocument('role'),
  updateDocument1 = fakeData.generateRandomDocument('role'),
  invalidAccessDocument = fakeData.generateRandomDocument('radnom');

let adminToken,
  regular1Token,
  regular2Token,
  privateDocId1,
  roleDocId1,
  publicDocId2;

describe('Document controller', () => {
  before((done) => {
    seeder.init().then(() => {
      request
        .post('/api/users/login')
        .send({ email: adminUser.email, password: adminUser.password })
        .end((err, res) => {
          adminToken = res.body.token;
        });
      request
        .post('/api/users/login')
        .send({ email: regulerUser1.email, password: regulerUser1.password })
        .end((err, res) => {
          regular1Token = res.body.token;
        });
      request
        .post('/api/users/login')
        .send({ email: regulerUser2.email, password: regulerUser2.password })
        .end((err, res) => {
          regular2Token = res.body.token;
          done();
        });
    });
  });
  after((done) => {
    log.info('message :  ', 'resseting Database.......');
    db.sequelize.sync({ force: true }).then(() => {
      log.info('message :  ', 'Database reset succesful');
      done();
    });
  });
  describe('POST /api/documents/', () => {
    it('should allow users to create private access documents', (done) => {
      request
        .post('/api/documents')
        .set({ 'x-access-token': regular1Token })
        .send(privateDocument1)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.document.title).to.equal(privateDocument1.title);
          privateDocId1 = res.body.document.id;
          done();
        });
    });
    it('should not allow users with invalid token create documents', (done) => {
      request
        .post('/api/documents')
        .set({ 'x-access-token': 'invalid token' })
        .send(publicDocument2)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
    it('should not allow users without token create documents', (done) => {
      request
        .post('/api/documents')
        .send(publicDocument2)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
    it('should allow users to create public access documents', (done) => {
      request
        .post('/api/documents')
        .set({ 'x-access-token': regular2Token })
        .send(publicDocument1)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.document.title).to.equal(publicDocument1.title);
          publicDocId2 = res.body.document.id;
          done();
        });
    });
    it('should allow users to create role access documents', (done) => {
      request
        .post('/api/documents')
        .set({ 'x-access-token': regular1Token })
        .send(roleDocument1)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.document.title).to.equal(roleDocument1.title);
          roleDocId1 = res.body.document.id;
          done();
        });
    });

    it(`should not allow users to create 
       documents with invalid access`, (done) => {
      request
        .post('/api/documents')
        .set({ 'x-access-token': regular1Token })
        .send(invalidAccessDocument)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal(
            'access can either be public, private or role'
          );
          done();
        });
    });
    it('should not allow users to create  documents empty title', (done) => {
      request
        .post('/api/documents')
        .set({ 'x-access-token': regular1Token })
        .send(emtptyTitleDocument)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal('please enter a title');
          done();
        });
    });
    it('should not allow users to create  documents empty content', (done) => {
      request
        .post('/api/documents')
        .set({ 'x-access-token': regular1Token })
        .send(emptyContentDocument)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal('please enter content');
          done();
        });
    });
  });
  describe('GET /api/documents/', () => {
    it('should allow Admin to get all documents', (done) => {
      request
        .get('/api/documents')
        .set({ 'x-access-token': adminToken })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.documents).to.be.an('array');
          done();
        });
    });
    it(`should allow regular
        user to get all documents`, (done) => {
      request
        .get('/api/documents')
        .set({ 'x-access-token': regular1Token })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.documents).to.be.an('array');
          done();
        });
    });
  });
  describe('GET /api/documents/:id', () => {
    it('should not allow admin retrieve private documents', (done) => {
      request
        .get(`/api/documents/${privateDocId1}`)
        .set({ 'x-access-token': adminToken })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('unauthorized');
          done();
        });
    });
    it(`should not allow regular user retrieve
       private documents he did not create`, (done) => {
      request
        .get(`/api/documents/${privateDocId1}`)
        .set({ 'x-access-token': regular2Token })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('unauthorized');
          done();
        });
    });
    it(`it should allow regular user retrieve 
        private documents he created`, (done) => {
      request
        .get(`/api/documents/${privateDocId1}`)
        .set({ 'x-access-token': regular1Token })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.document.title).to.equal(privateDocument1.title);
          done();
        });
    });
    it('it should allow allow regular users retrieve public', (done) => {
      request
        .get(`/api/documents/${publicDocId2}`)
        .set({ 'x-access-token': regular1Token })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.document.title).to.equal(publicDocument1.title);
          done();
        });
    });
    it(`it should allow allow regular 
       users retrieve role doucuments`, (done) => {
      request
        .get(`/api/documents/${roleDocId1}`)
        .set({ 'x-access-token': regular1Token })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.document.title).to.equal(roleDocument1.title);
          done();
        });
    });
    it(`it should allow allow regular users
       retrieve role doucuments`, (done) => {
      request
        .get('/api/documents/233333')
        .set({ 'x-access-token': regular1Token })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('document not found');
          done();
        });
    });
  });
  describe('PUT /api/documents/:id', () => {
    it('it should allow users update documents they did not create', (done) => {
      request
        .put(`/api/documents/${publicDocId2}`)
        .set({ 'x-access-token': regular1Token })
        .send(updateDocument1)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('unauthorized');
          done();
        });
    });
    it('it should not allow users update documents that dont exist', (done) => {
      request
        .put('/api/documents/44444')
        .set({ 'x-access-token': regular1Token })
        .send(updateDocument1)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('document not found');
          done();
        });
    });
    it('it should allow users update documents created by them', (done) => {
      request
        .put(`/api/documents/${privateDocId1}`)
        .set({ 'x-access-token': regular1Token })
        .send(updateDocument1)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.document.title).to.equal(updateDocument1.title);
          done();
        });
    });
  });
  describe('DELETE /api/documents/:id', () => {
    it(`it should allow not allow users delete
      documents they did not create`, (done) => {
      request
        .delete(`/api/documents/${publicDocId2}`)
        .set({ 'x-access-token': regular1Token })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('unauthorized');
          done();
        });
    });
    it('it should not allow users delete documents that dont exist', (done) => {
      request
        .delete('/api/documents/44444')
        .set({ 'x-access-token': regular1Token })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('document not found');
          done();
        });
    });
    it('it should allow users delete documents created by them', (done) => {
      request
        .delete(`/api/documents/${privateDocId1}`)
        .set({ 'x-access-token': regular1Token })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
    it('it should allow admin delete any users document', (done) => {
      request
        .delete(`/api/documents/${publicDocId2}`)
        .set({ 'x-access-token': adminToken })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
  describe('GET /api/users/:id/documents/', () => {
    it('should allow use get all his documents', (done) => {
      request
        .get('/api/users/1/documents')
        .set({ 'x-access-token': adminToken })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.documents).to.be.an('array');
          done();
        });
    });
    it(`should allow user get other users documents
        user to get all documents`, (done) => {
      request
        .get('/api/users/1/documents')
        .set({ 'x-access-token': regular1Token })
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });
});
