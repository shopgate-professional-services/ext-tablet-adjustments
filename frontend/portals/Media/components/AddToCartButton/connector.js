import { connect } from 'react-redux';
import { isProductOrderable, hasProductVariants } from '@shopgate/pwa-common-commerce/product/selectors/product';
import { isProductPageLoading } from '@shopgate/pwa-common-commerce/product/selectors/page';
import { addProductToCart } from './actions';

/**
 * Connects the current application state to the component props.
 * @param {Object} state The current application state.
 * @param {Object} props The component props.
 * @return {Object} The extended component props.
 */
const mapStateToProps = (state, props) => ({
  disabled: !isProductOrderable(state, props) && !hasProductVariants(state, props),
  loading: isProductPageLoading(state, props),
});

/**
 * Connects the dispatch function to a callable function in the props.
 * @param {Function} dispatch The redux dispatch function.
 * @return {Object} The extended component props.
 */
const mapDispatchToProps = dispatch => ({
  addToCart: data => dispatch(addProductToCart(data)),
});

export default connect(mapStateToProps, mapDispatchToProps);
