import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ backgroundColor: "var(--surface)" }}
    >
      <div className="w-full max-w-sm">
        {/* Wordmark */}
        <div className="mb-10 text-center">
          <h1
            className="font-serif text-4xl tracking-tight"
            style={{ color: "var(--on-surface)" }}
          >
            Clarity
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--tertiary)" }}>
            A private space to observe your thoughts.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-lg px-8 py-10"
          style={{
            backgroundColor: "var(--surface-container-high)",
            boxShadow: "0 0 48px 0 rgb(0 0 0 / 0.04)",
          }}
        >
          <p
            className="mb-6 text-center text-sm"
            style={{ color: "var(--tertiary)" }}
          >
            Sign in to continue
          </p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p
          className="mt-8 text-center text-xs"
          style={{ color: "var(--outline-variant)" }}
        >
          Your records are private and only visible to you.
        </p>
      </div>
    </main>
  );
}
