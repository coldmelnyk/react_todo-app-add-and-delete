import React from 'react';

import { TodoItem } from './TodoItem';

import { Todo } from '../types/Todo';
import { TempTodoItem } from './TempTodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

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
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              key={todo.id}
              todo={todo}
              onDeleteTodo={onDeleteTodo}
              onChangeTodoStatus={onChangeTodoStatus}
              arrayOfTodoId={arrayOfTodoId}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TempTodoItem tempTodo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
