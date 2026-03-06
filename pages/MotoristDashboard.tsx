import React, { useState } from 'react';
import { Settings, Shield, Activity, Calendar, MapPin, Search, ChevronRight, AlertTriangle, FileText, Upload, CreditCard, MessageSquare, Car, LogOut, CheckCircle2, Star, Zap, Droplets, BatteryCharging, Wrench } from 'lucide-react';
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

const MOCK_REPORTS = [
   { id: 1, date: "24 Oct 2023", location: "Borne Auchan Toulon", status: "warning", summary: "Ratés d'allumage cylindre 3", codes: ["P0303"], cost: "14.99€" },
   { id: 2, date: "12 Aou 2023", location: "Borne Carrefour Ollioules", status: "ok", summary: "Aucun défaut majeur", codes: [], cost: "14.99€" },
   { id: 3, date: "05 Fev 2023", location: "Garage Partenaire", status: "ok", summary: "Révision annuelle + Vidange", codes: [], cost: "185.00€" },
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

   // ----------------------------------------------------------------------
   // COMPONENTS
   // ----------------------------------------------------------------------
   const SidebarItem = ({ id, icon: Icon, label, alertCount = 0 }) => (
      <button
         onClick={() => setActiveSection(id)}
         className={`w-full flex items-center justify-between px-6 py-4 transition-all duration-300 ${activeSection === id
            ? 'bg-gradient-to-r from-brand-primary/20 to-transparent border-l-4 border-brand-primary text-white font-bold'
            : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
            }`}
      >
         <div className="flex items-center gap-4">
            <Icon size={20} className={activeSection === id ? 'text-brand-primary' : 'text-gray-500'} />
            <span>{label}</span>
         </div>
         {alertCount > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]">
               {alertCount}
            </span>
         )}
      </button>
   );

   return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row font-sans">

         {/* -----------------------------------------------------
          SIDEBAR (Glassmorphic Premium)
      ------------------------------------------------------- */}
         <aside className="md:w-72 bg-[#0c142b] text-white flex flex-col shadow-2xl z-20 sticky top-0 md:h-screen">
            <div className="p-8 pb-4">
               <div className="flex items-center gap-2 cursor-pointer mb-12" onClick={() => setView(ViewState.HOME)}>
                  <img src="/logo.png" alt="AutoScanR" className="h-8 md:h-10 w-auto" />
               </div>

               <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center text-xl font-bold font-display shadow-inner">
                     {MOCK_USER.name.charAt(0)}
                  </div>
                  <div>
                     <p className="font-bold text-sm">{MOCK_USER.name}</p>
                     <p className="text-xs text-brand-primary font-mono mt-0.5">{MOCK_USER.plate}</p>
                  </div>
               </div>
            </div>

            <nav className="flex-1 space-y-2 py-4">
               <SidebarItem id="overview" icon={Activity} label="Centre de Contrôle" />
               <SidebarItem id="reports" icon={FileText} label="Mes Diagnostics" />
               <SidebarItem id="quotes" icon={MessageSquare} label="Devis Garages" alertCount={2} />
               <SidebarItem id="settings" icon={Settings} label="Mon Profil" />
            </nav>

            <div className="p-6 border-t border-white/10">
               <button onClick={() => setView(ViewState.HOME)} className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-red-400 transition-colors py-2 text-sm font-medium">
                  <LogOut size={16} /> Déconnexion
               </button>
            </div>
         </aside>

         {/* -----------------------------------------------------
          MAIN CONTENT AREA
      ------------------------------------------------------- */}
         <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto w-full relative">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
               <div>
                  <h1 className="font-display text-4xl font-bold text-brand-dark mb-2">Bonjour, Alexandre 👋</h1>
                  <p className="text-gray-500 text-lg">Voici le bilan de santé de votre <span className="font-bold text-brand-dark">{MOCK_USER.vehicle}</span>.</p>
               </div>
               <button className="bg-white border border-gray-200 text-brand-dark shadow-sm hover:shadow-md px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all group">
                  Prendre un nouveau diagnostic <ChevronRight size={16} className="text-brand-primary group-hover:translate-x-1 transition-transform" />
               </button>
            </header>

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
            {activeSection === 'reports' && (
               <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                  <h2 className="font-display text-3xl font-bold text-brand-dark mb-8">Carnet de Santé Numérique</h2>

                  <div className="relative border-l-2 border-gray-200 ml-6 md:ml-10 space-y-12 pb-12">
                     {MOCK_REPORTS.map((report, idx) => (
                        <div key={report.id} className="relative pl-8 md:pl-12 group cursor-pointer">
                           {/* Timeline Node */}
                           <div className={`absolute -left-[17px] top-6 w-8 h-8 rounded-full border-4 border-[#f8f9fa] flex items-center justify-center transition-transform group-hover:scale-125 shadow-sm ${report.status === 'ok' ? 'bg-green-500' : 'bg-orange-500'
                              }`}>
                              {report.status === 'ok' ? <CheckCircle2 size={12} className="text-white" /> : <AlertTriangle size={12} className="text-white" />}
                           </div>

                           {/* Content Card */}
                           <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:border-brand-primary/30 transition-colors">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                 <div>
                                    <span className="text-brand-primary font-bold tracking-wider text-xs uppercase mb-1 block">{report.date}</span>
                                    <h3 className="font-display text-2xl font-bold text-brand-dark">{report.location}</h3>
                                 </div>
                                 <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                    <span className="text-xs text-gray-400 font-bold uppercase">Coût Total</span>
                                    <p className="font-bold text-brand-dark">{report.cost}</p>
                                 </div>
                              </div>

                              <div className={`p-4 rounded-xl mb-6 ${report.status === 'ok' ? 'bg-green-50 text-green-800' : 'bg-orange-50 text-orange-800'}`}>
                                 <p className="font-medium text-sm">{report.summary}</p>
                              </div>

                              {report.codes.length > 0 && (
                                 <div className="flex items-center gap-3 border-t border-gray-100 pt-6">
                                    <span className="text-xs text-gray-500 font-bold">Codes détectés :</span>
                                    <div className="flex gap-2">
                                       {report.codes.map(c => (
                                          <span key={c} className="bg-[#0c142b] text-white text-xs font-mono font-bold px-3 py-1 rounded-md shadow-sm">{c}</span>
                                       ))}
                                    </div>
                                 </div>
                              )}

                              <div className="mt-6 flex justify-end">
                                 <button className="text-brand-primary text-sm font-bold flex items-center gap-1 group-hover:underline">
                                    Voir le rapport détaillé <ChevronRight size={16} />
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}

                     {/* Timeline End fading */}
                     <div className="absolute bottom-0 left-[-2px] w-[2px] h-32 bg-gradient-to-t from-[#f8f9fa] to-transparent"></div>
                  </div>
               </div>
            )}

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