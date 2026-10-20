"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";

type Orientation = "portrait" | "landscape";
type PageSize = "a4" | "letter";

const pageSizes: Record<PageSize, { label: string; portrait: [number, number] }> = {
  a4: { label: "A4", portrait: [210, 297] },
  letter: { label: "US Letter", portrait: [215.9, 279.4] },
};

function getPageDimensions(size: PageSize, orientation: Orientation) {
  const [width, height] = pageSizes[size].portrait;
  return orientation === "portrait" ? [width, height] : [height, width];
}

export default function JpgToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const pageDimensions = useMemo(
    () => getPageDimensions(pageSize, orientation),
    [pageSize, orientation],
  );

  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (!["image/jpeg", "image/png"].includes(selected.type)) {
      setError("Please choose a JPG or PNG image.");
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setError("");
  };

  const generatePdf = async () => {
    if (!file) {
      setError("Choose a JPG or PNG image first.");
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("The image could not be read."));
      });

      const [pageWidth, pageHeight] = pageDimensions;
      const pageRatio = pageWidth / pageHeight;
      const sourcePageHeight = image.width * (1 / pageRatio);
      const pageCount = Math.ceil(image.height / sourcePageHeight);
      const pdf = new jsPDF({
        orientation,
        unit: "mm",
        format: pageSize,
        compress: true,
      });

      for (let page = 0; page < pageCount; page += 1) {
        const sourceTop = page * sourcePageHeight;
        const sourceHeight = Math.min(sourcePageHeight, image.height - sourceTop);
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = Math.ceil(sourceHeight);
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Your browser could not prepare the PDF.");

        context.drawImage(
          image,
          0,
          sourceTop,
          image.width,
          sourceHeight,
          0,
          0,
          canvas.width,
          canvas.height,
        );

        if (page > 0) pdf.addPage(pageSize, orientation);
        const renderedHeight = Math.min(pageHeight, (canvas.height / canvas.width) * pageWidth);
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.92),
          "JPEG",
          0,
          0,
          pageWidth,
          renderedHeight,
          undefined,
          "FAST",
        );
      }

      const baseName = file.name.replace(/\.(jpe?g|png)$/i, "") || "image";
      pdf.save(`${baseName}-split.pdf`);
      URL.revokeObjectURL(image.src);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "PDF generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4eee5] px-5 py-6 text-[#171717] md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between">
          <a href="/" className="font-serif text-xl tracking-tight">Your Brand</a>
          <a href="/" className="rounded-full border border-black/15 px-4 py-2 text-sm transition hover:bg-black hover:text-white">
            Back to home
          </a>
        </header>

        <section className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
          <div className="rounded-3xl bg-[#171717] p-7 text-white shadow-xl md:p-10">
            <p className="mb-4 text-xs uppercase tracking-[.2em] text-[#f5c996]">Your Brand tools</p>
            <h1 className="max-w-lg font-serif text-4xl leading-tight md:text-6xl">Split a long image into a multi-page PDF.</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
              Upload a tall JPG or PNG, choose the page format, and download a clean PDF with each section placed on its own page.
            </p>
            <div className="mt-10 rounded-2xl border border-white/15 bg-white/5 p-5 text-sm text-white/70">
              <p>Everything is processed locally in your browser. Your image is not uploaded to a server.</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl md:p-8">
            <label
              htmlFor="image-upload"
              className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/15 bg-[#faf8f4] px-6 text-center transition hover:border-black/40"
            >
              <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-[#171717] text-xl text-white">↑</span>
              <span className="font-semibold">{file ? file.name : "Choose a long JPG or PNG"}</span>
              <span className="mt-2 text-xs text-black/50">Click to browse · JPG, JPEG, PNG</span>
              <input id="image-upload" type="file" accept="image/jpeg,image/png" className="sr-only" onChange={chooseFile} />
            </label>

            {previewUrl && (
              <div className="mt-5 max-h-56 overflow-auto rounded-xl border border-black/10 bg-[#faf8f4] p-2">
                <img src={previewUrl} alt="Selected long image preview" className="mx-auto h-auto max-w-full" />
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Page orientation
                <select value={orientation} onChange={(event) => setOrientation(event.target.value as Orientation)} className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-black">
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </label>
              <label className="text-sm font-medium">
                Page size
                <select value={pageSize} onChange={(event) => setPageSize(event.target.value as PageSize)} className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-3 text-sm outline-none focus:border-black">
                  {Object.entries(pageSizes).map(([value, details]) => <option value={value} key={value}>{details.label}</option>)}
                </select>
              </label>
            </div>

            {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}

            <button type="button" onClick={generatePdf} disabled={isGenerating} className="mt-6 w-full rounded-xl bg-[#171717] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#383838] disabled:cursor-wait disabled:opacity-60">
              {isGenerating ? "Creating PDF..." : "Download multi-page PDF"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
