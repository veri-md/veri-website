# Quick Start: Verified Sorted List with Veri DSL

Veri DSL is a specification language for formal verification. You write contracts in a Pythonic syntax, and the pipeline compiles them to verified code across many backends — for example **C (via F* + KaRaMeL)** or **Rust (via Dafny)**. One spec, multiple targets.

> **You don't write Veri DSL yourself.** The LLM generates all Veri DSL for you — it knows the grammar, the backends, and what each target expects. Your job is to **read** the spec, understand the contracts, and verify they capture the right properties. The Veri DSL is always shown to you as a readable, reviewable artifact, never as something you need to type from scratch.

This guide walks through the full workflow — write, lint, compile — using a sorted list example targeting Dafny → Rust.

---

## What We're Building

A `ValidSortedList` — a list of `Element` records that must always remain sorted by `serial` number. Every insertion preserves the invariant.

---

## Step 1: The Spec

A `.veri.md` file is a markdown document. Prose describes intent; ` ```veri ` blocks contain the contracts. In this guide, `.veri.md` content is shown inside gray boxes — the natural language text you see there is what the LLM writes around the formal blocks.

### Target Declaration

The first Veri DSL block declares the backend and version:

<div class="veri-md"><div class="veri-title">Sorted List</div>
<div class="veri-sub">A verified sorted list targeting Dafny → Rust.</div>

<pre class="veri-dsl">TARGET dafny-rust
VERI_VERSION 0.0.2</pre></div>

`TARGET dafny-rust` routes through the Dafny verifier → Rust compiler.  
`VERI_VERSION` is checked by the linter — major.minor must match the toolchain.

### Element Record

A section header and prose description precede the record definition:

<div class="veri-md"><div class="veri-h2">Element type</div>
<div class="veri-p">Each element has a numeric serial and a string data field.</div>

<pre class="veri-dsl">class Element:
    serial: nat
    data: string</pre></div>

This maps to a Dafny `datatype` — a record with two immutable fields.

### Sortedness Predicate and Refined Type

The predicate defines what sorted means; `WHERE` attaches it to the type:

<div class="veri-md"><div class="veri-h2">Sortedness</div>
<div class="veri-p">A list is sorted if adjacent elements are ordered by serial.</div>

<pre class="veri-dsl">def is_sorted(lst: list[Element]) -> bool:
    return match lst:
        case []: True
        case [_]: True
        case [hd1, hd2, *tl]: hd1.serial <= hd2.serial and is_sorted([hd2] + tl)

type ValidSortedList = list[Element] WHERE is_sorted(lst)</pre></div>

Pattern matching on lists with `[hd, *tail]` syntax — three cases for empty, single, and adjacent pairs. `WHERE` attaches the predicate directly to the type, guaranteeing every `ValidSortedList` value is sorted. (Alternately, you can inline the check in `ENSURES` without a named predicate, but `WHERE` keeps the refinement on the type where it belongs.)

### Function Contract

Documentation plus the contract and a `#TODO` marker:

<div class="veri-md"><div class="veri-h2">Adding an element</div>
<div class="veri-p">Insert a new element while preserving sorted order.</div>

<pre class="veri-dsl">def add_element(existing: ValidSortedList, new_elem: Element) -> ValidSortedList:
    REQUIRES True
    ENSURES len(result) == len(existing) + 1

#TODO</pre></div>

`REQUIRES` is the precondition (always true here — the function accepts any input).

`ENSURES` is the postcondition. Notice sortedness isn't in `ENSURES` — it's already guaranteed by the `WHERE` clause on the return type. The `ENSURES` here only adds what `WHERE` can't express: that the list grows by exactly one element.

You can add more conditions if you want to constrain the LLM's implementation more tightly. For example, you could assert `new_elem` actually appears in the result:

```veri
def add_element(existing: ValidSortedList, new_elem: Element) -> ValidSortedList:
    REQUIRES True
    ENSURES (len(result) == len(existing) + 1
             and FORALL i IN range(0, len(result)):
                     result[i] == new_elem
                     or FORALL j IN range(0, len(existing)):
                             result[i] == existing[j])

#TODO
```

How much you specify is a tradeoff. More contracts = stronger guarantees, but also more verification work and less room for the LLM to find a clever implementation. The `WHERE` refinement already proves sortedness; add only the conditions that actually matter for correctness.

`#TODO` marks the implementation for the compile step — the LLM agent fills it inside the Docker sandbox.

Every `.veri.md` is linted before the model shows it to you. The model runs the linter internally, which parses all Veri DSL blocks, checks the `VERI_VERSION` against the toolchain, generates the target interface (Dafny `.dfy`), and verifies it with `dafny verify`. If lint fails, the model fixes the spec and re-lints until it passes. The lint guarantees the spec is well-formed and the interface is consistent — you never see a spec that doesn't parse.

---

