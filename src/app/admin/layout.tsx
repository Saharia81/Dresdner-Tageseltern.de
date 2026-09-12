import { cookies } from "next/headers";
import { ADMIN_COOKIE, benutzerFuerCookie } from "@/lib/adminAuth";
import { LogoutButton } from "./LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Wer ist angemeldet? (null auf der Login-Seite und im ungeschützten Dev-Modus)
  const benutzer = benutzerFuerCookie(
    (await cookies()).get(ADMIN_COOKIE)?.value,
  );

  return (
    <div className="min-h-screen">
      <div className="bg-korallenrot text-white text-sm px-4 py-2 flex items-center justify-between">
        <span>
          Admin-Bereich
          {benutzer && (
            <>
              {" · angemeldet als "}
              <strong className="font-bold">{benutzer.name}</strong>
            </>
          )}
        </span>
        <LogoutButton />
      </div>
      {children}
    </div>
  );
}
