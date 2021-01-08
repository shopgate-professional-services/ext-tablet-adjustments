import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { useTheme } from '@shopgate/engage/core';
import MediaColumnContext from '../MediaColumnContext';
import connect from '../connector';

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
};

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
      <div>
        <MediaColumnContext.Provider value={{ isMediaPosition: true }}>
          <ProductHeader />
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

export default connect(Media);
