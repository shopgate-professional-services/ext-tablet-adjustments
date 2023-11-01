import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { useTheme, withCurrentProduct } from '@shopgate/engage/core';
import { ProductContext } from '@shopgate/engage/product';
import ProductUnitQuantityPicker from '@shopgate/engage/product/components/UnitQuantityPicker/ProductUnitQuantityPicker';
import OrderQuantityHint from '@shopgate/engage/product/components/OrderQuantityHint';
import { Portal, SurroundPortals } from '@shopgate/engage/components';
import MediaColumnContext from '../MediaColumnContext';
import connectIsTablet from '../connector';
import AddToCartButton from './components/AddToCartButton';
import AddToFavlist from './components/AddToFavlist';
import { colorPdpBox } from '../../config';

const styles = {
  container: css({
    '@media only screen and (min-width: 640px)': {
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
      '&& .common__swiper': {
        width: '50vw',
      },
    },
  }).toString(),
  ctaWrapper: css({
    padding: 16,
    ...(colorPdpBox && { backgroundColor: colorPdpBox }),
  }).toString(),
  ctaWrapperInner: css({
    minHeight: '52px',
    display: 'flex',
    alignItems: 'stretch',
    '@media only screen and (max-width: 786px)': {
      flexDirection: 'column',
    },
  }).toString(),
  rightBox: css({
    padding: '0 32px',
  }).toString(),
};

css.global('.upselling-pdp-sheet', {
  marginBottom: '0 !important',
});

css.global('.tablet-right-column .theme__product__header__product-info', {
  minHeight: 100,
});

css.global('.tablet-right-column > div', {
  borderTop: 'none',
});

css.global('.tablet-right-column .theme__product__header', {
  ...(colorPdpBox && { backgroundColor: colorPdpBox }),
});
css.global('.tablet-right-column .theme__product__header__product-info__row2', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
});
css.global('.tablet-right-column .price ui-shared__price', {
  fontSize: '1.7rem',
});

const PRODUCT_TABLET_RIGHT_COLUMN_CTAS = 'product.tablet.right-column.ctas';
const PRODUCT_TABLET_RIGHT_COLUMN = 'product.tablet.right-column';
const PRODUCT_TABLET_RIGHT_COLUMN_ADD_TO_CART_BEFORE = 'product.tablet.right-column.add-to-cart.before';
const PRODUCT_TABLET_RIGHT_COLUMN_ADD_TO_CART = 'product.tablet.right-column.add-to-cart';
const PRODUCT_TABLET_RIGHT_COLUMN_ADD_TO_CART_AFTER = 'product.tablet.right-column.add-to-cart.after';

/**
 * Media component
 * @return {JSX}
 * @param {Object} props for the component
 */
const Media = (props) => {
  const { children, isTablet } = props;
  const { ProductHeader } = useTheme();
  return (
    <SurroundPortals portalName="component.product-media-section.tablet-adjustments" portalProps={props}>
      {!isTablet ?
        <>
          {children}
        </> :
        <div className={styles.container}>
          <div>
            {React.cloneElement(children, { className: styles.swiper })}
          </div>
          <div className={styles.rightBox}>
            <SurroundPortals portalName={PRODUCT_TABLET_RIGHT_COLUMN}>
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
                      <Portal name={PRODUCT_TABLET_RIGHT_COLUMN_ADD_TO_CART_BEFORE} props={null} />
                      <Portal
                        name={PRODUCT_TABLET_RIGHT_COLUMN_ADD_TO_CART}
                        props={{
                          conditioner,
                          options,
                          variantId,
                          productId,
                        }}
                      >
                        <AddToCartButton
                          conditioner={conditioner}
                          options={options}
                          productId={variantId || productId}
                        />
                      </Portal>
                      <Portal name={PRODUCT_TABLET_RIGHT_COLUMN_ADD_TO_CART_AFTER} props={null} />
                      <div className={styles.ctaWrapperInner}>
                        <AddToFavlist
                          productId={productId}
                        />
                        <Portal name={PRODUCT_TABLET_RIGHT_COLUMN_CTAS} />
                      </div>
                    </div>
                  )}
                </ProductContext.Consumer>

              </MediaColumnContext.Provider>
            </SurroundPortals>
          </div>
        </div>
      }
    </SurroundPortals>
  );
};

Media.propTypes = {
  children: PropTypes.element,
  isTablet: PropTypes.bool,
};

Media.defaultProps = {
  children: null,
  isTablet: false,
};

export default connectIsTablet(withCurrentProduct(Media));
