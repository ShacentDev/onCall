"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Stethoscope } from "lucide-react";

export function OnCallCard({ data }: { data: any }) {
  return (
    <Card className="hover:shadow-md transition-all border-muted">
      <CardContent className="p-5 space-y-3">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">
              {data.doctorName}
            </h3>
          </div>

          <Badge variant="secondary">
            On Duty
          </Badge>
        </div>

        {/* SPESIALIS */}
        <p className="text-sm text-muted-foreground">
          {data.specialization}
        </p>

        {/* INFO */}
        <div className="flex flex-col gap-1 text-sm">

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {data.room}
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {new Date(data.startTime).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {new Date(data.endTime).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>

        </div>

        {/* NOTES */}
        {data.notes && (
          <p className="text-xs text-muted-foreground italic">
            {data.notes}
          </p>
        )}

      </CardContent>
    </Card>
  );
}