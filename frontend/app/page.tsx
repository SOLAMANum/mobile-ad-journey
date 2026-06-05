"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, ScatterChart, Scatter, ZAxis
} from 'recharts';
import {
  Shield, ShieldAlert, Activity, GitCommit, Download, Info, Smartphone,
  EyeOff, Globe, BookOpen, X, ChevronRight, AlertTriangle, Database,
  Filter, Radio, Zap, Lock
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface JourneyPoint { time: string; dataBrokers: number; adNetworks: number; }
interface CFPBRecord { date: string; company: string; issue: string; desc: string; }
interface GDELTRecord { date: string; domain: string; title: string; theme: string; }
interface AdEvent {
  timestamp: string; date: string; maid: string; originalMaid: string;
  maidExposed: boolean; app: string; eventType: string; chain: string;
  owner: string; risk: 'High' | 'Medium' | 'Low'; locationPermission: boolean;
  attOptIn: boolean; source: string;
}
interface OwnerStat { owner: string; count: number; percentage: number; }
interface EventsResponse {
  events: AdEvent[];
  filters: { owners: string[]; risks: string[]; dates: string[] };
  stats: { ownerStats: OwnerStat[]; totalEvents: number; highRiskCount: number; mediumRiskCount: number; lowRiskCount: number };
}

// ─── Theme Helpers ────────────────────────────────────────────────────────────
const riskColor: Record<string, string> = {
  High: 'text-red-400',
  Medium: 'text-amber-400',
  Low: 'text-emerald-400',
};
const riskBg: Record<string, string> = {
  High: 'bg-red-500/10 border-red-500/20',
  Medium: 'bg-amber-500/10 border-amber-500/20',
  Low: 'bg-emerald-500/10 border-emerald-500/20',
};

const THEME_COLORS = {
  THEME_ABBREVIATIONS: {
    ECON_TAXATION: 'TAXATION',
    LEGISLATION: 'LEGISLATION',
    CYBER_ATTACK: 'CYBER ATTACK',
    CRISISLEX_CRISISLEXREC: 'CRISIS REC',
    INFO_HOAX: 'INFO HOAX',
    CYBER_SECURITY: 'CYBER SEC',
    ECON_STOCKMARKET: 'STOCKS',
    TAX_FNCACT: 'FIN ACT',
  } as Record<string, string>,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function RiskBadge({ risk }: { risk: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${riskBg[risk]} ${riskColor[risk]}`}>
      {risk === 'High' && <AlertTriangle size={10} />}
      {risk === 'Low' && <Shield size={10} />}
      {risk} Risk
    </span>
  );
}

function MaidPill({ maid, exposed }: { maid: string; exposed: boolean }) {
  return (
    <div className={`mt-1.5 flex items-center gap-2 text-[10px] font-mono rounded px-2 py-1 border ${exposed
      ? 'bg-red-500/10 border-red-500/30 text-red-300'
      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'}`}>
      {exposed ? <Radio size={10} className="shrink-0 animate-pulse" /> : <Lock size={10} className="shrink-0" />}
      <span className="truncate">{maid}</span>
    </div>
  );
}

// ─── Developer Signature Popover ──────────────────────────────────────────────
function DevSignaturePopover({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-12 right-4 z-50 w-72 rounded-xl border border-purple-500/20 shadow-2xl shadow-purple-900/30"
        style={{ background: 'rgba(10, 6, 22, 0.92)', backdropFilter: 'blur(20px)' }}>
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-white/80 uppercase tracking-widest">Infocreon Signature</span>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {[
            { label: 'Architect', value: 'Solaman' },
            { label: 'Batch', value: 'Batch 2 Interns' },
            { label: 'Rail', value: 'Mobile Ad Intelligence' },
            { label: 'Stack', value: 'Next.js · FastAPI · Tailwind CSS · Recharts' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] text-purple-400 uppercase tracking-widest mb-0.5">{label}</p>
              <p className="text-sm text-white/90 font-medium">{value}</p>
            </div>
          ))}
        </div>
        <div className="px-4 pb-4">
          <div className="text-[10px] text-white/20 text-center font-mono">Real Rails Intelligence Library</div>
        </div>
      </div>
    </>
  );
}

