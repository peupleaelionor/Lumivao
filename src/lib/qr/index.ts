import QRCode from "qrcode";

// ── Génération de QR codes ───────────────────────────────────────────
// Couleurs alignées sur la charte (noir profond sur fond crème/blanc).

const QR_OPTIONS = {
  margin: 1,
  color: { dark: "#121212", light: "#FFFFFF" },
  errorCorrectionLevel: "M" as const,
};

/** QR en data URL PNG — utilisable directement dans <img src>. */
export async function qrDataUrl(data: string, size = 360): Promise<string> {
  return QRCode.toDataURL(data, { ...QR_OPTIONS, width: size });
}

/** QR en SVG (string) — net à toutes les tailles, idéal impression. */
export async function qrSvg(data: string, size = 360): Promise<string> {
  return QRCode.toString(data, { ...QR_OPTIONS, type: "svg", width: size });
}
