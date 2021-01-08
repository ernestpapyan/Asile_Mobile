import React from 'react';
import FlashMessage, {showMessage} from 'react-native-flash-message';

export const successMessage = ({message, description = ''}) => {
  showMessage({
    message: message,
    description: description,
    type: 'success',
    duration: 3000,
    position: 'bottom',
  });
};

export const errorMessage = ({message, description = ''}) => {
  showMessage({
    message: message,
    description: description,
    type: 'danger',
    duration: 3000,
    position: 'bottom',
  });
};

export const FlashMessageOnModal = React.forwardRef((props, ref) => (
  <FlashMessage ref={ref} position="bottom" />
));
