'use client'

import React, { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import { getAdminUsersApi, updateUserStatusApi } from '@/services/api/krishi-api'
import { toast } from 'sonner'
import { Users, Search, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadUsers = async () => {
    try {
      const res = await getAdminUsersApi(search, roleFilter)
      if (res.success && res.data) {
        setUsers(res.data)
      }
    } catch (err) {
      console.error('Error fetching users', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [search, roleFilter])

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    try {
      const res = await updateUserStatusApi(userId, newStatus)
      if (res.success) {
        toast.success(`User status updated to ${newStatus}`)
        loadUsers()
      } else {
        toast.error(res.error?.message || 'Failed to update user status')
      }
    } catch (err) {
      toast.error('Error updating user status')
    }
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="bg-stone-800/90 border border-stone-700 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-400" />
              Platform User Directory & RBAC Security
            </h1>
            <p className="text-stone-400 text-xs mt-1">
              View all registered users across platform roles. Activate or suspend user access. Passwords remain hashed and hidden.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, or phone..."
                className="w-full pl-9 pr-4 py-2 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="">All Roles</option>
              <option value="FARMER">Farmers</option>
              <option value="FPO_MANAGER">FPO Managers</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading user registry...
          </div>
        ) : (
          <div className="bg-stone-800/90 rounded-2xl border border-stone-700 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 text-stone-400 font-mono font-bold uppercase border-b border-stone-700">
                  <tr>
                    <th className="p-3.5">User Name</th>
                    <th className="p-3.5">Contact Email / Phone</th>
                    <th className="p-3.5">Assigned Role</th>
                    <th className="p-3.5">Account Status</th>
                    <th className="p-3.5">Registration Date</th>
                    <th className="p-3.5 text-right">RBAC Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-700/60 font-medium">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-stone-750">
                      <td className="p-3.5 font-bold text-white">{u.name}</td>
                      <td className="p-3.5 text-stone-400">{u.email} • {u.phone}</td>
                      <td className="p-3.5">
                        <span className="font-mono text-[11px] font-bold bg-stone-900 border border-stone-700 px-2 py-0.5 rounded text-amber-400">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase ${
                            u.status === 'ACTIVE' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' : 'bg-rose-900/60 text-rose-300 border border-rose-700'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-stone-400">{new Date(u.createdAt).toLocaleDateString('en-GB')}</td>
                      <td className="p-3.5 text-right">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleToggleStatus(u.id, u.status)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                              u.status === 'ACTIVE'
                                ? 'bg-rose-900/50 hover:bg-rose-900 text-rose-200 border border-rose-700'
                                : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            {u.status === 'ACTIVE' ? 'Suspend User' : 'Activate User'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  )
}
