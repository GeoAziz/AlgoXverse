'use client';

import type { AIStrategyAdvisorOutput } from '@/ai/flows/ai-strategy-advisor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Bot } from 'lucide-react';
import { Line, LineChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

type ResultsDisplayProps = {
  result: AIStrategyAdvisorOutput;
};

const chartConfig = {
  pnl: {
    label: 'PnL ($)',
    color: 'hsl(var(--primary))',
  },
};

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const { backtest, suggestions, rationale } = result;
  
  return (
    <div className="mt-6 space-y-6 animate-in fade-in-50 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-primary/30 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <Lightbulb className="text-primary drop-shadow-[0_0_4px_hsl(var(--primary))]"/>
              <span>Optimization Suggestions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm prose prose-invert prose-p:text-muted-foreground prose-strong:text-foreground prose-headings:text-primary">
            <p>{suggestions}</p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 border-accent/30 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <Bot className="text-accent drop-shadow-[0_0_4px_hsl(var(--accent))]"/>
              <span>AI Rationale</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm prose prose-invert prose-p:text-muted-foreground prose-strong:text-foreground prose-headings:text-accent">
             <p>{rationale}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Simulated Performance</CardTitle>
          <CardDescription>AI-generated backtest results based on historical patterns.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
            <Card>
                <CardHeader><CardTitle>${backtest.totalPnl.toLocaleString()}</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Total PnL</p></CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>{backtest.winRate.toFixed(1)}%</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Win Rate</p></CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>{backtest.profitFactor.toFixed(2)}</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Profit Factor</p></CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>{backtest.totalTrades}</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Total Trades</p></CardContent>
            </Card>
          </div>
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
                <LineChart data={backtest.pnlData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" tickFormatter={(tick) => `Day ${tick}`} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `$${value}`} />
                    <Tooltip 
                        cursor={{fill: 'hsl(var(--primary) / 0.1)'}} 
                        content={<ChartTooltipContent indicator="line" />}
                    />
                    <Line type="monotone" dataKey="pnl" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Holographic Trade Monitor</CardTitle>
          <CardDescription>Log of significant simulated trades from the backtest.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-primary/20">
                <TableHead>Type</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>PnL</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backtest.tradeLog.map((trade) => (
                <TableRow key={trade.id} className="hover:bg-primary/10 border-primary/10">
                  <TableCell>
                    <Badge variant={trade.type === 'BUY' ? 'default' : 'destructive'} className={`${trade.type === 'BUY' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'} hover:bg-transparent`}>
                      {trade.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{trade.asset}</TableCell>
                  <TableCell>${trade.price.toLocaleString()}</TableCell>
                  <TableCell>{trade.size}</TableCell>
                  <TableCell className={trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {trade.pnl >= 0 ? `+$${trade.pnl}` : `-$${Math.abs(trade.pnl)}`}
                  </TableCell>
                  <TableCell>{trade.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
