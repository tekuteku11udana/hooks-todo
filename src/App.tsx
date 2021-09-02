import {useState} from 'react'

interface Todo {
  value: string;
  id: number;
  checked: boolean;
  removed: boolean;
}

type Filter = "all" | "checked" | "unchecked" | "removed";

const App: React.FC = () => {
  const initialTodos: Todo[] = [
    {
      value: 'teratail',
      id: 1619563885774,
      checked: false,
      removed: true,
    },
    {
      value: 'Qiita',
      id: 1619564012625,
      checked: true,
      removed: false,
    },
    {
      value: 'Zenn',
      id: 1619564053848,
      checked: false,
      removed: false,
    },
  ];

  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<Filter>("all");

  const handleOnSubmit = (
    e: React.FormEvent<HTMLFormElement | HTMLInputElement>
  ) => {
    e.preventDefault();
    if (!text) return;

    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false
    };

    setTodos([newTodo, ...todos]);
    setText("");
  };

  const handleOnEdit = (id: number, value: string) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.value = value;
      }
      return todo;
    });

    setTodos(newTodos);
  };

  const handleOnCheck = (id: number, checked: boolean) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.checked = !checked;
      }
      return todo;
    });

    setTodos(newTodos);
  };

  const handleOnRemove = (id: number, removed: boolean) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.removed = !removed;
      }
      return todo;
    });

    setTodos(newTodos);
  };

  const handleOnEmpty = () => {
    const newTodos = todos.filter((todo) => !todo.removed);
    setTodos(newTodos);
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case "all":
        return !todo.removed;
      case "checked":
        return todo.checked && !todo.removed;
      case "unchecked":
        return !todo.checked && !todo.removed;
      case "removed":
        return todo.removed;
      default:
        return todo;
    }
  });

  return (
    <div className="container">
      <select
        className="select"
        defaultValue="all"
        onChange={(e) => setFilter(e.target.value as Filter)}
      >
        <option value="all">すべてのタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="checked">完了済みのタスク</option>
        <option value="removed">ごみ箱</option>
      </select>
      {filter === "removed" ? (
        <button
          className="empty"
          disabled={todos.filter((todo) => todo.removed).length === 0}
          onClick={() => handleOnEmpty()}
        >
          ごみ箱を空にする
        </button>
      ) : (
        <form className="form" onSubmit={(e) => handleOnSubmit(e)}>
          <input
            className="text"
            type="text"
            disabled={filter === "checked"}
            placeholder="What to do..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="submit"
            value="追加"
            disabled={filter === "checked"}
            className="button"
            onSubmit={(e) => handleOnSubmit(e)}
          />
        </form>
      )}
      <ul>
        {filteredTodos.map((todo) => {
          return (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.checked}
                disabled={todo.removed}
                onChange={() => handleOnCheck(todo.id, todo.checked)}
              />
              <input
                className="text"
                type="text"
                value={todo.value}
                disabled={todo.checked || todo.removed}
                onChange={(e) => handleOnEdit(todo.id, e.target.value)}
              />
              <button
                className="button"
                onClick={() => handleOnRemove(todo.id, todo.removed)}
              >
                {todo.removed ? "復元" : "削除"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default App;
