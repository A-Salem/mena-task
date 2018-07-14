const expect = require('expect');
const request = require('supertest');

const { app, ObjectID } = require('./../server');
const { News } = require('./../models/news');

const news = [{
    _id: new ObjectID("5b49ac6ca31f80475aa8fa79"),
    title: 'First News Title',
    short_description: 'First Description',
    text: 'First News Text'
}, {
    title: 'Second News Title',
    short_description: 'Second Description',
    text: 'Second News Text'
}];


beforeEach((done) => {
  News.remove({}).then(() => {
    return News.insertMany(news);
  }).then(() => done());
});


describe('POST /news (Add News)', () => {
  it('should create a new item of news', (done) => {
    let oneOfNews = {
      title: 'Insert one item of news test ... title',
      short_description: 'insert item test ... description',
      text: 'insert item test ... text'
    };

    request(app)
      .post('/news')
      .send(oneOfNews)
      .expect(201)
      .expect((res) => {
        expect(res.body.added_item.title).toBe(oneOfNews.title);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        News.find(oneOfNews).then((news) => {
          expect(news.length).toBe(1);
          expect(news[0].title).toBe(oneOfNews.title);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create news item with invalid body text', (done) => {
    request(app)
      .post('/news')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err){
          return done(err);
        }

        News.find().then((news) => {
          expect(news.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});


describe('GET /news (List News)', () => {
  it('should get all news', (done) => {
    request(app)
      .get('/news')
      .expect(200)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        expect(res.body.news.length).toBe(2);
        done();
      });
  });
});


describe('GET /news/:id (Get item of news)', () => {
  it('should get one item of news by its id', (done) => {
    request(app)
      .get(`/news/${news[0]._id}`)
      .expect(200)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        expect(typeof res.body).toBe('object');
        expect(res.body.title).toBe(news[0].title);
        done();
      });
  });
});


describe('DELETE /news/:id (Delete item of news)', () => {
  it('should delete one item of news by its id', (done) => {
    request(app)
      .delete(`/news/${news[0]._id}`)
      .expect(200)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        expect(res.body.message).toBe('Deleted successfully');
        expect(res.body.deleted_item.title).toBe(news[0].title);

        News.find().then((news) => {
          expect(news.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
});


describe('POST /news/:id/update (Update item of news)', () => {
  it('should update one item of news by its id', (done) => {

    let updateObj = {
      title: 'New Title after update done',
      short_description: 'New Description after update done',
      text: 'New Text after update done'
    };

    request(app)
      .post(`/news/${news[0]._id}/update`)
      .send(updateObj)
      .expect(200)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        expect(res.body.message).toBe('Updated successfully');
        expect(res.body.updated_item.title).toBe(news[0].title);

        News.find({_id: news[0]._id}).then((news) => {
          expect(news.length).toBe(1);
          expect(news[0].title).toBe(updateObj.title);
          done();
        }).catch((e) => done(e));
      });
  });
});
