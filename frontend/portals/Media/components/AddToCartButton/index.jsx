import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import I18n from '@shopgate/pwa-common/components/I18n';
import { broadcastLiveMessage } from '@shopgate/engage/a11y';
import { IndicatorCircle, RippleButton, TickIcon } from '@shopgate/engage/components';
import cartButtonStyles from '@shopgate/pwa-ui-shared/AddToCartButton/style';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import connect from './connector';
import styles from './style';

/**
 * The AddToCartButton component.
 */
class AddToCartButton extends PureComponent {
  static propTypes = {
    addToCart: PropTypes.func.isRequired,
    conditioner: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    options: PropTypes.shape().isRequired,
    productId: PropTypes.string.isRequired,
  }

  static defaultProps = {
  }

  static contextTypes = {
    i18n: PropTypes.func,
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      showCheckmark: null,
    };
  }

  /**
   * Handles the button click.
   * Checks if the button can be clicked and if
   * all criteria set by the conditioner are met.
   */
  handleAddToCart = () => {
    if (this.state.clicked) {
      return;
    }

    if (this.props.loading || this.props.disabled) {
      return;
    }

    this.props.conditioner.check().then((fullfilled) => {
      if (!fullfilled) {
        return;
      }

      this.setState({
        clicked: true,
        showCheckmark: true,
      });

      setTimeout(() => {
        // return;
        this.setState({
          showCheckmark: false,
        });

        setTimeout(() => {
          this.setState({
            showCheckmark: null,
          });
        }, 700);
      }, 1100);

      this.props.addToCart({
        productId: this.props.productId,
        options: this.props.options,
        quantity: this.context.quantity,
      });

      broadcastLiveMessage('product.adding_item', {
        params: { count: this.context.quantity },
      });

      setTimeout(() => {
        this.setState({
          clicked: false,
        });
      }, 250);
    });
  }

  /**
   * Adds a new product to cart or opens the cart if it already has products in it.
   */
  handleClick = () => {
    this.handleAddToCart();
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const className = this.props.disabled ? styles.disabled : styles.button;

    let tickIconStyle = `${cartButtonStyles.icon} ${css({
      top: 15,
      right: 16,
    })}`;

    // Depending on the loading prop we only show the spinner or the other way around.
    const iconOpacity = this.props.loading ? { opacity: 0 } : { opacity: 1 };
    const spinnerInlineStyle = this.props.loading ? { opacity: 1 } : { opacity: 0 };

    let tickInlineStyle = this.state.showCheckmark === null ? {
      transform: 'translate3d(0, 300%, 0)',
      ...iconOpacity,
    } : null;

    if (this.state.showCheckmark) {
      /**
       * When checkmark should be shown, we start the spring transition
       * Tick icon springs in, and cart icon springs out.
       */
      tickIconStyle += ` ${styles.springFromBottom}`;
      /**
       * After the keyframe animation is done the transform values are reset
       * We add the inline style to make sure the icons stay where they are even after the animation
       */
      tickInlineStyle = {
        transform: 'translate3d(0, 0, 0)',
        ...iconOpacity,
      };
    } else if (this.state.showCheckmark !== null) {
      /**
       * When checkmark should no longer be shown we start the spring out transition.
       * Tick icon springs out, cart icon spring in.
       * We don't want a animation when we initially go to the page therefore this only happens
       * after the user pressed the button.
       */
      tickIconStyle += ` ${styles.springToBottom}`;
      tickInlineStyle = {
        transform: 'translate3d(0, -300%, 0)',
        ...iconOpacity,
      };
    }

    return (
      <RippleButton
        type="secondary"
        disabled={this.props.disabled}
        rippleClassName={styles.rippleButton}
        className={`${className} theme__product__add-to-cart-bar__add-to-cart-button`}
        data-test-id="addToCartBarButton"
        aria-label="product.add_to_cart"
        onClick={this.handleAddToCart}
      >
        <I18n.Text string="product.add_to_cart" />
        {this.props.loading &&
        <div className={styles.spinnerIcon} style={spinnerInlineStyle}>
          <IndicatorCircle
            color={themeConfig.colors.primaryContrast}
            strokeWidth={5}
            paused={!this.props.loading}
          />
        </div>
        }
        <div className={tickIconStyle} style={tickInlineStyle}>
          <TickIcon size={28} />
        </div>
      </RippleButton>
    );
  }
}

export default connect(AddToCartButton);
