import React, { useState } from 'react';
import { Settings, Shield, Activity, Calendar, MapPin, Search, ChevronRight, AlertTriangle, FileText, Upload, CreditCard, MessageSquare, Car, LogOut, CheckCircle2, Star, Zap, Droplets, BatteryCharging, Wrench, ArrowLeft, Lightbulb, PlayCircle, BookOpen } from 'lucide-react';
import { ViewState } from '../types';

interface MotoristDashboardProps {
   setView: (view: ViewState) => void;
}

// ----------------------------------------------------------------------
// MOCK DATA
// ----------------------------------------------------------------------
const MOCK_USER = {
   name: "Alexandre D.",
   vehicle: "Peugeot 308 (2019)",
   plate: "AB-123-CD",
   healthScore: 82, // Score on 100
   ecoScore: 91,
};

interface DiagnosticIssue {
   code: string;
   title: string;
   description: string;
   simplifiedExplanation: string;
   howItWorks: string;
   partsAffected: string[];
   severity: 'low' | 'medium' | 'high';
   urgency: 'immediate' | 'soon' | 'monitor';
   estimatedCost: string;
   recommendation: string;
   system: 'engine' | 'transmission' | 'brakes' | 'exhaust' | 'electrical' | 'suspension';
   media?: {
      videoUrl?: string; // YouTube or generic video MP4
      comicUrl?: string; // Image path
      articleContent?: string; // Markdown or long string
   }
}

const MOCK_ISSUES_1: DiagnosticIssue[] = [
   {
      code: "P0303",
      title: "Ratés d'allumage détectés (Cylindre 3)",
      description: "Le moteur ne brûle pas le carburant correctement causant des vibrations.",
      simplifiedExplanation: "Imaginez que votre moteur soit comme un groupe de sportifs. Si l'un rate son coup de pédale, le vélo avance par à-coups. Un cylindre \"rate\" son explosion.",
      howItWorks: "Une bougie crée une étincelle pour faire exploser le mélange air/essence. Si elle est usée, l'explosion ne se produit pas.",
      partsAffected: ["Bougies d'allumage", "Bobines d'allumage"],
      severity: "high",
      urgency: "immediate",
      estimatedCost: "80€ – 250€",
      recommendation: "Remplacez la bobine et la bougie du cylindre 3 rapidement.",
      system: "engine",
      media: {
         videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // placeholder for demo
         comicUrl: "/images/bd-allumage.png", // We will mock an image if it doesn't exist, using a placeholder text or styling
         articleContent: "L'allumage est un processus fondamental dans un moteur à combustion essence. La bobine d'allumage transforme le 12V de la batterie en haute tension (jusqu'à 40 000V) qui est ensuite envoyée à la bougie. Cette dernière crée une étincelle enflammant le mélange air/essence. Si la bougie est encrassée ou la bobine défectueuse, l'étincelle ne se fait pas : c'est le 'raté d'allumage' (code P0300 à P0312). Cela entraîne une perte de puissance, des vibrations (le moteur tourne sur '3 pattes' ou au lieu de 4), et peut gravement endommager le pot catalytique car du carburant imbrûlé s'y déverse."
      }
   }
];

const MOCK_ISSUES_2: DiagnosticIssue[] = [
   {
      code: "C0035",
      title: "Capteur de vitesse de roue (Avant Gauche)",
      description: "Le signal du capteur ABS est défaillant ou absent.",
      simplifiedExplanation: "L'ordinateur de bord ne sait plus à quelle vitesse tourne votre roue avant gauche. L'ABS est désactivé par sécurité.",
      howItWorks: "Un capteur magnétique lit une petite roue dentée sur le moyeu pour informer la voiture de la vitesse exacte de chaque roue, essentiel pour l'ABS et l'ESP.",
      partsAffected: ["Capteur ABS", "Faisceau électrique"],
      severity: "medium",
      urgency: "soon",
      estimatedCost: "60€ – 120€",
      recommendation: "Faites vérifier le capteur et son câblage. Nettoyage ou remplacement nécessaire.",
      system: "brakes",
      media: {
         articleContent: "Le système ABS (Anti-lock Braking System) empêche le blocage des roues lors d'un freinage d'urgence. Le capteur de vitesse de roue (Wheel Speed Sensor) est l'œil du système pour chaque roue. Exposé aux intempéries et à la saleté, il peut s'encrasser ou être endommagé. Un code C0035 indique un problème spécifique sur la roue avant gauche. Bien que la voiture puisse encore freiner normalement, elle le fera SANS assistance antiblocage, ce qui augmente les distances de freinage d'urgence."
      }
   }
];

