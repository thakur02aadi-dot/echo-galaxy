import "./globals.css";

export const metadata = { title: "Echo Galaxy", description: "3D YouTube History Mapper" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#020204] antialiased">{children}</body>
    </html>
  );
}