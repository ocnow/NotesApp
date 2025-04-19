import * as React from 'react';

export function Searchbar() {
  const [value, setValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+K on Mac or Ctrl+K on other OS
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault(); // Prevent browser's default find behavior
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="relative w-full max-w-xs lg:max-w-sm ml-4"> {/* Added ml-4 for spacing */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Search..." // Placeholder text
        value={value}
        onChange={(e) => setValue(e.target.value)}
        // Tailwind classes inspired by shadcn/ui Input component
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-500 dark:focus-visible:ring-gray-600"
      />
      {/* Keyboard shortcut hint */}
      <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
        <span className="text-xs">⌘</span>K
      </kbd>
    </div>
  );
}
