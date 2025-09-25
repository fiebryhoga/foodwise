import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'FoodWise',
  description: 'Unggah gambar makanan untuk mendapatkan bahan dan informasi gizinya.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <main className="flex-grow">
          {children}
        </main>
        <footer className="w-full text-center p-4 mt-8">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} fiebryhoga | hafa tech hub
          </p>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
