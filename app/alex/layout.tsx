import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Alex dashboard",
  description: "Private coupon redemption inbox with phone push alerts.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Alex Inbox",
  },
  icons: {
    apple: [{ url: "/icons/icon-192.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#faf4eb",
  width: "device-width",
  initialScale: 1,
};

export default function AlexLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
