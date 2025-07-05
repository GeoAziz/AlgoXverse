'use client';

import type { AIStrategyAdvisorOutput } from '@/ai/flows/ai-strategy-advisor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, Lightbulb, Bot } from 'lucide-react';
import { Line, LineChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

type ResultsDisplayProps = {
  result: AIStrategyAdvisorOutput;
};

const pnlData = [
    { day: 1, pnl: 0 }, { day: 2, pnl: 50 }, { day: 3, pnl: 45 }, { day: 4, pnl: 80 }, { day: 5, pnl: 120 },
    { day: 6, pnl: 110 }, { day: 7, pnl: 150 }, { day: 8, pnl: 180 }, { day: 9, pnl: 175 }, { day: 10, pnl: 220 },
    { day: 11, pnl: 210 }, { day: 12, pnl: 250 }, { day: 13, pnl: 280 }, { day: 14, pnl: 320 }, { day: 15, pnl: 310 },
];

const chartConfig = {
  pnl: {
    label: 'PnL ($)',
    color: 'hsl(var(--primary))',
  },
};

const tradeLog = [
    { id: 1, type: 'BUY', asset: 'BTC/USD', price: 68500, size: 0.1, pnl: 250, status: 'Closed' },
    { id: 2, type: 'SELL', asset: 'ETH/USD', price: 3500, size: 2, pnl: -150, status: 'Closed' },
    { id: 3, type: 'BUY', asset: 'BTC/USD', price: 69100, size: 0.05, pnl: 0, status: 'Open' },
    { id: 4, type: 'BUY', asset: 'SOL/USD', price: 165, size: 10, pnl: 550, status: 'Closed' },
];

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
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
            <p>{result.suggestions}</p>
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
             <p>{result.rationale}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Simulated Performance</CardTitle>
          <CardDescription>Mock backtest results based on historical patterns.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
            <Card>
                <CardHeader><CardTitle>$3,450.78</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Total PnL</p></CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>62.5%</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Win Rate</p></CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>2.15</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Profit Factor</p></CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>32</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Total Trades</p></CardContent>
            </Card>
          </div>
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
                <LineChart data={pnlData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" tickFormatter={(tick) => `Day ${tick}`} />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
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
          <CardDescription>Log of simulated trades from the backtest.</CardDescription>
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
              {tradeLog.map((trade) => (
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
