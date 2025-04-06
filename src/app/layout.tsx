import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { DriverProvider } from "./context/DriverContext";
import NetworkStatusWrapper from "./components/NetworkStatusWrapper";

export const metadata: Metadata = {
  title: "Formula One Driver Manager",
  description: "Manage Formula One drivers and their statistics",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <DriverProvider>
          <NetworkStatusWrapper>
            {children}
          </NetworkStatusWrapper>
        </DriverProvider>
      </body>
    </html>
  );
}
