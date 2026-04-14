import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  certNo: string;
  size?: number;
}

export function QRCodeDisplay({ certNo, size = 192 }: QRCodeDisplayProps) {
  const url = `${window.location.origin}/verify/${certNo}`;
  return (
    <div className="mx-auto my-4 p-4 bg-white rounded-xl border border-border inline-block">
      <QRCodeSVG value={url} size={size} level="M" />
      <p className="text-[10px] text-muted-foreground mt-2 font-mono text-center">{certNo}</p>
    </div>
  );
}
