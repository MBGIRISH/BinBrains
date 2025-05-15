export function AppFooter() {
  return (
    <footer className="py-8 border-t">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} BinBrain. All rights reserved.
      </div>
    </footer>
  );
}
