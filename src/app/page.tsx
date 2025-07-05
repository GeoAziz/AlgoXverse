import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoveRight, BrainCircuit, Rocket } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">Welcome, Navigator</h1>
        <p className="text-muted-foreground">
          Your portal to the AlgoXverse. Analyze, optimize, and deploy with the power of AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-8 lg:col-span-8 xl:col-span-9 bg-card/50 border-primary/20 backdrop-blur-sm transition-all hover:border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <Rocket className="w-6 h-6 text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]"/>
              <span>Launch Your Next Strategy</span>
            </CardTitle>
            <CardDescription>
              Ready to push the boundaries of algorithmic trading? Our AI advisor is on standby to help you refine your approach.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Upload your strategy code, and our advanced AI will perform a deep analysis, providing actionable suggestions and optimizations. Explore new parameters, enhance risk management, and unlock your strategy's full potential.
            </p>
            <Link href="/advisor">
              <Button className="group transition-all hover:drop-shadow-[0_0_8px_hsl(var(--primary))]">
                Go to AI Advisor
                <MoveRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="md:col-span-4 lg:col-span-4 xl:col-span-3 bg-card/50 border-accent/20 backdrop-blur-sm transition-all hover:border-accent/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <BrainCircuit className="w-6 h-6 text-accent drop-shadow-[0_0_5px_hsl(var(--accent))]"/>
              <span>How It Works</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-accent font-bold">1.</span>
              <p>
                <span className="font-semibold text-foreground">Upload:</span> Provide your trading strategy as a code snippet.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-bold">2.</span>
              <p>
                <span className="font-semibold text-foreground">Analyze:</span> Our AI engine runs a comprehensive analysis against historical data.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-accent font-bold">3.</span>
              <p>
                <span className="font-semibold text-foreground">Optimize:</span> Receive detailed suggestions and rationale to improve your strategy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
