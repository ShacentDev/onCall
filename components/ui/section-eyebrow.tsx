import { cn } from "@/lib/utils";

interface SectionEyebrowProps {
  text: string;
  className?: string;
  centered?: boolean;
  dark?: boolean;
}

export function SectionEyebrow({
  text,
  className,
  centered = false,
  dark = false,
}: SectionEyebrowProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 mb-4",
        centered && "justify-center",
        className,
      )}
    >
      <div
        className={cn(
          "h-[2px] w-8 flex-shrink-0",
          dark ? "bg-amber-400" : "bg-red-600",
        )}
      />
      <span
        className={cn(
          "text-xs font-bold tracking-[0.12em] uppercase",
          dark ? "text-amber-400" : "text-red-600",
        )}
      >
        {text}
      </span>
      {centered && (
        <div
          className={cn(
            "h-[2px] w-8 flex-shrink-0",
            dark ? "bg-amber-400" : "bg-red-600",
          )}
        />
      )}
    </div>
  );
}