// ─── Slide-over Intelligence Panel ────────────────────────────────────────────
function IntelligencePanel({
  event, cfpb, gdelt, stats, trackingEnabled, onClose
}: {
  event: AdEvent | null;
  cfpb: CFPBRecord[];
  gdelt: GDELTRecord[];
  stats: EventsResponse['stats'] | null;
  trackingEnabled: boolean;
  onClose: () => void;
}) {
  const visible = event !== null;

  return (
    <>
      {/* Backdrop */}
      {visible && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full z-40 w-full max-w-md flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${visible ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background: 'rgba(7, 4, 18, 0.97)', borderLeft: '1px solid rgba(168, 85, 247, 0.12)' }}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            <span className="text-sm font-semibold text-white/90 tracking-wide">Intelligence Panel</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all duration-200"
          >
            <X size={15} />
          </button>
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Selected Event */}
          {event && (
            <section>
              <p className="text-[10px] uppercase tracking-widest text-purple-400 mb-2.5 flex items-center gap-1.5">
                <ChevronRight size={10} />Selected Event
              </p>
              <div className="rounded-xl border border-white/6 p-4 space-y-3"
                style={{ background: 'rgba(168, 85, 247, 0.04)' }}>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-white">{event.app}</span>
                  <RiskBadge risk={event.risk} />
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  {[
                    ['Event', event.eventType.replace('_', ' ')],
                    ['Date', event.date],
                    ['Owner', event.owner],
                    ['Location', event.locationPermission ? 'Granted' : 'Denied'],
                    ['ATT Opt-In', event.attOptIn ? 'Yes' : 'No'],
                    ['Source', 'Synthetic'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-white/35 uppercase tracking-wider text-[9px]">{k}</p>
                      <p className="text-white/80 font-medium capitalize mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/35 mb-1">Partner Chain</p>
                  <p className="text-[11px] font-mono text-indigo-300 leading-relaxed">{event.chain}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/35 mb-1">Mobile Ad ID (MAID)</p>
                  <MaidPill maid={event.maid} exposed={event.maidExposed} />
                </div>
              </div>
            </section>
          )}

          {/* Who Controls the Rail */}
          {stats && stats.ownerStats.length > 0 && (
            <section>
              <p className="text-[10px] uppercase tracking-widest text-purple-400 mb-2.5 flex items-center gap-1.5">
                <Database size={10} />Who Controls the Rail
              </p>
              <div className="space-y-2">
                {stats.ownerStats.slice(0, 6).map((s) => (
                  <div key={s.owner} className="rounded-lg border border-white/5 px-3 py-2.5"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-mono text-indigo-300 truncate mr-2">{s.owner}</span>
                      <span className="text-[11px] text-white/50 shrink-0">{s.count} events</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-700"
                        style={{ width: `${s.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CFPB Feed */}
          {cfpb.length > 0 && (
            <section>
              <p className="text-[10px] uppercase tracking-widest text-purple-400 mb-2.5 flex items-center gap-1.5">
                <BookOpen size={10} />CFPB Complaint Feed
              </p>
              <div className="space-y-3">
                {cfpb.map((item, i) => (
                  <div key={i} className="rounded-xl border border-white/5 p-3.5"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[11px] font-semibold text-indigo-300 leading-tight max-w-[65%]">{item.company}</span>
                      <span className="text-[9px] text-white/30 font-mono shrink-0">{item.date}</span>
                    </div>
                    <p className="text-[11px] font-medium text-white/80 mb-1">{item.issue}</p>
                    <p className="text-[10px] text-white/40 leading-relaxed line-clamp-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* GDELT Feed */}
          {gdelt.length > 0 && (
            <section>
              <p className="text-[10px] uppercase tracking-widest text-purple-400 mb-2.5 flex items-center gap-1.5">
                <Globe size={10} />GDELT Global Events
              </p>
              <div className="space-y-3">
                {gdelt.map((item, i) => (
                  <div key={i} className="rounded-xl border border-white/5 p-3.5"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="flex justify-between text-[9px] text-white/30 mb-1.5">
                      <span className="font-mono">{item.domain}</span>
                      <span>{item.date}</span>
                    </div>
                    <p className="text-[11px] text-white/80 font-medium leading-snug mb-2">{item.title}</p>
                    <span className="inline-block px-2 py-0.5 rounded bg-white/5 border border-white/8 text-[9px] font-mono text-purple-300">
                      {THEME_COLORS.THEME_ABBREVIATIONS[item.theme] || item.theme}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Panel Footer */}
        <div className="px-5 py-3 border-t border-white/5">
          <a
            href="/mobile_ad_id_journey_sample.csv"
            download
            className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold text-white/80 border border-purple-500/20 hover:border-purple-500/50 hover:text-white transition-all duration-200"
            style={{ background: 'rgba(168, 85, 247, 0.08)' }}
          >
            <Download size={14} />
            Download Full Dataset
          </a>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MobileAdIdJourney() {
  const [isMounted, setIsMounted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [trackingEnabled, setTrackingEnabled] = useState(true);

  // Data state
  const [journeyData, setJourneyData] = useState<JourneyPoint[]>([]);
  const [cfpbData, setCfpbData] = useState<CFPBRecord[]>([]);
  const [gdeltData, setGdeltData] = useState<GDELTRecord[]>([]);
  const [eventsData, setEventsData] = useState<EventsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Intelligence Panel state
  const [selectedEvent, setSelectedEvent] = useState<AdEvent | null>(null);

  // Filter state
  const [filterOwner, setFilterOwner] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  // Fetch CFPB + GDELT (static, once)
  useEffect(() => {
    setIsMounted(true);
    Promise.all([
      fetch('http://localhost:4000/api/cfpb').then(r => r.json()),
      fetch('http://localhost:4000/api/gdelt').then(r => r.json()),
    ]).then(([cfpb, gdelt]) => {
      setCfpbData(cfpb);
      setGdeltData(gdelt);
    }).catch(console.error);
  }, []);

  // Fetch Journey data when tracking toggles
  useEffect(() => {
    fetch(`http://localhost:4000/api/journey?trackingEnabled=${trackingEnabled}`)
      .then(r => r.json())
      .then(setJourneyData)
      .catch(console.error);
  }, [trackingEnabled]);

  // Fetch events / stats when filters or tracking changes
  const fetchEvents = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      trackingEnabled: String(trackingEnabled),
      owner: filterOwner,
      risk: filterRisk,
      date: filterDate,
    });
    fetch(`http://localhost:4000/api/events?${params}`)
      .then(r => r.json())
      .then((data: EventsResponse) => {
        setEventsData(data);
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, [trackingEnabled, filterOwner, filterRisk, filterDate]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  // Auto-open panel with first event on load
  useEffect(() => {
    if (eventsData && eventsData.events.length > 0 && !selectedEvent) {
      // Don't auto-open; let user click
    }
  }, [eventsData]);

  const handleEventClick = (event: AdEvent) => setSelectedEvent(event);
  const handleClosePanel = () => setSelectedEvent(null);

  // Build scatter data for visualization
  const scatterData = (eventsData?.events ?? []).slice(0, 80).map((e, i) => ({
    x: (i % 12) * 8.5 + (Math.sin(i * 1.3) * 3),
    y: (Math.floor(i / 12)) * 14 + (Math.cos(i * 0.9) * 4) + 10,
    z: e.risk === 'High' ? 120 : e.risk === 'Medium' ? 70 : 40,
    event: e,
  }));

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">

      {/* ── Pillar I: Deep Visual DNA Background ── */}
      <div className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 10% 10%, rgba(99, 102, 241, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 80%, rgba(168, 85, 247, 0.07) 0%, transparent 60%),
            radial-gradient(ellipse 100% 100% at 50% 50%, #070415 0%, #050310 50%, #040208 100%)
          `,
        }}
      />
      {/* Subtle scanline texture */}
      <div className="fixed inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(168,85,247,1) 2px, rgba(168,85,247,1) 3px)',
          backgroundSize: '100% 6px',
        }}
      />

      {/* ── Pillar III: Developer Signature Header ── */}
      <header className="fixed top-0 inset-x-0 z-20 h-14 flex items-center justify-between px-5"
        style={{ background: 'rgba(5,3,10,0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(168,85,247,0.08)' }}>
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-900/40">
            <Smartphone size={14} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none tracking-tight">Mobile Ad ID Journey</h1>
            <p className="text-[10px] text-white/30 leading-none mt-0.5 font-mono">Real Rails Intelligence Library</p>
          </div>
        </div>

        {/* Center: Live status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/6"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <span className={`w-1.5 h-1.5 rounded-full ${trackingEnabled ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`} />
          <span className="text-[10px] font-mono text-white/50">
            {trackingEnabled ? 'MAID BROADCASTING' : 'MAID NULLIFIED'}
          </span>
        </div>

        {/* Right: Info icon */}
        <div className="relative">
          <button
            id="info-btn"
            onClick={() => setShowInfo(v => !v)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 border ${showInfo
              ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
              : 'border-white/8 text-white/40 hover:text-white/80 hover:border-white/20 hover:bg-white/5'}`}
          >
            <Info size={15} />
          </button>
          <DevSignaturePopover open={showInfo} onClose={() => setShowInfo(false)} />
        </div>
      </header>

      {/* ── Pillar II: 100% Full-Screen Main Stage ── */}
      <main className="pt-14 min-h-screen flex flex-col">

        {/* ── Floating Controls Bar ── */}
        <div className="fixed top-14 inset-x-0 z-10 flex flex-wrap items-center gap-2 px-4 py-2.5"
          style={{ background: 'rgba(5,3,10,0.65)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>

          {/* Privacy Toggle */}
          <button
            onClick={() => setTrackingEnabled(v => !v)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${trackingEnabled
              ? 'bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/20'
              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'}`}
          >
            {trackingEnabled ? <><EyeOff size={12} />Revoke Access</> : <><Activity size={12} />Allow Access</>}
          </button>

          <div className="w-px h-5 bg-white/8" />

          {/* Filters */}
          <div className="flex items-center gap-1.5 text-white/30">
            <Filter size={11} />
            <span className="text-[10px] uppercase tracking-widest font-mono">Filters</span>
          </div>

          {/* Owner filter */}
          <select
            value={filterOwner}
            onChange={e => setFilterOwner(e.target.value)}
            className="text-xs bg-transparent border border-white/10 rounded-lg px-2 py-1.5 text-white/70 hover:border-purple-500/30 focus:outline-none focus:border-purple-500/50 transition-colors cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <option value="all">All Owners</option>
            {eventsData?.filters.owners.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>

          {/* Risk filter */}
          <select
            value={filterRisk}
            onChange={e => setFilterRisk(e.target.value)}
            className="text-xs border border-white/10 rounded-lg px-2 py-1.5 text-white/70 hover:border-purple-500/30 focus:outline-none focus:border-purple-500/50 transition-colors cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <option value="all">All Risks</option>
            {eventsData?.filters.risks.map(r => (
              <option key={r} value={r}>{r} Risk</option>
            ))}
          </select>

          {/* Date filter */}
          <select
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="text-xs border border-white/10 rounded-lg px-2 py-1.5 text-white/70 hover:border-purple-500/30 focus:outline-none focus:border-purple-500/50 transition-colors cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <option value="all">All Dates</option>
            {eventsData?.filters.dates.slice(0, 14).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Stats badges */}
          <div className="ml-auto flex items-center gap-2">
            {eventsData && (
              <>
                <span className="text-[10px] font-mono px-2 py-1 rounded border border-white/8 text-white/40"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {eventsData.stats.totalEvents} events
                </span>
                <span className="text-[10px] font-mono px-2 py-1 rounded border border-red-500/20 text-red-400"
                  style={{ background: 'rgba(239,68,68,0.06)' }}>
                  {eventsData.stats.highRiskCount} high risk
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── Main Visualization Grid ── */}
        <div className="flex-1 pt-11 px-4 pb-4 grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Left / Main Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* MAID Propagation Graph — Full-width */}
            <div className="rounded-2xl border border-white/5 p-5 flex-shrink-0"
              style={{ background: 'rgba(9,5,22,0.70)', backdropFilter: 'blur(16px)' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">MAID Propagation Journey</h2>
                  <p className="text-[10px] text-white/35 mt-0.5 font-mono">Exposed data brokers & ad networks over time</p>
                </div>
                {!trackingEnabled && (
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1.5 rounded-lg">
                    <ShieldAlert size={11} />
                    Tracking Revoked
                  </div>
                )}
              </div>
              <div className="h-52">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={journeyData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.12)" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                      <YAxis stroke="rgba(255,255,255,0.12)" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: '#07041a', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 10, fontSize: 11 }}
                        labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
                        itemStyle={{ color: '#c4b5fd' }}
                      />
                      <Line type="monotone" dataKey="dataBrokers" name="Exposed Brokers" stroke="#a855f7" strokeWidth={2} dot={{ r: 3, fill: '#a855f7', strokeWidth: 0 }} />
                      <Line type="monotone" dataKey="adNetworks" name="Ad Networks" stroke="#6366f1" strokeWidth={2} dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Scatter Plot — Click to open Intelligence Panel */}
            <div className="flex-1 rounded-2xl border border-white/5 p-5 min-h-64 relative"
              style={{ background: 'rgba(9,5,22,0.70)', backdropFilter: 'blur(16px)' }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">Event Scatter Map</h2>
                  <p className="text-[10px] text-white/35 mt-0.5 font-mono">Click any node to open Intelligence Panel</p>
                </div>
              </div>
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center gap-2 text-xs text-white/30">
                    <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    Loading...
                  </div>
                </div>
              ) : isMounted && (
                <ResponsiveContainer width="100%" height={200}>
                  <ScatterChart margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" />
                    <XAxis type="number" dataKey="x" hide />
                    <YAxis type="number" dataKey="y" hide />
                    <ZAxis type="number" dataKey="z" range={[30, 180]} />
                    <RechartsTooltip
                      cursor={{ strokeDasharray: '3 3', stroke: 'rgba(168,85,247,0.3)' }}
                      contentStyle={{ backgroundColor: '#07041a', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 10, fontSize: 11 }}
                      content={({ payload }) => {
                        if (!payload?.length) return null;
                        const d = payload[0]?.payload?.event as AdEvent;
                        if (!d) return null;
                        return (
                          <div className="p-2.5 text-xs space-y-1">
                            <p className="font-semibold text-white">{d.app}</p>
                            <p className="text-purple-300 font-mono">{d.eventType}</p>
                            <p className={`font-mono ${riskColor[d.risk]}`}>{d.risk} Risk · {d.owner}</p>
                          </div>
                        );
                      }}
                    />
                    <Scatter
                      data={scatterData}
                      shape={(props: any) => {
                        const event = props.event as AdEvent;
                        const color = event?.risk === 'High' ? '#f87171' : event?.risk === 'Medium' ? '#fbbf24' : '#34d399';
                        return (
                          <circle
                            cx={props.cx} cy={props.cy}
                            r={Math.sqrt(props.z || 50) * 0.4 + 3}
                            fill={color} fillOpacity={0.6}
                            stroke={color} strokeWidth={1} strokeOpacity={0.8}
                            style={{ cursor: 'pointer', filter: `drop-shadow(0 0 4px ${color}50)` }}
                            onClick={() => event && handleEventClick(event)}
                          />
                        );
                      }}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              )}

              {/* Legend */}
              <div className="flex items-center gap-4 mt-2">
                {[['High Risk', '#f87171'], ['Medium Risk', '#fbbf24'], ['Low Risk', '#34d399']].map(([label, color]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}60` }} />
                    <span className="text-[10px] text-white/40 font-mono">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Event Stream */}
          <div className="flex flex-col gap-4">
            {/* Event Stream Panel */}
            <div className="rounded-2xl border border-white/5 flex flex-col flex-1 min-h-0"
              style={{ background: 'rgba(9,5,22,0.70)', backdropFilter: 'blur(16px)' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white">Ad Event Stream</h2>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/30 border border-white/8">LIVE</span>
                </div>
                <span className="text-[10px] text-purple-400 font-mono">{eventsData?.stats.totalEvents ?? 0} events</span>
              </div>
              <div className="overflow-y-auto flex-1 p-3 space-y-2">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-xl bg-white/3 animate-pulse border border-white/5" />
                  ))
                ) : (
                  (eventsData?.events ?? []).slice(0, 20).map((evt, i) => (
                    <button
                      key={`${evt.timestamp}-${i}`}
                      onClick={() => handleEventClick(evt)}
                      className={`w-full text-left rounded-xl border p-3 transition-all duration-200 hover:border-purple-500/30 hover:scale-[1.01] active:scale-[0.99] ${selectedEvent?.timestamp === evt.timestamp && selectedEvent?.maid === evt.maid
                        ? 'border-purple-500/40 bg-purple-500/8'
                        : 'border-white/5 hover:bg-white/2'
                        }`}
                      style={{ background: selectedEvent?.timestamp === evt.timestamp ? 'rgba(168,85,247,0.05)' : 'rgba(255,255,255,0.015)' }}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <span className="text-xs font-semibold text-white truncate mr-2">{evt.app}</span>
                        <RiskBadge risk={evt.risk} />
                      </div>
                      <div className="text-[10px] text-white/35 font-mono mb-1.5">{evt.eventType.replace('_', ' ')} · {evt.date}</div>
                      <MaidPill maid={evt.maid} exposed={evt.maidExposed} />
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Pillar II: Slide-over Intelligence Panel ── */}
      <IntelligencePanel
        event={selectedEvent}
        cfpb={cfpbData}
        gdelt={gdeltData}
        stats={eventsData?.stats ?? null}
        trackingEnabled={trackingEnabled}
        onClose={handleClosePanel}
      />
    </div>
  );
}