import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import chaiNock from 'chai-nock';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import nock from 'nock';

import server from '../server';
import resetDatabase from '../utils/resetDatabase';

chai.use(chaiHttp);
chai.use(chaiNock);
chai.use(chaiAsPromised);
describe('Empty Database GET and POST route on book', () => {
    beforeEach(() => {
        var initialJson = { books: [] };
        resetDatabase(path.join(__dirname, '../data/books.json'), initialJson)
    });
    it('GET route expect code 200, expect return a 0 lenght array', done => {
        chai
            .request(server)
            .get('/book')
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.books).to.be.a('array');
                expect(res.body.books.length).to.equal(0);
                done();
            });
    });
    it('Post route expect code 200, and showing in message key on body "book successfully added"', done => {
        chai
            .request(server)
            .post('/book')
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body.message).is.equal('book successfully added');
                done();
            });
    });
});

describe('Mocked database', () => {
    beforeEach(() => {
        var initialJson = {
            books: [
                {
                    id: '0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9',
                    title: 'Coco raconte Channel 2',
                    years: 1990,
                    pages: 400
                }
            ]
        }
        resetDatabase(path.join(__dirname, '../data/books.json'), initialJson)
    });
    it('Put route expect code 200, and showing in message key on body "book successfully updated"', done => {
        chai
            .request(server)
            .put('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body.message).is.equal('book successfully updated');
                done();
            });
    });

});