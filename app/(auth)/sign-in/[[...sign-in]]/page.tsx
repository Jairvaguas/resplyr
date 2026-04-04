import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="w-full bg-white p-8 sm:p-10 rounded-3xl shadow-none lg:shadow-2xl lg:border lg:border-slate-100 relative z-10">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none border-0 p-0 bg-transparent w-full",
            headerTitle: "text-2xl font-bold text-slate-900 hidden lg:block",
            headerSubtitle: "text-slate-500 hidden lg:block",
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-medium py-2.5",
            footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
            footer: "hidden", // Se oculta el footer de clerk para usar el de Next.js abajo
          }
        }} 
      />
      
      <div className="mt-8 text-center pt-6 border-t border-slate-100">
        <p className="text-sm text-slate-500">
          ¿No tienes cuenta?{' '}
          <Link href="/sign-up" className="text-blue-600 hover:text-blue-700 font-bold transition-all">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
