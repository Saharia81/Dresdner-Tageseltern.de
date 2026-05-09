import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Admin-Dashboard</h1>
      <ul className="space-y-3 list-disc pl-6">
        <li><Link className="underline" href="/admin/steckbriefe">Steckbriefe verwalten</Link></li>
        <li><Link className="underline" href="/admin/neuigkeiten">Neuigkeiten verwalten</Link></li>
        <li><Link className="underline" href="/admin/buchungen">Banner-Buchungen (Phase 2)</Link></li>
      </ul>
    </main>
  );
}
