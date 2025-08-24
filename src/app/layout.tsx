import "./globals.css";

export const metadata = {
  title: "SPD Explainer",
  description: "Upload SPDs and ask questions with sources",
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
