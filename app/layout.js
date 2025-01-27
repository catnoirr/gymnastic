import "./globals.css";
import Providers from "./components/Providers";

export const metadata = {
  title: 'Gymiee - Your Personal Fitness Journey',
  description: 'Track your fitness journey, set goals, and achieve your dreams with Gymiee',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
