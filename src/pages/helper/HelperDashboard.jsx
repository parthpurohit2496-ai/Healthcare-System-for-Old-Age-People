import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  CheckSquare, Activity, ClipboardCheck, Pill, LogIn, LogOut, Plus, AlertCircle 
} from 'lucide-react';

const HelperDashboard = () => {
  const { 
    activeUser, patients, medicines, tasks, toggleTask, addCustomTask, 
    checkInHelper, checkOutHelper, attendance, logVitals 
  } = useContext(AppContext);

  // Vitals State
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [sugar, setSugar] = useState('');
  const [pulse, setPulse] = useState('');
  const [vitalsMsg, setVitalsMsg] = useState('');

  // Task State
  const [customTask, setCustomTask] = useState('');
  const [taskTime, setTaskTime] = useState('09:00 AM');

  if (!activeUser) return null;

  // Find assigned patient
  const assignedPatient = patients.find(p => p.helperId === activeUser.id);
  const patientMedicines = assignedPatient ? medicines.filter(m => m.patientId === assignedPatient.id) : [];
  const patientTasks = assignedPatient ? tasks.filter(t => t.patientId === assignedPatient.id) : [];

  // Attendance check
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.find(a => a.helperId === activeUser.id && a.date === todayStr);
  const isCheckedIn = !!todayAttendance;
  const isCheckedOut = todayAttendance && !!todayAttendance.checkOut;

  const handleVitalsSave = (e) => {
    e.preventDefault();
    if (!systolic || !diastolic || !sugar || !pulse) return;

    logVitals(assignedPatient.id, systolic, diastolic, sugar, pulse);
    setVitalsMsg('Vitals saved and logged successfully!');
    setSystolic('');
    setDiastolic('');
    setSugar('');
    setPulse('');
    setTimeout(() => setVitalsMsg(''), 3000);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!customTask.trim()) return;

    addCustomTask(assignedPatient.id, activeUser.id, customTask, taskTime);
    setCustomTask('');
    setTaskTime('09:00 AM');
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Check-In panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Helper Dashboard</h2>
          <p className="text-slate-500 text-sm font-semibold">Welcome, {activeUser.name} | Log your shift activities below.</p>
        </div>

        {/* Check In / Out Buttons */}
        <div className="flex items-center gap-3">
          {isCheckedOut ? (
            <span className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-550 font-bold border border-slate-200">
              Shift Ended ({todayAttendance.checkOut})
            </span>
          ) : isCheckedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 mr-2">
                Shift Active ({todayAttendance.checkIn})
              </span>
              <button 
                onClick={() => checkOutHelper(activeUser.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-650 hover:bg-red-550 text-white text-xs font-bold rounded shadow transition-all"
              >
                <LogOut size={14} />
                <span>Check Out</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => checkInHelper(activeUser.id)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded shadow transition-all"
            >
              <LogIn size={14} />
              <span>Check In Shift</span>
            </button>
          )}
        </div>
      </div>

      {!assignedPatient ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center text-slate-800">
          <AlertCircle size={36} className="text-amber-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Patient Assigned</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-1.5 leading-relaxed font-semibold">
            You currently do not have any Elder Patient assigned to your care schedule. Please ask the Administrator to link a patient to your account.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Patient details & Vitals logging */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Patient Info Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Assigned Elder</h3>
              <div className="mt-3">
                <h4 className="font-extrabold text-lg text-slate-900">{assignedPatient.name}</h4>
                <div className="grid grid-cols-2 gap-3 mt-3 text-xs font-medium text-slate-600">
                  <p>Age: <strong className="text-slate-800">{assignedPatient.age} yrs</strong></p>
                  <p>Blood Group: <strong className="text-slate-800">{assignedPatient.bloodGroup}</strong></p>
                </div>
                <div className="mt-3 text-xs">
                  <p className="text-slate-400 font-bold">Diagnosed Conditions:</p>
                  <p className="text-slate-700 bg-slate-50 border border-slate-100 p-2.5 rounded-lg mt-1 font-semibold">
                    {assignedPatient.disease || 'None registered'}
                  </p>
                </div>
              </div>
            </div>

            {/* Vitals Logger Form */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Activity className="text-emerald-600" size={18} />
                <span>Log Patient Vitals</span>
              </h3>

              {vitalsMsg && (
                <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-100 rounded text-center text-xs font-semibold text-emerald-750">
                  {vitalsMsg}
                </div>
              )}

              <form onSubmit={handleVitalsSave} className="mt-4 flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">BP Systolic</label>
                    <input 
                      type="number" 
                      value={systolic}
                      onChange={(e) => setSystolic(e.target.value)}
                      placeholder="e.g. 120"
                      className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:outline-none text-slate-700 text-xs font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">BP Diastolic</label>
                    <input 
                      type="number" 
                      value={diastolic}
                      onChange={(e) => setDiastolic(e.target.value)}
                      placeholder="e.g. 80"
                      className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:outline-none text-slate-700 text-xs font-semibold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sugar (mg/dL)</label>
                    <input 
                      type="number" 
                      value={sugar}
                      onChange={(e) => setSugar(e.target.value)}
                      placeholder="e.g. 110"
                      className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:outline-none text-slate-700 text-xs font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pulse (bpm)</label>
                    <input 
                      type="number" 
                      value={pulse}
                      onChange={(e) => setPulse(e.target.value)}
                      placeholder="e.g. 72"
                      className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:outline-none text-slate-700 text-xs font-semibold"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={!isCheckedIn || isCheckedOut}
                  className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!isCheckedIn ? 'Check-in to Save Vitals' : 'Save Health Vitals'}
                </button>
              </form>
            </div>

          </div>

          {/* Middle Column: Daily Task Checklist */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between min-h-[400px]">
              <div>
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <CheckSquare className="text-emerald-600" size={18} />
                  <span>Shift Duty Checklist</span>
                </h3>

                {patientTasks.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center font-medium">No tasks scheduled for today.</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {patientTasks.map(task => (
                      <div key={task.id} className="flex items-start gap-2.5 p-2 rounded hover:bg-slate-50 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={task.completed}
                          disabled={!isCheckedIn || isCheckedOut}
                          onChange={() => toggleTask(task.id)}
                          className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="leading-tight">
                          <p className={`text-xs font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-850'}`}>
                            {task.task}
                          </p>
                          <span className="text-[9px] text-slate-400 font-bold">{task.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Custom Task Form */}
              <form onSubmit={handleAddTask} className="border-t border-slate-100 pt-4 mt-6 flex flex-col gap-3">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={customTask}
                    onChange={(e) => setCustomTask(e.target.value)}
                    placeholder="Add custom shift task..."
                    disabled={!isCheckedIn || isCheckedOut}
                    className="flex-1 px-2.5 py-1.5 rounded bg-slate-50 border border-slate-300 focus:outline-none focus:border-emerald-500 text-xs font-semibold text-slate-700 disabled:opacity-50"
                  />
                  <input 
                    type="text" 
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    placeholder="e.g. 09:00 AM"
                    disabled={!isCheckedIn || isCheckedOut}
                    className="w-20 px-2 py-1.5 rounded bg-slate-50 border border-slate-300 focus:outline-none focus:border-emerald-500 text-[10px] font-bold text-center text-slate-700 disabled:opacity-50"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={!isCheckedIn || isCheckedOut}
                  className="w-full py-1.5 bg-emerald-55 hover:bg-emerald-600 text-white font-bold text-xs rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                >
                  <Plus size={12} />
                  <span>Add Shift Task</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Medicine Reminder Guide */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Pill className="text-emerald-600" size={18} />
                <span>Medicine (Dava) Schedule</span>
              </h3>

              {patientMedicines.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center font-medium">No medicine schedule configured.</p>
              ) : (
                <div className="mt-3 space-y-3">
                  {patientMedicines.map(med => (
                    <div key={med.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col gap-1">
                      <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 w-fit">
                        {med.company}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 mt-1">{med.name}</h4>
                      <p className="text-[10px] text-slate-600 mt-0.5 font-bold">Time: {med.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default HelperDashboard;
