import type { ReactNode } from "react";

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-neutral-200 px-1.5 py-0.5 text-sm font-mono dark:bg-neutral-700">
      {children}
    </code>
  );
}

export function Pre({ children }: { children: ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-100 p-4 text-sm dark:border-neutral-700 dark:bg-neutral-800">
      {children}
    </pre>
  );
}

export function SectionTitle({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-12 mb-4 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white"
    >
      {children}
    </h2>
  );
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  );
}
