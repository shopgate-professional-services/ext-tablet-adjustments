import { createSelector } from 'reselect';
import { getDeviceInformation } from '@shopgate/pwa-common/selectors/client';

export const getIsTablet = createSelector(
  getDeviceInformation,
  (device) => {
    const { type = 'phone' } = device || {};

    return type === 'tablet';
  }
);
