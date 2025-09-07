import "./globals.css";
import Link from "next/link";

export function HeaderLayout() {
  return (
    <div className="border-b mt-10">
      <h1 className="text-2xl pl-10 pb-10">
        <Link href="/">ホームタイトル</Link>
      </h1>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <HeaderLayout />
        {children}
      </body>
    </html>
  );
}
