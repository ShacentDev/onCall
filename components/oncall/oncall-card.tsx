"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Stethoscope } from "lucide-react";

export function OnCallCard({ data }: { data: any }) {
  const now = new Date();
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  const isOnCall = now >= start && now <= end;

  return (
    <Card className="p-0 rounded-2xl border hover:shadow-md transition-all duration-200 h-full">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-lg flex items-center gap-2 truncate">
              <Stethoscope className="h-4 w-4 shrink-0 text-primary" />

              <span className="truncate">
                {data.person?.name}
              </span>

              {data.person?.code && (
                <span className="text-[11px] px-2 py-[2px] rounded bg-muted text-muted-foreground shrink-0">
                  {data.person.code}
                </span>
              )}
            </h3>

            <p className="text-sm text-muted-foreground truncate">
              {data.person?.category?.name}
            </p>
          </div>

          <Badge
            className={
              isOnCall
                ? "bg-green-600 text-white shrink-0"
                : "bg-yellow-500 text-white shrink-0"
            }
          >
            {isOnCall ? "On Call" : "Standby"}
          </Badge>
        </div>

        <div className="flex flex-col justify-between flex-1">
          <div className="space-y-2 text-sm">
            <p className="font-medium truncate h-[20px]">
              🏥 {data.room || "-"}
            </p>
            <div className="flex items-center gap-2 text-muted-foreground h-[20px]">
              <Clock className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {start.toLocaleString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" - "}
                {end.toLocaleString("id-ID", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <div className="mt-3 min-h-[36px]">
            <p className="text-xs italic text-muted-foreground line-clamp-2 break-words">
              {data.notes || "\u00A0"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}