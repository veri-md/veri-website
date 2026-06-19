import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Import all blog post markdown files as raw strings
const postModules = import.meta.glob("/src/blog-posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const BLOG_POSTS: Record<string, { title: string; date: string; desc: string }> = {
  "sorted-list-quickstart": {
    title: "Quick Start: Verified Sorted List with Veri DSL",
    date: "2026-06-19",
    desc: "Write, lint, and compile a formally verified sorted list targeting Dafny → Rust.",
  },
};

function slugFromPath(path: string): string {
  const parts = path.split("/");
  const file = parts[parts.length - 1];
  return file.replace(/\.md$/, "");
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const meta = slug ? BLOG_POSTS[slug] : undefined;

  const content = useMemo(() => {
    if (!slug) return "";
    for (const [path, raw] of Object.entries(postModules)) {
      if (slugFromPath(path) === slug) return raw;
    }
    return "";
  }, [slug]);

  if (!meta) {
    return (
      <div className="animate-fade-in py-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          Post not found
        </h1>
        <Link to="/blog" className="text-blue-600 dark:text-blue-400 underline">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="animate-fade-in py-16 max-w-3xl mx-auto">
      <Link
        to="/blog"
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        ← Back to blog
      </Link>
      <header className="mt-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {meta.title}
        </h1>
        <time className="mt-2 block text-sm text-neutral-500 dark:text-neutral-400">
          {meta.date}
        </time>
      </header>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
      </div>
    </article>
  );
}
