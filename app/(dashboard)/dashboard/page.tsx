import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Bienvenido a Replyr</h1>
      <p>Email: {user?.primaryEmailAddress?.emailAddress || "Desconocido"}</p>
    </div>
  );
}
