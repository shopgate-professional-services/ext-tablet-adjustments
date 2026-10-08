import React from 'react';
import PropTypes from 'prop-types';
import * as engageProduct from '@shopgate/engage/product';
import { I18n, ShareIconIOS as ShareIcon } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  button: {
    marginTop: 10,
    display: 'block',
    flexGrow: 1,
    border: `1px solid ${theme.palette.secondary.main}`,
    color: theme.palette.secondary.main,
    fontSize: 16,
    fontWeight: 700,
    borderRadius: theme.components.button.borderRadius,
    width: '100%',
    outline: 0,
    transition: 'width 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
    padding: '11px 9.6px 13px',
    '@media only screen and (min-width: 786px)': {
      marginLeft: 8,
    },
  },
  icon: {
    display: 'inline',
    marginBottom: -2,
    marginRight: 5,
  },
}));

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
  const { classes } = useStyles();

  if (!enabled || !canShare) {
    return null;
  }

  return (
    <button
      className={`ui-shared__share-button ${classes.button}`}
      onClick={share}
      data-test-id="shareButton"
      type="button"
    >
      <span><ShareIcon className={classes.icon} /></span>
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
