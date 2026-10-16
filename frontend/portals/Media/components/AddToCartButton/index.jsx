import React, {
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { broadcastLiveMessage } from '@shopgate/engage/a11y';
import { I18n, IndicatorCircle, TickIcon } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { ProductContext, isProductOrderable, hasProductVariants } from '@shopgate/engage/product';
import { isProductPageLoading } from '@shopgate/pwa-common-commerce/product/selectors/page';
import { makeStyles, keyframes } from '@shopgate/engage/styles';
import spring from 'css-spring';
import { addProductToCart } from './actions';

const CHECKMARK_HIDE_DELAY = 1100;
const CHECKMARK_RESET_DELAY = 700;
const CLICK_RESET_DELAY = 250;

const springOptions = {
  stiffness: 381.47,
  damping: 15,
};

const springFromBottomKeyframes = keyframes(spring(
  { transform: 'translate3d(0, -300%, 0)' },
  { transform: 'translate3d(0, 0, 0)' },
  springOptions
));

const springToBottomKeyframes = keyframes(spring(
  { transform: 'translate3d(0, 0, 0)' },
  { transform: 'translate3d(0, -300%, 0)' },
  springOptions
));

const useStyles = makeStyles()({
  button: {
    fontSize: 18,
    fontWeight: 700,
    padding: '16px !important',
    overflow: 'hidden',
  },
  icon: {
    transition: 'opacity 450ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    opacity: 1,
    position: 'absolute',
  },
  tickIcon: {
    top: 15,
    right: 16,
  },
  spinnerIcon: {
    top: 12,
    right: 16,
    position: 'absolute',
  },
  springFromBottom: {
    animation: `${springFromBottomKeyframes} 600ms`,
  },
  springToBottom: {
    animation: `${springToBottomKeyframes} 600ms`,
  },
});

/**
 * The AddToCartButton component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const AddToCartButton = ({ conditioner, options, productId }) => {
  const { classes, cx, theme } = useStyles();
  const dispatch = useDispatch();
  const { quantity } = useContext(ProductContext);

  const disabled = useSelector(state => (
    !isProductOrderable(state, { productId }) && !hasProductVariants(state, { productId })
  ));
  const loading = useSelector(state => isProductPageLoading(state, { productId }));

  const [showCheckmark, setShowCheckmark] = useState(null);
  const clicked = useRef(false);

  const handleAddToCart = useCallback(() => {
    if (clicked.current || loading || disabled) {
      return;
    }

    conditioner.check().then((fulfilled) => {
      if (!fulfilled) {
        return;
      }

      clicked.current = true;
      setShowCheckmark(true);

      setTimeout(() => {
        setShowCheckmark(false);
        setTimeout(() => setShowCheckmark(null), CHECKMARK_RESET_DELAY);
      }, CHECKMARK_HIDE_DELAY);

      dispatch(addProductToCart({
        productId,
        options,
        quantity,
      }));

      broadcastLiveMessage('product.adding_item', {
        params: { count: quantity },
      });

      setTimeout(() => {
        clicked.current = false;
      }, CLICK_RESET_DELAY);
    });
  }, [loading, disabled, conditioner, dispatch, productId, options, quantity]);

  const iconOpacity = loading ? { opacity: 0 } : { opacity: 1 };
  const spinnerInlineStyle = loading ? { opacity: 1 } : { opacity: 0 };

  let tickClassName = cx(classes.icon, classes.tickIcon);
  let tickInlineStyle = showCheckmark === null
    ? {
      transform: 'translate3d(0, 300%, 0)',
      ...iconOpacity,
    }
    : null;

  if (showCheckmark) {
    tickClassName = cx(classes.icon, classes.tickIcon, classes.springFromBottom);
    tickInlineStyle = {
      transform: 'translate3d(0, 0, 0)',
      ...iconOpacity,
    };
  } else if (showCheckmark !== null) {
    tickClassName = cx(classes.icon, classes.tickIcon, classes.springToBottom);
    tickInlineStyle = {
      transform: 'translate3d(0, -300%, 0)',
      ...iconOpacity,
    };
  }

  return (
    <Button
      color="cta"
      fullWidth
      disabled={disabled}
      className={cx(classes.button, 'theme__product__add-to-cart-bar__add-to-cart-button')}
      data-test-id="addToCartBarButton"
      aria-label="product.add_to_cart"
      onClick={handleAddToCart}
    >
      <I18n.Text string="product.add_to_cart" />
      {loading && (
        <div className={classes.spinnerIcon} style={spinnerInlineStyle}>
          <IndicatorCircle
            color={theme.palette.primary.contrastText}
            strokeWidth={5}
            paused={!loading}
          />
        </div>
      )}
      <div className={tickClassName} style={tickInlineStyle}>
        <TickIcon size={28} />
      </div>
    </Button>
  );
};

AddToCartButton.propTypes = {
  conditioner: PropTypes.shape().isRequired,
  options: PropTypes.shape().isRequired,
  productId: PropTypes.string.isRequired,
};

export default AddToCartButton;
