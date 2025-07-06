'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { signUpWithEmail } from '@/app/auth/actions';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { cn } from '@/lib/utils';
import { Terminal } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  remember: z.boolean().default(false),
});

const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  plan: z.string().default('trial'),
});

type AuthMode = 'login' | 'register';

const ConsoleLog = ({ logs }: { logs: string[] }) => (
    <div className="font-code text-xs h-40 p-2 overflow-y-auto bg-black/30 rounded-md border border-primary/20">
        {logs.map((log, index) => (
            <motion.p
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className={cn(
                    log.startsWith('ERROR') ? 'text-red-400 animate-glitch' : 'text-green-400',
                    "whitespace-pre-wrap"
                )}
            >
                &gt; {log}
            </motion.p>
        ))}
    </div>
);


export default function AuthForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [consoleLogs, setConsoleLogs] = useState<string[]>(['Awaiting Commander Input...']);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', plan: 'trial' },
  });
  
  const addLog = (log: string) => {
    setConsoleLogs(prev => [...prev.slice(-10), log]); // Keep last 10 logs
  }

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setConsoleLogs(['Initiating secure uplink...']);
    addLog(`Scanning signature for: ${values.email}`);
    try {
        await new Promise(resolve => setTimeout(resolve, 500)); // simulate check
        addLog('Signature recognized. Authenticating...');
        await signInWithEmailAndPassword(auth, values.email, values.password);
        addLog('Access Token Confirmed.');
        addLog('Redirecting to Command Console...');
        toast({ title: 'Login Successful', description: 'Redirecting to your dashboard.' });
        router.push('/');
    } catch (error: any) {
        let message = 'An unknown error occurred.';
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            message = 'Incorrect Access Code.';
        }
        addLog(`ERROR: Authentication failed. ${message}`);
        toast({ variant: 'destructive', title: 'Login Failed', description: message });
        setLoading(false);
    }
  };

  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    setLoading(true);
    setConsoleLogs(['Creating new Command Profile...']);
    addLog(`Registering pilot: ${values.email}`);
    try {
        const result = await signUpWithEmail(values);
        if (result.error) {
            throw new Error(result.error);
        }
        addLog('Profile created successfully.');
        addLog('Assigning default role: trader.');
        addLog('Please proceed to login.');
        toast({ title: 'Registration Successful', description: 'Please sign in to continue.' });
        loginForm.setValue('email', values.email);
        setAuthMode('login');
    } catch (e: any) {
        addLog(`ERROR: Registration failed. ${e.message}`);
        toast({ variant: 'destructive', title: 'Registration Failed', description: e.message });
    } finally {
        setLoading(false);
    }
  };

  const panelVariants = {
    hidden: (isLogin: boolean) => ({ x: isLogin ? '-100%' : '100%', opacity: 0 }),
    visible: { x: 0, opacity: 1 },
    exit: (isLogin: boolean) => ({ x: isLogin ? '100%' : '-100%', opacity: 0 }),
  };

  const formContent = (mode: AuthMode) => {
    const isLogin = mode === 'login';
    const form = isLogin ? loginForm : registerForm;
    const handler = isLogin ? handleLogin : handleRegister;

    return (
        <motion.div
            key={mode}
            custom={isLogin}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'tween', duration: 0.3 }}
            className="w-full absolute top-0 left-0"
        >
            <h2 className="font-headline text-2xl font-bold text-primary mb-1">{isLogin ? 'Connect to Mainframe' : 'Create Command Profile'}</h2>
            <p className="text-muted-foreground mb-6 text-sm">{isLogin ? 'Enter your credentials to access your dashboard.' : 'Join the AlgoXverse fleet.'}</p>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(handler as any)} className="space-y-4">
                     <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pilot Email</FormLabel>
                            <FormControl><Input type="email" placeholder="navigator@algox.dev" {...field} className="bg-background/50 focus-visible:ring-accent" /></FormControl>
                            <FormMessage />
                        </FormItem>
                     )}/>
                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Access Code</FormLabel>
                            <FormControl><Input type="password" placeholder="••••••••" {...field} className="bg-background/50 focus-visible:ring-accent" /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    {!isLogin && (
                         <FormField control={registerForm.control} name="plan" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Plan</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-background/50"><SelectValue placeholder="Select a plan" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="trial">Free Trial</SelectItem>
                                        <SelectItem value="pro">Pro Navigator</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    )}
                    <Button type="submit" className="w-full group transition-all hover:drop-shadow-[0_0_8px_hsl(var(--primary))]" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Connect' : 'Create Profile')}
                    </Button>
                </form>
            </Form>
        </motion.div>
    );
  };


  return (
    <Card className="bg-black/50 backdrop-blur-lg border-primary/30 shadow-2xl shadow-primary/20 overflow-hidden w-full">
      <CardContent className="p-0 flex flex-col md:flex-row min-h-[520px]">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center relative">
           <div className="flex mb-4 border-b border-primary/20">
                <Button variant="ghost" onClick={() => setAuthMode('login')} className={cn("flex-1 rounded-none", authMode === 'login' && 'bg-primary/20 text-primary')}>Login</Button>
                <Button variant="ghost" onClick={() => setAuthMode('register')} className={cn("flex-1 rounded-none", authMode === 'register' && 'bg-primary/20 text-primary')}>Register</Button>
            </div>
            <div className="relative h-[320px]">
                 <AnimatePresence mode="wait" initial={false}>
                    {formContent(authMode)}
                </AnimatePresence>
            </div>
        </div>
        
        <div className="w-full md:w-1/2 bg-black/40 p-8 border-l border-primary/20 flex flex-col justify-center">
            <h3 className="font-headline text-lg flex items-center gap-2 mb-4">
                <Terminal className="text-primary"/>
                <span>Auth Link Status</span>
            </h3>
            <ConsoleLog logs={consoleLogs} />
            <div className="mt-4 text-center text-muted-foreground text-xs">
                 {authMode === 'login' ? (
                     <p>Don't have a profile? <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setAuthMode('register')}>Create one now.</Button></p>
                 ) : (
                     <p>Already a pilot? <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setAuthMode('login')}>Connect to the mainframe.</Button></p>
                 )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
