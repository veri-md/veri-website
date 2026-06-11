import { useDarkMode } from "../hooks/useDarkMode";
import { HeaderLinks } from "../consts";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { dark, toggle } = useDarkMode();
  const location = useLocation();

  return (
    <header className="flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full py-7">
      <nav
        className="relative max-w-7xl w-full flex flex-wrap md:grid md:grid-cols-12 basis-full items-center px-4 mx-auto"
        aria-label="Global"
      >
        <div className="md:col-span-3">
          <Link
            className="flex-none flex items-center gap-2"
            to="/"
            aria-label="Veri Build home"
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="8" fill="#2563eb" />
              <text x="18" y="24" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="monospace">V</text>
            </svg>
            <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
              Veri Build
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-x-2 ms-auto py-1 md:ps-6 md:order-3 md:col-span-3">
          {/* Dark mode toggle */}
          <button
            type="button"
            className="inline-flex items-center gap-x-2 py-2 px-3 rounded-full text-sm text-neutral-600 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700 transition"
            onClick={toggle}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? (
              // Moon icon
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              // Sun icon
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button
              type="button"
              className="size-[38px] flex justify-center items-center text-sm font-semibold rounded-xl text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
              aria-label="Toggle navigation"
              onClick={() => {
                document.getElementById("navbar-collapse")?.classList.toggle("hidden");
              }}
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <div
          id="navbar-collapse"
          className="hidden overflow-hidden transition-all duration-300 basis-full grow md:block md:w-auto md:basis-auto md:order-2 md:col-span-6"
        >
          <div className="flex flex-col gap-y-4 gap-x-0 mt-5 md:flex-row md:justify-center md:items-center md:gap-y-0 md:gap-x-7 md:mt-0">
            {HeaderLinks.map((link) => {
              const isActive = location.pathname === link.href || (link.href === "/" && location.pathname === "/");
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-3 font-medium transition ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-neutral-900 hover:text-neutral-600 dark:text-neutral-400 dark:hover:text-neutral-200"
                  }`}
                >
                  {link.title}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
