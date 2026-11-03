import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { appConfig } from '@shopgate/engage';
import { i18n } from '@shopgate/engage/core/helpers';
import { I18n, HeartIcon, HeartOutlineIcon } from '@shopgate/engage/components';
import { toggleFavoriteWithListChooser } from '@shopgate/engage/favorites';
import { isCurrentProductOnFavoriteList } from '@shopgate/pwa-common-commerce/favorites/selectors';
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
  },
  icon: {
    display: 'inline',
    marginBottom: -2,
    marginRight: 5,
  },
}));

/**
 * The favorites button component.
 * @param {Object} props The component props.
 * @returns {JSX|null}
 */
const AddToFavlist = ({
  productId,
  once,
  removeThrottle,
  removeWithRelatives,
  'aria-hidden': ariaHidden,
}) => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const active = useSelector(state => isCurrentProductOnFavoriteList(state, { productId }));
  const clickedOnce = useRef(false);

  const handleClick = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    if (once && clickedOnce.current) {
      return;
    }

    clickedOnce.current = true;

    if (!productId) {
      return;
    }

    if (!active) {
      dispatch(toggleFavoriteWithListChooser(productId));
    } else {
      setTimeout(() => {
        dispatch(toggleFavoriteWithListChooser(productId, removeWithRelatives));
      }, removeThrottle);
    }
  }, [once, productId, active, dispatch, removeWithRelatives, removeThrottle]);

  if (!appConfig.hasFavorites) {
    return null;
  }

  return (
    <button
      aria-label={i18n.text(active ? 'favorites.remove' : 'favorites.add')}
      aria-hidden={ariaHidden}
      className={`ui-shared__favorites-button ${classes.button}`}
      onClick={handleClick}
      data-test-id="favoriteButton"
      type="button"
    >
      <span>
        {active
          ? <HeartIcon className={classes.icon} />
          : <HeartOutlineIcon className={classes.icon} />}
      </span>
      <I18n.Text string={active ? 'favorites.remove' : 'favorites.add'} />
    </button>
  );
};

AddToFavlist.propTypes = {
  'aria-hidden': PropTypes.bool,
  once: PropTypes.bool,
  productId: PropTypes.string,
  removeThrottle: PropTypes.number,
  removeWithRelatives: PropTypes.bool,
};

AddToFavlist.defaultProps = {
  'aria-hidden': null,
  once: false,
  productId: null,
  removeThrottle: 0,
  removeWithRelatives: false,
};

export default AddToFavlist;
