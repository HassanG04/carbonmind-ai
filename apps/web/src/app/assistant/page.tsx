'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Send, Sparkles, ShieldAlert, Bot, User, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';
import { useDemo } from '@/demo/context';
import { SyntheticBadge } from '@/components/common/SyntheticBadge';
import { AssistantCitation, AssistantMessage } from '@/lib/contracts';

export default function AssistantPage() {
  const { currentOrg, currentSite, getAssistantConversations } = useDemo();
  const presetThreads = getAssistantConversations();

  // Initial conversation messages
  const initialMessages: AssistantMessage[] = [
    {
      id: 'msg-welcome',
      sender: 'assistant',
      content: `Hello! I am your CarbonMind Sustainability Copilot for ${currentOrg.name}. I can explain accounting boundaries, break down primary vs attributed meter readings, and identify decarbonization opportunities across your facilities. How can I help you today?`,
      timestamp: '10:00 AM',
    },
    {
      id: 'msg-sample-q',
      sender: 'user',
      content: presetThreads[0].query,
      timestamp: '10:01 AM',
    },
    {
      id: 'msg-sample-a',
      sender: 'assistant',
      content: presetThreads[0].response,
      timestamp: '10:01 AM',
      citations: presetThreads[0].citations,
    },
  ];

  const [messages, setMessages] = useState<AssistantMessage[]>(initialMessages);
  const [inputText, setInputText] = useState<string>('');
  const [selectedCitation, setSelectedCitation] = useState<AssistantCitation | null>(
    presetThreads[0].citations[0] ?? null
  );

  // Suggested prompt chips
  const suggestedPrompts = [
    'How can AASTMT reduce Scope 2 electricity emissions this semester?',
    'Explain the difference between primary meter readings and attributed sub-loads.',
    'Why did electricity consumption drop on October 24 and 25 at Main Campus?',
    'Does the equipment camera scan directly calculate greenhouse gas emissions?',
  ];

  const handleSendPrompt = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Find closest scripted match from fixtures
    const match = presetThreads.find(
      (t) =>
        t.query.toLowerCase().includes(queryText.toLowerCase().slice(0, 15)) ||
        queryText.toLowerCase().includes(t.topic.toLowerCase())
    );

    let assistantResponse: string;
    let citations: AssistantCitation[] | undefined;

    if (match) {
      assistantResponse = match.response;
      citations = match.citations;
    } else {
      assistantResponse = `For ${currentOrg.name} (${currentSite?.name}), all recorded metrics are deterministic synthetic fixtures. Under our accounting rules, direct electricity consumption is aggregated from primary boundary meters and converted using the fictional factor 0.45 kgCO2e/kWh. Scope 1 and Scope 3 emissions remain unestimated. You can explore scenario optimization on the /optimize route or review full ledger logs in /reports.`;
      citations = [
        {
          entityId: 'demo-electricity-v1',
          entityType: 'factor',
          title: 'Fictional Grid Factor (0.45 kgCO2e/kWh)',
          detail: 'docs/scientific_engine.md illustrative baseline',
        },
        {
          entityId: currentSite?.id ?? 'site-active',
          entityType: 'facility',
          title: `${currentSite?.name ?? 'Active Facility'} (${currentSite?.facilityCode ?? 'FAC'})`,
          detail: 'Primary accounting boundary',
        },
      ];
    }

    const assistantMsg: AssistantMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: 'assistant',
      content: assistantResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      citations,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInputText('');
    if (citations && citations.length > 0) {
      setSelectedCitation(citations[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendPrompt(inputText);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Enterprise Assistant</p>
          <h1 className="page-heading">AI Sustainability Copilot</h1>
          <p className="mt-3 text-muted text-sm max-w-2xl">
            Simulated conversational explanations grounded in transparent GHG Protocol provenance.
            Answers cite specific synthetic ledger entries and methodology formulas without external cloud API calls.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SyntheticBadge label="DEMO RESPONSE — NO GEMINI API CALL" />
        </div>
      </div>

      {/* Disclaimers & Security Shield */}
      <div className="panel p-5 border-l-4 border-l-info bg-info-soft/30 flex items-start gap-4 text-sm">
        <ShieldAlert className="text-info shrink-0 mt-0.5" size={20} aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-medium text-ink">Zero API Key / Zero External Telemetry Guarantee</p>
          <p className="text-muted leading-relaxed">
            All responses are executed locally via scripted deterministic fixtures.
            No proprietary organizational data is transmitted across the internet, and no paid Gemini or OpenAI API keys are configured.
          </p>
        </div>
      </div>

      {/* Chat & Evidence Drawer Layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Chat Feed */}
        <div className="lg:col-span-8 panel flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-line bg-subtle/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-positive-soft text-positive flex items-center justify-center font-bold text-xs">
                AI
              </div>
              <div>
                <p className="text-sm font-semibold text-ink leading-none">CarbonMind Assistant</p>
                <p className="text-[11px] text-muted mt-1">Grounding: Operational control boundary</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-positive bg-positive-soft px-2 py-0.5 rounded">
              OFFLINE DEMO MODE
            </span>
          </div>

          {/* Message Scroll Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {messages.map((m) => {
              const isBot = m.sender === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-3xl ${isBot ? 'items-start' : 'items-start flex-row-reverse ml-auto'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs ${
                      isBot ? 'bg-positive-soft text-positive' : 'bg-subtle text-ink'
                    }`}
                  >
                    {isBot ? <Bot size={15} /> : <User size={15} />}
                  </div>

                  <div className={`space-y-2 ${isBot ? 'items-start' : 'items-end'}`}>
                    <div
                      className={`p-4 rounded-xl text-sm leading-relaxed ${
                        isBot
                          ? 'bg-subtle/70 text-ink border border-line'
                          : 'bg-positive text-slate-950 font-medium'
                      }`}
                    >
                      <p>{m.content}</p>

                      {/* Bot Citations Badges */}
                      {isBot && m.citations && m.citations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-line/60 flex flex-wrap gap-1.5 items-center">
                          <span className="text-[11px] text-muted flex items-center gap-1 font-sans">
                            <BookOpen size={12} /> Grounding Evidence:
                          </span>
                          {m.citations.map((c) => (
                            <button
                              key={c.entityId}
                              type="button"
                              onClick={() => setSelectedCitation(c)}
                              className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface hover:bg-line border border-line text-ink transition-colors flex items-center gap-1"
                            >
                              <span>{c.entityId}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-muted block px-1">{m.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prompt Chips Bar */}
          <div className="p-3 border-t border-line bg-subtle/30 overflow-x-auto flex gap-2">
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendPrompt(p)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full border border-line bg-surface hover:bg-subtle text-xs text-muted hover:text-ink transition-colors shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-line bg-surface flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about emissions, scope 2 calculation, or facility benchmarks..."
              className="flex-1 px-4 py-2.5 rounded-lg border border-line bg-subtle text-ink text-sm focus:outline-none focus:ring-2 focus:ring-positive"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-lg bg-positive text-slate-950 font-medium text-sm hover:bg-positive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={16} /> Send
            </button>
          </form>
        </div>

        {/* Right: Evidence & Provenance Inspector */}
        <div className="lg:col-span-4 panel p-6 space-y-6">
          <div className="border-b border-line pb-4">
            <h2 className="text-base font-semibold">Evidence &amp; Provenance</h2>
            <p className="text-xs text-muted mt-1">
              Inspection trace of cited ledger records and factors
            </p>
          </div>

          {selectedCitation ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-subtle border border-line space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-positive-soft text-positive inline-block">
                  {selectedCitation.entityType.toUpperCase()}
                </span>
                <h3 className="font-semibold text-ink text-sm">{selectedCitation.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{selectedCitation.detail}</p>
                <div className="pt-2 text-[11px] font-mono text-muted">
                  ID: <span className="text-ink">{selectedCitation.entityId}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-muted">
                <p className="font-semibold text-ink">Verification Audit Rules:</p>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>Calculated emissions strictly follow formula: $kWh \times factor = kgCO_2e$.</li>
                  <li>Attribution children do not increase parent meter totals.</li>
                  <li>All values are synthetic demonstration records for {currentOrg.name}.</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-line">
                <Link
                  href="/inventory"
                  className="text-xs text-positive inline-flex items-center gap-1 hover:underline"
                >
                  Inspect Activity Ledger <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted">Click any cited entity pill in the conversation to view its provenance trace.</p>
          )}
        </div>
      </div>
    </div>
  );
}
