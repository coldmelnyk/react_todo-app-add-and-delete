import React, { Dispatch, FormEvent } from 'react';
import cn from 'classnames';

interface Props {
  isAllTodosCompleted: boolean;
  newTodoTitle: string;
  onHeaderSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  handleTodoTitle: Dispatch<React.SetStateAction<string>>;
}

export const Header: React.FC<Props> = ({
  isAllTodosCompleted,
  newTodoTitle,
  onHeaderSubmit,
  handleTodoTitle,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isAllTodosCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={event => onHeaderSubmit(event)}>
        <input
          value={newTodoTitle}
          onChange={event => handleTodoTitle(event.target.value.trimStart())}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
