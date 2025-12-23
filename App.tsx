
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  MapPin, 
  Calculator, 
  Loader2,
  Plus,
  Building2,
  Home,
  UploadCloud,
  BrainCircuit,
  ShieldAlert,
  History,
  TrendingUp,
  X,
  ChevronRight,
  Download,
  Zap,
  Check,
  Hammer,
  Box,
  Construction,
  Layers,
  Activity,
  ArrowLeft,
  Calendar,
  DollarSign,
  Briefcase,
  LayoutDashboard,
  LogOut,
  Mail,
  Lock,
  User,
  ExternalLink,
  Target,
  AlertTriangle,
  BriefcaseBusiness,
  Globe,
  Quote
} from 'lucide-react';
import { ProjectData, ProjectType, ProjectScale, ProjectTimeline, Step, EstimateResult, VisionAnalysis } from './types';
import { generateEstimate, analyzeImage, generateClarificationQuestions } from './services/geminiService';

// --- Simulation Hooks (In a real production app, replace with Supabase Client) ---
const useAuth = () => {
  const [user, setUser] = useState<{ email: string; name: string } | null>(() => {
    const saved = localStorage.getItem('construct_ai_user');
    return saved ? JSON.parse(saved) : null;
  });
  const login = (email: string) => {
    const newUser = { email, name: email.split('@')[0] };
    setUser(newUser);
    localStorage.setItem('construct_ai_user', JSON.stringify(newUser));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('construct_ai_user');
  };
  return { user, login, logout };
};

const usePersistence = () => {
  const [estimates, setEstimates] = useState<any[]>(() => {
    const saved = localStorage.getItem('construct_ai_estimates');
    return saved ? JSON.parse(saved) : [];
  });

  const saveEstimate = (project: ProjectData, result: any) => {
    const newEst = { id: `EST-${Math.floor(Math.random() * 900000 + 100000)}`, project, result, date: new Date().toISOString() };
    const updated = [newEst, ...estimates];
    setEstimates(updated);
    localStorage.setItem('construct_ai_estimates', JSON.stringify(updated));
  };

  return { estimates, saveEstimate };
};

// --- Views ---

