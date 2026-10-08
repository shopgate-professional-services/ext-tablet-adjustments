import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getIsTablet } from '../../selectors';

/**
 * Nullify component
 * @param {Object} props The component props.
 * @returns {JSX|null}
 */
const Nullify = ({ children }) => {
  const isTablet = useSelector(getIsTablet);

  if (isTablet) {
    return null;
  }

  return children;
};

Nullify.propTypes = {
  children: PropTypes.node,
};

Nullify.defaultProps = {
  children: null,
};

export default Nullify;
