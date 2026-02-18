import { useEffect, useState } from "react";

export const LOGO_DARK =
  "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20data-bbox='0%200%20181.55%2032.27'%20viewBox='0%200%20181.56%2032.27'%20xmlns='http://www.w3.org/2000/svg'%20data-type='color'%3e%3cg%3e%3cpath%20d='M162.7%208.18h4.71v6.02l7.47-6.02h6.37l-8.22%206.79%208.52%208.97h-6.27l-5.77-6.08c-.16-.07-1.79%201.45-2.11%201.61v4.47h-4.71V8.18Z'%20fill='%23000000'%20data-color='1'/%3e%3cpath%20d='M144.35%2020.63c4.52-.03%209.05-.36%2013.54-.9.05%201.41-.17%202.8-.1%204.22-1.25.14-2.51.14-3.76.2-6.06.29-14.33%201.67-14.9-6.58-.39-5.59.75-9.06%206.77-9.68%203.87-.21%207.76%200%2011.62.32l.17.23.1%203.96-13.44-1z'%20fill='%23000000'%20data-color='1'/%3e%3cpath%20d='M47.35%2020.63c4.52-.02%209.05-.37%2013.54-.9.08%201.42-.13%202.81-.1%204.22-2.32.24-4.64.25-6.98.3-3.31.07-8.36.53-10.48-2.65-1.54-2.3-1.53-7.55-.52-10.06%201.98-4.89%209.34-3.53%2013.51-3.65l4.36.3.1%204.22-13.44-1v9.23Z'%20fill='%23000000'%20data-color='1'/%3e%3cpath%20fill='%2304f87f'%20d='M14.34%2014.3H6.87L0%207.43%207.42%200l.2.1%206.72%206.73z'%20data-color='2'/%3e%3cpath%20fill='%2304f87f'%20d='M18.05%2014.3V6.83L24.78.1l.2-.1%207.42%207.43-6.87%206.87z'%20data-color='2'/%3e%3cpath%20fill='%2304f87f'%20d='M18.05%2018.02h7.48l6.87%206.87-7.27%207.29-.2.09-.21-.09-6.67-6.68z'%20data-color='2'/%3e%3cpath%20fill='%2304f87f'%20d='M14.34%2018.02v7.48l-6.66%206.68-.19.08-7.3-7.16-.1-.21.1-.2%206.68-6.67z'%20data-color='2'/%3e%3cpath%20d='M91.98%208.18v15.76h14.7c2.04-.16%204.49-.65%205.13-2.89.65-2.29-.18-4.6-2.68-5.04.32-.36.81-.46%201.19-.76%201.5-1.19%201.46-3.99.31-5.41-1.04-1.27-2.94-1.47-4.46-1.66h-14.2Zm15.15%209.44v2.61H96.7v-2.61zm-.6-5.72v2.51H96.7V11.9z'%20fill='%23000000'%20data-color='1'/%3e%3cpath%20d='M68%209.03c-3.13%201.61-3.45%205.44-3.18%208.61.32%203.63%202.16%205.54%205.68%206.26%203.55.72%2011.19.86%2014.05-1.61%202.88-2.49%202.83-10.18-.15-12.59-3.06-2.48-12.99-2.42-16.4-.66Zm13.45%203.07v7.93H70.01V12.1z'%20fill='%23000000'%20data-color='1'/%3e%3cpath%20d='M114.35%2023.94h5.12c.2-.42%201.25-3.02%201.47-3.1%202.95%200%205.95-.09%208.87.05l1.44%203.05h5.17l-7.57-15.66-6.83-.11-7.67%2015.76Zm13.75-6.62h-5.52l2.76-5.92z'%20fill='%23000000'%20data-color='1'/%3e%3c/g%3e%3c/svg%3e";

