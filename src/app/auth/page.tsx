import AuthForm from "@/components/auth/auth-form";
import { Logo } from "@/components/icons";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
            <Logo className="w-12 h-12 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]" />
            <h1 className="font-headline text-3xl font-bold text-primary mt-2">AlgoXverse</h1>
            <p className="text-muted-foreground">Access your command console.</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
