import Loading from "@/components/loading";
import React, { Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SWRProvider } from "@/lib/swr-provider";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <SWRProvider>
              <Suspense fallback={<Loading />}>
                <main className="p-6">{children}</main>
              </Suspense>
            </SWRProvider>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default layout;
