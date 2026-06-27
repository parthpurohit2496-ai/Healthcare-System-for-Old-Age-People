import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Users, UserCheck, AlertTriangle, FileClock, CalendarClock, ShieldAlert, Check, X } from 'lucide-react';

const AdminDashboard = () => {
  const { 
    patients, helpers, sosAlerts, auditLogs, leaves, updateLeaveStatus, resolveSos 
  } = useContext(AppContext);

  // Stats calculation
  const totalHelpers = helpers.length;
  const pendingHelpers = helpers.filter(h => h.status === 'Pending').length;
  const totalPatients = patients.length;
  const unfitPatients = patients.filter(p => p.fitStatus === 'Unfit').length;
  const activeSos = sosAlerts.filter(s => s.active);
  const pendingLeaves = leaves.filter(l => l.status === 'Pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Admin Overview</h2>
          <p className="text-slate-500 text-sm font-semibold">Central Monitoring & Operations Dashboard</p>
        </div>
        <div className="text-xs px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
          Live Sync Active
        </div>
      </div>

      {/* SOS Alerts Panel */}
      {activeSos.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm animate-pulse-sos">
          <div className="flex items-center gap-2 text-red-700 font-extrabold text-lg mb-4">
            <AlertTriangle className="animate-bounce" />
            <h3>CRITICAL ALERTS ({activeSos.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSos.map(sos => (
              <div key={sos.id} className="bg-white p-4 rounded-lg border border-red-150 shadow-md flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Patient: {sos.patientName} (ID: {sos.patientId})</h4>
                  <p className="text-xs text-red-600 mt-1 font-semibold">Message: {sos.details}</p>
                  <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Triggered: {sos.time}</p>
                </div>
                <button 
                  onClick={() => resolveSos(sos.id)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Check size={14} />
                  <span>Resolve</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Patients</span>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{totalPatients}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Elders registered</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Helpers</span>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{totalHelpers}</h3>
            <p className="text-[10px] text-orange-600 font-bold mt-1">({pendingHelpers} pending approvals)</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Unfit Patients</span>
            <h3 className="text-3xl font-extrabold text-red-600 mt-1">{unfitPatients}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Critical vitals alert</p>
          </div>
          <div className="p-3 rounded-xl bg-red-50 text-red-600">
            <ShieldAlert size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Pending Leaves</span>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{pendingLeaves.length}</h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">Awaiting review</p>
          </div>
          <div className="p-3 rounded-xl bg-yellow-50 text-yellow-600">
            <CalendarClock size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Helper Leave Requests */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <CalendarClock className="text-yellow-600" size={18} />
              <span>Leave & Availability Requests</span>
            </h3>
            {pendingLeaves.length === 0 ? (
              <p className="text-sm text-slate-400 py-8 text-center font-medium">No pending leave requests.</p>
            ) : (
              <div className="divide-y divide-slate-100 mt-2 max-h-[300px] overflow-y-auto pr-1">
                {pendingLeaves.map(leave => (
                  <div key={leave.id} className="py-3.5 flex items-center justify-between text-slate-800">
                    <div>
                      <h4 className="font-semibold text-sm">{leave.helperName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">Date: {leave.date} ({leave.duration})</p>
                      <p className="text-xs text-slate-600 italic mt-1 bg-slate-50 px-2 py-1 rounded">Reason: {leave.reason}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateLeaveStatus(leave.id, 'Approved')}
                        className="p-1 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={() => updateLeaveStatus(leave.id, 'Rejected')}
                        className="p-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Audit Log Log Feed */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileClock className="text-indigo-600" size={18} />
              <span>Recent Activity Feed</span>
            </h3>
            <div className="divide-y divide-slate-150 mt-2 max-h-[300px] overflow-y-auto pr-1">
              {auditLogs.slice(0, 10).map(log => (
                <div key={log.id} className="py-2.5 flex items-start justify-between text-slate-800">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-700">{log.message}</p>
                    <span className="text-[9px] text-slate-400 font-semibold">{log.date}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold uppercase select-none">
                    {log.actor}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
