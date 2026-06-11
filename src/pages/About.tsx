import { Code, Pre, SectionTitle, Table } from "../components/Markdown";

export default function About() {
  return (
    <div className="animate-fade-in">
      {/* Pipeline */}
      <SectionTitle>Pipeline</SectionTitle>
      <Pre>
        <span className="text-blue-600 dark:text-blue-400">.veri.md</span>{" "}
        <span className="text-neutral-500">──►</span> lint{" "}
        <span className="text-neutral-500">──►</span> compile{" "}
        <span className="text-neutral-500">──►</span> verified code
      </Pre>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
        A <Code>.veri.md</Code> file is a markdown document — you write your specification
        in natural language, and Veri DSL goes inside <Code>```veri</Code> fenced code blocks.
        The pipeline extracts them, builds an AST, verifies, and compiles to a target backend.
      </p>

      {/* Example */}
      <SectionTitle id="example">Quick Example</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
        Here's a sorted list specification written in Veri DSL:
      </p>
      <Pre>{`# Sorted List Specification

\`\`\`veri
TARGET f-star-c
\`\`\`

\`\`\`veri
class Element:
    serial: nat
    data:   string

def is_sorted(lst: list[Element]) -> bool:
    return match lst:
        case []: True
        case [_]: True
        case [hd1, hd2, *tl]:
            hd1.serial <= hd2.serial
            and is_sorted([hd2] + tl)

type valid_sorted_list = list[Element] WHERE is_sorted(lst)

def add_element(
    existing: valid_sorted_list,
    new_elem: Element,
) -> valid_sorted_list:
    REQUIRES True
    ENSURES (is_sorted(result)
             and len(result) == len(existing) + 1)
\`\`\``}</Pre>

      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
        The pipeline lints the spec, fills <Code>#TODO</Code> blocks with an LLM agent
        inside a Docker sandbox, verifies the result, and emits target code.
      </p>

      {/* Veri DSL */}
      <SectionTitle id="veri-dsl">Veri DSL</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
        Veri DSL is a Pythonic language for writing formal specifications in one
        syntax that compiles to three backends: F* (→ C via KaRaMeL), Dafny (→ Rust),
        and Python (runtime <Code>@contract</Code> enforcement).
      </p>

      <Table>
        <thead>
          <tr className="border-b border-neutral-300 dark:border-neutral-600">
            <th className="py-2 pr-4 text-left font-semibold text-neutral-700 dark:text-neutral-300">Construct</th>
            <th className="py-2 pr-4 text-left font-semibold text-neutral-700 dark:text-neutral-300">Syntax</th>
            <th className="py-2 text-left font-semibold text-neutral-700 dark:text-neutral-300">Backends</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {[
            ["Record types", "class Name: field: type", "F* / Dafny / Python"],
            ["Abstract types", "type Name: kind", "F* / Dafny"],
            ["Type aliases", "type Name = expr", "F* / Dafny"],
            ["Refined types", "type T = Base WHERE pred", "F* / Dafny / Python"],
            ["Predicates", "def f(x: T) -> bool:", "F* / Dafny / Python"],
            ["Contracts", "REQUIRES / ENSURES", "F* / Dafny / Python"],
            ["Quantifiers", "FORALL x IN set: body", "F* / Dafny / Python"],
            ["Pattern match", "match x: case []: ...", "F* / Dafny / Python"],
            ["List ops", "[hd, *tl], len(x)", "F* / Dafny / Python"],
            ["Target marker", "TARGET f-star-c", "Pipeline routing"],
          ].map(([construct, syntax, backends]) => (
            <tr key={construct as string}>
              <td className="py-2 pr-4 font-medium text-neutral-800 dark:text-neutral-200">{construct as string}</td>
              <td className="py-2 pr-4 font-mono text-sm text-neutral-600 dark:text-neutral-400">{syntax as string}</td>
              <td className="py-2 text-sm text-neutral-600 dark:text-neutral-400">{backends as string}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Targets */}
      <SectionTitle id="targets">Targets</SectionTitle>
      <Table>
        <thead>
          <tr className="border-b border-neutral-300 dark:border-neutral-600">
            <th className="py-2 pr-4 text-left font-semibold text-neutral-700 dark:text-neutral-300">Target</th>
            <th className="py-2 pr-4 text-left font-semibold text-neutral-700 dark:text-neutral-300">Toolchain</th>
            <th className="py-2 text-left font-semibold text-neutral-700 dark:text-neutral-300">Use Case</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {[
            ["f-star-c", "F* → Low* → KaRaMeL → C", "Embedded, WASM, verified C libraries"],
            ["dafny-rust", "Dafny → Rust", "Verified Rust crates"],
            ["python-assert", "Python @contract", "Runtime enforcement in Python"],
          ].map(([target, toolchain, useCase]) => (
            <tr key={target as string}>
              <td className="py-2 pr-4 font-mono text-sm font-medium text-neutral-800 dark:text-neutral-200">{target as string}</td>
              <td className="py-2 pr-4 text-sm text-neutral-600 dark:text-neutral-400">{toolchain as string}</td>
              <td className="py-2 text-sm text-neutral-600 dark:text-neutral-400">{useCase as string}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* CLI Workflow */}
      <SectionTitle id="workflow">CLI Workflow</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
        Lint a spec to verify the interface:
      </p>
      <Pre><span className="text-green-700 dark:text-green-400">$</span> python3 -m veri_build.pipeline lint sorted_list.veri.md</Pre>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed my-4">
        Compile (fill TODOs + verify + emit):
      </p>
      <Pre><span className="text-green-700 dark:text-green-400">$</span> python3 -m veri_build.pipeline compile sorted_list.veri.md --agent claude</Pre>

      {/* Pure contracts */}
      <SectionTitle id="contracts">Pure Contract Discipline</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <Code>REQUIRES</Code> / <Code>ENSURES</Code> conditions must be <strong>pure expressions</strong> —
        no side effects, no I/O, no mutation. The target code can have real effects
        (C writes to buffers, Rust I/O, Python file operations), but the contracts
        that guard them must evaluate without side effects.
      </p>

      {/* Pipeline APIs */}
      <SectionTitle id="api">Pipeline APIs</SectionTitle>
      <Table>
        <thead>
          <tr className="border-b border-neutral-300 dark:border-neutral-600">
            <th className="py-2 pr-4 text-left font-semibold text-neutral-700 dark:text-neutral-300">API</th>
            <th className="py-2 text-left font-semibold text-neutral-700 dark:text-neutral-300">What it does</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {[
            ["verify_and_convert(code, target, name)", "Verify F*/Dafny code + convert to Veri DSL"],
            ["compile_veri(spec, config)", "Full pipeline: extract → agent → verify → compile"],
            ["lint_interface(spec, target)", "Parse + verify interface (fast, no agent)"],
            ["read_spec(path)", "Parse .veri.md into ExtractedSpec"],
          ].map(([api, desc]) => (
            <tr key={api as string}>
              <td className="py-2 pr-4 font-mono text-sm text-blue-700 dark:text-blue-400">{api as string}</td>
              <td className="py-2 text-sm text-neutral-600 dark:text-neutral-400">{desc as string}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Repo */}
      <SectionTitle id="repo">Source</SectionTitle>
      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
        This project is open source on GitHub. Check it out at{" "}
        <a
          href="https://github.com/veri-md/veri-build"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-600 hover:text-blue-800 underline dark:text-blue-400 dark:hover:text-blue-300"
        >
          github.com/veri-md/veri-build
        </a>.
      </p>
    </div>
  );
}
