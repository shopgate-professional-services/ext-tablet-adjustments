import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import connect from '../connector';

const wrapper = css({
  display: 'flex',
  justifyContent: 'flex-end',
});

const inner = css({
  width: '50%',
  padding: 16,
});

/**
 * PaymentBar component
 * @return {JSX}
 */
const PaymentBar = ({ children, isTablet }) => {
  if (!isTablet) {
    return children;
  }

  return (
    <div className={wrapper}>
      <div className={inner}>
        {children}
      </div>
    </div>
  );
};

PaymentBar.propTypes = {
  children: PropTypes.node,
  isTablet: PropTypes.bool,
};

PaymentBar.defaultProps = {
  isTablet: false,
  children: null,
};

export default connect(PaymentBar);
