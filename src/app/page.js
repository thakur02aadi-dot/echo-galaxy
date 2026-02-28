"use client";
import { useState } from "react";
import { parseYouTubeHistory } from "@/utils/youtubeParser";
import Galaxy from "@/components/Galaxy";
import { Upload, Database } from "lucide-react";

export default function Home() {
  const [data, setData] = useState([]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const json = JSON.parse(event.target.result);
      setData(parseYouTubeHistory(json));
    };
    reader.readAsText(file);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        <section className="space-y-4">
          <h1 className="text-6xl font-black tracking-tighter italic bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
            ECHO GALAXY
          </h1>
          <p className="text-zinc-400 text-xl max-w-xl font-light">
            An algorithmic visualization of your YouTube "Echo Chamber." 
            Upload your data to map your digital bias in 3D.
          </p>
        </section>

        {!data.length ? (
          <div className="group relative border-2 border-dashed border-zinc-800 rounded-3xl p-24 flex flex-col items-center hover:border-blue-500/50 transition-all bg-zinc-900/20">
            <Upload className="w-12 h-12 mb-6 text-zinc-600 group-hover:text-blue-400 transition-colors" />
            <label className="cursor-pointer bg-white text-black px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform active:scale-95">
              Upload watch-history.json
              <input type="file" className="hidden" onChange={handleFile} accept=".json" />
            </label>
            <p className="mt-6 text-zinc-500 text-sm">Find this in your Google Takeout export.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Galaxy data={data} />
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 flex items-center gap-4">
                <Database className="text-blue-500" />
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold">Videos Analyzed</p>
                  <p className="text-2xl font-mono">{data.length.toLocaleString()}</p>
                </div>
              </div>
              <button onClick={() => setData([])} className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 text-zinc-400 hover:text-white transition">
                Reset Galaxy
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}