"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Stethoscope } from "lucide-react";

export function OnCallCard({ data }: { data: any }) {
  const isOnCall = data.status === "oncall";

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-4 space-y-3">

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              {data.doctorName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {data.specialization}
            </p>
          </div>

          <Badge variant={isOnCall ? "default" : "secondary"}>
            {isOnCall ? "On Call" : "Standby"}
          </Badge>
        </div>

        {/* INFO */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Ruangan: {data.room}</p>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {new Date(data.startTime).toLocaleString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {" - "}
              {new Date(data.endTime).toLocaleTimeString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {data.notes && (
            <p className="italic text-xs mt-1">
              "{data.notes}"
            </p>
          )}
        </div>

      </CardContent>
    </Card>
  );
}