import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your Brand — Find your place",
  description: "Exceptional homes, thoughtfully found.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