const MOCK_REPORTS = [
   { id: 1, date: "24 Oct 2023", location: "Borne Auchan Toulon", status: "warning", summary: "Ratés d'allumage cylindre 3", codes: ["P0303"], cost: "14.99€", issues: MOCK_ISSUES_1 },
   { id: 2, date: "12 Aou 2023", location: "Borne Carrefour Ollioules", status: "warning", summary: "Défaillance capteur ABS (C0035)", codes: ["C0035"], cost: "14.99€", issues: MOCK_ISSUES_2 }
];

const MOCK_QUOTES = [
   { id: 1, garageName: "Garage MecaExpert", rating: 4.8, distance: "2.5 km", priceEstimate: "180€ - 250€", message: "Le code P0303 nécessite le remplacement de la bobine d'allumage. Pièce en stock.", date: "Aujourd'hui, 10:30" },
   { id: 2, garageName: "Garage du Port", rating: 4.5, distance: "4.1 km", priceEstimate: "220€ - 280€", message: "Devis estimatif pour le changement d'une bobine + bougie. À confirmer sur place.", date: "Hier, 16:45" },
];

const VEHICLE_SYSTEMS = [
   { id: 'engine', name: 'Moteur', status: 'warning', icon: Activity, score: 65, desc: "Cylindre 3 à vérifier" },
   { id: 'battery', name: 'Batterie', status: 'ok', icon: BatteryCharging, score: 98, desc: "Charge optimale" },
   { id: 'fluids', name: 'Liquides', status: 'ok', icon: Droplets, score: 90, desc: "Niveaux corrects" },
   { id: 'brakes', name: 'Freinage', status: 'ok', icon: Shield, score: 85, desc: "Usure normale (40%)" },
];

