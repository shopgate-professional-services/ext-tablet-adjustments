import { connect } from 'react-redux';
import { isCurrentProductOnFavoriteList } from '@shopgate/pwa-common-commerce/favorites/selectors';

/**
 * Connects the current application state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  active: isCurrentProductOnFavoriteList(state, props),
});

export default connect(mapStateToProps);
