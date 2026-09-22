"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-NG">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#f3efe6",
          color: "#1c1916",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <main style={{ maxWidth: "40rem", padding: "4rem 1.5rem" }}>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#746c62",
            }}
          >
            Hale
          </p>
          <h1 style={{ fontSize: "2.25rem", fontWeight: 400, marginTop: "1rem" }}>
            This page couldn’t be shown.
          </h1>
          <p style={{ lineHeight: 1.6, color: "#3a3530", maxWidth: "28rem" }}>
            Try again, or write to the studio. Concept stills can wait.
          </p>
          <p style={{ marginTop: "2rem" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                background: "#1c1916",
                color: "#f3efe6",
                border: 0,
                padding: "0.75rem 1.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontSize: "12px",
              }}
            >
              Try again
            </button>
          </p>
        </main>
      </body>
    </html>
  );
}
