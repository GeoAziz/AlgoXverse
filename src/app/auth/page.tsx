import AuthForm from "@/components/auth/auth-form";
import { Logo } from "@/components/icons";

export default function AuthPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden bg-grid-pattern">
       <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-0"></div>
       <div className="z-10 w-full max-w-4xl flex flex-col items-center">
         <div className="flex flex-col items-center justify-center mb-8 text-center">
            <Logo className="w-12 h-12 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]" />
            <h1 className="font-headline text-3xl font-bold text-primary mt-2">AlgoXverse Mainframe</h1>
            <p className="text-muted-foreground">Authenticate to access your command console.</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