## Step 2: Compile → Rust

You give the pipeline the `.veri.md`. You get back verified Rust.

```bash
docker run --rm -v $(pwd)/sorted_list.veri.md:/spec.veri.md verification-builder \
    "veri-build compile /spec.veri.md --target dafny-rust"
```

That's the entire user-facing command. Inside the Docker sandbox, the pipeline generates the Dafny interface, launches an LLM agent to fill `#TODO` with an implementation, runs `dafny verify` on the filled code, and runs `dafny translate rs` to emit Rust. You don't see any of that — you just get `SortedList.rs`, verified and ready.

---

## Full Spec and Resulting Code

### The `.veri.md` (as the LLM writes it)

The complete file — prose and Veri DSL blocks together, exactly as the LLM produces it:

<div class="veri-md"><div class="veri-title">Sorted List</div>
<div class="veri-sub">A verified sorted list targeting Dafny → Rust.</div>

<pre class="veri-dsl">TARGET dafny-rust
VERI_VERSION 0.0.2</pre>

<hr class="veri-sep" />

<div class="veri-h2">Element type</div>
<div class="veri-p">Each element has a numeric serial and a string data field.</div>

<pre class="veri-dsl">class Element:
    serial: nat
    data: string</pre>

<hr class="veri-sep" />

<div class="veri-h2">Sortedness</div>
<div class="veri-p">A list is sorted if adjacent elements are ordered by serial.</div>

<pre class="veri-dsl">def is_sorted(lst: list[Element]) -> bool:
    return match lst:
        case []: True
        case [_]: True
        case [hd1, hd2, *tl]: hd1.serial <= hd2.serial and is_sorted([hd2] + tl)

type ValidSortedList = list[Element] WHERE is_sorted(lst)</pre>

<hr class="veri-sep" />

<div class="veri-h2">Adding an element</div>
<div class="veri-p">Insert a new element while preserving sorted order.</div>

<pre class="veri-dsl">def add_element(existing: ValidSortedList, new_elem: Element) -> ValidSortedList:
    REQUIRES True
    ENSURES len(result) == len(existing) + 1

#TODO</pre></div>

### Resulting Dafny (filled by the agent)

The agent fills `#TODO` with a recursive insertion. `ValidSortedList` remains a subset type with the `is_sorted` constraint — Dafny verifies the function body satisfies it automatically.

```dafny
module SortedList {

    datatype Element = Element(serial: nat, data: string)

    function is_sorted(lst: seq<Element>): bool
    {
        if |lst| <= 1 then true
        else lst[0].serial <= lst[1].serial && is_sorted(lst[1..])
    }

    type ValidSortedList = x: seq<Element> | is_sorted(x)

    function add_element(
        existing: ValidSortedList,
        new_elem: Element
    ): (result: ValidSortedList)
      requires true
      ensures |result| == |existing| + 1
    {
        if existing == [] then [new_elem]
        else if new_elem.serial <= existing[0].serial then
            [new_elem] + existing
        else
            [existing[0]] + add_element(existing[1..], new_elem)
    }
}
```

### Compiled Rust

```rust
pub mod SortedList {
    pub use ::dafny_runtime::Sequence;

    pub struct Element {
        pub serial: ::dafny_runtime::nat,
        pub data: ::dafny_runtime::Sequence<::dafny_runtime::DafnyChar>,
    }

    pub type ValidSortedList = Sequence<::std::rc::Rc<Element>>;

    pub fn is_sorted(lst: &Sequence<::std::rc::Rc<Element>>) -> bool {
        if lst.cardinality() <= 1.into() {
            true
        } else {
            lst.get(&0.into()).serial().clone()
                <= lst.get(&1.into()).serial().clone()
                && is_sorted(&lst.drop(&1.into()))
        }
    }

    pub fn add_element(
        existing: &ValidSortedList,
        new_elem: &::std::rc::Rc<Element>,
    ) -> ValidSortedList {
        if existing.clone().to_array().len() == 0 {
            seq![new_elem.clone()]
        } else if new_elem.serial().clone() <= existing.get(&0.into()).serial().clone() {
            seq![new_elem.clone()].concat(&existing)
        } else {
            seq![existing.get(&0.into())]
                .concat(&add_element(&existing.drop(&1.into()), new_elem))
        }
    }
}
```

Every `add_element` call was verified by Dafny to return a sorted list before the Rust was ever emitted.

---

## Summary

```
Describe in natural language  →  LLM writes .veri.md  →  Lint  →  Compile  →  Verified Rust
```

You never write Veri DSL. You describe what you want, review the contracts the LLM produces, and collect the verified output.

**Next steps:** Describe a different data structure (ring buffer, binary search tree, priority queue) and let the pipeline produce the spec and verified code.

---

*Built with [veri-build](https://github.com/veri-md/veri-build) — Formal Verification Pipeline*
