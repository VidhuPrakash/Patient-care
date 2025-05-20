import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import NextTopLoader from "nextjs-toploader";
import { ConfigProvider } from "antd";
import "@ant-design/v5-patch-for-react-19";
import { App as AntdApp } from "antd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Patient Registration App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#6F826A",
          },
        }}
      >
        <body className={`${geistSans.variable}`}>
          <NextTopLoader color="#6F826A" crawlSpeed={20} />
          <AntdRegistry>
            <AntdApp notification={{ placement: "topRight" }}>
              {children}
            </AntdApp>
          </AntdRegistry>
        </body>
      </ConfigProvider>
    </html>
  );
}
