"use client";

import { SidebarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/images/logo-fix.png"
            alt="Andrawina Logo Fixed"
            width={30}
            height={30}
          />
          <h1 className="font-semibold">Andrawina Kuliner</h1>
        </Link>
      </div>
    </header>
  );
}
