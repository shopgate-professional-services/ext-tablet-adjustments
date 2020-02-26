import { connect } from 'react-redux';
import { getIsTablet } from '../selectors';

/**
 * Maps state to prop
 * @param {Object} state Redux state
 * @return {Object}
 */
const mapStateToProps = state => ({
  isTablet: getIsTablet(state),
});

export default connect(mapStateToProps);
