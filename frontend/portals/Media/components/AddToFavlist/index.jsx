import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import connectUiShared from '@shopgate/pwa-ui-shared/FavoritesButton/connector';
import appConfig from '@shopgate/pwa-common/helpers/config';
import { HeartIcon, HeartOutlineIcon } from '@shopgate/engage/components';
import connect from './connector';
import styles from './style';

/**
 * The favorites button component.
 */
class AddToFavlist extends Component {
  static propTypes = {
    active: PropTypes.bool,
    addFavorites: PropTypes.func,
    'aria-hidden': PropTypes.bool,
    // When true, button would react on click only once.
    once: PropTypes.bool,
    onRippleComplete: PropTypes.func,
    productId: PropTypes.string,
    removeFavorites: PropTypes.func,
    removeThrottle: PropTypes.number,
    removeWithRelatives: PropTypes.bool,
  };

  /**
   * Context types definition.
   * @type {{i18n: shim}}
   */
  static contextTypes = {
    i18n: PropTypes.func,
  };

  static defaultProps = {
    active: false,
    addFavorites: () => {},
    'aria-hidden': null,
    once: false,
    onRippleComplete: () => {},
    productId: null,
    removeFavorites: () => {},
    removeThrottle: 0,
    removeWithRelatives: false,
  };

  /**
   * Construct and init state
   * @param {Object} props Component props
   */
  constructor(props) {
    super(props);
    this.clickedOnce = false;
  }

  /**
   * Callback for the moment when the ripple animation is done.
   */
  onRippleComplete = () => {
    this.props.onRippleComplete(this.props.active);
  };

  /**
   * Returns text for aria-label.
   * @returns {string}
   */
  getLabel() {
    const { __ } = this.context.i18n();
    const lang = this.props.active ? 'favorites.remove' : 'favorites.add';
    return __(lang);
  }

  /**
   * Adds or removes a given product ID from the favorite list.
   * @param {Object} event The click event object.
   */
  handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (this.props.once && this.clickedOnce) {
      return;
    }

    this.clickedOnce = true;

    if (!this.props.productId) {
      return;
    }

    if (!this.props.active) {
      this.props.addFavorites(this.props.productId);
    } else {
      setTimeout(() => {
        this.props.removeFavorites(this.props.productId, this.props.removeWithRelatives);
      }, this.props.removeThrottle);
    }
  };

  /**
   * Renders the heart icon as filled or outlined, depending on the favorite button being active.
   * @returns {JSX}
   */
  renderIcon() {
    if (this.props.active) {
      return <HeartIcon className={styles.icon} />;
    }

    return <HeartOutlineIcon className={styles.icon} />;
  }

  /**
   * Renders the component.
   * @returns {JSX|null}
   */
  render() {
    if (!appConfig.hasFavorites) {
      return null;
    }
    return (
      <button
        aria-label={this.getLabel()}
        aria-hidden={this.props['aria-hidden']}
        className={`ui-shared__favorites-button ${styles.button}`}
        onClick={this.handleClick}
        data-test-id="favoriteButton"
        type="button"
      >
        <span>{this.renderIcon()}</span>
        <I18n.Text string={this.props.active ? 'favorites.remove' : 'favorites.add'} />
      </button>
    );
  }
}

export default connectUiShared(connect(AddToFavlist));
