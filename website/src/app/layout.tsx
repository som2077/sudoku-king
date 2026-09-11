import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sudoku King — The Ultimate Mind Puzzle Game",
  description:
    "Master the classic number puzzle game with daily challenges, smart hints, clean aesthetic, and progressive difficulty levels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var clean = function(el) {
                    if (el && el.removeAttribute) el.removeAttribute('bis_skin_checked');
                  };
                  var observer = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var m = mutations[i];
                      if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked') {
                        clean(m.target);
                      }
                    }
                  });
                  observer.observe(document.documentElement, {
                    attributes: true,
                    subtree: true,
                    attributeFilter: ['bis_skin_checked']
                  });
                } catch (e) {}
                var origError = console.error;
                console.error = function() {
                  for (var i = 0; i < arguments.length; i++) {
                    var arg = arguments[i];
                    if (typeof arg === 'string' && arg.indexOf('bis_skin_checked') !== -1) {
                      return;
                    }
                  }
                  return origError.apply(console, arguments);
                };
              })();
            `,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-white text-foreground selection:bg-indigo-500/20 selection:text-indigo-900"
        suppressHydrationWarning
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
