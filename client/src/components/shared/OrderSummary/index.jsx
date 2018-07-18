import React from 'react';
import PropTypes from 'prop-types';
import { orderMealPropTypes } from '../../../helpers/proptypes';
/**
 * @exports
 * @function OrderSummary
 * @param {array} meals
 * @returns {JSX} OrderSummary
 */
const OrderSummary = ({ meals }) => (
  <div className="order-summary">
    {meals.map(meal => (
      <div key={meal.id}>
        <p>{meal.quantity}x</p>
        <p>{meal.title}</p>
        <p>&#8358;{meal.quantity * meal.price}</p>
      </div>
  ))}
  </div>
);

OrderSummary.propTypes = {
  meals: PropTypes.arrayOf(orderMealPropTypes).isRequired
};

export default OrderSummary;