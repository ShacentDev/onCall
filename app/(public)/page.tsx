import { NAV_ITEMS } from "@/components/landing/nav";
import { NavCard } from "@/components/landing/nav-card";
import { Separator } from "@/components/ui/separator";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  return (
    <div className="space-y-10 pb-10">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
          Internal Tools
        </p>
        <h1 className="text-4xl font-bold tracking-tight">
          {getGreeting()}.
        </h1>
        <p className="text-muted-foreground text-sm mt-2">
          All operational modules in one place. Select one to get started.
        </p>
      </div>

      <Separator />

      <section aria-labelledby="modules-heading">
        <h2
          id="modules-heading"
          className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-4"
        >
          Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NAV_ITEMS.map((item, index) => (
            <NavCard key={item.href} item={item} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}