import React from 'react';
import PropTypes from 'prop-types';
import connect from '../connector';

/**
 * Nullify component
 * @return {JSX}
 */
const Nullify = ({ children, isTablet }) => {
  if (isTablet) {
    return null;
  }

  return children;
};

Nullify.propTypes = {
  children: PropTypes.node,
  isTablet: PropTypes.bool,
};

Nullify.defaultProps = {
  isTablet: false,
  children: null,
};

export default connect(Nullify);
