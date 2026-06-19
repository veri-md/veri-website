# Blog Posts

Markdown files in this directory are blog posts. They're imported by `src/pages/BlogPost.tsx` via Vite's `import.meta.glob` and rendered with `react-markdown` + `remark-gfm` + `rehype-raw`.

## Adding a post

1. Create a `.md` file in this directory (e.g., `my-post.md`)
2. Add an entry to `BLOG_POSTS` in `src/pages/BlogPost.tsx` with `title`, `date`, and `desc`
3. Add an entry to the `POSTS` array in `src/pages/Blog.tsx` for the listing page

## Writing a post

Use standard markdown. Headings, code blocks, tables, lists all work.

### Showing `.veri.md` content

When a blog post shows what a `.veri.md` file looks like (prose + Veri DSL blocks), use this pattern instead of nesting markdown fences:

```html
<div class="veri-md">
  <div class="veri-title">Section Title</div>
  <div class="veri-p">Description text.</div>

  <pre class="veri-dsl">def fn(x: int) -> int:
    REQUIRES x > 0
    ENSURES x + 1</pre>
</div>
```

The `veri-md` box renders as a gray panel with a blue left border — visually distinct from the blog prose. Inside it:

| Class | Use |
|---|---|
| `.veri-title` | Document title (large, bold) |
| `.veri-h2` | Section heading within the doc |
| `.veri-p` | Prose description paragraph |
| `.veri-sub` | Subtitle / tagline (smaller, muted) |
| `.veri-dsl` | Veri DSL code block (nested `<pre>`) |
| `.veri-sep` | `<hr>` separator between sections |

Never use raw markdown fences inside a `veri-md` box — use the HTML elements above. This avoids nested-fence parsing issues and keeps the rendering consistent.

### Code blocks

Use standard markdown fenced code blocks for everything outside `veri-md` boxes:

````markdown
```dafny
function f(x: int): int { x + 1 }
```

```rust
pub fn f(x: i32) -> i32 { x + 1 }
```

```bash
docker run ...
```
````

## What imports these files

`src/pages/BlogPost.tsx` uses:

```typescript
const postModules = import.meta.glob("/src/blog-posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
```

Files are bundled as raw strings. The slug is derived from the filename (e.g., `sorted-list-quickstart.md` → slug `sorted-list-quickstart`).
