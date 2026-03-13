import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Todos(){
  const [items, setItems] = useState([])
  const [text, setText] = useState('')

  useEffect(()=>{
    axios.get('/todos').then(r=>setItems(r.data)).catch(()=>setItems([]))
  },[])

  async function add(){
    if(!text.trim()) return
    const r = await axios.post('/todos', { text: text.trim() })
    setItems(s => [r.data, ...s])
    setText('')
  }

  async function toggle(id){
    const it = items.find(x=>x.id===id)
    if(!it) return
    const r = await axios.patch(`/todos/${id}`, { done: !it.done })
    setItems(s => s.map(x => x.id===id ? r.data : x))
  }

  async function remove(id){
    await axios.delete(`/todos/${id}`)
    setItems(s => s.filter(it => it.id !== id))
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Local TODOs</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded p-2"
          placeholder="Add a todo"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={add}>Add</button>
      </div>

      <ul className="space-y-2">
        {items.map(it => (
          <li key={it.id} className="flex items-center justify-between bg-white p-3 shadow rounded">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={it.done} onChange={() => toggle(it.id)} />
              <span className={"select-none " + (it.done ? 'line-through text-gray-400' : '')}>{it.text}</span>
            </div>
            <div>
              <button className="text-red-500" onClick={() => remove(it.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
