
'use server';

import { getStrategyById } from "@/app/admin/actions";
import ResultsDisplay from "@/components/advisor/results-display";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default async function StrategyDetailPage({ params }: { params: { id: string } }) {
    const strategy = await getStrategyById(params.id);

    if (!strategy) {
        return (
             <div className="flex flex-col gap-8 items-center justify-center h-full text-center">
                <Bot className="w-24 h-24 text-muted-foreground" />
                <h1 className="font-headline text-4xl font-bold">Strategy Not Found</h1>
                <p className="text-muted-foreground">The requested strategy analysis could not be located.</p>
            </div>
        );
    }

    return <ResultsDisplay result={strategy.analysis} strategyName={strategy.strategyName} />;
}
