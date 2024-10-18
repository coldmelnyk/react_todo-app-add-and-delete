import React from 'react';

import { TodoComponent } from './TodoComponent';

import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  onDeleteTodo: (targetId: number) => void;
  onChangeTodoStatus: (todo: Todo) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  onChangeTodoStatus,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TodoComponent
        todos={todos}
        onDeleteTodo={onDeleteTodo}
        onChangeTodoStatus={onChangeTodoStatus}
      />
    </section>
  );
};
