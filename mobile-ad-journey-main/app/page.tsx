"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Shield, ShieldAlert, Activity, GitCommit, Download, Info, Smartphone, EyeOff, Globe, BookOpen } from 'lucide-react';

export default function MobileAdIdJourney() {
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Synthetic MAID Graph Data
  const journeyData = [
    { time: '08:00', dataBrokers: trackingEnabled ? 2 : 0, adNetworks: 1 },
    { time: '10:00', dataBrokers: trackingEnabled ? 5 : 0, adNetworks: 3 },
    { time: '12:00', dataBrokers: trackingEnabled ? 12 : 0, adNetworks: 7 },
    { time: '14:00', dataBrokers: trackingEnabled ? 18 : 0, adNetworks: 10 },
    { time: '16:00', dataBrokers: trackingEnabled ? 24 : 0, adNetworks: 14 },
    { time: '18:00', dataBrokers: trackingEnabled ? 35 : 0, adNetworks: 20 },
  ];

  // Primary Data Mock: CFPB Complaints Schema
  const cfpbData = [
    { date: "2026-04-28", company: "EXPERIAN INFO SOLUTIONS", issue: "Improper use of report", desc: "Company shared mobile location/transaction data..." },
    { date: "2026-04-27", company: "EQUIFAX, INC.", issue: "Data broker identity merge", desc: "Broker merged incorrect identity based on device tracking..." },
    { date: "2026-04-26", company: "TRANSUNION HOLDINGS", issue: "Investigation problem", desc: "Refusal to delete mobile ad ID associations from file." }
  ];

  // Primary Data Mock: GDELT Events Schema
  const gdeltData = [
    { date: "2026-04-28", domain: "example.news", title: "Regulators Probe Data Brokers Over Mobile Tracking", theme: "LEGISLATION" },
    { date: "2026-04-27", domain: "tech.example", title: "EU Considers Total Ban on Mobile Advertising IDs", theme: "CYBER_SECURITY" },
    { date: "2026-04-26", domain: "finance.example", title: "Ad-Tech Stocks Plummet as OS Strengthens Tracking Blocks", theme: "ECON_STOCKMARKET" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
      {/* Header */}
      <header className="mb-8 border-b border-slate-800 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Smartphone className="text-blue-500" />
              Mobile Advertising ID Journey
            </h1>
            <p className="text-slate-400 mt-2">Real Rails Intelligence Library • Distribution & Demand  by solaman</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Right Sidebar: Context & Controls */}
        <div className="space-y-6 lg:col-span-1 lg:order-last">
          {/* Download Action */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <a href="/mobile_ad_id_journey_sample.csv" download className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-md text-sm font-semibold transition-colors shadow-lg shadow-blue-900/20">
              <Download size={18} />
              Download Full Synthetic Dataset
            </a>
          </div>

          {/* Why This Matters Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <Info size={20} className="text-blue-400" /> Why This Matters
            </h2>
            <div className="space-y-3 text-sm text-slate-300">
              <p><strong>For Everyday Viewers:</strong> Your Mobile Ad ID (MAID) is a silent tracker broadcasting your habits.</p>
              <p><strong>For Builders:</strong> Relying on MAIDs creates systemic fragility as platform privacy protections scale.</p>
              <p><strong>For Allocators:</strong> Ad-tech companies dependent on unrestricted MAID access face regulatory risk.</p>
            </div>
          </div>

          {/* Simulation Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 border-l-4 border-l-blue-500">
            <h2 className="text-xl font-semibold text-white mb-3">Privacy Controls Simulation</h2>
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded border border-slate-800">
              <div className="flex items-center gap-2">
                {trackingEnabled ? <Activity className="text-green-400" size={18} /> : <EyeOff className="text-red-400" size={18} />}
                <span className="text-sm font-medium">OS Tracking Permissions</span>
              </div>
              <button
                onClick={() => setTrackingEnabled(!trackingEnabled)}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${trackingEnabled ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
              >
                {trackingEnabled ? 'Revoke Access' : 'Allow Access'}
              </button>
            </div>
            {!trackingEnabled && (
              <div className="mt-3 flex items-start gap-2 text-xs text-amber-400 bg-amber-400/10 p-2 rounded">
                <ShieldAlert size={14} className="mt-0.5 shrink-0" />
                <p>Tracking revoked. MAID zeroed out. Downstream data brokers lose identity resolution.</p>
              </div>
            )}
          </div>

          {/* CFPB Primary Data Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-400" /> CFPB Complaint Feed
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {cfpbData.map((item, i) => (
                <div key={i} className="text-xs">
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span className="font-semibold text-indigo-300">{item.company}</span>
                    <span>{item.date}</span>
                  </div>
                  <p className="text-white font-medium mb-1">{item.issue}</p>
                  <p className="text-slate-400 line-clamp-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Column: Visualizations & Event Feed */}
        <div className="lg:col-span-2 space-y-6 lg:order-first">
          {/* Main Graph */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">MAID Propagation Journey</h2>
            </div>
            <div className="h-64 w-full">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={journeyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                    <Line type="monotone" dataKey="dataBrokers" name="Exposed Data Brokers" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="adNetworks" name="Ad Networks" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Synthetic Event Stream */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-sm font-semibold text-white">Synthetic Ad Event Stream</h2>
                <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">MOCK</span>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { app: 'WeatherApp', event: 'location_ping', chain: 'App → AdNet_A → DSP_X' },
                  { app: 'Puzzle Game', event: 'ad_bid_request', chain: 'App → AdNet_B → SSP_Y' }
                ].map((row, i) => (
                  <div key={i} className="text-xs bg-slate-950 p-2 rounded border border-slate-800">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-white">{row.app}</span>
                      <span className="text-slate-400">{row.event}</span>
                    </div>
                    <div className="text-slate-500 font-mono mt-1 text-[10px]">{row.chain}</div>
                    <div className="mt-2">
                      {trackingEnabled ? (
                        <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">MAID Exposed</span>
                      ) : (
                        <span className="text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">MAID Nullified</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GDELT Primary Data Feed */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Globe size={16} className="text-emerald-400" /> GDELT Global Events
                </h2>
              </div>
              <div className="p-4 space-y-4">
                {gdeltData.map((item, i) => (
                  <div key={i} className="text-xs border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>{item.domain}</span>
                      <span>{item.date}</span>
                    </div>
                    <p className="text-white font-medium leading-relaxed">{item.title}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-slate-800 text-slate-300 rounded-sm text-[10px] font-mono">
                      {item.theme}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}