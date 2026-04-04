import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_auth_session");

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-sm">
          <div className="flex flex-col items-center justify-center mb-6 gap-3">
            <Image src="/logo.png" alt="Resplyr Logo" height={32} width={0} sizes="100vw" style={{ width: "auto" }} className="object-contain" unoptimized />
            <h1 className="text-xl font-bold text-slate-900">Admin Login</h1>
          </div>
          <form
            action={async (formData) => {
              "use server";
              const user = formData.get("username");
              const pass = formData.get("password");
              const adminPass = process.env.ADMIN_PASSWORD || "admin123";

              if (user === "jairvaguas" && pass === adminPass) {
                const cookiesObj = await cookies();
                cookiesObj.set("admin_auth_session", "true", { path: "/", httpOnly: true, maxAge: 86400 * 7 });
                redirect("/admin");
              }
            }}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
              <input type="text" name="username" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input type="password" name="password" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors mt-2">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminClient />;
}
