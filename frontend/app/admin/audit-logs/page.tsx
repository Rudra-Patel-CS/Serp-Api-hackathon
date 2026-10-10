'use client'

import React, { useState, useEffect } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import { getAuditLogsApi } from '@/services/api/krishi-api'
import { FileCode, Loader2 } from 'lucide-react'

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await getAuditLogsApi()
        if (res.success && res.data) setLogs(res.data)
      } catch (err) {
        console.error('Error fetching audit logs', err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  return (
    <AdminShell>
      <div className="space-y-6">
        <div className="bg-stone-800/90 border border-stone-700 p-6 rounded-2xl">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileCode className="w-6 h-6 text-amber-400" />
            Security & System Audit Log Trail
          </h1>
          <p className="text-stone-400 text-xs mt-1">Immutable audit records of administrative, authentication, and transaction events.</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-stone-500 text-sm">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading audit logs from database...
          </div>
        ) : (
          <div className="bg-stone-800/90 rounded-2xl border border-stone-700 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300 font-mono">
                <thead className="bg-stone-950 text-stone-400 font-bold uppercase border-b border-stone-700">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Action Code</th>
                    <th className="p-3.5">Entity Type</th>
                    <th className="p-3.5">Target Entity ID</th>
                    <th className="p-3.5">Trigger User</th>
                    <th className="p-3.5">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-700/60">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-750">
                      <td className="p-3.5 text-stone-400">{new Date(log.createdAt).toLocaleString('en-GB')}</td>
                      <td className="p-3.5 font-bold text-rose-400">{log.action}</td>
                      <td className="p-3.5 text-stone-200">{log.entityType}</td>
                      <td className="p-3.5 text-stone-400">{log.entityId || 'N/A'}</td>
                      <td className="p-3.5 text-amber-300 font-bold">{log.user?.email || 'System'}</td>
                      <td className="p-3.5 text-stone-400">{log.ipAddress || '127.0.0.1'}</td>
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