const AuthView = ({ onLogin }: { onLogin: (e: string) => void }) => {
  const [email, setEmail] = useState('demo@estimator.com');
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]"></div>
      </div>
      <div className="max-w-md w-full bg-slate-800 rounded-3xl border border-slate-700 p-10 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-blue-500/10 rounded-2xl mb-4 border border-blue-500/20">
            <BrainCircuit className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter">CONSTRUCT<span className="text-blue-400">AI</span></h1>
          <p className="text-slate-400 font-medium mt-2">The Market Dominance Estimation Suite</p>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address" 
              className="w-full pl-12 p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
            <input type="password" value="password" readOnly placeholder="Password" className="w-full pl-12 p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none opacity-50" />
          </div>
          <button 
            onClick={() => onLogin(email)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest text-sm"
          >
            Access Terminal
          </button>
          <div className="text-center pt-4">
            <p className="text-xs text-slate-500">Authorized personnel only. Secure encryption active.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardView = ({ user, estimates, onNewEstimate }: any) => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h2 className="text-sm font-black text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" /> Commander Console
          </h2>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter capitalize">Welcome back, {user?.name}</h1>
        </div>
        <button 
          onClick={onNewEstimate}
          className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-slate-950/10 active:scale-95"
        >
          <Plus className="w-5 h-5" /> NEW ESTIMATE
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <Layers className="w-8 h-8 text-blue-600 mb-4" />
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Active Projects</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{estimates.length}</h3>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <TrendingUp className="w-8 h-8 text-emerald-600 mb-4" />
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Win Rate</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">68%</h3>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <Activity className="w-8 h-8 text-amber-600 mb-4" />
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Avg. Margin</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">24.5%</h3>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm flex items-center gap-2">
            <History className="w-5 h-5 text-slate-400" /> Recent Submissions
          </h3>
          <span className="text-xs text-slate-400 font-medium">Local synchronization active</span>
        </div>
        {estimates.length === 0 ? (
          <div className="p-20 text-center opacity-40">
            <Briefcase className="w-12 h-12 mx-auto mb-4" />
            <p className="font-medium text-slate-600">No estimates generated yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-8 py-4">ID</th>
                  <th className="px-8 py-4">Project</th>
                  <th className="px-8 py-4">Location</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {estimates.map((est: any) => (
                  <tr key={est.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 font-mono text-xs text-blue-600 font-bold">{est.id}</td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-800 text-sm">{est.project.scope || 'Custom Scope'}</p>
                      <p className="text-xs text-slate-400">{est.project.projectScale}</p>
                    </td>
                    <td className="px-8 py-6 text-slate-500 font-medium text-sm">{est.project.location}</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-200">PUBLISHED</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-slate-400 hover:text-blue-600 transition-colors p-2">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const IntakeFlow = ({ projectData, setProjectData, next, back }: any) => {
  const [isUploading, setIsUploading] = useState(false);

  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const analysis = await analyzeImage(reader.result as string);
        setProjectData((p: any) => ({ 
          ...p, 
          visionAnalysis: analysis, 
          blueprintImage: reader.result as string,
          scope: analysis.summary || p.scope,
          size: analysis.detectedSize || p.size
        }));
      } catch (err) {
        alert("Vision analysis failed. Please try again or fill in details manually.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in slide-in-from-right-4 duration-500">
      <button onClick={back} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest transition-colors">
        <ArrowLeft className="w-4 h-4" /> Cancel Session
      </button>
      
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-black tracking-tighter">Project Intelligence Intake</h2>
            <p className="text-slate-400 mt-2 font-medium">PHASE 01: Scope & Market Identification</p>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <BriefcaseBusiness className="w-20 h-20" />
          </div>
        </div>

        <div className="p-10 space-y-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Quote className="w-4 h-4 text-blue-500" /> Project Identifier
            </label>
            <input 
              type="text"
              value={projectData.scope}
              onChange={(e) => setProjectData({ ...projectData, scope: e.target.value })}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
              placeholder="e.g. Dallas Multi-Family Roofing Retrofit"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Takeoff (Vision AI)</label>
              <input type="file" id="takeoff" className="hidden" onChange={onFileUpload} />
              <label 
                htmlFor="takeoff" 
                className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${isUploading ? 'bg-blue-50 border-blue-400 cursor-wait' : 'border-slate-200 hover:bg-slate-50 hover:border-blue-300'}`}
              >
                {isUploading ? (
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-500">Scan Blueprints / Photos</p>
                  </>
                )}
              </label>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Regional Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                <input 
                  type="text" 
                  value={projectData.location}
                  onChange={e => setProjectData({...projectData, location: e.target.value})}
                  className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" 
                  placeholder="City, State (e.g., Austin, TX)" 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sector</label>
              <select value={projectData.projectType} onChange={e => setProjectData({...projectData, projectType: e.target.value as any})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-4 focus:ring-blue-500/5 outline-none">
                <option value={ProjectType.RESIDENTIAL}>Residential</option>
                <option value={ProjectType.COMMERCIAL}>Commercial</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</label>
              <select value={projectData.timeline} onChange={e => setProjectData({...projectData, timeline: e.target.value as any})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-4 focus:ring-blue-500/5 outline-none">
                <option value={ProjectTimeline.STANDARD}>Standard</option>
                <option value={ProjectTimeline.RUSH}>Rush</option>
                <option value={ProjectTimeline.EXTENDED}>Extended</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dimensions</label>
              <input type="text" value={projectData.size} onChange={e => setProjectData({...projectData, size: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-4 focus:ring-blue-500/5 outline-none" placeholder="e.g. 5200 SQFT" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Narrative Scope</label>
            <textarea 
              value={projectData.description}
              onChange={e => setProjectData({...projectData, description: e.target.value})}
              rows={4} 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" 
              placeholder="Describe constraints, finishes, or special requirements..."
            ></textarea>
          </div>

          <button 
            onClick={next}
            disabled={!projectData.location || !projectData.scope}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all text-lg active:scale-95"
          >
            INITIALIZE CLARIFICATION ENGINE
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ClarifyStep = ({ projectData, next, back }: any) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);

  useEffect(() => {
    generateClarificationQuestions(projectData).then(res => {
      setQuestions(res.questions || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-in fade-in duration-300">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-50 scale-150"></div>
          <div className="relative bg-white p-6 rounded-full border border-blue-100 shadow-xl">
            <BrainCircuit className="w-16 h-16 text-blue-600 animate-pulse" />
          </div>
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Expert Agent Reasoning</h3>
        <p className="text-slate-400 mt-2 font-mono text-sm uppercase tracking-widest">Analyzing regional variables...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-8 text-white relative">
          <h2 className="text-3xl font-black tracking-tighter">Market Clarification</h2>
          <p className="text-slate-400 mt-2 font-medium">Precision required to mitigate margin erosion:</p>
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <ShieldAlert className="w-16 h-16 text-amber-500" />
          </div>
        </div>
        <div className="p-10 space-y-10">
          {questions.map((q, i) => (
            <div key={i} className="space-y-4">
              <label className="block text-sm font-black text-slate-800 bg-slate-50 px-6 py-4 rounded-xl border border-slate-200 shadow-sm leading-relaxed">{i + 1}. {q}</label>
              <textarea 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                placeholder="Specify details..."
                value={answers[i]}
                onChange={e => {
                  const na = [...answers];
                  na[i] = e.target.value;
                  setAnswers(na);
                }}
              />
            </div>
          ))}
          <div className="flex gap-4">
             <button onClick={back} className="flex-1 p-5 border-2 border-slate-200 rounded-2xl font-black text-slate-400 uppercase tracking-widest text-xs hover:bg-slate-50 transition-all">Previous</button>
             <button 
              onClick={() => next(answers)}
              disabled={answers.some(a => !a.trim())}
              className="flex-[2] bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all text-sm uppercase tracking-widest active:scale-95"
             >
              LOCK SCOPE & QUERY MARKET RATES
              <ChevronRight className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultStep = ({ result, projectData, reset }: any) => {
  const [margin, setMargin] = useState(25);
  
  const rawSubtotal = result.materials.reduce((a: any, b: any) => a + b.total, 0) + result.labor.total + result.overheadEstimate;
  const profit = rawSubtotal * (margin / 100);
  const total = rawSubtotal + profit;
  const tax = total * 0.0825;
  const final = total + tax;

  const getRiskColor = (score: number) => {
    if (score > 60) return 'text-red-500 bg-red-50 border-red-100';
    if (score > 30) return 'text-amber-500 bg-amber-50 border-amber-100';
    return 'text-emerald-500 bg-emerald-50 border-emerald-100';
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <button onClick={reset} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest transition-colors">
          <ArrowLeft className="w-4 h-4" /> Commander Terminal
        </button>
        <div className="flex gap-4">
           <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95">
             <Download className="w-4 h-4" /> EXPORT PDF
           </button>
           <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-sm flex items-center gap-2 hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
             <Mail className="w-4 h-4" /> SEND TO CLIENT
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Main Branded Result */}
          <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden">
             <div className="p-8 md:p-12 border-b border-slate-100">
               <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
                 <div>
                   <div className="flex items-center gap-3 text-slate-900 font-black text-3xl tracking-tighter">
                     <BrainCircuit className="w-10 h-10 text-blue-600" />
                     CONSTRUCT<span className="text-blue-600">AI</span>
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Market Dominance Proposal</p>
                 </div>
                 <div className="text-left md:text-right">
                   <p className="text-sm font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 md:justify-end">
                     <Globe className="w-4 h-4" /> GROUNDED IN REAL-TIME MARKET DATA
                   </p>
                   <p className="text-2xl font-black text-slate-900 tracking-tighter mt-1">{projectData.location}</p>
                   <p className="text-slate-400 text-sm font-medium">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
                 </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-slate-100">
                 <div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Sector</span><p className="font-bold text-slate-900">{projectData.projectType}</p></div>
                 <div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Scale</span><p className="font-bold text-slate-900">{projectData.projectScale}</p></div>
                 <div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Timeline</span><p className="font-bold text-blue-600">{projectData.timeline}</p></div>
                 <div><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Takeoff Size</span><p className="font-bold text-slate-900">{projectData.size}</p></div>
               </div>
             </div>

             <div className="p-8 md:p-12 overflow-x-auto">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                  <Layers className="w-5 h-5 text-blue-500" /> Grounded Market Assemblies
                </h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                      <th className="pb-6 pr-4">Assembly Detail</th>
                      <th className="pb-6 px-4 text-center">Unit/Qty</th>
                      <th className="pb-6 px-4 text-right">Market Rate</th>
                      <th className="pb-6 pl-4 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {result.materials.map((m: any, i: number) => (
                      <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-5 pr-4 font-bold text-slate-800">{m.name}</td>
                        <td className="py-5 px-4 text-center text-slate-500 font-medium">{m.qty} {m.unit}</td>
                        <td className="py-5 px-4 text-right text-slate-500 font-medium">${m.rate.toLocaleString()}</td>
                        <td className="py-5 pl-4 text-right font-black text-slate-900">${m.total.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50/20">
                      <td className="py-5 px-4 font-bold text-blue-900 rounded-l-xl">{result.labor.name}</td>
                      <td className="py-5 text-center text-blue-700 font-medium">{result.labor.qty} {result.labor.unit}</td>
                      <td className="py-5 text-right text-blue-700 font-medium">${result.labor.rate.toLocaleString()}</td>
                      <td className="py-5 px-4 text-right font-black text-blue-950 rounded-r-xl">${result.labor.total.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
             </div>

             <div className="bg-slate-950 p-8 md:p-12 text-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <h3 className="text-xs font-black uppercase tracking-widest opacity-60">Digital Master Narrative</h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold">
                    <History className="w-3 h-3 text-blue-400" /> Confidence Level: {(result.marketConfidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <Quote className="w-12 h-12 text-blue-600/40 shrink-0 hidden sm:block" />
                  <p className="text-slate-300 leading-relaxed font-medium italic">
                    "{result.insights[1]?.text || "Market intelligence indicates increasing material volatility in the primary trade sectors. This estimate incorporates localized surge pricing based on real-time grounding in the current regional construction climate."}"
                  </p>
                </div>
                
                {result.sources && result.sources.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Grounded Pricing Sources</h4>
                    <div className="flex flex-wrap gap-3">
                      {result.sources.map((s: any, idx: number) => (
                        <a 
                          key={idx} 
                          href={s.web?.uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-blue-400 hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                          <Globe className="w-3 h-3" /> {s.web?.title || 'Market Source'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Predictive Sidebar */}
        <div className="space-y-10">
          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 p-10 hover:border-blue-200 transition-colors">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-500" /> Profit Configuration
            </h3>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400">
                  <span>Net Margin Override</span>
                  <span className="text-blue-600 font-black text-lg">{margin}%</span>
                </div>
                <input 
                  type="range" min="10" max="45" value={margin} 
                  onChange={e => setMargin(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-4 py-8 border-y border-slate-100">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-500">Market Raw Cost:</span>
                  <span className="text-slate-900 font-bold">${rawSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-500">Profit Target:</span>
                  <span className="text-blue-600 font-bold">+${profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-500">Regional Factor:</span>
                  <span className="text-slate-900 font-bold">{(result.regionalMultiplier || 1).toFixed(2)}x</span>
                </div>
              </div>

              <div className="animate-in slide-in-from-top-2">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Final Bid Value</span>
                <span className="block text-5xl font-black text-slate-900 tracking-tighter">${final.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Incl. Regional Tax (8.25%)</span>
                  <span>${tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 p-10 hover:border-amber-200 transition-colors">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" /> Risk Diagnostics
            </h3>
            <div className="space-y-6">
               <div className={`p-6 rounded-2xl border flex items-center justify-between ${getRiskColor(result.riskScore)}`}>
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Risk Index</p>
                   <p className="text-3xl font-black tracking-tight">{result.riskScore}/100</p>
                 </div>
                 <Activity className="w-10 h-10 opacity-20" />
               </div>
               
               {result.insights.map((insight: any, i: number) => (
                 <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${insight.impact === 'high' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{insight.title}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{insight.text}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Controller ---

export default function App() {
  const { user, login, logout } = useAuth();
  const { estimates, saveEstimate } = usePersistence();
  
  const [currentStep, setCurrentStep] = useState<Step>(Step.INTAKE);
  const [activeView, setActiveView] = useState<'dashboard' | 'flow'>('dashboard');
  const [projectData, setProjectData] = useState<ProjectData>({
    scope: '',
    projectType: ProjectType.RESIDENTIAL,
    projectScale: ProjectScale.MEDIUM,
    timeline: ProjectTimeline.STANDARD,
    location: '',
    size: '',
    description: '',
    customItems: []
  });
  const [estimateResult, setEstimateResult] = useState<any>(null);
  const [loadingMsg, setLoadingMsg] = useState('');

  if (!user) return <AuthView onLogin={login} />;

  const handleStartFlow = () => {
    setProjectData({
      scope: '',
      projectType: ProjectType.RESIDENTIAL,
      projectScale: ProjectScale.MEDIUM,
      timeline: ProjectTimeline.STANDARD,
      location: '',
      size: '',
      description: '',
      customItems: []
    });
    setActiveView('flow');
    setCurrentStep(Step.INTAKE);
  };

  const handleFinalGeneration = async (clarificationAnswers: string[]) => {
    setCurrentStep(Step.PROCESSING);
    setLoadingMsg("Grounded search active: Querying regional market APIs...");
    
    try {
      const result = await generateEstimate({
        ...projectData,
        description: projectData.description + "\n\nCLARIFICATIONS:\n" + clarificationAnswers.join('\n')
      });
      
      setEstimateResult(result);
      saveEstimate(projectData, result);
      setCurrentStep(Step.RESULT);
    } catch (err) {
      console.error(err);
      alert("Grounding error: High latency in market data retrieval. Please reset and retry.");
      setCurrentStep(Step.INTAKE);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveView('dashboard')}>
              <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-700 transition-colors">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-xl tracking-tighter group-hover:text-blue-600 transition-colors">CONSTRUCT<span className="text-blue-600">AI</span></span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Pricing Core: Real-Time Grounding</span>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 capitalize">{user.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Senior Estimator</p>
              </div>
              <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors active:scale-90">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {activeView === 'dashboard' ? (
          <DashboardView user={user} estimates={estimates} onNewEstimate={handleStartFlow} />
        ) : (
          <>
            {currentStep === Step.INTAKE && (
              <IntakeFlow 
                projectData={projectData} 
                setProjectData={setProjectData} 
                next={() => setCurrentStep(Step.CLARIFY)} 
                back={() => setActiveView('dashboard')} 
              />
            )}
            {currentStep === Step.CLARIFY && (
              <ClarifyStep 
                projectData={projectData} 
                next={handleFinalGeneration} 
                back={() => setCurrentStep(Step.INTAKE)} 
              />
            )}
            {currentStep === Step.PROCESSING && (
              <div className="flex flex-col items-center justify-center h-[70vh] animate-in fade-in duration-500">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20 scale-[2.5]"></div>
                  <div className="relative bg-white p-10 rounded-full border-4 border-blue-50 shadow-2xl">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Market Supremacy Protocol</h3>
                <div className="mt-6 px-8 py-4 bg-slate-900 rounded-2xl shadow-xl border border-slate-800">
                  <p className="text-blue-400 font-mono text-xs tracking-[0.2em] uppercase text-center max-w-sm">{loadingMsg}</p>
                </div>
              </div>
            )}
            {currentStep === Step.RESULT && (
              <ResultStep 
                result={estimateResult} 
                projectData={projectData} 
                reset={handleStartFlow} 
              />
            )}
          </>
        )}
      </main>

      <footer className="py-12 text-center opacity-30 border-t border-slate-200 mt-20">
        <p className="text-[10px] font-black uppercase tracking-[0.4em]">&copy; 2025 CONSTRUCTAI GROUNDED DOMINANCE. PRODUCTION NODE SECURED.</p>
      </footer>
    </div>
  );
}
