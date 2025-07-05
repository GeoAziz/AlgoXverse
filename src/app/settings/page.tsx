import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BellRing, Mail } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">Settings</h1>
        <p className="text-muted-foreground max-w-2xl">
          Configure your account and notification preferences.
        </p>
      </div>

      <Card className="max-w-2xl bg-card/50 backdrop-blur-sm border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Notification Alerts</CardTitle>
          <CardDescription>
            Receive alerts for trade signals directly to your preferred channels. This feature is for demonstration purposes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="telegram" className="flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-accent" />
                    Telegram Chat ID
                </Label>
                <Input id="telegram" placeholder="Enter your Telegram Chat ID" className="bg-background/50 focus-visible:ring-accent" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-accent" />
                    Email Address
                </Label>
                <Input id="email" type="email" placeholder="Enter your email for alerts" className="bg-background/50 focus-visible:ring-accent" />
            </div>
            <Button className="transition-all hover:drop-shadow-[0_0_8px_hsl(var(--accent))]">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
