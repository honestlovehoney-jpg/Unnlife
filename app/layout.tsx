import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNN Life",
  description: "Student life simulation on University of Nigeria, Nsukka campus",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
