'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DEMO_FACTOR } from '@/lib/contracts';

interface ProvenanceModalProps {
  title?: string;
  trace?: string[];
  assumptions?: string[];
}

export const ProvenanceModal: React.FC<ProvenanceModalProps> = ({
  title = 'Scientific Provenance & Trace',
  trace = [],
  assumptions = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      // Focus close button on open
      closeBtnRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
          return;
        }

        if (e.key === 'Tab' && dialogRef.current) {
          const focusable = Array.from(
            dialogRef.current.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          ).filter((element) => !element.hasAttribute('disabled'));

          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else if (wasOpenRef.current) {
      // Restore focus to trigger button when closed
      triggerRef.current?.focus();
      wasOpenRef.current = false;
    }
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center text-sm font-medium text-positive hover:text-positive underline focus:ring-1 focus:ring-emerald-500 rounded px-1"
        aria-label="View calculation trace and provenance"
      >
        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Provenance &amp; Trace
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="provenance-modal-title"
        >
          <div
            className="bg-surface rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4 border border-line max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 id="provenance-modal-title" className="text-base font-semibold text-ink">
                {title}
              </h3>
              <button
                ref={closeBtnRef}
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-muted rounded p-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Close provenance dialog"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm text-muted">
              <div className="p-3 bg-warning-soft rounded border border-warning-border text-warning text-sm">
                <span className="font-semibold block mb-0.5">DEMO NOTICE:</span>
                All figures, factors, and traces shown are purely synthetic demo calculations. Factor is fictional and does not represent national grid emission factors.
              </div>

              <div>
                <span className="font-semibold text-ink block mb-1">Applied Emission Factor:</span>
                <ul className="list-disc pl-5 text-sm space-y-1 font-mono text-ink bg-subtle p-2.5 rounded">
                  <li>Factor ID: {DEMO_FACTOR.id}</li>
                  <li>Value: {DEMO_FACTOR.value} {DEMO_FACTOR.unit}</li>
                  <li>Region: {DEMO_FACTOR.region}</li>
                  <li>Version: {DEMO_FACTOR.version}</li>
                  <li>Source: {DEMO_FACTOR.source}</li>
                </ul>
              </div>

              {assumptions.length > 0 && (
                <div>
                  <span className="font-semibold text-ink block mb-1">Assumptions:</span>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {assumptions.map((assump, idx) => (
                      <li key={idx}>{assump}</li>
                    ))}
                  </ul>
                </div>
              )}

              {trace.length > 0 && (
                <div>
                  <span className="font-semibold text-ink block mb-1">Execution Trace:</span>
                  <ol className="list-decimal pl-5 text-sm font-mono space-y-1 text-ink bg-subtle p-2.5 rounded">
                    {trace.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 text-sm font-medium text-ink bg-subtle hover:bg-subtle rounded transition focus:ring-2 focus:ring-emerald-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
