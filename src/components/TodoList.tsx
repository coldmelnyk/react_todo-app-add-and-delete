import React from 'react';

import { TodoItem } from './TodoItem';

import { Todo } from '../types/Todo';
import { TempTodoItem } from './TempTodoItem';

interface Props {
  todos: Todo[];
  onDeleteTodo: (targetId: number) => void;
  onChangeTodoStatus: (todo: Todo) => void;
  tempTodo: Todo | null;
  arrayOfTodoId: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  onChangeTodoStatus,
  tempTodo,
  arrayOfTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TodoItem
        todos={todos}
        onDeleteTodo={onDeleteTodo}
        onChangeTodoStatus={onChangeTodoStatus}
        arrayOfTodoId={arrayOfTodoId}
      />

      {tempTodo && <TempTodoItem tempTodo={tempTodo} />}
    </section>
  );
};
