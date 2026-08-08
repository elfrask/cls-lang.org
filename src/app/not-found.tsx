import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <SearchX className="size-12 text-muted-foreground/40" />
      <p className="mt-6 font-mono text-6xl font-bold text-gradient">404</p>
      <h1 className="mt-3 text-xl font-semibold">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-lg border border-border bg-background px-4 py-2 text-sm hover:bg-muted"
      >
        Back to home
      </Link>
    </div>
  );
}
