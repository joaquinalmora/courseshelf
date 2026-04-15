import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "CourseShelf",
  description: "Manage courses and learning materials in one place.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
