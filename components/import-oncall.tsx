"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUp } from "lucide-react";

type OnCallEntry = {
  personId: string | null;
  personCode: string;
  specialization: string;
  date: string;
  startTime: string;
  endTime: string;
};

type ImportOnCallResult = {
  toCreate: OnCallEntry[];
  duplicates: string[];
  newCategories: string[];
  newPersons: { code: string; categoryName: string }[];
  totalRows: number;
};

type Props = {
  importResult: ImportOnCallResult;
  applyChanges: () => void;
  isImportError: boolean;
};

export function ImportOnCallDialog({
  importResult,
  applyChanges,
  isImportError,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={isImportError}>
          <FileUp className="h-4 w-4 mr-2" />
          Lihat Preview Import ({importResult.toCreate.length} jadwal baru)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Preview Import On Call</DialogTitle>
          <DialogDescription>
            Total dari file: {importResult.totalRows} entri.{" "}
            {importResult.toCreate.length} akan diimpor,{" "}
            {importResult.duplicates.length} duplikat dilewati.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[55vh] pr-2 space-y-4">
          {importResult.newCategories.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-blue-600 mb-2">
                Kategori Baru Akan Dibuat ({importResult.newCategories.length})
              </p>
              <ul className="text-sm space-y-1">
                {importResult.newCategories.map((cat, i) => (
                  <li key={i} className="text-muted-foreground">
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {importResult.newPersons.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-blue-600 mb-2">
                Person Baru Akan Dibuat ({importResult.newPersons.length})
              </p>
              <ul className="text-sm space-y-1">
                {importResult.newPersons.slice(0, 30).map((p, i) => (
                  <li key={i} className="text-muted-foreground">
                    {p.code} <span className="text-xs">({p.categoryName})</span>
                  </li>
                ))}
                {importResult.newPersons.length > 30 && (
                  <li className="text-muted-foreground italic">
                    ...dan {importResult.newPersons.length - 30} person lainnya
                  </li>
                )}
              </ul>
            </div>
          )}

          {importResult.toCreate.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-green-600 mb-2">
                Jadwal Akan Diimpor ({importResult.toCreate.length})
              </p>
              <ul className="text-sm space-y-1">
                {importResult.toCreate.slice(0, 50).map((item, i) => (
                  <li key={i} className="text-muted-foreground">
                    {item.date} — {item.personCode} ({item.specialization})
                  </li>
                ))}
                {importResult.toCreate.length > 50 && (
                  <li className="text-muted-foreground italic">
                    ...dan {importResult.toCreate.length - 50} entri lainnya
                  </li>
                )}
              </ul>
            </div>
          )}

          {importResult.duplicates.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-yellow-600 mb-2">
                Duplikat Dilewati ({importResult.duplicates.length})
              </p>
              <ul className="text-sm space-y-1">
                {importResult.duplicates.slice(0, 20).map((d, i) => (
                  <li key={i} className="text-muted-foreground">
                    {d}
                  </li>
                ))}
                {importResult.duplicates.length > 20 && (
                  <li className="text-muted-foreground italic">
                    ...dan {importResult.duplicates.length - 20} duplikat
                    lainnya
                  </li>
                )}
              </ul>
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          <Button
            onClick={applyChanges}
            disabled={importResult.toCreate.length === 0}
          >
            Konfirmasi Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
