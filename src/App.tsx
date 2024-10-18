import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';

import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodoStatus,
  USER_ID,
} from './api/todos';

import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';

import { Todo } from './types/Todo';
import {
  ErrorMessage,
  filteringTodos,
  FilterTypes,
} from './utils/helperFunctions';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [filterType, setFilterType] = useState<FilterTypes>(FilterTypes.All);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.none,
  );

  const uploadingTodos = useMemo(() => {
    setErrorMessage(ErrorMessage.none);
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.load))
      .finally(() => setIsLoading(false));
  }, []);

  const deleteSelectedTodo = (targetId: number) => {
    setErrorMessage(ErrorMessage.none);
    setIsLoading(true);
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== targetId));

    deleteTodo(targetId)
      .catch(() => {
        setTodos(todos);
        setErrorMessage(ErrorMessage.delete);
      })
      .finally(() => setIsLoading(false));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage(ErrorMessage.none);

    const pushingNewTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    };

    if (newTodoTitle) {
      setIsLoading(true);

      return addTodo(pushingNewTodo)
        .then(newTodo => setTodos(currentTodos => [...currentTodos, newTodo]))
        .catch(() => setErrorMessage(ErrorMessage.add))
        .finally(() => {
          setIsLoading(false);
          setNewTodoTitle('');
        });
    }

    return setErrorMessage(ErrorMessage.emptyTitle);
  };

  const isTodosEmpty = todos.length === 0;

  const isAllTodosCompleted = todos.every(todo => todo.completed);

  const filteredTodos = useMemo(
    () => filteringTodos(todos, filterType),
    [todos, filterType],
  );

  const handleTodoStatus = (todo: Todo) => {
    setIsLoading(true);

    const todoWithNewStatus: Todo = {
      id: todo.id,
      userId: USER_ID,
      title: todo.title,
      completed: !todo.completed,
    };

    updateTodoStatus(todoWithNewStatus)
      .then(patchedTodo =>
        setTodos(currentTodos => {
          const updatingTodos = [...currentTodos];
          const indexOfTodo = todos.findIndex(
            todoFromArray => todoFromArray.id === patchedTodo.id,
          );

          updatingTodos.splice(indexOfTodo, 1, todoWithNewStatus);

          return updatingTodos;
        }),
      )
      .catch(() => setErrorMessage(ErrorMessage.update))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => uploadingTodos);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllTodosCompleted={isAllTodosCompleted}
          newTodoTitle={newTodoTitle}
          onHeaderSubmit={handleSubmit}
          handleTodoTitle={setNewTodoTitle}
        />

        <TodoList
          todos={filteredTodos}
          onDeleteTodo={deleteSelectedTodo}
          onChangeTodoStatus={handleTodoStatus}
        />

        {!isTodosEmpty && (
          <Footer
            todos={todos}
            onSettingFilter={setFilterType}
            filterType={filterType}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        handleError={setErrorMessage}
      />
    </div>
  );
};
