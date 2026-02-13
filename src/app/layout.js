import "./globals.css";

export const metadata = {
  title: "Xilə Çay evi | QR Menu",
  description: "QR code menu system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="az">
      <body className="bg-black text-gray-900">{children}</body>
    </html>
  );
}
