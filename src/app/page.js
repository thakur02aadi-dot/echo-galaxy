"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { parseYouTubeHistory, getTopChannels, filterData, downloadGalaxySnapshot } from "@/utils/youtubeParser";
import { 
  Upload, Zap, X, ChevronRight, Download, Settings, FileJson, 
  Search, HelpCircle, Camera, Users, ShieldCheck, Globe, Cpu, Sparkles, ExternalLink
} from "lucide-react";

const Galaxy = dynamic(() => import("@/components/Galaxy"), { 
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-zinc-900/40 animate-pulse rounded-[3rem] border border-white/5 flex items-center justify-center text-zinc-600 font-mono text-[10px] tracking-[0.5em] uppercase">Initializing Neural Core...</div>
});

export default function Home() {
  const [rawData, setRawData] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("home"); 
  const [activePersona, setActivePersona] = useState(null);

  const runPersonaSim = (name) => {
    setActiveTab("home");
    setActivePersona(name);
    const dataMap = {
      "Elon Musk": ["SpaceX", "Tesla", "Lex Fridman", "Engineering Explained"],
      "Narendra Modi": ["Yoga with Modi", "Sansad TV", "MyGov India"],
      "Donald Trump": ["Fox News", "Golf Digest", "Rally Archive"],
      "Rahul Gandhi": ["INC India", "Bharat Jodo", "Economy Insights"],
      "Tony Stark": ["MIT Tech", "Robotics Today", "AC/DC Official"]
    };
    const channels = dataMap[name] || ["YouTube Global"];
    const mockData = Array.from({ length: 2000 }).map((_, i) => ({
      title: `${name.split(' ')[0]} Node #${i}`,
      subtitles: [{ name: channels[Math.floor(Math.random() * channels.length)] }],
      titleUrl: "#"
    }));
    setRawData(parseYouTubeHistory(mockData));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setRawData(parseYouTubeHistory(json));
        setActiveTab("home");
        setActivePersona(null);
      } catch (err) { alert("Format Error: Ensure you upload 'watch-history.json'."); }
    };
    reader.readAsText(file);
  };

  const displayData = useMemo(() => filterData(rawData, search), [rawData, search]);
  const topChannels = useMemo(() => getTopChannels(rawData), [rawData]);

  return (
    <main className="min-h-screen bg-[#020205] text-white p-4 md:p-6 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* --- HUD NAVIGATION --- */}
        <nav className="sticky top-4 z-50 flex justify-between items-center bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-4 md:px-8 rounded-[2rem] shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => {setRawData([]); setActiveTab("home");}}>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:rotate-12 transition-transform">
                <Zap fill="white" size={18} />
              </div>
              <h1 className="text-lg font-black italic uppercase tracking-tighter">Echo.Galaxy</h1>
            </div>

            {!rawData.length && (
              <div className="hidden md:flex gap-6 ml-6 border-l border-white/10 pl-6">
                <button onClick={() => setActiveTab("about")} className={`text-[10px] font-bold uppercase tracking-widest transition ${activeTab === 'about' ? 'text-blue-500' : 'text-zinc-400'}`}>Mission</button>
                <button onClick={() => setActiveTab("guide")} className={`text-[10px] font-bold uppercase tracking-widest transition ${activeTab === 'guide' ? 'text-blue-500' : 'text-zinc-400'}`}>Data Retrieval</button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {rawData.length > 0 && (
              <div className="flex gap-2">
                <button onClick={downloadGalaxySnapshot} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl">
                  <Camera size={14} /> Snapshot
                </button>
                <button onClick={() => {setRawData([]); setActiveTab("home"); setSearch("");}} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20">
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* --- LOGIC ROUTER --- */}
        {rawData.length > 0 ? (
          /* STATE 1: GALAXY VIEW */
          <div className="grid grid-cols-12 gap-6 animate-in fade-in duration-1000">
            <div className="col-span-12 lg:col-span-9 relative rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
              <div className="absolute top-8 left-8 right-8 z-10 flex justify-center pointer-events-none">
                <div className="pointer-events-auto w-full max-w-xl">
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input type="text" placeholder={`Mapping ${activePersona || 'Neural'} Data...`} className="w-full bg-black/60 backdrop-blur-3xl border border-white/10 rounded-3xl py-5 pl-16 pr-8 text-sm outline-none focus:border-blue-500/50 transition-all shadow-2xl" onChange={(e) => setSearch(e.target.value)} />
                  </div>
                </div>
              </div>
              <Galaxy data={displayData} onSelect={setSelected} />
              {selected && (
                <div className="absolute bottom-8 left-8 right-8 bg-zinc-950/90 border border-white/10 p-10 rounded-[3rem] flex items-center justify-between shadow-2xl animate-in slide-in-from-bottom-10">
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-inner"><Zap className="text-blue-500" /></div>
                    <div>
                      <span className="text-[11px] font-black text-blue-500 uppercase tracking-widest mb-1 block italic">{selected.channel}</span>
                      <h4 className="text-2xl font-medium italic">{selected.title}</h4>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><X size={24}/></button>
                </div>
              )}
            </div>
            <aside className="col-span-12 lg:col-span-3 space-y-6">
              <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[3rem] backdrop-blur-xl">
                <h3 className="text-[11px] font-black text-zinc-600 uppercase tracking-widest mb-10 text-center">Neural Influence</h3>
                <div className="space-y-8">
                  {topChannels.map((ch, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between text-[11px] font-bold text-zinc-400 italic"><span>{ch.name}</span><span className="text-blue-500">{ch.count}</span></div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-blue-600" style={{ width: `${(ch.count / topChannels[0].count) * 100}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-blue-600/5 border border-blue-500/10 p-8 rounded-[3rem] text-center">
                 <p className="text-[10px] font-black text-blue-500 uppercase mb-2 tracking-widest">Global Nodes</p>
                 <p className="text-5xl font-black italic tracking-tighter">{rawData.length.toLocaleString()}</p>
              </div>
            </aside>
          </div>
        ) : activeTab === "guide" ? (
          /* STATE 2: ENHANCED GUIDE PAGE WITH DIRECT LINKS */
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 py-10 space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Extraction Protocol</h2>
              <p className="text-zinc-500 font-light text-lg">Your data never leaves your machine. Follow the steps below to fetch your archive.</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { title: "ACCESS", icon: <Globe />, desc: "Login to Google Takeout and click 'Deselect All'.", action: "Open Takeout", link: "https://takeout.google.com" },
                { title: "FILTER", icon: <Download />, desc: "Select ONLY 'YouTube and YouTube Music'.", action: "Select Data", link: "https://takeout.google.com/settings/takeout/custom/youtube" },
                { title: "CONFIG", icon: <Settings />, desc: "Set 'History' format to JSON (Required).", action: "Help with Formats", link: "https://support.google.com/accounts/answer/3024190" },
                { title: "FINALIZE", icon: <FileJson />, desc: "Extract the ZIP and find 'watch-history.json'.", action: "I'm Ready", link: null }
              ].map((s, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/10 p-10 rounded-[3rem] flex flex-col items-center text-center space-y-6 group hover:bg-white/[0.05] transition-all">
                  <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">{s.icon}</div>
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] italic">{s.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed font-light">{s.desc}</p>
                  </div>
                  {s.link ? (
                    <a href={s.link} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all">
                      {s.action} <ExternalLink size={12} />
                    </a>
                  ) : (
                    <button onClick={() => setActiveTab("home")} className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
                      {s.action} <ChevronRight size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="max-w-xl mx-auto p-8 bg-blue-600/5 border border-blue-500/20 rounded-[2.5rem] flex items-center gap-6">
                <ShieldCheck className="text-blue-500 shrink-0" size={32} />
                <p className="text-[11px] text-zinc-400 leading-relaxed uppercase tracking-wider font-bold italic">Security Note: We utilize Web Workers to process your file locally. Zero data is transmitted to external servers during mapping.</p>
            </div>
          </div>
        ) : activeTab === "about" ? (
          /* STATE 3: ABOUT PAGE */
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 py-20 text-center max-w-4xl mx-auto space-y-10">
            <h2 className="text-8xl font-black italic tracking-tighter uppercase leading-none">The Digital <br/> Universe.</h2>
            <p className="text-2xl text-zinc-500 font-light leading-relaxed italic max-w-2xl mx-auto">Echo Galaxy is a high-fidelity visualizer that turns your YouTube metadata into a navigable star-field. It allows you to see the gravity of your own habits.</p>
            <div className="grid md:grid-cols-3 gap-4 pt-10">
               <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-2">
                  <p className="text-blue-500 font-black text-xs uppercase italic tracking-widest">Privacy</p>
                  <p className="text-[10px] text-zinc-500">100% Client-side processing.</p>
               </div>
               <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-2">
                  <p className="text-blue-500 font-black text-xs uppercase italic tracking-widest">Performance</p>
                  <p className="text-[10px] text-zinc-500">GPU Accelerated Three.js Engine.</p>
               </div>
               <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-2">
                  <p className="text-blue-500 font-black text-xs uppercase italic tracking-widest">Insight</p>
                  <p className="text-[10px] text-zinc-500">Discover hidden algorithm biases.</p>
               </div>
            </div>
            <button onClick={() => setActiveTab("home")} className="px-10 py-4 bg-white text-black rounded-full font-black text-xs uppercase italic hover:scale-105 transition-transform">Return to Deck</button>
          </div>
        ) : (
          /* STATE 4: LANDING PAGE */
          <div className="grid lg:grid-cols-2 gap-20 py-20 items-center animate-in fade-in duration-700">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-[120px] font-black tracking-tighter leading-[0.75] italic uppercase">Echo <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Galaxy</span></h2>
                <p className="text-zinc-500 text-xl font-light max-w-lg leading-relaxed italic">Visualize your algorithm. Your history, reimagined as a 3D digital constellation.</p>
              </div>
              <div className="flex flex-col gap-6">
                <label className="bg-white text-black px-12 py-7 rounded-[2.5rem] font-black flex items-center gap-4 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-2xl uppercase text-sm italic w-fit">
                  <Upload size={20} /> Load Neural History (.json)
                  <input type="file" className="hidden" onChange={handleFile} accept=".json" />
                </label>
                <button onClick={() => setActiveTab("guide")} className="flex items-center gap-3 text-zinc-500 hover:text-white transition-all font-black text-[11px] uppercase tracking-widest pl-4">
                  <HelpCircle size={18} className="text-blue-500" /> Start Extraction Guide
                </button>
              </div>
              <div className="space-y-6 pt-10 border-t border-white/5">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-2"> <Users size={14}/> Neural Archetypes</p>
                <div className="flex flex-wrap gap-2">
                  {["Elon Musk", "Narendra Modi", "Donald Trump", "Tony Stark"].map((name) => (
                    <button key={name} onClick={() => runPersonaSim(name)} className="px-6 py-3 bg-zinc-900 border border-white/5 rounded-2xl text-[10px] font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-widest">{name}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative aspect-square flex items-center justify-center">
               <div className="absolute inset-0 bg-blue-600/5 blur-[150px] rounded-full animate-pulse" />
               <div className="w-full aspect-square bg-white/[0.02] border border-white/5 rounded-[6rem] flex items-center justify-center relative overflow-hidden backdrop-blur-sm group">
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:60px_60px] opacity-[0.03]" />
                  <Sparkles size={140} className="text-blue-500/10 group-hover:text-blue-500/40 transition-all duration-1000 group-hover:scale-110" />
                  <div className="absolute bottom-10 left-10 right-10 p-6 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-md">
                     <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-1">System Status</p>
                     <p className="text-xl font-mono text-blue-500">READY FOR UPLOAD</p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}