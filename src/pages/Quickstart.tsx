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
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-3">
        The pipeline has three stages:
      </p>
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

      <Pre>{`# Sorted List Specification

Target: F* → C via Low*/KaRaMeL

\`\`\`veri
TARGET fstar-c
\`\`\`

## Element Type

Each element has a numeric serial number and a string data field.

\`\`\`veri
class Element:
    serial: nat
    data:   string
\`\`\`

## Sorted List Type

A sorted list is a list of elements with an invariant that enforces ordering
by serial number. The predicate \`is_sorted\` recursively checks that every
adjacent pair is in non-decreasing order:

\`\`\`veri
def is_sorted(lst: list[Element]) -> bool:
    return match lst:
        case []: True
        case [_]: True
        case [hd1, hd2, *tl]:
            hd1.serial <= hd2.serial
            and is_sorted([hd2] + tl)

type valid_sorted_list = list[Element] WHERE is_sorted(lst)
\`\`\`

## Adding an Element

Insert a new element while preserving the invariant. The ENSURES clause
guarantees the result is sorted and has exactly one more element:

\`\`\`veri
def add_element(
    existing: valid_sorted_list,
    new_elem: Element,
) -> valid_sorted_list:
    REQUIRES True
    ENSURES (is_sorted(result)
             and len(result) == len(existing) + 1)

#TODO
\`\`\``}</Pre>

      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mt-4">
        Things to notice:
      </p>
      <ul className="mt-2 space-y-1 text-sm text-neutral-700 dark:text-neutral-300 list-disc list-inside">
        <li><Code>class Element</Code> &mdash; a record type with two named fields</li>
        <li><Code>is_sorted</Code> &mdash; a recursive predicate using Pythonic <Code>match</Code>/<Code>case</Code> with list destructuring</li>
        <li><Code>type valid_sorted_list</Code> &mdash; a refined type: <Code>list[Element]</Code> constrained by <Code>WHERE is_sorted(lst)</Code></li>
        <li><Code>add_element</Code> &mdash; a function with <Code>REQUIRES</Code>/<Code>ENSURES</Code> contract and <Code>#TODO</Code> marker</li>
        <li>Natural language prose surrounds each Veri DSL block &mdash; the file is documentation <em>and</em> a spec</li>
      </ul>

      {/* Backend Targets */}
      <SectionTitle id="targets">Backend Targets</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
        The same Veri DSL spec can compile to different outputs by changing the
        <Code>TARGET</Code> declaration. The pipeline&apos;s plugin backend registry
        currently supports:
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

      {/* Pipeline APIs */}
      <SectionTitle id="api">Pipeline APIs</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
        The pipeline provides two APIs that your LLM uses on your behalf.
        You don&apos;t need to run these yourself &mdash; just tell your LLM
        to use them.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">Lint API</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Checks that a <Code>.veri.md</Code> spec is valid &mdash; parses Veri DSL
            blocks, generates the target interface, and runs the verifier. Every spec
            must pass lint before it&apos;s shown to you.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">Compile API</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            End-to-end: reads a <Code>.veri.md</Code>, launches an LLM agent in
            a Docker sandbox to fill implementations, verifies, and emits the
            target output (<Code>.c</Code>, <Code>.rs</Code>, <Code>.py</Code>, etc.).
          </p>
        </div>
      </div>



      {/* Using with an LLM */}
      <SectionTitle id="llm-usage">Using with an LLM</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
        The pipeline is designed to be driven by an LLM agent. The repo includes
        a skill file that tells the LLM exactly how to use it. Here&apos;s what
        you need to know:
      </p>

      <h3 className="mt-6 mb-2 text-lg font-semibold text-neutral-800 dark:text-neutral-200">1. Load the skill</h3>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-3">
        The skill is at <Code>veri-build/skills/VERIFICATION-SKILL.md</Code>. Tell
        your LLM to read it. It contains the full instruction set for using the
        pipeline:
      </p>
      <Pre className="text-xs"># Tell your LLM:
