import { Link } from "react-router-dom";

const POSTS = [
  {
    slug: "sorted-list-quickstart",
    title: "Quick Start: Verified Sorted List with Veri DSL",
    date: "2026-06-17",
    desc: "Write, lint, and compile a formally verified sorted list targeting Dafny → Rust.",
  },
];

export default function Blog() {
  return (
    <div className="animate-fade-in py-16">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-8">
        Blog
      </h1>
      {POSTS.length === 0 ? (
        <p className="text-lg text-neutral-500 dark:text-neutral-400">
          Coming soon &mdash; posts on formal verification, Veri DSL patterns,
          and verified compilation workflows.
        </p>
      ) : (
        <ul className="space-y-6">
          {POSTS.map((post) => (
            <li key={post.slug}>
              <Link
                to={`/blog/${post.slug}`}
                className="block rounded-lg border border-neutral-200 p-5 transition hover:border-blue-400 dark:border-neutral-700 dark:hover:border-blue-500"
              >
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  {post.title}
                </h2>
                <time className="mt-1 block text-sm text-neutral-500 dark:text-neutral-400">
                  {post.date}
                </time>
                <p className="mt-2 text-neutral-600 dark:text-neutral-300">
                  {post.desc}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
