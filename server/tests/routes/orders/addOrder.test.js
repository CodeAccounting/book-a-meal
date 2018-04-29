import request from 'supertest';
import { expect } from 'chai';
import moment from 'moment';
import app from '../../../src/app';
import unAuthorized from '../../utils/unAuthorized';

const userMockToken = '68734hjsdjkjksdjkndjsjk78938823sdvzgsuydsugsujsdbcuydsiudsy';
const adminMockToken = '68734hjsdjkjksdjkndjsjk78938823sdvzgsuydsugsup[d73489jsdbcuydsiudsy';
const currentDay = moment().format('YYYY-MM-DD');
let newMenuId;

describe('Order Routes: Add an Order', () => {
  const menu = {
    date: currentDay,
    meals: [
      '72a3417e-45c8-4559-8b74-8b5a61be8614',
      '8a65538d-f862-420e-bcdc-80743df06578',
      'f9eb7652-125a-4bcb-ad81-02f84901cdc3',
    ]
  };

  const newOrder = {
    deliveryAddress: '4, Church Street, Yaba',
    deliveryPhoneNo: '+2348134567890',
    quantity: 2
  };

  const orderwithoutQuantity = {
    deliveryAddress: '4, Church Street, Yaba',
    deliveryPhoneNo: '+2348134567890',
  };

  const badOrder = {
    menuId: '15421f7a-0f82-4802-b215-e0e8efb6bfb38932',
    deliveryAddress: '',
    deliveryPhoneNo: 'disdod',
    quantity: '2'
  };

  const orderWithExpiredMenu = {
    menuId: 'f43f3d49-a6c9-476d-b65a-1af772ff0f36',
    deliveryAddress: '4, Church Street, Yaba',
    deliveryPhoneNo: '+2348134567890',
    quantity: 2
  };

  it('should add a menu for authenticated user, for the current day', (done) => {
    request(app)
      .post('/api/v1/menu')
      .set('Accept', 'application/json')
      .set('authorization', adminMockToken)
      .send(menu)
      .end((err, res) => {
        newMenuId = res.body.menuId;
        expect(res.statusCode).to.equal(201);
        expect(res.body).to.include.keys('menuId');
        expect(res.body).to.include.keys('date');
        expect(res.body.date).to.equal(currentDay);
        expect(res.body.meals[0].mealId).to.equal('72a3417e-45c8-4559-8b74-8b5a61be8614');

        if (err) return done(err);
        done();
      });
  });

  it('should add an order for authenticated user', (done) => {
    request(app)
      .post('/api/v1/orders')
      .set('Accept', 'application/json')
      .set('authorization', userMockToken)
      .send({ ...newOrder, menuId: newMenuId })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body).to.include.keys('orderId');
        expect(res.body).to.include.keys('userId');
        expect(res.body).to.include.keys('created');
        expect(res.body).to.include.keys('updated');
        expect(res.body.menu).to.include.keys('meals');

        if (err) return done(err);
        done();
      });
  });

  it('should add an order using default quantity 1', (done) => {
    request(app)
      .post('/api/v1/orders')
      .set('Accept', 'application/json')
      .set('authorization', userMockToken)
      .send({ ...orderwithoutQuantity, menuId: newMenuId })
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.quantity).to.equal(1);

        if (err) return done(err);
        done();
      });
  });

  it('should not add expired menu/future menu', (done) => {
    request(app)
      .post('/api/v1/orders')
      .set('Accept', 'application/json')
      .set('authorization', userMockToken)
      .send(orderWithExpiredMenu)
      .end((err, res) => {
        expect(res.statusCode).to.equal(422);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.equal('Menu is Unavailable');

        if (err) return done(err);
        done();
      });
  });

  it('should return errors for invalid input', (done) => {
    request(app)
      .post('/api/v1/orders')
      .set('Accept', 'application/json')
      .set('authorization', userMockToken)
      .send(badOrder)
      .end((err, res) => {
        expect(res.statusCode).to.equal(422);
        expect(res.body).to.be.an('object');
        // expect(res.body.errors.menuId.msg).to.equal('Invalid ID');
        expect(res.body.errors.deliveryAddress.msg).to.equal('Delivery Address cannot be empty');
        expect(res.body.errors.deliveryPhoneNo.msg).to.equal('Delivery Phone Number must be in the format +2348134567890');

        if (err) return done(err);
        done();
      });
  });

  unAuthorized(
    'should return 401 error for user without token',
    request(app), 'post', '/api/v1/orders'
  );
});
