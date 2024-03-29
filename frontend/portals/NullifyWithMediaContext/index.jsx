import React from 'react';
import PropTypes from 'prop-types';
import MediaColumnContext from '../MediaColumnContext';
import connect from '../connector';

/**
 * NullifyWithMediaContext component
 * @return {JSX}
 */
const NullifyWithMediaContext = ({ children, isTablet }) => {
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

NullifyWithMediaContext.propTypes = {
  children: PropTypes.node,
  isTablet: PropTypes.bool,
};

NullifyWithMediaContext.defaultProps = {
  isTablet: false,
  children: null,
};

export default connect(NullifyWithMediaContext);
