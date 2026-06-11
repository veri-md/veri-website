export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="py-16 md:py-20">
        <div className="flex items-center gap-4 mb-6">
          <svg width="48" height="48" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="8" fill="#2563eb" />
            <text x="18" y="24" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="monospace">V</text>
          </svg>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Veri Build
          </h1>
        </div>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mb-8">
          Formal Verification Pipeline &mdash; Write formal specs in <strong>Veri DSL</strong>,
          lint, compile to C / Rust / Python with automated proof assistance.
        </p>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mb-10 leading-relaxed">
          Veri Build turns specification-first design into verified, compilable code.
          Write contracts in a Pythonic DSL, target F*&rarr;C, Dafny&rarr;Rust, or
          Python runtime enforcement, and let the pipeline handle the rest.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="#/quickstart"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            Quick Start
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a
            href="#/about"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 transition dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            About
          </a>
          <a
            href="https://github.com/veri-md/veri-build"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 transition dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd" />
            </svg>
            GitHub
          </a>
        </div>
      </section>

      {/* Quick start banner */}
      <section className="py-6">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Write one spec, ship verified code
          </h2>
          <p className="text-blue-800 dark:text-blue-300 text-sm leading-relaxed mb-4">
            Veri DSL specs are markdown files with natural-language documentation
            surrounding formal contracts. Lint, then compile with an LLM agent
            in a Docker sandbox to get verified C, Rust, or Python.
          </p>
          <a
            href="#/quickstart"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
          >
            See the full walkthrough
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>

      {/* Quick overview cards */}
      <section className="py-8 border-t border-neutral-200 dark:border-neutral-700">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-8">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              title: "Write specs",
              desc: "Define records, predicates, and contracts in Veri DSL inside markdown files.",
            },
            {
              step: "2",
              title: "Lint & verify",
              desc: "Check interfaces, run F*/Dafny verifiers, and catch inconsistencies early.",
            },
            {
              step: "3",
              title: "Compile & ship",
              desc: "LLM agent fills implementations, verification checks pass, target code is emitted.",
            },
          ].map((card) => (
            <div
              key={card.step}
              className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <div className="mb-3 flex size-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {card.step}
              </div>
              <h3 className="mb-2 font-semibold text-neutral-900 dark:text-white">
                {card.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Targets */}
      <section className="py-8 border-t border-neutral-200 dark:border-neutral-700">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
          Supported targets
        </h2>
        <ul className="space-y-3">
          {[
            ["fstar-c", "F* → Low* → KaRaMeL → C", "Verified C for embedded / WASM"],
            ["fstar-ocaml", "F* → fstar --codegen OCaml", "Verified OCaml"],
            ["fstar-wasm", "F* → krml -wasm", "WebAssembly"],
            ["dafny-rust", "Dafny → Rust", "Verified Rust crates"],
            ["dafny-java", "Dafny → Java", "Verified Java"],
            ["dafny-python", "Dafny → Python", "Verified Python"],
            ["dafny-js", "Dafny → JavaScript", "Verified JS"],
            ["python-assert", "Python @contract", "Runtime enforcement in Python"],
          ].map(([target, toolchain, use]) => (
            <li key={target as string}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 rounded-lg border border-neutral-200 bg-white px-5 py-3 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <code className="text-sm font-semibold text-blue-700 dark:text-blue-400">{target as string}</code>
              <span className="text-sm text-neutral-500 hidden sm:inline">&mdash;</span>
              <span className="text-sm text-neutral-700 dark:text-neutral-300">{toolchain as string}</span>
              <span className="text-xs text-neutral-400 ml-auto">{use as string}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Team */}
      <section className="py-12 border-t border-neutral-200 dark:border-neutral-700">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-8 text-center">
          Team
        </h2>

        <h3 className="text-lg font-semibold text-neutral-500 dark:text-neutral-400 mb-5 text-center uppercase tracking-wider text-sm">
          Advisors
        </h3>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {[
            { name: "Mohsen Lesan", role: "Advisor", photo: null },
            { name: "Matei Zaharia", role: "Advisor", photo: null },
            { name: "Scott Shenker", role: "Advisor", photo: null },
          ].map((person) => (
            <div key={person.name} className="flex flex-col items-center gap-2 w-32">
              <div className="size-24 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 ring-2 ring-neutral-200 dark:ring-neutral-700 flex items-center justify-center">
                <span className="text-2xl font-bold text-neutral-400 dark:text-neutral-500">
                  {person.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <span className="text-sm font-medium text-neutral-900 dark:text-white text-center">{person.name}</span>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-neutral-500 dark:text-neutral-400 mb-5 text-center uppercase tracking-wider text-sm">
          Students
        </h3>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { name: "Dev Bali", role: "Student", photo: null },
            { name: "Ziming Mao", role: "Student", photo: "/people/ziming_mao.jpeg" },
            { name: "Jamie K", role: "Student", photo: null },
          ].map((person) => (
            <div key={person.name} className="flex flex-col items-center gap-2 w-32">
              <div className="size-24 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 ring-2 ring-neutral-200 dark:ring-neutral-700">
                {person.photo ? (
                  <img
                    src={person.photo}
                    alt={person.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="size-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-neutral-400 dark:text-neutral-500">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-neutral-900 dark:text-white text-center">{person.name}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center mt-8">
          Open source at{" "}
          <a href="https://github.com/veri-md/veri-build" className="text-blue-600 underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">github.com/veri-md/veri-build</a>
        </p>
      </section>
    </div>
  );
}
