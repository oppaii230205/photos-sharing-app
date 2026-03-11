import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PhotoBoard - Modern Photo Sharing",
  description: "Upload photos and comment on them",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="bg-[#F7F8FA] min-h-screen flex flex-col font-sans text-gray-800">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#6366f1",
              fontFamily: "var(--font-inter), sans-serif",
              borderRadius: 8,
            },
            components: {
              Card: {
                boxShadowTertiary:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
              },
            },
          }}
        >
          <AntdRegistry>
            <Header />
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
          </AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}
