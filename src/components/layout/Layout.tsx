// src/components/layout/Layout.tsx
import Head from "next/head";
import React, { ReactNode } from "react";

interface LayoutProps {
  title: string;
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content="This is a description of the page" />
      </Head>

      <main>{children}</main>
    </div>
  );
};

export default Layout;
