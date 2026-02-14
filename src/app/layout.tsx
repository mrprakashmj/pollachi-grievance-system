import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import ChatWidget from "@/components/chat/ChatWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tamil Nadu Government Grievance Portal | Pollachi Municipal Corporation",
  description:
    "Official grievance redressal portal of Tamil Nadu Government for Pollachi Municipal Corporation. Register and track civic complaints across water, electricity, sanitation, roads, health, and education departments.",
  keywords: "Tamil Nadu, Government, Pollachi, Municipal Corporation, Grievance, Complaints, Civic Services",
  icons: {
    icon: "/tn-emblem.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <AuthProvider>
          {children}
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
