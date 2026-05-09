// TODO Phase 2: Auth-Schutz (NextAuth/Auth.js) ergänzen.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="bg-korallenrot text-white text-sm px-4 py-2">
        Admin-Bereich (noch ungeschützt – Auth folgt in Phase 2)
      </div>
      {children}
    </div>
  );
}