Please read /path/to/veri-build/skills/VERIFICATION-SKILL.md
# This defines the core loop, pure discipline rules,
# parent-subagent protocol, and lint-before-deliver rule.</Pre>

      <h3 className="mt-6 mb-2 text-lg font-semibold text-neutral-800 dark:text-neutral-200">2. Follow the core loop</h3>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-3">
        The skill defines a strict workflow. Summarized:
      </p>
      <ol className="space-y-2 text-neutral-700 dark:text-neutral-300 leading-relaxed list-decimal list-inside">
        <li><strong>Write in F*/Dafny first</strong> &mdash; work in a temp <Code>.veri.f.md</Code> or <Code>.veri.dfy.md</Code> file. All targets produce pure functions and pure types.</li>
        <li><strong>Call <Code>verify_and_convert()</Code></strong> &mdash; this checks the code with fstar.exe / dafny and converts it to Veri DSL if verification passes.</li>
        <li><strong>Lint before delivering</strong> &mdash; <em>never</em> show a <Code>.veri.md</Code> to a user without running it through <Code>lint</Code> first.</li>
        <li><strong>For compile</strong> &mdash; if the user needs the spec compiled to C/Rust/Python, use <Code>compile_veri()</Code> in a <em>spawned sub-agent</em> (it takes minutes, not seconds).</li>
      </ol>

      <h3 className="mt-6 mb-2 text-lg font-semibold text-neutral-800 dark:text-neutral-200">3. Pure discipline (all targets)</h3>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-3">
        Every Veri DSL spec must be pure. The skill enforces:
      </p>
      <ul className="space-y-1 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed list-disc list-inside mb-3">
        <li>Functions are <strong>pure</strong> (<Code>Pure</Code>/<Code>Tot</Code>/<Code>Lemma</Code> in F*, <Code>function</Code>/<Code>predicate</Code> in Dafny). No mutable effects.</li>
        <li>Types are <strong>pure</strong> &mdash; no heap objects, no ST regions.</li>
        <li>Python target: contract conditions are pure, but the implementation function can have side effects.</li>
        <li>F* → C additionally enforces the <strong>Low* subset</strong> for KaRaMeL compatibility.</li>
        <li>Dafny → Rust allows only <Code>function</Code>/<Code>predicate</Code>/<Code>lemma</Code> &mdash; no mutable <Code>method</Code>.</li>
      </ul>

      <h3 className="mt-6 mb-2 text-lg font-semibold text-neutral-800 dark:text-neutral-200">4. Best results</h3>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-3">
        For best results when using an LLM with this pipeline:
      </p>
      <ul className="space-y-2 text-neutral-700 dark:text-neutral-300 leading-relaxed list-disc list-inside">
        <li><strong>Stick to the skill</strong> &mdash; the VERIFICATION-SKILL.md has hard rules (lint before deliver, parent-subagent retry protocol, signal codes). Make sure the LLM follows them.</li>
        <li><strong>Use sub-agents for compile</strong> &mdash; <Code>compile_veri</Code> with <Code>use_docker=True</Code> builds images, runs agents, and verifies. This is a long-running task &mdash; always spawn it as a sub-agent, never block the main session.</li>
        <li><strong>Lint is a hard gate</strong> &mdash; if lint fails, the LLM must fix the parse errors before showing the spec to anyone. A spec that doesn&apos;t lint is broken.</li>
        <li><strong>Three-round retry</strong> &mdash; the parent sub-agent retries up to 3 rounds with function-count feedback. If the agent reports <Code>IMPOSSIBLE</Code>, the parent validates the reasoning and decides whether to stop or re-prompt.</li>
        <li><strong>Python API over CLI</strong> &mdash; LLMs should use <Code>verify_and_convert()</Code> and <Code>compile_veri()</Code> directly rather than shelling out to the CLI. The API returns structured results, making it easier to handle errors.</li>
      </ul>

      <h3 className="mt-6 mb-2 text-lg font-semibold text-neutral-800 dark:text-neutral-200">5. Quick reference</h3>
      <Table>
        <thead>
          <tr className="border-b border-neutral-300 dark:border-neutral-600">
            <th className="py-2 pr-4 text-left font-semibold text-neutral-700 dark:text-neutral-300">Task</th>
            <th className="py-2 text-left font-semibold text-neutral-700 dark:text-neutral-300">What to tell the LLM</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {[
            ["New spec from scratch", "Write F* in a temp .veri.f.md, call verify_and_convert(), then lint before showing me the .veri.md"],
            ["Compile to C/Rust", "Read skills/VERIFICATION-SKILL.md, then call compile_veri() in a spawned sub-agent with Config(agent='claude', use_docker=True)"],
            ["Convert existing F*/Dafny", "Call verify_and_convert(code, target='fstar'|'dafny', module_name='...') and lint the result before showing it"],
            ["Fix a spec", "Get the skill, write the target code correctly, verify_and_convert(), lint &mdash; never patch Veri DSL directly"],
          ].map(([task, instruction]) => (
            <tr key={task as string}>
              <td className="py-2 pr-4 font-medium text-neutral-800 dark:text-neutral-200 text-sm">{task as string}</td>
              <td className="py-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{instruction as string}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Contributors */}
      <SectionTitle id="contributors">Contributors</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
        Veri Build is developed and maintained by{" "}
        <a href="https://github.com/devbali" className="text-blue-600 underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">@devbali</a>{" "}
        and the Veri DSL community.
        Contributions, issues, and feature requests are welcome on{" "}
        <a href="https://github.com/veri-md/veri-build" className="text-blue-600 underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">GitHub</a>.
      </p>
    </div>
  );
}