export const MotoristDashboard: React.FC<MotoristDashboardProps> = ({ setView }) => {
   const [activeSection, setActiveSection] = useState<'overview' | 'reports' | 'quotes' | 'settings'>('overview');
   const [viewingReportId, setViewingReportId] = useState<number | null>(null);
   const [activeSystem, setActiveSystem] = useState<string | null>(null);
   // State to track which media is open for a specific issue ID
   const [activeMedia, setActiveMedia] = useState<{ issueCode: string, type: 'video' | 'comic' | 'article' } | null>(null);

   const SYSTEMS_MAP = [
      { id: 'engine', label: 'Moteur', icon: Settings, x: 75, y: 35 },
      { id: 'transmission', label: 'Boîte de vitesses', icon: Settings, x: 60, y: 55 },
      { id: 'brakes', label: 'Freinage', icon: Shield, x: 28, y: 65 },
      { id: 'exhaust', label: 'Échappement', icon: Activity, x: 45, y: 72 },
      { id: 'electrical', label: 'Électronique', icon: Zap, x: 65, y: 45 },
      { id: 'suspension', label: 'Suspension', icon: Settings, x: 18, y: 58 },
   ];

   // ----------------------------------------------------------------------
   // COMPONENTS
   // ----------------------------------------------------------------------
   const NavItem = ({ id, icon: Icon, label, alertCount = 0 }) => (
      <button
         onClick={() => setActiveSection(id)}
         className={`relative flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all duration-300 ${activeSection === id
            ? 'text-brand-primary border-b-2 border-brand-primary'
            : 'text-gray-500 hover:text-brand-dark'
            }`}
      >
         <Icon size={18} />
         <span className="hidden md:block">{label}</span>
         {alertCount > 0 && (
            <span className="absolute top-2 right-2 md:relative md:top-auto md:right-auto bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
               {alertCount}
            </span>
         )}
      </button>
   );

   return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans pt-20">

         {/* -----------------------------------------------------
          TOP NAVIGATION BAR
         ------------------------------------------------------- */}
         <div className="sticky top-20 z-20 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-4 md:px-8">
            <nav className="flex items-center overflow-x-auto hide-scrollbar">
               <NavItem id="overview" icon={Activity} label="Centre de Contrôle" />
               <NavItem id="reports" icon={FileText} label="Mes Diagnostics" />
               <NavItem id="quotes" icon={MessageSquare} label="Devis Garages" alertCount={2} />
               <NavItem id="settings" icon={Settings} label="Mon Profil" />
            </nav>
            <div className="hidden md:flex items-center gap-4 py-2 border-l border-gray-100 pl-6">
               <div className="text-right">
                  <p className="font-bold text-sm text-brand-dark">{MOCK_USER.name}</p>
                  <p className="text-xs text-gray-500">{MOCK_USER.plate}</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
                  {MOCK_USER.name.charAt(0)}
               </div>
            </div>
         </div>

         {/* -----------------------------------------------------
          MAIN CONTENT AREA
         ------------------------------------------------------- */}
         <main className="flex-1 p-6 md:p-10 lg:p-12 w-full max-w-7xl mx-auto relative">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>



            {/* ===================================================
            SECTION: VUE D'ENSEMBLE (OVERVIEW)
        ==================================================== */}
            {activeSection === 'overview' && (
               <div className="space-y-8 animate-fade-in-up">

                  {/* Top Stat Row: Gamification & Health */}
                  <div className="grid lg:grid-cols-3 gap-6">

                     {/* Main Health Card */}
                     <div className="lg:col-span-2 bg-gradient-to-br from-[#0c142b] to-[#1a2542] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-[60px] pointer-events-none"></div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-8">
                           <div>
                              <div className="flex items-center gap-2 mb-2">
                                 <Activity size={20} className="text-brand-primary" />
                                 <span className="font-bold text-sm tracking-widest uppercase text-gray-300">Indice de Santé Global</span>
                              </div>
                              <div className="flex items-end gap-3 mt-4">
                                 <span className="font-display text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{MOCK_USER.healthScore}</span>
                                 <span className="text-2xl text-gray-500 mb-2">/100</span>
                              </div>
                              <p className="mt-4 text-gray-300 max-w-sm text-sm leading-relaxed">
                                 Votre véhicule est en bon état général, mais une <span className="text-orange-400 font-bold">attention est requise</span> sur le système d'allumage pour éviter une surconsommation.
                              </p>
                           </div>

                           {/* Circular radar mock up */}
                           <div className="relative w-40 h-40 shrink-0 mx-auto md:mx-0">
                              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                 <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                                 <circle cx="50" cy="50" r="45" fill="none" stroke="#22d3ee" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * MOCK_USER.healthScore) / 100} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center flex-col">
                                 <Car className="text-white w-8 h-8 opacity-50 mb-1" />
                                 <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">Normal</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Eco/Gamification Card */}
                     <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-center items-center text-center relative overflow-hidden group">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all duration-500 shadow-lg shadow-green-500/20">
                           <Zap size={32} />
                        </div>
                        <h3 className="font-display font-bold text-xl text-gray-900 mb-2">Éco-Conducteur</h3>
                        <p className="text-gray-500 text-sm mb-6">Vous faites partie des <span className="font-bold text-gray-800">15%</span> d'utilisateurs qui entretiennent le mieux leur véhicule. Continuez !</p>
                        <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                           <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full relative" style={{ width: `${MOCK_USER.ecoScore}%` }}>
                              <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress_1s_linear_infinite]"></div>
                           </div>
                        </div>
                        <span className="text-xs font-bold text-green-600 block w-full text-right">{MOCK_USER.ecoScore} pts</span>
                     </div>
                  </div>

                  {/* Middle Row: Urgent Alerts & System Status */}
                  <div className="grid lg:grid-cols-2 gap-6">

                     {/* Systems Grid */}
                     <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <h3 className="font-bold text-lg text-brand-dark mb-6 flex items-center gap-2">
                           <Wrench size={20} className="text-brand-primary" /> État des Sous-Systèmes
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                           {VEHICLE_SYSTEMS.map(sys => (
                              <div key={sys.id} className={`p-4 rounded-2xl border ${sys.status === 'warning' ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-100'}`}>
                                 <div className="flex justify-between items-start mb-3">
                                    <div className={`p-2 rounded-lg ${sys.status === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-white text-gray-500 shadow-sm'}`}>
                                       <sys.icon size={20} />
                                    </div>
                                    <span className={`text-xs font-black ${sys.status === 'warning' ? 'text-orange-600' : 'text-gray-400'}`}>{sys.score}%</span>
                                 </div>
                                 <h4 className="font-bold text-brand-dark text-sm">{sys.name}</h4>
                                 <p className={`text-xs mt-1 leading-tight ${sys.status === 'warning' ? 'text-orange-800 font-medium' : 'text-gray-500'}`}>{sys.desc}</p>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Action Required Alert Premium */}
                     <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-[2rem] p-8 text-white relative shadow-[0_15px_40px_-10px_rgba(249,115,22,0.5)] overflow-hidden flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>

                        <div className="relative z-10">
                           <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                              <AlertTriangle size={14} /> Action Requise
                           </div>
                           <h3 className="font-display text-3xl font-bold mb-4 leading-tight">Défaut P0303 détecté il y a 3 jours.</h3>
                           <p className="text-white/80 text-sm mb-8 max-w-md leading-relaxed">
                              Nous avons identifié un raté d'allumage sur le cylindre 3. Ignorer ce problème peut endommager votre pot catalytique.
                           </p>

                           <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-white text-orange-500 rounded-full flex items-center justify-center font-bold">2</div>
                                 <div>
                                    <p className="font-bold text-sm">Devis Reçus</p>
                                    <p className="text-xs text-white/70">À partir de 180€</p>
                                 </div>
                              </div>
                              <button onClick={() => setActiveSection('quotes')} className="bg-white text-orange-600 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                 Comparer
                              </button>
                           </div>
                        </div>
                     </div>

                  </div>
               </div>
            )}

            {/* ===================================================
            SECTION: HISTORIQUE / TIMELINE (REPORTS)
        ==================================================== */}
            {activeSection === 'reports' && !viewingReportId && (
               <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
                  <h2 className="font-display text-4xl font-bold text-brand-dark mb-10 text-center md:text-left">Vos Diagnostics AutoScanR</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {MOCK_REPORTS.map((report) => (
                        <div key={report.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-300 group flex flex-col relative overflow-hidden">

                           <div className="p-8 flex-1 flex flex-col pt-10">
                              {/* Top row: Date & Status Badge */}
                              <div className="flex justify-between items-center mb-6">
                                 <div className="flex items-center gap-2 text-gray-500 text-sm font-bold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    <Calendar size={16} className="text-brand-primary" /> {report.date}
                                 </div>
                                 <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${report.issues.length > 0 ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                    {report.issues.length > 0 ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                                    {report.issues.length > 0 ? `${report.issues.length} Défaut${report.issues.length > 1 ? 's' : ''}` : 'Sain'}
                                 </div>
                              </div>

                              {/* Terminal Location */}
                              <h3 className="font-display text-2xl font-bold text-brand-primary mb-2 flex items-center gap-2">
                                 <MapPin className="text-brand-primary/50" /> {report.location}
                              </h3>

                              {/* Vehicle Analyzed */}
                              <div className="flex items-center gap-3 mt-4 mb-8 bg-[#f8f9fa] p-4 rounded-xl border border-gray-100/80">
                                 <Car size={24} className="text-gray-400" />
                                 <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">Véhicule analysé</p>
                                    <p className="text-brand-dark font-bold text-sm">{MOCK_USER.vehicle}</p>
                                 </div>
                              </div>

                              {/* Action Button */}
                              <div className="mt-auto pt-2">
                                 <button
                                    onClick={() => setViewingReportId(report.id)}
                                    className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 hover:bg-brand-light hover:shadow-brand-primary/40 transition-all duration-300 transform group-hover:-translate-y-1"
                                 >
                                    Ouvrir le Diagnostic <ChevronRight size={18} />
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* RAPPORT DÉTAILLÉ (BORNE INTEGRATION) */}
            {activeSection === 'reports' && viewingReportId && (() => {
               const report = MOCK_REPORTS.find(r => r.id === viewingReportId);
               if (!report) return null;

               const totalIssues = report.issues.length;

               return (
                  <div className="animate-fade-in-up flex flex-col h-full space-y-6">
                     <button onClick={() => { setViewingReportId(null); setActiveSystem(null); }} className="flex items-center gap-2 text-gray-500 hover:text-brand-primary font-bold w-fit mb-2">
                        <ArrowLeft size={20} /> Retour à l'historique
                     </button>

                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                        <div>
                           <h2 className="font-display text-2xl font-bold text-brand-dark mb-1">Rapport de Diagnostic</h2>
                           <p className="text-gray-500 text-sm flex items-center gap-2"><MapPin size={14} /> {report.location} • {report.date}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold ${totalIssues > 0 ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                           {totalIssues > 0 ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                           {totalIssues} Anomalie{totalIssues !== 1 ? 's' : ''}
                        </div>
                     </div>

                     <div className="flex flex-col lg:flex-row gap-6">
                        {/* Car Schema */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 flex-1 flex flex-col items-center justify-center relative min-h-[400px]">
                           <p className="absolute top-6 left-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Localisation visuelle</p>
                           <div className="relative w-full max-w-lg mt-8">
                              <img src="/images/voiture-scan.png" alt="Schéma voiture" className="w-full object-contain mix-blend-multiply" />
                              {SYSTEMS_MAP.map(sys => {
                                 const faultyIssues = report.issues.filter(i => i.system === sys.id);
                                 const faulty = faultyIssues.length > 0;
                                 const isSelected = activeSystem === sys.id;
                                 return (
                                    <button
                                       key={sys.id}
                                       onClick={() => setActiveSystem(isSelected ? null : sys.id)}
                                       className="absolute -translate-x-1/2 -translate-y-1/2 group"
                                       style={{ left: `${sys.x}%`, top: `${sys.y}%` }}
                                    >
                                       {faulty && !isSelected && <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-30 scale-150" />}
                                       <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg border-2 transition-all duration-300 ${faulty ? (isSelected ? 'bg-orange-600 border-white text-white scale-110' : 'bg-orange-500 border-white text-white hover:scale-110') : 'bg-green-500 border-white text-white hover:scale-110'} ${isSelected && !faulty ? 'ring-4 ring-green-500/30' : ''} ${isSelected && faulty ? 'ring-4 ring-orange-500/30' : ''}`}>
                                          <sys.icon size={18} strokeWidth={2.5} />
                                       </div>
                                       {faulty && (
                                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                             {faultyIssues.length}
                                          </div>
                                       )}
                                    </button>
                                 );
                              })}
                           </div>
                        </div>

                        {/* Issue Details / List */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 flex-1 lg:max-w-md flex flex-col overflow-hidden">
                           {activeSystem ? (() => {
                              const activeSysDef = SYSTEMS_MAP.find(s => s.id === activeSystem);
                              const issues = report.issues.filter(i => i.system === activeSystem);
                              return (
                                 <div className="flex flex-col h-full">
                                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                                       <h3 className="font-display font-bold text-xl text-brand-dark">{activeSysDef?.label}</h3>
                                       <button onClick={() => setActiveSystem(null)} className="text-gray-400 hover:text-brand-primary p-2">✕</button>
                                    </div>
                                    <div className="p-6 overflow-y-auto max-h-[500px] space-y-6">
                                       {issues.length > 0 ? issues.map(issue => (
                                          <div key={issue.code} className="space-y-6">
                                             <div className="flex items-center gap-3 mb-2">
                                                <span className="font-mono text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-md">{issue.code}</span>
                                                <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-full uppercase tracking-wider">{issue.severity}</span>
                                             </div>
                                             <h4 className="font-bold text-lg text-brand-dark leading-tight">{issue.title}</h4>

                                             <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50">
                                                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2"><Lightbulb size={16} /> Explication simple</p>
                                                <p className="text-sm text-gray-700 leading-relaxed">{issue.simplifiedExplanation}</p>
                                             </div>

                                             <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Settings size={16} /> Comment ça marche ?</p>
                                                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">{issue.howItWorks}</p>
                                             </div>

                                             <div className="flex flex-wrap gap-2">
                                                {issue.partsAffected.map(part => (
                                                   <span key={part} className="text-xs font-bold bg-white text-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-2"><Wrench size={12} className="text-gray-400" /> {part}</span>
                                                ))}
                                             </div>

                                             <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 flex gap-3">
                                                <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={18} />
                                                <p className="text-sm text-orange-800 font-medium">{issue.recommendation}</p>
                                             </div>

                                             {/* Media Links for learning */}
                                             <div className="pt-6 border-t border-gray-100 gap-3 grid grid-cols-1 sm:grid-cols-3">
                                                <button
                                                   onClick={() => setActiveMedia(activeMedia?.issueCode === issue.code && activeMedia.type === 'video' ? null : { issueCode: issue.code, type: 'video' })}
                                                   className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-colors text-sm font-bold border ${activeMedia?.issueCode === issue.code && activeMedia.type === 'video' ? 'bg-purple-600 text-white' : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-100'}`}
                                                >
                                                   <PlayCircle size={18} /> Vidéo
                                                </button>
                                                <button
                                                   onClick={() => setActiveMedia(activeMedia?.issueCode === issue.code && activeMedia.type === 'comic' ? null : { issueCode: issue.code, type: 'comic' })}
                                                   className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-colors text-sm font-bold border ${activeMedia?.issueCode === issue.code && activeMedia.type === 'comic' ? 'bg-blue-600 text-white' : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-100'}`}
                                                >
                                                   <BookOpen size={18} /> BD
                                                </button>
                                                <button
                                                   onClick={() => setActiveMedia(activeMedia?.issueCode === issue.code && activeMedia.type === 'article' ? null : { issueCode: issue.code, type: 'article' })}
                                                   className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-colors text-sm font-bold border ${activeMedia?.issueCode === issue.code && activeMedia.type === 'article' ? 'bg-teal-600 text-white' : 'bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-100'}`}
                                                >
                                                   <FileText size={18} /> Article
                                                </button>
                                             </div>

                                             {/* Inline Media Content Display */}
                                             {activeMedia?.issueCode === issue.code && issue.media && (
                                                <div className="mt-4 p-4 border border-gray-100 bg-white rounded-2xl shadow-inner animate-fade-in-up">
                                                   {/* Header of inline container */}
                                                   <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                                                      <h5 className="font-bold text-brand-dark flex items-center gap-2">
                                                         {activeMedia.type === 'video' && <><PlayCircle className="text-purple-600" size={18} /> Tutoriel Vidéo</>}
                                                         {activeMedia.type === 'comic' && <><BookOpen className="text-blue-600" size={18} /> Explication Illustrée</>}
                                                         {activeMedia.type === 'article' && <><FileText className="text-teal-600" size={18} /> Article Détaillé</>}
                                                      </h5>
                                                      <button onClick={() => setActiveMedia(null)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors">
                                                         ✕
                                                      </button>
                                                   </div>

                                                   {/* Content Rendering based on type */}
                                                   {activeMedia.type === 'video' && issue.media.videoUrl && (
                                                      <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-sm">
                                                         <video controls className="w-full h-full object-cover">
                                                            <source src={issue.media.videoUrl} type="video/mp4" />
                                                            Votre navigateur ne supporte pas la vidéo.
                                                         </video>
                                                      </div>
                                                   )}

                                                   {activeMedia.type === 'comic' && (
                                                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 flex flex-col items-center text-center justify-center min-h-[250px]">
                                                         {/* Placeholder since we don't have the actual BD image yet */}
                                                         <BookOpen size={48} className="text-blue-200 mb-4" />
                                                         <p className="text-gray-500 font-medium">La bande dessinée explicative pour ce problème apparaîtra ici.</p>
                                                      </div>
                                                   )}

                                                   {activeMedia.type === 'article' && issue.media.articleContent && (
                                                      <div className="prose prose-sm text-gray-700 leading-relaxed font-serif">
                                                         <p>{issue.media.articleContent}</p>
                                                      </div>
                                                   )}
                                                </div>
                                             )}
                                          </div>
                                       )) : (
                                          <div className="text-center py-12 text-gray-500">
                                             <CheckCircle2 size={48} className="mx-auto text-green-400 mb-4" />
                                             <p className="font-bold text-gray-700">Aucun défaut</p>
                                             <p className="text-sm mt-1">Ce système est en parfait état.</p>
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              );
                           })() : (
                              <div className="p-8 h-full flex flex-col items-center justify-center text-center text-gray-500 bg-gray-50/50">
                                 <Activity size={48} className="text-gray-300 mb-4" />
                                 <h3 className="font-bold text-gray-700 mb-2">Sélectionnez un système</h3>
                                 <p className="text-sm max-w-[200px]">Cliquez sur un point du véhicule pour voir les détails du diagnostic.</p>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               );
            })()}

            {/* ===================================================
            SECTION: DEVIS GARAGES (QUOTES)
        ==================================================== */}
            {activeSection === 'quotes' && (
               <div className="animate-fade-in-up">
                  <h2 className="font-display text-3xl font-bold text-brand-dark mb-2">Offres Garagistes</h2>
                  <p className="text-gray-500 mb-10">Suite à votre dernier diagnostic du 24 Octobre (Code P0303).</p>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {MOCK_QUOTES.map(quote => (
                        <div key={quote.id} className="bg-white rounded-[2rem] flex flex-col border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-shadow relative overflow-hidden group cursor-pointer">

                           {/* Match Badge */}
                           {quote.rating >= 4.7 && (
                              <div className="absolute top-0 right-0 bg-gradient-to-r from-brand-primary to-blue-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-8 translate-x-12 translate-y-4 rotate-45 shadow-md z-10">
                                 Top Match
                              </div>
                           )}

                           <div className="p-8 pb-0">
                              <div className="flex justify-between items-start mb-4">
                                 <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shrink-0">
                                    <Wrench className="text-brand-dark opacity-50" />
                                 </div>
                                 <div className="text-right">
                                    <span className="text-2xl font-display font-black text-brand-primary block">{quote.priceEstimate}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main d'oeuvre incluse</span>
                                 </div>
                              </div>

                              <h3 className="font-display text-xl font-bold text-brand-dark mb-1">{quote.garageName}</h3>

                              <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mb-6 pb-6 border-b border-gray-100">
                                 <span className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-md">
                                    <Star size={12} fill="currentColor" /> {quote.rating}
                                 </span>
                                 <span className="flex items-center gap-1">
                                    <MapPin size={12} /> {quote.distance}
                                 </span>
                              </div>
                           </div>

                           <div className="p-8 pt-0 flex-1 flex flex-col">
                              <div className="bg-gray-50 rounded-2xl p-4 flex-1 mb-6 relative">
                                 {/* Quotation marks decoration */}
                                 <div className="absolute top-2 left-2 text-4xl text-gray-200 font-serif leading-none opacity-50">"</div>
                                 <p className="text-gray-600 text-sm leading-relaxed relative z-10 pl-2 italic">
                                    {quote.message}
                                 </p>
                              </div>

                              <div className="flex flex-col gap-3 mt-auto">
                                 <button className="w-full bg-[#0c142b] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:bg-black hover:-translate-y-0.5 transition-all">
                                    Prendre Rendez-vous
                                 </button>
                                 <button className="w-full bg-white border-2 border-gray-100 text-brand-dark py-3.5 rounded-xl font-bold text-sm hover:border-brand-primary/30 transition-colors">
                                    Voir le détail
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}

                     {/* Empty State / Waiting Card */}
                     <div className="bg-gray-50 rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 p-8 text-center opacity-70">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                           <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-primary rounded-full animate-spin"></div>
                        </div>
                        <h3 className="font-bold text-brand-dark mb-2">En attente de devis</h3>
                        <p className="text-sm text-gray-500">D'autres garagistes partenaires étudient votre diagnostic de la semaine dernière.</p>
                     </div>
                  </div>
               </div>
            )}

         </main>
      </div>
   );
};

export default MotoristDashboard;