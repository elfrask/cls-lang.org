"use client";

import { useState, type ReactNode } from "react";
import { PanelLeft } from "lucide-react";
import { DocsSidebar } from "@/components/docs/sidebar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function DocsShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-8 sm:px-6">
      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 lg:block">
        <div className="glass h-full overflow-hidden rounded-xl">
          <DocsSidebar />
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>

      <div className="fixed bottom-4 left-4 z-40 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="glass shadow-lg">
              <PanelLeft className="size-4" />
              <span className="sr-only">Docs menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Docs</SheetTitle>
            <DocsSidebar />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
