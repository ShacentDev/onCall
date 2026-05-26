"use client";

import { useState, useRef } from "react";
import { useQRCode } from "next-qrcode";

import { QrCode, Download, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function QRGeneratorPage() {
  const { Canvas } = useQRCode();

  const [text, setText] = useState("");
  const [generatedText, setGeneratedText] = useState("");

  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const generateQR = () => {
    setGeneratedText(text.trim());
  };

  const downloadQR = () => {
    const canvas = canvasWrapperRef.current?.querySelector("canvas");

    if (!canvas) return;

    const url = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = url;
    link.download = "qr-code.png";
    link.click();
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <QrCode className="h-8 w-8" />
          QR Generator
        </h1>

        <p className="text-muted-foreground mt-2">
          Generate QR Code untuk URL, text, atau informasi lainnya.
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Generate QR Code</CardTitle>
          <CardDescription>
            Masukkan URL atau text yang ingin diubah menjadi QR Code.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="https://example.com"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <Button
            onClick={generateQR}
            disabled={!text.trim()}
            className="w-full sm:w-auto"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Generate QR
          </Button>
        </CardContent>
      </Card>

      {generatedText && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              QR Code berhasil dibuat.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-6">
            <div
              ref={canvasWrapperRef}
              className="rounded-xl border p-6 bg-white"
            >
              <Canvas
                text={generatedText}
                options={{
                  errorCorrectionLevel: "M",
                  margin: 3,
                  scale: 4,
                  width: 250,
                  color: {
                    dark: "#000000FF",
                    light: "#FFFFFFFF",
                  },
                }}
              />
            </div>

            <Button onClick={downloadQR}>
              <Download className="h-4 w-4 mr-2" />
              Download PNG
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}