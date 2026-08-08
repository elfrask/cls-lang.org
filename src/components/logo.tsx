import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-8 w-8 items-center justify-center rounded-lg glass text-sm font-bold tracking-tight",
        className,
      )}
    >
      <span className="bg-gradient-to-br from-[#4ec9b0] to-[#cba6f7] bg-clip-text text-transparent">
        CLS
      </span>
    </span>
  );
}
