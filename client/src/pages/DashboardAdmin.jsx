import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import { MESS_OPTIONS } from '../lib/constants.js'

export default function DashboardAdmin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/admin/users')
      setUsers(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const updateUser = async (id, payload) => {
    await api.patch(`/admin/users/${id}/role`, payload)
    await load()
  }

  if (loading) return <div>Loading...</div>
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-3">Users</h2>
      <div className="divide-y">
        {users.map(u => (
          <div key={u._id} className="py-2 flex items-center justify-between">
            <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-sm text-gray-600">{u.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <select className="border p-1 rounded" value={u.role} onChange={e=>updateUser(u._id, { role: e.target.value })}>
                <option value="student">student</option>
                <option value="staff">staff</option>
                <option value="admin">admin</option>
              </select>
              {u.role === 'staff' && (
                <select className="border p-1 rounded" value={u.mess || ''} onChange={e=>updateUser(u._id, { mess: e.target.value })}>
                  <option value="" disabled>Select mess</option>
                  {MESS_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}






