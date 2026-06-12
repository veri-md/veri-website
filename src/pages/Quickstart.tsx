import { Code, Pre, SectionTitle, Table } from "../components/Markdown";

export default function Quickstart() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="py-8 md:py-10">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-3">
          Quick Start
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          Write a formal spec once in Veri DSL, verify it, and ship verified C,
          Rust, or Python. This guide walks through the full pipeline with a
          sorted list example &mdash; from spec to compiled output.
        </p>
      </section>

      {/* Pipeline */}
      <SectionTitle id="pipeline">Pipeline Overview</SectionTitle>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          {
            n: "1",
            title: "Lint",
            desc: "Parses Veri DSL blocks, generates the target-language interface, and runs the verifier (fstar.exe or dafny). Rejects unimplemented functions &mdash; every def with REQUIRES/ENSURES must have a body, EXTERN, or #TODO.",
          },
          {
            n: "2",
            title: "Fill",
            desc: "Launches an LLM agent inside a Docker sandbox. The agent gets the verified interface, writes implementations, runs self-check, and retries up to 3 rounds with function-count feedback.",
          },
          {
            n: "3",
            title: "Compile",
            desc: "Extracts the verified code to the output language. C via KaRaMeL, Rust via Dafny translate, Python @contract decorators &mdash; all from the same .veri.md spec.",
          },
        ].map((step) => (
          <div
            key={step.n}
            className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <div className="mb-3 flex size-7 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {step.n}
            </div>
            <h3 className="mb-1 font-semibold text-neutral-900 dark:text-white">{step.title}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: step.desc }} />
          </div>
        ))}
      </div>

      {/* The Veri DSL Format */}
      <SectionTitle id="format">The .veri.md Format</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-3">
        A spec is a <strong>markdown document</strong>, not raw code. You write
        natural-language explanations surrounding <Code>```veri</Code> fenced code
        blocks. The first Veri DSL block must declare the target backend:
      </p>

      {/* Rendered markdown preview */}
      <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 p-6 md:p-8 my-6 space-y-5">
        {/* Title */}
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-700 pb-3">
          Sorted List Specification
        </h3>

        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Target: F* &rarr; C via Low*/KaRaMeL
        </p>

        {/* First code block */}
        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-900 overflow-x-auto">
          <div className="flex items-center gap-2 px-4 py-1.5 border-b border-neutral-200 dark:border-neutral-700">
            <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Veri DSL</span>
          </div>
          <pre className="p-4 text-sm font-mono text-neutral-800 dark:text-neutral-200 leading-relaxed">TARGET fstar-c</pre>
        </div>

        {/* Section: Element Type */}
        <h4 className="text-lg font-semibold text-neutral-900 dark:text-white">Element Type</h4>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          Each element has a numeric serial number and a string data field.
        </p>

        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-900 overflow-x-auto">
          <div className="flex items-center gap-2 px-4 py-1.5 border-b border-neutral-200 dark:border-neutral-700">
            <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Veri DSL</span>
          </div>
          <pre className="p-4 text-sm font-mono text-neutral-800 dark:text-neutral-200 leading-relaxed">{`class Element:
    serial: nat
    data:   string`}</pre>
        </div>

        {/* Section: Sorted List Type */}
        <h4 className="text-lg font-semibold text-neutral-900 dark:text-white">Sorted List Type</h4>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          A sorted list is a list of elements with an invariant that enforces ordering
          by serial number. The predicate <Code>is_sorted</Code> recursively checks that every
          adjacent pair is in non-decreasing order:
        </p>

        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-900 overflow-x-auto">
          <div className="flex items-center gap-2 px-4 py-1.5 border-b border-neutral-200 dark:border-neutral-700">
            <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Veri DSL</span>
          </div>
          <pre className="p-4 text-sm font-mono text-neutral-800 dark:text-neutral-200 leading-relaxed">{`def is_sorted(lst: list[Element]) -> bool:
    return match lst:
        case []: True
        case [_]: True
        case [hd1, hd2, *tl]:
            hd1.serial <= hd2.serial
            and is_sorted([hd2] + tl)

