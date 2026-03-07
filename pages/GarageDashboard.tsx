import React, { useState } from 'react';
import { Users, Calendar as CalendarIcon, Settings, Search, AlertCircle, Clock, CheckCircle2, TrendingUp, DollarSign, Filter, Activity, Star } from 'lucide-react';
import { ViewState } from '../types';

interface GarageDashboardProps {
   setView: (view: ViewState) => void;
}

const GarageDashboard: React.FC<GarageDashboardProps> = ({ setView }) => {
   const [activeView, setActiveView] = useState<'leads' | 'stats' | 'schedule' | 'settings'>('leads');

   const leads = [
      { id: 1, car: 'Peugeot 308', year: 2019, issue: 'Ratés Allumage (P0303)', distance: '2.5 km', urgency: 'Haute', reportId: 'rep_001', notes: 'Bruit étrange au ralenti, voyant clignote.', time: 'Il y a 15 min', price: '180€ - 250€' },
      { id: 2, car: 'Renault Captur', year: 2021, issue: 'Pression Pneus Basse', distance: '5.1 km', urgency: 'Basse', reportId: 'rep_889', notes: '', time: 'Il y a 1h', price: '50€' },
      { id: 3, car: 'Citroën C3', year: 2018, issue: 'Filtre à Particules (P2002)', distance: '1.2 km', urgency: 'Moyenne', reportId: 'rep_902', notes: 'Mode dégradé activé sur autoroute.', time: 'Il y a 3h', price: '300€ - 500€' },
      { id: 4, car: 'Volkswagen Golf 7', year: 2017, issue: 'Usure Plaquettes', distance: '8.4 km', urgency: 'Moyenne', reportId: 'rep_404', notes: 'Bruit métallique au freinage.', time: 'Il y a 1j', price: '120€ - 180€' },
   ];

   const renderUrgencyBadge = (urgency: string) => {
      switch (urgency) {
         case 'Haute':
            return <span className="bg-red-500/20 text-red-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1"><AlertCircle size={12} /> Urgent</span>;
         case 'Moyenne':
            return <span className="bg-orange-500/20 text-orange-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Modéré</span>;
         default:
            return <span className="bg-green-500/20 text-green-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Mineur</span>;
      }
   };

   const NavItem = ({ id, icon: Icon, label, alertCount = 0 }) => (
      <button
         onClick={() => setActiveView(id)}
         className={`relative flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all duration-300 ${activeView === id
            ? 'text-brand-primary border-b-2 border-brand-primary'
            : 'text-gray-500 hover:text-brand-dark'
            }`}
      >
         <Icon size={18} />
         <span className="hidden md:block">{label}</span>
         {alertCount > 0 && (
            <span className="absolute top-2 right-2 md:relative md:top-auto md:right-auto bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
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
               <NavItem id="leads" icon={Users} label="Demandes de Devis" alertCount={3} />
               <NavItem id="stats" icon={TrendingUp} label="Mes Statistiques" />
               <NavItem id="schedule" icon={CalendarIcon} label="Disponibilités & Équipe" />
               <NavItem id="settings" icon={Settings} label="Configuration" />
            </nav>
            <div className="hidden md:flex items-center gap-4 py-2 border-l border-gray-100 pl-6">
               <div className="text-right">
                  <p className="font-bold text-sm text-brand-dark">Garage MecaExpert</p>
                  <p className="text-xs text-green-500 font-bold flex items-center justify-end gap-1"><span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></span> En ligne</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
                  M
               </div>
            </div>
         </div>

         {/* Main Content Area */}
         <main className="flex-1 w-full max-w-7xl mx-auto relative lg:px-4">

            {/* Dynamic Header */}
            <header className="bg-white border-b border-gray-200/60 sticky top-0 z-10 backdrop-blur-xl bg-white/80">
               <div className="px-8 py-4 flex justify-between items-center max-w-7xl mx-auto">
                  <div>
                     <h1 className="text-2xl font-display font-bold text-brand-dark">
                        {activeView === 'leads' && "Nouvelles Opportunités"}
                        {activeView === 'stats' && "Tableau de Bord"}
                        {activeView === 'schedule' && "Planning Atelier"}
                        {activeView === 'settings' && "Configuration Garage"}
                     </h1>
                     <p className="text-gray-500 text-sm mt-1">
                        {activeView === 'leads' && "Répondez rapidement pour maximiser vos conversions."}
                        {activeView === 'stats' && "Performances de votre garage sur les 30 derniers jours."}
                     </p>
                  </div>

                  <div className="flex items-center gap-4">
                     <div className="hidden md:flex bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-600 items-center gap-2 border border-gray-200">
                        <Search size={16} />
                        <input type="text" placeholder="Chercher un rapport (P0...)" className="bg-transparent outline-none w-48" />
                     </div>
                     <button className="bg-brand-primary/10 text-brand-primary p-2 rounded-full hover:bg-brand-primary/20 transition relative">
                        <AlertCircle size={20} />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                     </button>
                  </div>
               </div>
            </header>

            <div className="p-8 max-w-7xl mx-auto">
               {/* VIEW: LEADS MANAGER */}
               {activeView === 'leads' && (
                  <div className="animate-fade-in-up">
                     {/* Quick Filters */}
                     <div className="flex flex-wrap items-center gap-2 mb-6">
                        <button className="px-4 py-2 bg-brand-dark text-white text-sm font-bold rounded-full shadow-md">Toutes (4)</button>
                        <button className="px-4 py-2 bg-white text-brand-dark border border-gray-200 hover:border-brand-primary text-sm font-bold rounded-full shadow-sm transition flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-red-500"></span> Urgentes
                        </button>
                        <button className="px-4 py-2 bg-white text-brand-dark border border-gray-200 hover:border-brand-primary text-sm font-bold rounded-full shadow-sm transition flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-green-500"></span> Devis envoyés
                        </button>
                        <button className="ml-auto flex items-center gap-2 text-gray-500 hover:text-brand-dark px-2">
                           <Filter size={16} /> Filtres avancés
                        </button>
                     </div>

                     {/* Enhanced Leads Grid (Card style) */}
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {leads.map(lead => (
                           <div key={lead.id} className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden hover:shadow-xl hover:border-brand-primary/30 transition-all duration-300 group flex flex-col">
                              {/* Card Header (Top Bar) */}
                              <div className={`h-1.5 w-full ${lead.urgency === 'Haute' ? 'bg-gradient-to-r from-red-500 to-orange-500' : lead.urgency === 'Moyenne' ? 'bg-gradient-to-r from-orange-400 to-yellow-400' : 'bg-gradient-to-r from-green-400 to-emerald-400'}`}></div>

                              <div className="p-6 flex-1 flex flex-col">
                                 <div className="flex justify-between items-start mb-4">
                                    <div>
                                       <div className="flex items-center gap-2 mb-1">
                                          {renderUrgencyBadge(lead.urgency)}
                                          <span className="text-gray-400 text-xs flex items-center gap-1"><Clock size={12} /> {lead.time}</span>
                                       </div>
                                       <h3 className="font-display font-bold text-xl text-brand-dark">{lead.car} <span className="text-gray-400 text-base font-normal">({lead.year})</span></h3>
                                    </div>
                                    <div className="text-right">
                                       <span className="block text-xs text-gray-500 mb-1">Estimation AutoScanR</span>
                                       <span className="font-bold text-brand-dark bg-gray-100 px-3 py-1 rounded-lg">{lead.price}</span>
                                    </div>
                                 </div>

                                 {/* Diagnostic Box */}
                                 <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-6 mt-2 relative overflow-hidden">
                                    <Activity size={80} className="absolute -bottom-4 -right-4 text-blue-500/5 rotate-12" />
                                    <h4 className="font-bold text-brand-dark flex items-center gap-2 mb-2 relative z-10">
                                       <AlertCircle size={16} className="text-brand-primary" /> {lead.issue}
                                    </h4>
                                    {lead.notes ? (
                                       <p className="text-sm text-gray-600 relative z-10 italic border-l-2 border-brand-primary/30 pl-2">"{lead.notes}"</p>
                                    ) : (
                                       <p className="text-sm text-gray-400 relative z-10">Aucun symptôme déclaré par le conducteur.</p>
                                    )}
                                    <div className="mt-4 flex items-center gap-4 text-xs font-bold text-blue-600 relative z-10">
                                       <span className="cursor-pointer hover:underline">Voir rapport complet (# {lead.reportId})</span>
                                       <span className="cursor-pointer hover:underline text-gray-400 flex items-center gap-1"><Search size={12} /> Historique</span>
                                    </div>
                                 </div>

                                 {/* Card Footer (Actions) */}
                                 <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gray-100">
                                    <button className="flex-1 bg-brand-dark text-white px-4 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-black transition-transform hover:-translate-y-0.5 active:translate-y-0">
                                       Proposer ce devis
                                    </button>
                                    <button className="bg-brand-beige/50 text-brand-dark px-4 py-3 rounded-xl text-sm font-bold shadow-sm border border-brand-beige hover:bg-brand-beige transition">
                                       Ajuster l'offre
                                    </button>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {/* VIEW: STATISTIQUES (KPIs) */}
               {activeView === 'stats' && (
                  <div className="animate-fade-in-up space-y-8">
                     {/* Top KPI row */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                           <div className="flex items-center gap-4 mb-4">
                              <div className="bg-green-100 text-green-600 p-3 rounded-xl"><DollarSign size={24} /></div>
                              <div>
                                 <p className="text-sm text-gray-500 font-medium">Chiffre d'Affaires (Mois)</p>
                                 <h3 className="font-display text-3xl font-bold text-brand-dark">4 250 €</h3>
                              </div>
                           </div>
                           <div className="flex items-center gap-2 text-sm text-green-600 font-bold bg-green-50 w-fit px-2 py-1 rounded">
                              <TrendingUp size={16} /> +12.5% vs mois dernier
                           </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                           <div className="flex items-center gap-4 mb-4">
                              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl"><Users size={24} /></div>
                              <div>
                                 <p className="text-sm text-gray-500 font-medium">Nouveaux Clients</p>
                                 <h3 className="font-display text-3xl font-bold text-brand-dark">18</h3>
                              </div>
                           </div>
                           <div className="flex items-center gap-2 text-sm text-blue-600 font-bold bg-blue-50 w-fit px-2 py-1 rounded">
                              <TrendingUp size={16} /> +3 cette semaine
                           </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 relative overflow-hidden">
                           {/* CSS-based pseudo gauge chart */}
                           <div className="absolute right-0 top-0 w-32 h-32 bg-brand-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                           <div className="absolute right-8 top-1/2 w-16 h-16 rounded-full border-4 border-gray-100 border-t-brand-primary border-r-brand-primary -translate-y-1/2 rotate-45"></div>
                           <div className="absolute right-8 top-1/2 w-16 h-16 flex items-center justify-center -translate-y-1/2 font-bold text-brand-dark">65%</div>

                           <div className="flex items-center gap-4 mb-4 relative z-10">
                              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl"><CheckCircle2 size={24} /></div>
                              <div>
                                 <p className="text-sm text-gray-500 font-medium">Taux de Conversion</p>
                                 <h3 className="font-display text-2xl font-bold text-brand-dark">AutoScanR</h3>
                              </div>
                           </div>
                           <p className="text-sm text-gray-500 mt-2 relative z-10">Sur 28 devis envoyés, 18 ont été validés.</p>
                        </div>
                     </div>

                     {/* Mock Graph Section */}
                     <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
                        <h3 className="font-display font-bold text-xl text-brand-dark mb-6">Évolution des revenus via AutoScanR</h3>
                        <div className="h-64 w-full flex items-end gap-2 md:gap-4 relative pt-10">
                           {/* Y-axis labels */}
                           <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 pb-8">
                              <span>5k€</span>
                              <span>2.5k€</span>
                              <span>0€</span>
                           </div>
                           <div className="ml-8 md:ml-12 w-full h-full border-b border-gray-200 flex items-end justify-between px-2 md:px-6 relative pb-1">
                              {/* CSS Bars for chart */}
                              <div className="w-1/12 bg-gray-200 hover:bg-brand-primary/50 transition-colors h-[40%] rounded-t-sm relative group cursor-pointer">
                                 <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">1.8k€</span>
                                 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium">Juil</span>
                              </div>
                              <div className="w-1/12 bg-gray-200 hover:bg-brand-primary/50 transition-colors h-[55%] rounded-t-sm relative group cursor-pointer">
                                 <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">2.4k€</span>
                                 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium">Août</span>
                              </div>
                              <div className="w-1/12 bg-brand-beige hover:bg-brand-primary/70 transition-colors h-[45%] rounded-t-sm relative group cursor-pointer">
                                 <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">2.1k€</span>
                                 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium">Sept</span>
                              </div>
                              <div className="w-1/12 bg-brand-primary/60 hover:bg-brand-primary transition-colors h-[75%] rounded-t-sm relative group cursor-pointer">
                                 <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">3.6k€</span>
                                 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-brand-dark">Oct</span>
                              </div>
                              <div className="w-1/12 bg-gradient-to-t from-brand-primary to-blue-500 hover:opacity-80 transition-opacity h-[90%] rounded-t-sm shadow-[0_0_15px_rgba(23,43,77,0.3)] relative group cursor-pointer">
                                 <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition">4.2k€</span>
                                 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-brand-primary">Nov (En cours)</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* VIEW: SCHEDULE & SETTINGS PLACEHOLDERS */}
               {activeView === 'schedule' && (
                  <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
                     <div className="bg-white p-12 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 max-w-2xl text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary to-blue-500"></div>
                        <div className="w-24 h-24 bg-gradient-to-br from-brand-beige to-white rounded-3xl flex items-center justify-center mx-auto mb-8 text-brand-primary shadow-lg border border-brand-beige/50">
                           <CalendarIcon size={48} strokeWidth={1.5} />
                        </div>
                        <h2 className="font-display text-3xl font-bold text-brand-dark mb-4">Planning Intelligent (Bientôt)</h2>
                        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                           Connectez votre logiciel de gestion (DMS) pour permettre aux automobilistes AutoScanR de sélectionner une date parmi vos créneaux réels disponibles.
                        </p>
                        <button className="bg-[#0c142b] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-black transition-transform hover:-translate-y-1 shadow-xl shadow-brand-dark/20 w-full md:w-auto">
                           Demander l'accès Beta
                        </button>
                     </div>
                  </div>
               )}

               {activeView === 'settings' && (
                  <div className="text-center py-20 text-gray-500">
                     Paramètres du garage (Zone de chalandise, Taux horaire de base, Horaires d'ouverture...)
                  </div>
               )}

            </div>
         </main>
      </div>
   );
};

export default GarageDashboard;