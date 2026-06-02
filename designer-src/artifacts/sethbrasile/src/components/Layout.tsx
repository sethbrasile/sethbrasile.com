import { ReactNode } from "react";
import { Navigation } from "./Navigation";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <Navigation />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>
      <footer className="border-t border-border/40 py-8 mt-12">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Seth Brasile. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="https://github.com/sethbrasile" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
            <a href="https://youtube.com/@byteMyCache" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">YouTube</a>
            <a href="https://www.linkedin.com/in/sethbrasile-43a315a0" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
            <a href="https://bytemycache.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Blog</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
