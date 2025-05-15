import { Recycle } from 'lucide-react';
import Link from 'next/link';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center max-w-7xl mx-auto px-4">
        <Link href="/" className="flex items-center space-x-2.5 mr-6">
          <Recycle className="h-7 w-7 text-primary" />
          <span className="font-bold text-2xl tracking-tight">BinBrain</span>
        </Link>
        {/* Optional: Navigation links can be added here */}
        {/* <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link href="#simulation" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Simulation</Link>
          <Link href="#tips" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Tips</Link>
          <Link href="#guide" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Sorting Guide</Link>
        </nav> */}
      </div>
    </header>
  );
}
