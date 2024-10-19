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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.none,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [arrayOfTodoId, setArrayOfTodoId] = useState<number[]>([]);

  const clearAllCompletedTodos = () => {
    setIsLoading(true);
    const ids: number[] = [];
    const successIds: number[] = [];

    for (const todo of todos) {
      if (todo.completed) {
        ids.push(todo.id);
      }
    }

    if (ids.length > 0) {
      setArrayOfTodoId(ids);

      for (const id of ids) {
        deleteTodo(id)
          .then(() => {
            successIds.push(id);
          })
          .catch(() => {
            setErrorMessage(ErrorMessage.delete);
          });
      }

      setTimeout(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => !successIds.includes(todo.id)),
        );
        setArrayOfTodoId([]);
        setIsLoading(false);
      }, 300);
    }
  };

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
    setArrayOfTodoId([targetId]);

    deleteTodo(targetId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== targetId),
        ),
      )
      .catch(() => {
        setTodos(todos);
        setErrorMessage(ErrorMessage.delete);
      })
      .finally(() => {
        setArrayOfTodoId([]);
        setIsLoading(false);
      });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(ErrorMessage.none);

    const pushingNewTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    if (newTodoTitle) {
      setIsLoading(true);
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: newTodoTitle.trim(),
        completed: false,
      });

      return addTodo(pushingNewTodo)
        .then(newTodo => {
          setTodos(currentTodos => [...currentTodos, newTodo]);
          setNewTodoTitle('');
        })
        .catch(() => setErrorMessage(ErrorMessage.add))
        .finally(() => {
          setTempTodo(null);
          setIsLoading(false);
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
    setArrayOfTodoId([todo.id]);

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
      .finally(() => {
        setArrayOfTodoId([]);
        setIsLoading(false);
      });
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
          isLoading={isLoading}
          isAllTodosCompleted={isAllTodosCompleted}
          newTodoTitle={newTodoTitle}
          onHeaderSubmit={handleSubmit}
          handleTodoTitle={setNewTodoTitle}
          todos={todos}
        />

        <TodoList
          todos={filteredTodos}
          onDeleteTodo={deleteSelectedTodo}
          onChangeTodoStatus={handleTodoStatus}
          tempTodo={tempTodo}
          arrayOfTodoId={arrayOfTodoId}
        />

        {!isTodosEmpty && (
          <Footer
            todos={todos}
            onSettingFilter={setFilterType}
            filterType={filterType}
            clearAllCompletedTodos={clearAllCompletedTodos}
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
