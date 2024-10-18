/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, useEffect } from 'react';
import cn from 'classnames';
import { ErrorMessage } from '../utils/helperFunctions';

interface Props {
  errorMessage: ErrorMessage;
  handleError: Dispatch<React.SetStateAction<ErrorMessage>>;
}

export const ErrorNotification: React.FC<Props> = ({
  errorMessage,
  handleError,
}) => {
  useEffect(() => {
    if (errorMessage !== ErrorMessage.none) {
      setTimeout(() => {
        handleError(ErrorMessage.none);
      }, 3000);
    }
  }, [errorMessage]);

  return (
    <div
      data-cy="ErrorNotification"
      className={cn('notification is-danger is-light has-text-weight-normal', {
        hidden: errorMessage === ErrorMessage.none,
      })}
    >
      <button data-cy="HideErrorButton" type="button" className="delete" />
      {errorMessage}
    </div>
  );
};
