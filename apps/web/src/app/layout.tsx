import type { Metadata } from 'next';
import './globals.css';
import { DemoProvider } from '@/demo/context';
import { Shell } from '@/components/layout/Shell';

export const metadata: Metadata = {
  title: 'CarbonMind SaaS — Synthetic Prototype',
  description: 'Temporary fully synthetic Next.js SaaS experience for university, factory, and commercial building carbon accounting.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try { document.documentElement.dataset.theme = localStorage.getItem('carbonmind-theme') === 'light' ? 'light' : 'dark'; } catch {}` }} />
      </head>
      <body>
        <DemoProvider>
          <Shell>{children}</Shell>
        </DemoProvider>
      </body>
    </html>
  );
}
