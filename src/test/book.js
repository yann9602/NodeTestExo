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
            .send({
                "id": "55b7d315-1a5f-4b13-a665-c382a6c71756",
                "title": "Oui-Oui contre Dominique Strauss-Kahn",
                "years": "2015",
                "pages": "650"
            })
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
            .send({
                "title": "Salut les z'amis"
            })
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body.message).is.equal('book successfully updated');
                done();
            });
    });
    it('Delete route expect code 200, and showing in message key on body "book successfully deleted"', done => {
        chai
            .request(server)
            .delete('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body.message).is.equal('book successfully deleted');
                done();
            });
    });
    it('get route expect code 200, and showing in message key on body "book fetched" ...', done => {
        chai
            .request(server)
            .get('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body.message).is.equal('book fetched');
                expect(res.body.book).to.be.a('object');
                expect(res.body.book.title).to.be.a('string');
                expect(res.body.book.id).is.equal('0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9');
                expect(res.body.book.years).to.be.a('number');
                expect(res.body.book.years).is.equal(1990);
                expect(res.body.book.pages).to.be.a('number');
                expect(res.body.book.pages).is.equal(400);
                done();
            });
    });
});
describe('Simulate answer', () => {
    beforeEach(() => {
        nock.cleanAll()
    })
    it('get route expect code 200, and books object is an array', done => {
        let books = { books: [] };
        nock('http://localhost:8080').get('/book').reply(200, books)
        chai.request('http://localhost:8080')
            .get('/book')
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body.books).to.be.a('array');
                done();
            });

    });
    it('post route expect code 200, and message is " book successfully added" ', done => {

        let message = {
            message: 'book successfully added'
        }
        nock('http://localhost:8080').post('/book').reply(200, message)
        chai.request('http://localhost:8080')
            .post('/book')
            .send(
                {
                    id: '0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9',
                    title: 'Coco raconte Channel 2',
                    years: 1990,
                    pages: 400
                }
            )
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body.message).is.equal('book successfully added');
                done();
            });
    });
    it('post route expect code 200, and message is " book successfully added" ', done => {

        let message = {
            message: 'book successfully updated'
        }
        nock('http://localhost:8080').put('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9').reply(200, message)
        chai.request('http://localhost:8080')
            .put('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
            .send(
                {
                    title: 'Coco raconte Channel 3'
                }
            )
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body.message).is.equal('book successfully updated');
                done();
            });
    });
    it(' delete route expect code 200 and send an message"book successfully deleted"', done => {
        let message = {
            message: 'book successfully deleted'
        }
        nock("http://localhost:8080")
            .delete('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
            .reply(200, message)
        chai
            .request('http://localhost:8080')
            .delete('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(200);
                expect(res.body.message).to.equal('book successfully deleted');
                done();
            });
    })
})
describe('Simulate bad answer', () => {
    beforeEach(() => {
        nock.cleanAll()
    })
    let message = {
        message: 'error fetching books'
    }
    it('route get books expect 400 and send an message "error fetching book"', done => {
        nock("http://localhost:8080")
            .get('/book')
            .reply(400, message)
        chai
            .request('http://localhost:8080')
            .get('/book')
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(400);
                expect(res.body.message).to.equal('error fetching books');
                done();
            });
    });
    it('post route expect http code 400 and send an message "error adding the book"', done => {
        let message = {
            message: 'error adding the book'
        }
        nock("http://localhost:8080")
            .post('/book')
            .reply(400, message)
        chai
            .request('http://localhost:8080')
            .post('/book')
            .send({
                "id": "55b7d315-1a5f-4b13-a665-c382a6c71756",
                "title": "Oui-Oui contre Dominique Strauss-Kahn",
                "years": "2010",
                "pages": "50"
            })
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(400);
                expect(res.body.message).to.equal('error adding the book');
                done();
            });
    })
    it('put route expect status 400 and send an message"error updating the book"',done=>{
        let message = {
            message: 'error updating the book'
        }
        nock("http://localhost:8080")
        .put('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
        .reply(400,message)
            chai
            .request('http://localhost:8080')
            .put('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
            .send({
                "pages": "780"
            })
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(400);
                expect(res.body.message).to.equal('error updating the book');
                done();
            });
    });
    it('delete route expect status 400 and send an message"error deleting the book"',done=>{
        let message = {
            message: 'error deleting the book'
        }
        nock("http://localhost:8080")
        .delete('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
        .reply(400,message)
            chai
            .request('http://localhost:8080')
            .delete('/book/0db0b43e-dddb-47ad-9b4a-e5fe9ec7c2a9')
            .end((err, res) => {
                if (err) console.log(err);
                expect(res).to.have.status(400);
                expect(res.body.message).to.equal('error deleting the book');
                done();
            });
    });


});