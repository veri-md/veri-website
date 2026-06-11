import { Code, Pre, SectionTitle, Table } from "../components/Markdown";

export default function About() {
  return (
    <div className="animate-fade-in">
      {/* Pipeline */}
      <SectionTitle id="pipeline">Pipeline</SectionTitle>
      <Pre>
        <span className="text-blue-600 dark:text-blue-400">.veri.md</span>{" "}
        <span className="text-neutral-500">──►</span> lint{" "}
        <span className="text-neutral-500">──►</span> compile{" "}
        <span className="text-neutral-500">──►</span> verified code
      </Pre>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
        A <Code>.veri.md</Code> file is a markdown document — you write your specification
        in natural language, and Veri DSL goes inside <Code>```veri</Code> fenced code blocks.
        The pipeline extracts them, builds an AST, verifies against the target backend,
        and produces compilable output.
      </p>

      {/* Quick Example */}
      <SectionTitle id="example">Quick Example</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
        A TokenBucket spec with a refined type and contract:
      </p>
      <Pre>{`# Token Bucket Specification

\`\`\`veri
TARGET fstar-c

class TokenBucket:
    capacity: int
    tokens: int

type ValidBucket = TokenBucket WHERE tokens <= capacity

def consume(bucket: STATE_READ_WRITE ValidBucket, count: int) -> bool:
    REQUIRES count > 0
    ENSURES match result:
        case True:
            bucket.tokens >= 0
        case False:
            bucket.tokens >= 0
\`\`\``}</Pre>

      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
        The pipeline lints the spec (checks Low* compliance for C targets), fills
        <Code>#TODO</Code> blocks with an LLM agent inside a Docker sandbox, verifies the
        result, and compiles to the target output.
      </p>

      {/* Architecture */}
      <SectionTitle id="architecture">Architecture</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
        The pipeline is built on three layers:
      </p>

      <h3 className="mt-6 mb-2 text-lg font-semibold text-neutral-800 dark:text-neutral-200">Veri DSL (separate submodule)</h3>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
        A Pythonic contract specification language with bidirectional parsers and printers
        for F*, Dafny, and Python. The DSL lives in the{" "}
        <a href="https://github.com/devbali/Veri-DSL" className="text-blue-600 underline dark:text-blue-400" target="_blank" rel="noopener noreferrer">Veri-DSL repo</a>{" "}
        and is embedded as a git submodule at <Code>src/veri_build/dsl/</Code>.
      </p>

      <h3 className="mt-6 mb-2 text-lg font-semibold text-neutral-800 dark:text-neutral-200">Backend registry (plugin system)</h3>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
        Each target language is a self-contained plugin in <Code>src/veri_build/backend/</Code>.
        A backend provides agent extra rules, a verification command, and an extraction
        command. Adding a new backend means creating one file and registering it.
      </p>

      <h3 className="mt-6 mb-2 text-lg font-semibold text-neutral-800 dark:text-neutral-200">Pipeline orchestrator</h3>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <Code>pipeline.py</Code> coordinates lint, compile, and verify+convert. The compile
        step launches a single Docker container that runs
        <Code>compile_parent_subagent_runner.py</Code> — handling parsing, interface
        generation, sub-agent LLM fill, verification, and output in one process.
      </p>

      {/* Veri DSL */}
      <SectionTitle id="veri-dsl">Veri DSL Features</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
        Veri DSL is a Pythonic language for writing formal specifications in one
        syntax that compiles to verification backends via F*, Dafny, or Python contracts.
      </p>

      <Table>
        <thead>
          <tr className="border-b border-neutral-300 dark:border-neutral-600">
            <th className="py-2 pr-4 text-left font-semibold text-neutral-700 dark:text-neutral-300">Feature</th>
            <th className="py-2 pr-4 text-left font-semibold text-neutral-700 dark:text-neutral-300">Veri DSL Syntax</th>
            <th className="py-2 text-left font-semibold text-neutral-700 dark:text-neutral-300">Applies to</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {[
            ["Record types", "class Name: field: type", "All backends"],
            ["Refined types", "type T = Base WHERE pred", "All backends"],
            ["Contracts", "REQUIRES / ENSURES", "All backends"],
            ["Termination", "DECREASES expr", "All backends"],
            ["Quantifiers", "FORALL x IN set: body", "All backends"],
            ["Pattern match", "match x: case []: ...", "All backends"],
            ["Lambda", "lambda x: body", "All backends"],
            ["Ternary", "A if cond else B", "All backends"],
            ["Void return", "-> None:", "All backends"],
            ["State annotations", "STATE_READ_ONLY / STATE_WRITE_ONLY / STATE_READ_WRITE", "All backends"],
            ["Invariant blocks", "CONSTRAINT Name: ...", "All backends"],
            ["Cross-module import", "import Module", "All backends"],
            ["List patterns", "case []: / case [a, *rest]:", "All backends"],
            ["Comments", "# line comment", "All backends"],
            ["Version pinning", "VERI_VERSION 0.0.1", "Pipeline routing"],
            ["Target marker", "TARGET fstar-c", "Pipeline routing"],
          ].map(([feature, syntax, applies]) => (
            <tr key={feature as string}>
              <td className="py-2 pr-4 font-medium text-neutral-800 dark:text-neutral-200">{feature as string}</td>
              <td className="py-2 pr-4 font-mono text-sm text-neutral-600 dark:text-neutral-400">{syntax as string}</td>
              <td className="py-2 text-sm text-neutral-600 dark:text-neutral-400">{applies as string}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mt-4">
        Uppercase keywords (<Code>REQUIRES</Code>, <Code>ENSURES</Code>, <Code>FORALL</Code>, etc.)
        visually separate <em>what the code must satisfy</em> from <em>how the code computes</em>.
      </p>

      {/* Targets */}
      <SectionTitle id="targets">Supported Backends</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
        The backend registry system (new in v0.0.1) makes each target a self-contained plugin.
        Currently registered:
      </p>

      <Table>
        <thead>
          <tr className="border-b border-neutral-300 dark:border-neutral-600">
            <th className="py-2 pr-4 text-left font-semibold text-neutral-700 dark:text-neutral-300">TARGET</th>
            <th className="py-2 pr-4 text-left font-semibold text-neutral-700 dark:text-neutral-300">Toolchain</th>
            <th className="py-2 text-left font-semibold text-neutral-700 dark:text-neutral-300">Output</th>
            <th className="py-2 text-left font-semibold text-neutral-700 dark:text-neutral-300">Use Case</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {[
            ["fstar-c", "F* → Low* → KaRaMeL", ".c", "Embedded, WASM, verified C libraries"],
            ["fstar-ocaml", "F* → fstar --codegen OCaml", ".ml", "Verified OCaml"],
            ["fstar-wasm", "F* → krml -wasm", ".wasm", "WebAssembly targets"],
            ["dafny-java", "Dafny → dafny translate java", ".java", "Verified Java"],
            ["dafny-js", "Dafny → dafny translate js", ".js", "Verified JavaScript"],
            ["dafny-python", "Dafny → dafny translate py", ".py", "Verified Python"],
            ["dafny-rust", "Dafny → dafny translate rs", ".rs", "Verified Rust crates"],
            ["python-assert", "Python @contract", ".py", "Runtime assertion enforcement"],
          ].map(([target, toolchain, output, useCase]) => (
            <tr key={target as string}>
              <td className="py-2 pr-4 font-mono text-sm font-medium text-blue-700 dark:text-blue-400">{target as string}</td>
              <td className="py-2 pr-4 text-sm text-neutral-600 dark:text-neutral-400">{toolchain as string}</td>
              <td className="py-2 pr-4 text-sm text-neutral-600 dark:text-neutral-400">{output as string}</td>
              <td className="py-2 text-sm text-neutral-600 dark:text-neutral-400">{useCase as string}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-2">
        Dafny backends require the Dafny runtime library (<Code>DafnyRuntime.jar</Code>{" "}
        for Java, <Code>dafny.js</Code> for JS, <Code>dafny.py</Code> for Python)
        — not bundled automatically.
      </p>

      {/* APIs */}
      <SectionTitle id="api">Pipeline APIs</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
        The pipeline exposes four APIs. The primary workflow is{" "}
        <strong>verify+convert</strong>: write F*/Dafny code, verify it, then
        convert to Veri DSL for the user.
      </p>

      <Table>
        <thead>
          <tr className="border-b border-neutral-300 dark:border-neutral-600">
            <th className="py-2 pr-4 text-left font-semibold text-neutral-700 dark:text-neutral-300">API</th>
            <th className="py-2 pr-4 text-left font-semibold text-neutral-700 dark:text-neutral-300">Direction</th>
            <th className="py-2 text-left font-semibold text-neutral-700 dark:text-neutral-300">Purpose</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {[
            ["verify_and_convert(code, target, name)", "F*/Dafny → Veri DSL", "Verify target code, convert to Veri DSL (primary)"],
            ["convert_fstar_to_veri(code)", "F* → Veri DSL", "Straight conversion, no verification"],
            ["lint(spec_path, target)", "Veri DSL → verify", "Validate .veri.md compiles to well-formed target"],
            ["compile_veri(spec, config)", "Veri DSL → C/Rust/Python", "Full pipeline: agent fills TODOs, verify, emit"],
          ].map(([api, dir, purpose]) => (
            <tr key={api as string}>
              <td className="py-2 pr-4 font-mono text-sm text-blue-700 dark:text-blue-400">{api as string}</td>
              <td className="py-2 pr-4 text-sm text-neutral-600 dark:text-neutral-400">{dir as string}</td>
              <td className="py-2 text-sm text-neutral-600 dark:text-neutral-400">{purpose as string}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* CLI */}
      <SectionTitle id="cli">CLI Usage</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-3">
        Lint a spec:
      </p>
      <Pre><span className="text-green-700 dark:text-green-400">$</span> python3 -m veri_build.pipeline lint path/to/file.veri.md --target fstar</Pre>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed my-3">
        Compile (Docker sandbox, Claude Code):
      </p>
      <Pre><span className="text-green-700 dark:text-green-400">$</span> python3 -m veri_build.pipeline compile path/to/file.veri.md --target fstar --agent claude -o build/</Pre>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed my-3">
        Compile with OpenClaw, no Docker:
      </p>
      <Pre><span className="text-green-700 dark:text-green-400">$</span> python3 -m veri_build.pipeline compile path/to/file.veri.md --target dafny --agent openclaw --no-docker -o build/</Pre>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed my-3">
        Convert F* to Veri DSL:
      </p>
      <Pre><span className="text-green-700 dark:text-green-400">$</span> python3 -m veri_build.pipeline convert path/to/fstar_code.fst</Pre>

      {/* Key changes in v0.0.1 */}
      <SectionTitle id="changes">What's New in v0.0.1</SectionTitle>
      <ul className="space-y-2 text-neutral-700 dark:text-neutral-300 leading-relaxed list-disc list-inside">
        <li><strong>Backend registry</strong> — Plugin system replacing hardcoded targets. Each backend provides its own agent rules, verification, and extraction. Adding a new output language means one new <Code>.py</Code> file.</li>
        <li><strong>8 targets</strong> — Up from 3. C, OCaml, Wasm (F*); Java, JS, Python, Rust (Dafny); plus Python assert.</li>
        <li><strong>Multi-turn agent</strong> — The sub-agent now does self-check (write → verify → fix → retry) with function-count feedback over 3 rounds.</li>
        <li><strong>Cross-module imports</strong> — <Code>import Module</Code> resolves CamelCase→snake_case, inlines type declarations from other <Code>.veri.md</Code> files.</li>
        <li><strong>Lint enforcement</strong> — Every <Code>def</Code> with contracts must have a body, <Code>EXTERN</Code>, or <Code>#TODO</Code>. No more unimplemented interfaces passing lint.</li>
        <li><strong>DSL parser fixes</strong> — <Code>elif</Code> keyword, leading <Code>if</Code> forms, proper body consumption for contract functions, Dafny 4 <Code>function</Code> (not <Code>function method</Code>).</li>
        <li><strong>Version pinning</strong> — <Code>VERI_VERSION 0.0.1</Code> in specs. Lint checks match. Git tags track language changes.</li>
        <li><strong>Direction annotations</strong> — <Code>STATE_READ_ONLY</Code>, <Code>STATE_WRITE_ONLY</Code>, <Code>STATE_READ_WRITE</Code> for memory effect contracts.</li>
        <li><strong>Invariant blocks</strong> — <Code>CONSTRAINT Name: ...</Code> for system invariants.</li>
      </ul>

      {/* Contract discipline */}
      <SectionTitle id="contracts">Pure Contract Discipline</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <Code>REQUIRES</Code> / <Code>ENSURES</Code> conditions must be <strong>pure expressions</strong> —
        no side effects, no I/O, no mutation. The target code can have real effects
        (C writes to buffers, Rust I/O, Python file operations), but the contracts
        that guard them must evaluate without side effects.
      </p>

      {/* Repo */}
      <SectionTitle id="repo">Source</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
        The full pipeline is open source. Veri DSL is a separate repo with its own docs:
      </p>
      <ul className="mt-2 space-y-1 text-sm">
        <li>
          <a
            href="https://github.com/veri-md/veri-build"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:text-blue-800 underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            veri-md/veri-build
          </a>{" "}
          <span className="text-neutral-500 dark:text-neutral-400">— Pipeline, CLI, Docker, backends</span>
        </li>
        <li>
          <a
            href="https://github.com/devbali/Veri-DSL"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:text-blue-800 underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            devbali/Veri-DSL
          </a>{" "}
          <span className="text-neutral-500 dark:text-neutral-400">— DSL grammar, parsers, printers (git submodule)</span>
        </li>
      </ul>
    </div>
  );
}
