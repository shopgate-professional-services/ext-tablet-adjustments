import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { withCurrentProduct } from '@shopgate/engage/core';
import { useThemeComponents } from '@shopgate/engage/core/hooks';
import { ProductContext } from '@shopgate/engage/product';
import ProductUnitQuantityPicker from '@shopgate/engage/product/components/UnitQuantityPicker/ProductUnitQuantityPicker';
import OrderQuantityHint from '@shopgate/engage/product/components/OrderQuantityHint';
import { Portal, SurroundPortals } from '@shopgate/engage/components';
import { makeStyles, injectGlobal } from '@shopgate/engage/styles';
import MediaColumnContext from '../MediaColumnContext';
import { getIsTablet } from '../../selectors';
import AddToCartButton from './components/AddToCartButton';
import AddToFavlist from './components/AddToFavlist';
import ShareProduct from './components/ShareProduct';
import config from '../../config.json';

const { colorPdpBox } = config;

const MEDIA_COLUMN_CONTEXT_VALUE = { isMediaPosition: true };

const useStyles = makeStyles()({
  container: {
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
  },
  swiper: {
    '@media only screen and (min-width: 640px)': {
      '&& .common__swiper': {
        width: '50vw',
      },
    },
  },
  ctaWrapper: {
    padding: 16,
    ...(colorPdpBox && { backgroundColor: colorPdpBox }),
  },
  ctaWrapperInner: {
    minHeight: '52px',
    display: 'flex',
    alignItems: 'stretch',
    '@media only screen and (max-width: 786px)': {
      flexDirection: 'column',
    },
  },
  rightBox: {
    padding: '0 32px',
  },
});

injectGlobal({
  '.upselling-pdp-sheet': {
    marginBottom: '0 !important',
  },
  '.tablet-right-column .theme__product__header__product-info': {
    minHeight: 100,
  },
  '.tablet-right-column > div': {
    borderTop: 'none',
  },
  '.tablet-right-column .theme__product__header': {
    ...(colorPdpBox && { backgroundColor: colorPdpBox }),
  },
  '.tablet-right-column .theme__product__header__product-info__row2': {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  '.tablet-right-column .price .ui-shared__price': {
    fontSize: '1.7rem',
  },
});

const PRODUCT_TABLET_RIGHT_COLUMN_CTAS = 'product.tablet.right-column.ctas';
const PRODUCT_TABLET_RIGHT_COLUMN = 'product.tablet.right-column';
const ADD_TO_CART_BEFORE = 'product.tablet.right-column.add-to-cart.before';
const ADD_TO_CART = 'product.tablet.right-column.add-to-cart';
const ADD_TO_CART_AFTER = 'product.tablet.right-column.add-to-cart.after';

/**
 * Media component
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Media = (props) => {
  const { children } = props;
  const { classes } = useStyles();
  const isTablet = useSelector(getIsTablet);
  const { ProductHeader } = useThemeComponents();

  return (
    <SurroundPortals
      portalName="component.product-media-section.tablet-adjustments"
      portalProps={props}
    >
      {!isTablet ? (
        children
      ) : (
        <div className={classes.container}>
          <div>
            {React.cloneElement(children, { className: classes.swiper })}
          </div>
          <div className={classes.rightBox}>
            <SurroundPortals portalName={PRODUCT_TABLET_RIGHT_COLUMN}>
              <MediaColumnContext.Provider value={MEDIA_COLUMN_CONTEXT_VALUE}>
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
                    <div className={classes.ctaWrapper}>
                      <ProductUnitQuantityPicker>
                        <OrderQuantityHint
                          productId={variantId || productId}
                        />
                      </ProductUnitQuantityPicker>
                      <Portal name={ADD_TO_CART_BEFORE} props={null} />
                      <Portal
                        name={ADD_TO_CART}
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
                      <Portal name={ADD_TO_CART_AFTER} props={null} />
                      <div className={classes.ctaWrapperInner}>
                        <AddToFavlist
                          productId={productId}
                        />
                        <ShareProduct productId={variantId || productId} />
                        <Portal name={PRODUCT_TABLET_RIGHT_COLUMN_CTAS} />
                      </div>
                    </div>
                  )}
                </ProductContext.Consumer>

              </MediaColumnContext.Provider>
            </SurroundPortals>
          </div>
        </div>
      )}
    </SurroundPortals>
  );
};

Media.propTypes = {
  children: PropTypes.element,
};

Media.defaultProps = {
  children: null,
};

export default withCurrentProduct(Media);
