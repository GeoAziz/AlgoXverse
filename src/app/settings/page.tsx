import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BellRing, Mail, KeyRound, CreditCard, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-8"
    >
      <div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">Settings</h1>
        <p className="text-muted-foreground max-w-2xl">
          Configure your account, integrations, and notification preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-primary"/>
                    API Keys
                </CardTitle>
                <CardDescription>
                    Connect your exchange accounts to enable live trading. Keys are encrypted and stored securely.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="binance-api" className="flex items-center gap-2">
                            Binance API Key
                        </Label>
                        <Input id="binance-api" placeholder="Enter your Binance API Key" className="bg-background/50 focus-visible:ring-accent" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="binance-secret" className="flex items-center gap-2">
                           Binance API Secret
                        </Label>
                        <Input id="binance-secret" type="password" placeholder="Enter your Binance API Secret" className="bg-background/50 focus-visible:ring-accent" />
                    </div>
                     <Button className="transition-all hover:drop-shadow-[0_0_8px_hsl(var(--accent))]">Save API Keys</Button>
                </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <BellRing className="w-5 h-5 text-primary"/>
                    Notification Alerts
                </CardTitle>
                <CardDescription>
                    Receive alerts for trade signals directly to your preferred channels.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="telegram" className="flex items-center gap-2">
                            Telegram Chat ID
                        </Label>
                        <Input id="telegram" placeholder="Enter your Telegram Chat ID" className="bg-background/50 focus-visible:ring-accent" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email Address
                        </Label>
                        <Input id="email" type="email" placeholder="Enter your email for alerts" className="bg-background/50 focus-visible:ring-accent" />
                    </div>
                    <Button className="transition-all hover:drop-shadow-[0_0_8px_hsl(var(--accent))]">Save Notification Settings</Button>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20 sticky top-20">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary"/>
                        Subscription
                    </CardTitle>
                    <CardDescription>
                       Manage your billing and plan details.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="border rounded-lg p-4 bg-background/50">
                        <p className="text-sm font-medium">Current Plan</p>
                        <p className="font-headline text-xl text-primary">Pro Navigator</p>
                    </div>
                     <div className="border rounded-lg p-4 bg-background/50">
                        <p className="text-sm font-medium">Next Billing Date</p>
                        <p className="font-headline text-xl">July 31, 2024</p>
                    </div>
                    <Separator />
                    <Button className="w-full transition-all hover:drop-shadow-[0_0_8px_hsl(var(--accent))]">Manage Billing</Button>
                    <Button variant="outline" className="w-full">Upgrade Plan</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </motion.div>
  );
}
