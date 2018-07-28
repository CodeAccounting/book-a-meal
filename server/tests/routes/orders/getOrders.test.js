import request from 'supertest';
import { expect } from 'chai';
import db from '../../../src/models';
import app from '../../../src/app';
import unAuthorized from '../../utils/unAuthorized';
import { addOrder as data } from '../../utils/data';
import { tokens } from '../../utils/setup';

const { foodCircleToken, emiolaToken, fakeUserToken } = tokens;
const { newOrder } = data;

describe('Order Routes: Get All Orders', () => {
  before((done) => {
    request(app)
      .post('/api/v1/orders')
      .set('Accept', 'application/json')
      .set('authorization', emiolaToken)
      .send({ ...newOrder })
      .end((err, res) => {
        db.Order.findOne({ where: { orderId: res.body.id } }).then(order =>
          order.update({ status: 'pending' }).then(() => {
            expect(res.statusCode).to.equal(201);

            if (err) return done(err);
            done();
          }));
      });
  });

  describe('Get Caterer Orders', () => {
    it('should get all caterer\'s orders', (done) => {
      request(app)
        .get('/api/v1/orders')
        .set('Accept', 'application/json')
        .set('authorization', foodCircleToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.orders.length).to.equal(3);

          if (err) return done(err);
          done();
        });
    });

    it('should get all caterer\'s orders for a particular day', (done) => {
      request(app)
        .get('/api/v1/orders?date=2018-05-01')
        .set('Accept', 'application/json')
        .set('authorization', foodCircleToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.orders.length).to.equal(1);

          if (err) return done(err);
          done();
        });
    });

    it('should not get orders for unauthorized user', (done) => {
      request(app)
        .get('/api/v1/orders')
        .set('Accept', 'application/json')
        .set('authorization', fakeUserToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(401);
          expect(res.body.error).to.equal('Unauthorized');

          if (err) return done(err);
          done();
        });
    });

    unAuthorized(
      'should return 401 error for user without token',
      request(app), 'get', '/api/v1/orders'
    );
  });

  describe('Get Customer Orders', () => {
    it('should get all orders in the app for customer', (done) => {
      request(app)
        .get('/api/v1/orders')
        .set('Accept', 'application/json')
        .set('authorization', emiolaToken)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.orders.length).to.equal(6);

          if (err) return done(err);
          done();
        });
    });

    unAuthorized(
      'should return 401 error for user without token',
      request(app), 'get', '/api/v1/orders'
    );
  });
});
