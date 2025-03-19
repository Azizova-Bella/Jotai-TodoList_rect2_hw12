import { atom, useAtom } from 'jotai'

interface ITodo {
  id: string | number
  title: string
  description: string
  completed: boolean
}

const todosAtom = atom<ITodo[]>([
  { id: 1, title: 'Title 1', description: 'Description 1', completed: false },
  { id: 2, title: 'Title 2', description: 'Description 2', completed: false },
])

const titleAtom = atom('')
const descriptionAtom = atom('')
const editTodoIdAtom = atom<number | null>(null)

export default function TodoApp() {
  const [todos, setTodos] = useAtom(todosAtom)
  const [title, setTitle] = useAtom(titleAtom)
  const [description, setDescription] = useAtom(descriptionAtom)
  const [editTodoId, setEditTodoId] = useAtom(editTodoIdAtom)

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return

    if (editTodoId !== null) {
      setTodos(
        todos.map(todo =>
          todo.id === editTodoId ? { ...todo, title, description } : todo
        )
      )
      setEditTodoId(null)
    } else {
      const newTodo: ITodo = {
        id: Date.now(),
        title,
        description,
        completed: false,
      }
      setTodos([...todos, newTodo])
    }

    setTitle('')
    setDescription('')
  }

  const openEdit = (todo: ITodo) => {
    setEditTodoId(todo.id as number)
    setTitle(todo.title)
    setDescription(todo.description)
  }

  const toggleComplete = (id: string | number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: string | number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
   <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
  Jotai Todo List
</h1>


      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Todo Title"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Todo Description"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white transition shadow-md hover:shadow-xl
            ${editTodoId !== null
              ? 'bg-gradient-to-r from-green-400 to-green-600'
              : 'bg-gradient-to-r from-blue-500 to-yellow-400'}
          `}
        >
          {editTodoId !== null ? 'Update Todo' : 'Add Todo'}
        </button>
      </div>

      <div className="space-y-5">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:shadow-2xl transition duration-300"
          >
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">{todo.title}</h2>
              <p className="text-gray-500 mt-1">{todo.description}</p>
              <div className="mt-2">
                <span
                  className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${
                    todo.completed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {todo.completed ? 'Completed' : 'Not Completed'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  className="accent-blue-500 h-5 w-5"
                />
                <span>Done</span>
              </label>

              <button
                onClick={() => openEdit(todo)}
                className="px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-blue-400 to-blue-600 hover:shadow-lg transition"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-yellow-400 to-yellow-600 hover:shadow-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
