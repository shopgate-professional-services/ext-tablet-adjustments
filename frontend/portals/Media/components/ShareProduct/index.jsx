import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import I18n from '@shopgate/pwa-common/components/I18n';
import * as engageProduct from '@shopgate/engage/product';
import ShareIcon from '@shopgate/pwa-ui-ios/icons/ShareIcon';
import favlistStyles from '../AddToFavlist/style';

const button = css(favlistStyles.button, {
  '@media only screen and (min-width: 786px)': {
    marginLeft: 8,
  },
}).toString();

/**
 * Fallback for PWA versions without the core share feature.
 * @returns {Object}
 */
const useNoShare = () => ({
  enabled: false,
  canShare: false,
  share: () => null,
});

const useProductShare = engageProduct.useProductShare || useNoShare;

/**
 * Share button of the right column. Uses the share feature of the PWA core.
 * @param {Object} props The component props.
 * @returns {JSX.Element|null}
 */
const ShareProduct = ({ productId }) => {
  const { enabled, canShare, share } = useProductShare(productId);

  if (!enabled || !canShare) {
    return null;
  }

  return (
    <button
      className={`ui-shared__share-button ${button}`}
      onClick={share}
      data-test-id="shareButton"
      type="button"
    >
      <span><ShareIcon className={favlistStyles.icon} /></span>
      <I18n.Text string="product.share" />
    </button>
  );
};

ShareProduct.propTypes = {
  productId: PropTypes.string,
};

ShareProduct.defaultProps = {
  productId: null,
};

export default ShareProduct;
