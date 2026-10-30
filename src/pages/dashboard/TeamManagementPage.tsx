import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getTeamMembers, addTeamMember, removeTeamMember } from '@/services/dataService'
import { TeamMember, MemberRole } from '@/types'
import {
  Users,
  UserPlus,
  ShieldCheck,
  Shield,
  User,
  Trash2,
  Mail,
  X,
  CheckCircle2
} from 'lucide-react'

export const TeamManagementPage: React.FC = () => {
  const { currentBusiness } = useAuth()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  // Invite modal
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<MemberRole>('staff')

  useEffect(() => {
    loadTeam()
  }, [currentBusiness])

  async function loadTeam() {
    if (!currentBusiness) return
    setLoading(true)
    try {
      const data = await getTeamMembers(currentBusiness.id)
      setMembers(data)
    } catch (err) {
      console.error('Error loading team:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentBusiness || !email.trim() || !name.trim()) return

    await addTeamMember({
      business_id: currentBusiness.id,
      invited_email: email,
      full_name: name,
      role
    })

    setModalOpen(false)
    setName('')
    setEmail('')
    setRole('staff')
    await loadTeam()
  }

  const handleRemove = async (id: string) => {
    if (confirm('Revoke access for this team member?')) {
      await removeTeamMember(id)
      await loadTeam()
    }
  }

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#071321] tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#087BEE]" /> Team Access & Staff Roles
          </h2>
          <p className="text-xs text-slate-500">
            Grant dashboard permissions to managers, baristas, or supervisors without sharing your owner login.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#087BEE] to-[#13C8F4] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
        >
          <UserPlus className="w-4 h-4" /> Invite Team Member
        </button>
      </div>

      {/* Role explanation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="font-bold text-[#087BEE] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Owner
          </span>
          <p className="text-slate-500">Full control over billing, business slug, team and deletion.</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="font-bold text-purple-600 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Manager / Admin
          </span>
          <p className="text-slate-500">Can manage digital menu, QR/NFC stands, Wi-Fi and view feedback.</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="font-bold text-emerald-600 flex items-center gap-1">
            <User className="w-3.5 h-3.5" /> Staff
          </span>
          <p className="text-slate-500">Can toggle dish stock status and view incoming table orders.</p>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {members.map((member) => (
            <div
              key={member.id}
              className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={
                    member.avatar_url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={member.full_name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {member.full_name}
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        member.role === 'owner'
                          ? 'bg-blue-100 text-blue-800'
                          : member.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {member.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    {member.invited_email}
                  </p>
                </div>
              </div>

              {member.role !== 'owner' && (
                <button
                  onClick={() => handleRemove(member.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  title="Remove Member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL: INVITE TEAM MEMBER                                      */}
      {/* ============================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#071321] mb-3">Invite Team Member</h3>

            <form onSubmit={handleInvite} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mira Kapoor"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mira@business.com"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as MemberRole)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#087BEE] bg-white capitalize"
                >
                  <option value="admin">Manager / Admin</option>
                  <option value="staff">Staff / Server</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#087BEE] text-white font-bold shadow hover:bg-blue-600"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

