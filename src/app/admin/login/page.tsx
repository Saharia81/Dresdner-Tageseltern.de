import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Admin-Login" };

export default function AdminLoginPage() {
  return (
    <main className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-extrabold mb-6">Admin-Login</h1>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
