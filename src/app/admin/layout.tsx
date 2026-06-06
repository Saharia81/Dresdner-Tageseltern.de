import { LogoutButton } from "./LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="bg-korallenrot text-white text-sm px-4 py-2 flex items-center justify-between">
        <span>Admin-Bereich</span>
        <LogoutButton />
      </div>
      {children}
    </div>
  );
}
