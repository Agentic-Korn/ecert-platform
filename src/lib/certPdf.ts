import jsPDF from "jspdf";
import type { Certificate, Program } from "./types";

/**
 * Render a certificate as a single-page A4 landscape PDF and trigger download.
 * Uses pure jsPDF (vector text, no canvas). The QR code is encoded as a
 * Google Chart URL via dataURL → addImage to keep zero new dependencies for QR
 * generation (qrcode.react renders SVG, which jsPDF can't directly embed).
 */
export async function downloadCertificatePdf(cert: Certificate, program?: Program) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // Outer frame
  doc.setDrawColor(180, 150, 80);
  doc.setLineWidth(1.5);
  doc.rect(8, 8, pageW - 16, pageH - 16);
  doc.setLineWidth(0.4);
  doc.rect(11, 11, pageW - 22, pageH - 22);

  // Header — issuer + program code
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(120, 90, 30);
  doc.text((program?.issuer ?? "TMPSA / สพฉ").toUpperCase(), pageW / 2, 26, { align: "center" });

  // Title
  doc.setFontSize(28);
  doc.setTextColor(30, 60, 110);
  doc.text("CERTIFICATE OF COMPLETION", pageW / 2, 48, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(90, 90, 90);
  doc.text("This certificate is awarded to", pageW / 2, 62, { align: "center" });

  // Holder name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(20, 20, 30);
  doc.text(cert.holderName, pageW / 2, 80, { align: "center" });

  // Underline
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(pageW / 2 - 60, 84, pageW / 2 + 60, 84);

  // Program statement
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(70, 70, 70);
  doc.text("for successfully completing the program", pageW / 2, 98, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(40, 80, 130);
  doc.text(cert.programName, pageW / 2, 110, { align: "center" });

  // Footer block — dates + cert no + QR
  const footerY = pageH - 42;
  doc.setDrawColor(220, 220, 220);
  doc.line(20, footerY - 4, pageW - 20, footerY - 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110);
  doc.text("Issued", 22, footerY + 3);
  doc.text("Expires", 22, footerY + 12);
  doc.text("Certificate No.", 22, footerY + 21);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text(cert.issuedAt || "—", 50, footerY + 3);
  doc.text(cert.expiresAt || "—", 50, footerY + 12);
  doc.setFont("courier", "bold");
  doc.text(cert.certNo, 50, footerY + 21);

  // QR — use external image API (works offline-fallback gracefully)
  const verifyUrl = `${window.location.origin}/verify/${cert.certNo}`;
  try {
    const qrDataUrl = await fetchQrDataUrl(verifyUrl);
    doc.addImage(qrDataUrl, "PNG", pageW - 60, footerY - 8, 36, 36);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text("Scan to verify", pageW - 42, footerY + 32, { align: "center" });
  } catch {
    // QR fetch failed — print the URL as fallback
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(verifyUrl, pageW - 60, footerY + 16);
  }

  doc.save(`certificate-${cert.certNo}.pdf`);
}

async function fetchQrDataUrl(url: string): Promise<string> {
  // Render QR locally via a transient canvas using a simple QR library would add
  // a dep; instead generate via qrserver.com (used widely for static QR images).
  const api = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}`;
  const res = await fetch(api);
  const blob = await res.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