type valid_sorted_list = list[Element] WHERE is_sorted(lst)`}</pre>
        </div>

        {/* Section: Adding an Element */}
        <h4 className="text-lg font-semibold text-neutral-900 dark:text-white">Adding an Element</h4>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          Insert a new element while preserving the invariant. The return type being <Code>valid_sorted_list</Code>
          guarantees the result is sorted and we also verify it has exactly one more element
        </p>

        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-900 overflow-x-auto">
          <div className="flex items-center gap-2 px-4 py-1.5 border-b border-neutral-200 dark:border-neutral-700">
            <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Veri DSL</span>
          </div>
          <pre className="p-4 text-sm font-mono text-neutral-800 dark:text-neutral-200 leading-relaxed">{`def add_element(
    existing: valid_sorted_list,
    new_elem: Element,
) -> valid_sorted_list:
    REQUIRES True
    ENSURES (len(result) == len(existing) + 1)

#TODO`}</pre>
        </div>
      </div>

      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mt-4">
        Things to notice:
      </p>
      <ul className="mt-2 space-y-1 text-sm text-neutral-700 dark:text-neutral-300 list-disc list-inside">
        <li><Code>class Element</Code> &mdash; a record type with two named fields</li>
        <li><Code>is_sorted</Code> &mdash; a recursive predicate using Pythonic <Code>match</Code>/<Code>case</Code> with list destructuring</li>
        <li><Code>type valid_sorted_list</Code> &mdash; a refined type: <Code>list[Element]</Code> constrained by <Code>WHERE is_sorted(lst)</Code></li>
        <li><Code>add_element</Code> &mdash; a function with <Code>REQUIRES</Code>/<Code>ENSURES</Code> contract and <Code>#TODO</Code> marker</li>
        <li>Natural language prose surrounds each Veri DSL block &mdash; the file is documentation <em>and</em> a spec</li>
        <li>All functions and types are <strong>pure</strong> &mdash; no side effects, no mutable state, no I/O inside contracts. The LLM enforces this.</li>
      </ul>

      {/* Backend Targets */}
      <SectionTitle id="targets">Backend Targets</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
        The same Veri DSL spec can compile to different outputs by changing the
        <Code>TARGET</Code> declaration:
      </p>

      <Table>
        <thead>
          <tr className="border-b border-neutral-300 dark:border-neutral-600">
            <th className="py-2 pr-4 text-left font-semibold text-neutral-700 dark:text-neutral-300">TARGET</th>
            <th className="py-2 pr-4 text-left font-semibold text-neutral-700 dark:text-neutral-300">Toolchain</th>
            <th className="py-2 text-left font-semibold text-neutral-700 dark:text-neutral-300">Output</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {[
            ["fstar-c", "F* → Low* → KaRaMeL", "Verified C"],
            ["fstar-ocaml", "F* → fstar --codegen OCaml", "Verified OCaml"],
            ["fstar-wasm", "F* → krml -wasm", "WebAssembly"],
            ["dafny-rust", "Dafny → dafny translate rs", "Verified Rust"],
            ["dafny-java", "Dafny → dafny translate java", "Verified Java"],
            ["dafny-js", "Dafny → dafny translate js", "Verified JavaScript"],
            ["dafny-python", "Dafny → dafny translate py", "Verified Python"],
            ["python-assert", "Python @contract decorators", "Runtime enforcement"],
          ].map(([target, toolchain, output]) => (
            <tr key={target as string}>
              <td className="py-2 pr-4 font-mono text-sm font-medium text-blue-700 dark:text-blue-400">{target as string}</td>
              <td className="py-2 pr-4 text-sm text-neutral-600 dark:text-neutral-400">{toolchain as string}</td>
              <td className="py-2 text-sm text-neutral-600 dark:text-neutral-400">{output as string}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Core loop */}
      <SectionTitle id="core-loop">Core Loop</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
        The pipeline follows a strict iterative loop. Your LLM handles every
        step &mdash; you just provide the spec and tell it when to lint or compile.
      </p>
      <ol className="space-y-3 text-neutral-700 dark:text-neutral-300 leading-relaxed list-decimal list-inside mb-6">
        <li>
          <strong>Write the spec</strong> &mdash; Your LLM writes F*/Dafny in a temp
          file, calls <Code>verify_and_convert()</Code> to verify and convert it to
          Veri DSL, then runs <Code>lint</Code>.
        </li>
        <li>
          <strong>Iterate</strong> &mdash; You review the spec and suggest changes.
          Every time the LLM shows you a revised <Code>.veri.md</Code>, it must
          have passed <Code>lint</Code> first. If lint fails, the LLM fixes the
          errors and re-lints before showing it to you.
        </li>
        <li>
          <strong>Compile</strong> &mdash; When the spec is finalized, the LLM calls
          <Code>compile_veri()</Code> to produce verified output
          (<Code>.c</Code>, <Code>.rs</Code>, <Code>.py</Code>, etc.).
          Compilation can take hours &mdash; it runs as a sub-agent with an LLM
          inside a Docker sandbox filling implementations, running verifiers,
          and retrying on failure.
        </li>
      </ol>

      {/* Lint API */}
      <SectionTitle id="lint-api">Lint API</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
        The LLM calls <Code>lint</Code> on every <Code>.veri.md</Code> before
        showing it to you. It validates the spec end-to-end:
        parses Veri DSL blocks, generates the target-language interface, runs
        fstar.exe or dafny to confirm consistency, and rejects unimplemented
        functions. <strong>If lint fails, the spec is broken</strong> &mdash;
        the LLM must fix it before you see it.
      </p>

      {/* Compile API */}
      <SectionTitle id="compile-api">Compile API</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
        When the spec is finalized, the LLM calls <Code>compile_veri()</Code>.
        This is a long-running pipeline (minutes to hours):
      </p>
      <ol className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed list-decimal list-inside">
        <li>Reads the <Code>.veri.md</Code>, extracts Veri DSL blocks, builds an AST</li>
        <li>Generates the target-language interface (F* <Code>.fsti</Code> or Dafny <Code>.dfy</Code> header)</li>
        <li>Launches an LLM agent inside a Docker sandbox with credentials mounted</li>
        <li>The agent fills <Code>#TODO</Code> blocks with target-language implementations</li>
        <li>The agent runs self-check: verifies with fstar.exe / dafny, then extracts to output</li>
        <li>If verification fails, the agent retries up to 3 rounds with function-count feedback</li>
        <li>On success, produces the output artifacts (<Code>.c</Code>, <Code>.rs</Code>, etc.)</li>
      </ol>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3">
        The LLM should always spawn compile as a sub-agent &mdash; it shouldn&apos;t
        block your conversation.
      </p>

      {/* Using with an LLM */}
      <SectionTitle id="llm-usage">Using with an LLM</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
        The pipeline is designed to be driven by an LLM agent. We&apos;ve tested
        this on <strong>OpenClaw</strong> and <strong>Claude Code</strong>
        harnesses &mdash; both work with the skill file.
      </p>

      <h3 className="mt-6 mb-2 text-lg font-semibold text-neutral-800 dark:text-neutral-200">1. Load the skill</h3>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
        Tell your LLM: <Code>get the skills from https://github.com/veri-md/veri-build</Code>.
        The skill file at <Code>skills/VERIFICATION-SKILL.md</Code> contains the full
        instruction set &mdash; the core loop, pure discipline rules, parent-subagent
        protocol, and lint-before-deliver rule.
      </p>

      <h3 className="mt-6 mb-2 text-lg font-semibold text-neutral-800 dark:text-neutral-200">2. Best results</h3>
      <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed list-disc list-inside">
        <li><strong>Stick to the skill</strong> &mdash; the skill has hard rules (lint before deliver, parent-subagent retry protocol, signal codes). Make sure the LLM follows them.</li>
        <li><strong>Use sub-agents for compile</strong> &mdash; <Code>compile_veri</Code> with <Code>use_docker=True</Code> builds images, runs agents, and verifies. This is a long-running task &mdash; always spawn it as a sub-agent.</li>
        <li><strong>Lint is a hard gate</strong> &mdash; if lint fails, the LLM must fix the errors before showing you anything.</li>
        <li><strong>Three-round retry</strong> &mdash; the parent sub-agent retries up to 3 rounds. If the agent reports <Code>IMPOSSIBLE</Code>, the parent validates the reasoning.</li>
        <li><strong>Python API over CLI</strong> &mdash; LLMs should use <Code>verify_and_convert()</Code> and <Code>compile_veri()</Code> directly rather than shell commands.</li>
      </ul>

      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-700">
        Learn more at{" "}
        <a href="https://github.com/veri-md/veri-build" className="text-blue-600 underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">github.com/veri-md/veri-build</a>
        {" "}&mdash; the repo README has the full reference.
      </p>
    </div>
  );
}
