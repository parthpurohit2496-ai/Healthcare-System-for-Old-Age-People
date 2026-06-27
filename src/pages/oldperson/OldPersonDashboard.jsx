import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { 
  Heart, AlertTriangle, Link2, MessageSquare, Plus, Send, Bell, Pill, Utensils, FileText 
} from 'lucide-react';

const OldPersonDashboard = () => {
  const { 
    activeUser, patients, vitals, medicines, chats, sendMessage, 
    triggerSos, addFeedback, updateFoodLog, announcements, helpers, sosAlerts 
  } = useContext(AppContext);

  // States
  const [familyLinked, setFamilyLinked] = useState(false);
  const [familyEmail, setFamilyEmail] = useState('');
  const [chatText, setChatText] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Food inputs
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [dinner, setDinner] = useState('');
  const [foodMsg, setFoodMsg] = useState('');

  if (!activeUser) return null;

  // Find this patient
  const patient = patients.find(p => p.id === activeUser.id);
  if (!patient) return <div className="text-center py-8">Patient not found in registry.</div>;

  // Find assigned helper
  const assignedHelper = helpers.find(h => h.id === patient.helperId);

  // Vitals for this patient
  const patientVitals = vitals.filter(v => v.patientId === patient.id);
  const lastVitals = patientVitals[patientVitals.length - 1];

  // Medicines
  const patientMeds = medicines.filter(m => m.patientId === patient.id);

  // Chat filter
  const patientChats = chats.filter(c => c.sender === patient.id || c.receiver === patient.id);

  // SOS status
  const activeSos = sosAlerts.find(s => s.patientId === patient.id && s.active);

  const handleSosTrigger = () => {
    triggerSos(patient.id, "EMERGENCY: Elder triggered manually from dashboard.");
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    // Send message to assigned helper (or broadcast to family if no helper)
    const receiverId = patient.helperId || 'Family';
    sendMessage(chatText, receiverId);
    setChatText('');
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    addFeedback(patient.id, feedbackText);
    setFeedbackText('');
    setFeedbackMsg('Feedback submitted to Admin dashboard.');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleFoodSubmit = (e) => {
    e.preventDefault();
    updateFoodLog(patient.id, breakfast, lunch, dinner);
    setFoodMsg('Food log updated successfully!');
    setTimeout(() => setFoodMsg(''), 3000);
  };

  // Get current today food log
  const todayStr = new Date().toISOString().split('T')[0];
  const todayFood = patient.foodLogs?.find(f => f.date === todayStr);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Panel + SOS Emergency Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold uppercase tracking-wider">
            Patient Portal
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">Hello, {patient.name}</h2>
          <p className="text-slate-500 text-sm font-semibold">Track your health records and contact care helpers.</p>
        </div>

        {/* SOS Alert Button */}
        <div>
          {activeSos ? (
            <div className="px-6 py-3 bg-red-100 border border-red-200 rounded-xl text-center animate-pulse-sos">
              <span className="font-extrabold text-red-700 text-sm flex items-center gap-1.5 justify-center">
                <AlertTriangle />
                SOS TRANSMITTING...
              </span>
              <p className="text-[10px] text-red-650 font-bold mt-1">Medical assistance has been notified.</p>
            </div>
          ) : (
            <button 
              onClick={handleSosTrigger}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all active:scale-[0.97]"
            >
              <AlertTriangle size={18} />
              <span>EMERGENCY SOS</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Health vitals chart */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Vitals History Line Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Heart className="text-red-500" size={18} />
                <span>My Vitals History</span>
              </h3>
              {patientVitals.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-12 font-medium">No vitals logged yet by care helper.</p>
              ) : (
                <div className="h-64 mt-4 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={patientVitals} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <Tooltip />
                      <Legend verticalAlign="top" height={36} fontSize={10} />
                      <Line type="monotone" dataKey="bpSystolic" name="Systolic (BP)" stroke="#a855f7" strokeWidth={2.5} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="bpDiastolic" name="Diastolic (BP)" stroke="#c084fc" strokeWidth={2} />
                      <Line type="monotone" dataKey="sugar" name="Sugar" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="pulse" name="Pulse Rate" stroke="#f43f5e" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Current Vitals Readings */}
            {lastVitals && (
              <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-100 text-center">
                <div className="bg-purple-50/50 p-2.5 rounded-lg border border-purple-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Blood Pressure</p>
                  <h4 className="text-base font-extrabold text-purple-750 mt-1">{lastVitals.bpSystolic}/{lastVitals.bpDiastolic}</h4>
                  <span className="text-[8px] text-slate-400 font-bold">mmHg</span>
                </div>
                <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Sugar Level</p>
                  <h4 className="text-base font-extrabold text-emerald-700 mt-1">{lastVitals.sugar}</h4>
                  <span className="text-[8px] text-slate-400 font-bold">mg/dL</span>
                </div>
                <div className="bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Heart Pulse</p>
                  <h4 className="text-base font-extrabold text-rose-700 mt-1">{lastVitals.pulse}</h4>
                  <span className="text-[8px] text-slate-400 font-bold">bpm</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Care Status</p>
                  <h4 className={`text-xs font-black mt-2 uppercase ${patient.fitStatus === 'Fit' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {patient.fitStatus}
                  </h4>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Link Family Member Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Link2 className="text-purple-600" size={18} />
                  <span>Link Family Member</span>
                </h3>
                
                {familyLinked ? (
                  <div className="mt-4 p-3 bg-emerald-50 text-emerald-750 text-xs font-semibold rounded border border-emerald-100 text-center">
                    Linked: <strong className="text-emerald-900">{familyEmail}</strong> (View-Only Mode)
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                      Grant view-only health records access to family members by entering their email address.
                    </p>
                    <input 
                      type="email" 
                      value={familyEmail}
                      onChange={(e) => setFamilyEmail(e.target.value)}
                      placeholder="family@member.com"
                      className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-350 focus:outline-none focus:border-purple-500 text-xs font-semibold text-slate-700"
                    />
                    <button 
                      onClick={() => familyEmail && setFamilyLinked(true)}
                      className="w-full py-1.5 bg-purple-650 hover:bg-purple-550 text-white font-bold text-xs rounded transition-colors"
                    >
                      Authorize Access
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Announcements Panel */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Bell className="text-purple-650" size={18} />
                  <span>Announcements</span>
                </h3>
                <div className="mt-3 space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {announcements.map(ann => (
                    <div key={ann.id} className="p-2.5 rounded bg-slate-50 border border-slate-100 text-xs text-slate-800">
                      <p className="font-semibold text-slate-900">{ann.text}</p>
                      <span className="text-[9px] text-slate-400 font-bold block mt-1">{ann.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Diagnostic Reports and Food Log */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Reports Uploaded by Admin */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <FileText className="text-purple-600" size={18} />
                  <span>Medical Reports ({patient.reports?.length || 0})</span>
                </h3>
                {(patient.reports?.length || 0) === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center font-medium">No reports uploaded by administrator.</p>
                ) : (
                  <div className="mt-3 space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {patient.reports.map(rep => (
                      <div key={rep.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-850">
                        <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                          <span>{rep.type}</span>
                          <span>{rep.date}</span>
                        </div>
                        <h5 className="font-bold text-slate-900 mt-1">{rep.summary}</h5>
                        {rep.details && <p className="text-[10px] text-slate-500 italic mt-1 font-medium">{rep.details}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Food Log update */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Utensils className="text-purple-650" size={18} />
                  <span>My Food logs</span>
                </h3>
                {foodMsg && (
                  <div className="mt-2 p-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded text-center">
                    {foodMsg}
                  </div>
                )}
                
                <form onSubmit={handleFoodSubmit} className="mt-3 flex flex-col gap-2">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Breakfast</label>
                    <input 
                      type="text" 
                      value={breakfast}
                      onChange={(e) => setBreakfast(e.target.value)}
                      placeholder={todayFood?.breakfast || "e.g. Poha / Oats"}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-300 focus:outline-none focus:border-purple-500 text-xs font-semibold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Lunch</label>
                    <input 
                      type="text" 
                      value={lunch}
                      onChange={(e) => setLunch(e.target.value)}
                      placeholder={todayFood?.lunch || "e.g. Rice, Dal & Salad"}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-300 focus:outline-none focus:border-purple-500 text-xs font-semibold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Dinner</label>
                    <input 
                      type="text" 
                      value={dinner}
                      onChange={(e) => setDinner(e.target.value)}
                      placeholder={todayFood?.dinner || "e.g. Soup / Light Salad"}
                      className="w-full px-2.5 py-1.5 rounded bg-slate-50 border border-slate-300 focus:outline-none focus:border-purple-500 text-xs font-semibold text-slate-700"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-1.5 bg-purple-650 hover:bg-purple-550 text-white font-bold text-xs rounded transition-colors mt-1"
                  >
                    Update Today's Meals
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Chat with Helper/Family & Feedback */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Active Medicines Checklist */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Pill size={16} />
              <span>Active Medicines</span>
            </h3>
            {patientMeds.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center font-medium">No medicine schedule configured.</p>
            ) : (
              <div className="mt-3 space-y-2.5">
                {patientMeds.map(med => (
                  <div key={med.id} className="p-2.5 rounded bg-slate-50 border border-slate-100 text-xs text-slate-850 flex flex-col gap-0.5">
                    <h4 className="font-bold text-slate-900">{med.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold">Company: {med.company}</p>
                    <p className="text-[10px] text-purple-750 font-black mt-1">Schedule: {med.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Panel with Helper */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-[350px]">
            <div>
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <MessageSquare className="text-purple-600" size={18} />
                <span>Chat with Care Provider</span>
              </h3>
              
              <div className="mt-3 space-y-2 h-[200px] overflow-y-auto pr-1 text-xs">
                {patientChats.length === 0 ? (
                  <p className="text-slate-400 py-12 text-center font-medium">No messages yet. Send a query below.</p>
                ) : (
                  patientChats.map((chat, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2.5 rounded-lg max-w-[85%] ${
                        chat.sender === patient.id 
                          ? 'bg-purple-50 text-purple-800 ml-auto border border-purple-100' 
                          : 'bg-slate-50 text-slate-800 border border-slate-100'
                      }`}
                    >
                      <span className="text-[8px] font-bold text-slate-400 block mb-0.5">{chat.senderName}</span>
                      <p className="font-semibold leading-relaxed">{chat.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <form onSubmit={handleSendChat} className="border-t border-slate-100 pt-3 mt-4 flex gap-1.5">
              <input 
                type="text" 
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                placeholder={assignedHelper ? `Msg Helper ${assignedHelper.name}...` : "Send message..."}
                className="flex-1 px-2.5 py-1.5 rounded bg-slate-50 border border-slate-350 focus:outline-none focus:border-purple-500 text-xs font-semibold text-slate-700"
              />
              <button 
                type="submit" 
                className="p-2 bg-purple-650 hover:bg-purple-550 text-white rounded transition-colors shadow"
              >
                <Send size={12} />
              </button>
            </form>
          </div>

          {/* Feedback Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
              <MessageSquare className="text-purple-650" size={18} />
              <span>Feedback / Complaint</span>
            </h3>

            {feedbackMsg && (
              <div className="mt-2.5 p-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded text-center">
                {feedbackMsg}
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit} className="mt-4 flex flex-col gap-3">
              <textarea 
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Write feedback/complaints for administrators..."
                className="w-full px-3 py-2 rounded bg-slate-50 border border-slate-350 focus:border-purple-500 focus:outline-none text-slate-700 text-xs font-semibold min-h-[80px]"
                required
              />
              <button 
                type="submit"
                className="w-full py-1.5 bg-purple-650 hover:bg-purple-550 text-white font-bold text-xs rounded transition-colors shadow"
              >
                Submit Feedback
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OldPersonDashboard;
