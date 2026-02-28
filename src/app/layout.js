// src/app/layout.js

export const metadata = {
  title: "Echo.Galaxy | Neural Mapper",
  description: "Visualize your YouTube history in 3D",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* This line pulls a Zap icon directly from the web */}
        <link rel="icon" href="https://fav.farm/⚡" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}