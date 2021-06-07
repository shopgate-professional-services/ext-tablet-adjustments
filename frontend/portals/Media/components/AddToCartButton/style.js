import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import spring from 'css-spring';

const { colors } = themeConfig;

const button = css({
  display: 'block',
  flexGrow: 1,
  background: colors.cta,
  color: colors.ctaContrast,
  fontSize: 18,
  fontWeight: 700,
  borderRadius: 5,
  width: '100%',
  outline: 0,
  overflow: 'hidden',
  transition: 'width 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  padding: '0 !important',
});

const rippleButton = css({
  fontSize: 18,
  fontWeight: 700,
  padding: '16px !important',
});

const disabled = css(button, {
  background: colors.shade5,
  padding: '16px !important',
});

const spinnerIcon = css({
  top: 12,
  right: 16,
  position: 'absolute',
});

const options = {
  stiffness: 381.47,
  damping: 15,
};

const springFromBottomKeyframes = css.keyframes(spring(
  { transform: 'translate3d(0, -300%, 0)' },
  { transform: 'translate3d(0, 0, 0)' },
  options
));

const springToBottomKeyframes = css.keyframes(spring(
  { transform: 'translate3d(0, 0, 0)' },
  { transform: 'translate3d(0, -300%, 0)' },
  options
));

const springFromBottom = css({
  animation: `${springFromBottomKeyframes} 600ms`,
}).toString();

const springToBottom = css({
  animation: `${springToBottomKeyframes} 600ms`,
}).toString();

export default {
  button,
  rippleButton,
  disabled,
  springToBottom,
  springFromBottom,
  spinnerIcon,
};
