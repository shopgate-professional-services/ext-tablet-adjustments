import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import MediaColumnContext from '../MediaColumnContext';
import { getIsTablet } from '../../selectors';

/**
 * NullifyWithMediaContext component
 * @param {Object} props The component props.
 * @returns {JSX|null}
 */
const NullifyWithMediaContext = ({ children }) => {
  const isTablet = useSelector(getIsTablet);

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
};

NullifyWithMediaContext.defaultProps = {
  children: null,
};

export default NullifyWithMediaContext;
