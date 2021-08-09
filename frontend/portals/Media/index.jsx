import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { useTheme, withCurrentProduct } from '@shopgate/engage/core';
import { ProductContext } from '@shopgate/engage/product';
import ProductUnitQuantityPicker
  from '@shopgate/engage/product/components/UnitQuantityPicker/ProductUnitQuantityPicker';
import OrderQuantityHint
  from '@shopgate/engage/product/components/OrderQuantityHint';
import MediaColumnContext from '../MediaColumnContext';
import connectIsTablet from '../connector';
import AddToCartButton from './components/AddToCartButton';
import AddToFavlist from './components/AddToFavlist';
import { colorPdpBox } from '../../config';

const styles = {
  container: css({
    '@media only screen and (min-width: 640px)': {
      marginBottom: 10,
      display: 'flex',
      alignItems: 'center',
      '> div': {
        width: '50%',
        '> div': {
          // remove border top from gmd
          borderTop: 'none',
        },
      },
    },
  }),
  swiper: css({
    '@media only screen and (min-width: 640px)': {
      width: '50vw',
    },
  }).toString(),
  ctaWrapper: css({
    padding: 16,
    ...(colorPdpBox && { backgroundColor: colorPdpBox }),
  }).toString(),
  rightBox: css({
    padding: '0 32px',
  }).toString(),
};

css.global('.upselling-pdp-sheet', {
  marginBottom: '0 !important',
});

css.global('.tablet-right-column .theme__product__header__product-info', {
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginTop: 10,
});
css.global('.tablet-right-column .theme__product__header', {
  ...(colorPdpBox && { backgroundColor: colorPdpBox }),
});
css.global('.tablet-right-column .theme__product__header__product-info__row2', {
  marginLeft: 0,
  marginTop: 10,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  width: '100%',
  paddingRight: 16,
});
css.global('.tablet-right-column .price ui-shared__price', {
  fontSize: '1.7rem',
});

/**
 * Media component
 * @return {JSX}
 */
const Media = ({ children, isTablet }) => {
  if (!isTablet) {
    return children;
  }

  const { ProductHeader } = useTheme();

  return (
    <div className={styles.container}>
      <div>
        {React.cloneElement(children, { className: styles.swiper })}
      </div>
      <div className={styles.rightBox}>
        <MediaColumnContext.Provider value={{ isMediaPosition: true }}>
          <div className="tablet-right-column">
            <ProductHeader />
          </div>
          <ProductContext.Consumer>
            {({
              conditioner,
              options,
              productId,
              variantId,
            }) => (
              <div className={styles.ctaWrapper}>
                <ProductUnitQuantityPicker>
                  <OrderQuantityHint
                    productId={variantId || productId}
                  />
                </ProductUnitQuantityPicker>
                <AddToCartButton
                  conditioner={conditioner}
                  options={options}
                  productId={variantId || productId}
                />
                <AddToFavlist
                  productId={productId}
                />
              </div>
            )}
          </ProductContext.Consumer>

        </MediaColumnContext.Provider>
      </div>
    </div>
  );
};

Media.propTypes = {
  children: PropTypes.node,
  isTablet: PropTypes.bool,
};

Media.defaultProps = {
  isTablet: false,
  children: null,
};

export default connectIsTablet(withCurrentProduct(Media));
