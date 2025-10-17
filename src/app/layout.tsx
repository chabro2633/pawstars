import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PawStars - 강아지 사주와 궁합",
  description: "강아지의 사주와 견주와의 궁합을 AI로 분석해보세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        {/* Kakao SDK (optional; initialized on demand in client) */}
        <script
          defer
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          crossOrigin="anonymous"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__KAKAO_API_KEY__ = '${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY ?? ""}';`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        <Navbar />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var w=window as any; if(w.Kakao && !w.Kakao.isInitialized?.() && w.__KAKAO_API_KEY__){w.Kakao.init(w.__KAKAO_API_KEY__);} }catch(e){}})();",
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if ('AmbientLightSensor' in window) {
                    const sensor = new AmbientLightSensor({ frequency: 1 });
                    sensor.addEventListener('reading', () => {
                      const lux = sensor.illuminance;
                      const html = document.documentElement;
                      if (lux < 10) {
                        html.classList.add('dark');
                        html.style.colorScheme = 'dark';
                      } else if (lux > 50) {
                        html.classList.remove('dark');
                        html.style.colorScheme = 'light';
                      }
                    });
                    sensor.start();
                  } else {
                    // Fallback: use system preference
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
                    const updateTheme = (e) => {
                      const html = document.documentElement;
                      if (e.matches) {
                        html.classList.add('dark');
                        html.style.colorScheme = 'dark';
                      } else {
                        html.classList.remove('dark');
                        html.style.colorScheme = 'light';
                      }
                    };
                    updateTheme(prefersDark);
                    prefersDark.addEventListener('change', updateTheme);
                  }
                } catch (e) {
                  // Fallback to system preference
                  try {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
                    const updateTheme = (e) => {
                      const html = document.documentElement;
                      if (e.matches) {
                        html.classList.add('dark');
                        html.style.colorScheme = 'dark';
                      } else {
                        html.classList.remove('dark');
                        html.style.colorScheme = 'light';
                      }
                    };
                    updateTheme(prefersDark);
                    prefersDark.addEventListener('change', updateTheme);
                  } catch (e2) {}
                }
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}",
          }}
        />
      </body>
    </html>
  );
}
