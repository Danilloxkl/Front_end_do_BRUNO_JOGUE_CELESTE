import { useEffect, useState } from "react"
import {
  getAllHabitsAdmin,
  createHabitAdmin,
  updateHabitAdmin,
  deleteHabitAdmin
} from "../api/adminApi"

export default function Admin() {
  const [habits, setHabits] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [editingId, setEditingId] = useState(null)

  const loadHabits = async () => {
    const data = await getAllHabitsAdmin()
    setHabits(data)
  }

  useEffect(() => {
    loadHabits()
  }, [])

  const handleSubmit = async () => {
    if (editingId) {
      await updateHabitAdmin(editingId, { title, description })
      setEditingId(null)
    } else {
      await createHabitAdmin({ title, description })
    }

    setTitle("")
    setDescription("")
    loadHabits()
  }

  const handleEdit = (habit) => {
    setTitle(habit.title)
    setDescription(habit.description)
    setEditingId(habit._id)
  }

  const handleDelete = async (id) => {
    await deleteHabitAdmin(id)
    loadHabits()
  }

  return (
    <div className="container">
      <h1>Painel Admin</h1>

      <div>
        <input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {editingId ? "Atualizar" : "Criar"}
        </button>
      </div>

      <div>
        {habits.map((habit) => (
          <div key={habit._id}>
            <h3>{habit.title}</h3>
            <p>{habit.description}</p>

            <button onClick={() => handleEdit(habit)}>
              Editar
            </button>

            <button onClick={() => handleDelete(habit._id)}>
              Deletar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}