import React, { useState, useEffect } from 'react';
import { Users, UserPlus, ShieldCheck, Mail, Phone, Building } from 'lucide-react';
import { User, UserRole } from '../../types';
import { api } from '../../services/api';

export const UserManagementView: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'INSPECTION_OFFICER' as UserRole,
    designation: '',
    department: 'DoSJE',
    state: 'Delhi',
    district: 'New Delhi',
  });

  const fetchUsers = () => {
    api.getUsers().then((u) => setUsers(u));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    await api.updateUserRole(userId, newRole);
    fetchUsers();
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    await api.createUser(formData);
    setShowAddModal(false);
    fetchUsers();
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'INSPECTION_OFFICER',
      designation: '',
      department: 'DoSJE',
      state: 'Delhi',
      district: 'New Delhi',
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h1 className="text-base font-bold text-slate-900">
              Role-Based Access Control (RBAC) &amp; Users
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage authenticated officials, state authorities, and field inspection officers.
          </p>
        </div>

        {currentUser.role === 'SUPER_ADMIN' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Provision New Officer</span>
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[620px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Official Name</th>
                <th className="py-2.5 px-3">Designation &amp; Dept</th>
                <th className="py-2.5 px-3">Contact</th>
                <th className="py-2.5 px-3">Jurisdiction</th>
                <th className="py-2.5 px-3">Assigned Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{u.id}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-medium text-slate-800">{u.designation}</div>
                    <div className="text-[10px] text-slate-500">{u.department}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                    <div>{u.email}</div>
                    <div className="text-slate-400">{u.phone}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-slate-700">
                      {u.district ? `${u.district}, ${u.state}` : u.state || 'National (All)'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {currentUser.role === 'SUPER_ADMIN' ? (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="px-2 py-1 text-xs rounded border border-slate-300 bg-white font-semibold"
                      >
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        <option value="DEPARTMENT_OFFICIAL">DEPARTMENT_OFFICIAL</option>
                        <option value="INSPECTION_OFFICER">INSPECTION_OFFICER</option>
                        <option value="STATE_DISTRICT_AUTHORITY">STATE_DISTRICT_AUTHORITY</option>
                        <option value="NGO_INSTITUTE">NGO_INSTITUTE</option>
                      </select>
                    ) : (
                      <span className="font-semibold text-slate-800">{u.role}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Provision Official Account</h2>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Officer Name"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="officer@nic.in"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="INSPECTION_OFFICER">INSPECTION_OFFICER</option>
                    <option value="DEPARTMENT_OFFICIAL">DEPARTMENT_OFFICIAL</option>
                    <option value="STATE_DISTRICT_AUTHORITY">STATE_DISTRICT_AUTHORITY</option>
                    <option value="NGO_INSTITUTE">NGO_INSTITUTE</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. District Inspection Officer"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
