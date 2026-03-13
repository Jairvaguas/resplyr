import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-6xl font-bold tracking-tight mb-4">Replyr</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        Responde tus reseñas de Google con IA en segundos.
      </p>
      <Button asChild size="lg">
        <Link href="/sign-up">Comenzar gratis</Link>
      </Button>
    </main>
  );
}
