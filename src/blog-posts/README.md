# Blog Posts

Markdown files in this directory are blog posts. They're imported by `src/pages/BlogPost.tsx` via Vite's `import.meta.glob` and rendered with `react-markdown` + `remark-gfm` + `rehype-raw`.

## Adding a post

1. Create a `.md` file in this directory (e.g., `my-post.md`)
2. Add an entry to `BLOG_POSTS` in `src/pages/BlogPost.tsx` with `title`, `date`, and `desc`
3. Add an entry to the `POSTS` array in `src/pages/Blog.tsx` for the listing page

## Writing a post

Use standard markdown. Headings, code blocks, tables, lists all work.

## Rendering `.veri.md` content in a blog post

When you need to show what a `.veri.md` spec looks like (prose + Veri DSL blocks), use the same rendering style as the Quickstart page at `veri-md.com/#/quickstart`.

The pattern uses a bordered card with the doc title, section headings, and Veri DSL code blocks that have a "Veri DSL" tab bar. Use inline HTML via `rehype-raw`:

```html
<div class="veri-md-preview">
<h4 class="veri-section-title">Section Title</h4>
<p class="veri-section-desc">Description text.</p>

<div class="veri-code-block">
<div class="code-tab"><span>Veri DSL</span></div>
<pre>def fn(x: int) -> int:
    REQUIRES x > 0
    ENSURES x + 1</pre>
</div>
</div>
```

### Available CSS classes

Defined in `src/index.css`:

| Class | Use |
|---|---|
| `.veri-md-preview` | Outer container — white card with border, rounded corners, padding |
| `.veri-section-title` | Section heading inside the preview |
| `.veri-section-desc` | Description paragraph |
| `.veri-sub` | Subtitle / tagline below the title |
| `.veri-sep` | `<hr>` separator between sections |
| `.veri-code-block` | Veri DSL code block wrapper — gray background, rounded |
| `.code-tab` | The "Veri DSL" label bar at the top of a code block |

### Notes

- Always use these CSS classes as HTML attributes inside the markdown (rehype-raw passes them through)
- Don't use Tailwind utility classes in inline HTML — the Tailwind scanner won't detect them and they'll be purged. These CSS classes are safe because they're defined in `index.css`.
- The full spec at the end of a blog post should show all sections concatenated inside a single `.veri-md-preview` container

### Example: single section

```html
<div class="veri-md-preview">
<h4 class="veri-section-title">Sortedness</h4>
<p class="veri-section-desc">A list is sorted if adjacent elements are ordered by serial.</p>

<div class="veri-code-block">
<div class="code-tab"><span>Veri DSL</span></div>
<pre>def is_sorted(lst: list[Element]) -> bool:
    return match lst:
        case []: True
        case [_]: True
        case [hd1, hd2, *tl]: hd1.serial <= hd2.serial and is_sorted([hd2] + tl)</pre>
</div>
</div>
```

### Example: full spec

```html
<div class="veri-md-preview">
<h3>Sorted List</h3>
<p class="veri-sub">A verified sorted list targeting Dafny → Rust.</p>

<div class="veri-code-block">
<div class="code-tab"><span>Veri DSL</span></div>
<pre>TARGET dafny-rust
VERI_VERSION 0.0.2</pre>
</div>

<hr class="veri-sep" />

<h4 class="veri-section-title">Element type</h4>
<p class="veri-section-desc">Each element has a numeric serial and a string data field.</p>

<div class="veri-code-block">
<div class="code-tab"><span>Veri DSL</span></div>
<pre>class Element:
    serial: nat
    data: string</pre>
</div>
</div>
```
