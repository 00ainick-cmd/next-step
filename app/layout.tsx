import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NextStep GTD',
  description: 'A Getting Things Done application built with Next.js and Prisma',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
