import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import App from "./page";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Pushup tracker",
};

export default function RootLayout() {
  return (
    <html suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <App />
        </ThemeProvider>
      </body>
    </html>
  );
}