const LOGO_LIGHT =
  "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'?%3e%3csvg%20data-bbox='0%200%20181.55%2032.27'%20viewBox='0%200%20181.56%2032.27'%20xmlns='http://www.w3.org/2000/svg'%20data-type='color'%3e%3cg%3e%3cpath%20d='M162.7%208.18h4.71v6.02l7.47-6.02h6.37l-8.22%206.79%208.52%208.97h-6.27l-5.77-6.08c-.16-.07-1.79%201.45-2.11%201.61v4.47h-4.71V8.18Z'%20fill='%23ffffff'%20data-color='1'/%3e%3cpath%20d='M144.35%2020.63c4.52-.03%209.05-.36%2013.54-.9.05%201.41-.17%202.8-.1%204.22-1.25.14-2.51.14-3.76.2-6.06.29-14.33%201.67-14.9-6.58-.39-5.59.75-9.06%206.77-9.68%203.87-.21%207.76%200%2011.62.32l.17.23.1%203.96-13.44-1z'%20fill='%23ffffff'%20data-color='1'/%3e%3cpath%20d='M47.35%2020.63c4.52-.02%209.05-.37%2013.54-.9.08%201.42-.13%202.81-.1%204.22-2.32.24-4.64.25-6.98.3-3.31.07-8.36.53-10.48-2.65-1.54-2.3-1.53-7.55-.52-10.06%201.98-4.89%209.34-3.53%2013.51-3.65l4.36.3.1%204.22-13.44-1v9.23Z'%20fill='%23ffffff'%20data-color='1'/%3e%3cpath%20fill='%2304f87f'%20d='M14.34%2014.3H6.87L0%207.43%207.42%200l.2.1%206.72%206.73z'%20data-color='2'/%3e%3cpath%20fill='%2304f87f'%20d='M18.05%2014.3V6.83L24.78.1l.2-.1%207.42%207.43-6.87%206.87z'%20data-color='2'/%3e%3cpath%20fill='%2304f87f'%20d='M18.05%2018.02h7.48l6.87%206.87-7.27%207.29-.2.09-.21-.09-6.67-6.68z'%20data-color='2'/%3e%3cpath%20fill='%2304f87f'%20d='M14.34%2018.02v7.48l-6.66%206.68-.19.08-7.3-7.16-.1-.21.1-.2%206.68-6.67z'%20data-color='2'/%3e%3cpath%20d='M91.98%208.18v15.76h14.7c2.04-.16%204.49-.65%205.13-2.89.65-2.29-.18-4.6-2.68-5.04.32-.36.81-.46%201.19-.76%201.5-1.19%201.46-3.99.31-5.41-1.04-1.27-2.94-1.47-4.46-1.66h-14.2Zm15.15%209.44v2.61H96.7v-2.61zm-.6-5.72v2.51H96.7V11.9z'%20fill='%23ffffff'%20data-color='1'/%3e%3cpath%20d='M68%209.03c-3.13%201.61-3.45%205.44-3.18%208.61.32%203.63%202.16%205.54%205.68%206.26%203.55.72%2011.19.86%2014.05-1.61%202.88-2.49%202.83-10.18-.15-12.59-3.06-2.48-12.99-2.42-16.4-.66Zm13.45%203.07v7.93H70.01V12.1z'%20fill='%23ffffff'%20data-color='1'/%3e%3cpath%20d='M114.35%2023.94h5.12c.2-.42%201.25-3.02%201.47-3.1%202.95%200%205.95-.09%208.87.05l1.44%203.05h5.17l-7.57-15.66-6.83-.11-7.67%2015.76Zm13.75-6.62h-5.52l2.76-5.92z'%20fill='%23ffffff'%20data-color='1'/%3e%3c/g%3e%3c/svg%3e";

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 transition-transform duration-300"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 transition-transform duration-300"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const NAV_LINKS = [
  { label: "Why COBACK", href: "#" },
  { label: "Product", href: "#" },
  { label: "VSME", href: "#" },
  { label: "Knowledge", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <a className="flex items-center shrink-0" href="#">
            <img
              src={LOGO_DARK}
              alt="COBACK"
              width="80"
              height="18"
              className="h-[18px] w-auto dark:hidden"
              loading="eager"
              decoding="sync"
              fetchPriority="high"
            />
            <img
              src={LOGO_LIGHT}
              alt="COBACK"
              width="80"
              height="18"
              className="h-[18px] w-auto hidden dark:block"
              loading="eager"
              decoding="sync"
              fetchPriority="high"
            />
          </a>

          {/* Desktop nav links (lg+) */}
          <div className="hidden lg:flex items-center justify-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                className="px-4 py-2 text-[13px] font-medium rounded-full transition-colors duration-200 text-muted-foreground/80 hover:text-foreground"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Tablet nav links (md only) */}
          <div className="hidden md:flex lg:hidden items-center justify-center gap-0.5">
            {NAV_LINKS.slice(0, 3).map((link) => (
              <a
                key={link.label}
                className="px-2.5 py-2 text-[12px] font-medium rounded-full transition-colors duration-200 whitespace-nowrap text-muted-foreground/80 hover:text-foreground"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop right actions (lg+) */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent w-9 h-9 text-muted-foreground hover:text-foreground"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
              <span className="sr-only">Toggle theme</span>
            </button>
          </div>

          {/* Tablet right actions (md only) */}
          <div className="hidden md:flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent w-9 h-9 text-muted-foreground hover:text-foreground"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
              <span className="sr-only">Toggle theme</span>
            </button>
          </div>

          {/* Mobile right actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent w-9 h-9 text-muted-foreground hover:text-foreground"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
              <span className="sr-only">Toggle theme</span>
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-foreground/70 hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                className="block px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
