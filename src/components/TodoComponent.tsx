/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  onDeleteTodo: (targetId: number) => void;
  onChangeTodoStatus: (todo: Todo) => void;
}

export const TodoComponent: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  onChangeTodoStatus,
}) => {
  return (
    <>
      {todos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={cn('todo', {
            completed: todo.completed,
          })}
        >
          <label className="todo__status-label">
            <input
              onClick={() => onChangeTodoStatus(todo)}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            onClick={() => onDeleteTodo(todo.id)}
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
          >
            x
          </button>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </>
  );
};
