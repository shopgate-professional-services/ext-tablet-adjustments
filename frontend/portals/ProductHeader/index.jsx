import React from 'react';
import PropTypes from 'prop-types';
import MediaColumnContext from '../MediaColumnContext';
import connect from '../connector';

/**
 * ProductHeader component
 * @return {JSX}
 */
const ProductHeader = ({ children, isTablet }) => {
  if (!isTablet) {
    return children;
  }

  return (
    <MediaColumnContext.Consumer>
      {(mediaContext = {}) => {
        if (!mediaContext.isMediaPosition) {
          return null;
        }

        return children;
      }}
    </MediaColumnContext.Consumer>
  );
};

ProductHeader.propTypes = {
  children: PropTypes.node,
  isTablet: PropTypes.bool,
};

ProductHeader.defaultProps = {
  isTablet: false,
  children: null,
};

export default connect(ProductHeader);
