
'use client';

import type { AIStrategyAdvisorOutput } from '@/ai/flows/ai-strategy-advisor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Bot, TrendingUp, Wallet } from 'lucide-react';
import { ComposedChart, Line, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, YAxis, Scatter, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

type ResultsDisplayProps = {
  result: AIStrategyAdvisorOutput;
  strategyName?: string;
};

const chartConfig = {
  price: {
    label: 'Price ($)',
    color: 'hsl(var(--chart-1))',
  },
  pnl: {
    label: 'PnL ($)',
    color: 'hsl(var(--chart-4))',
  },
  buy: {
    label: 'Buy Signal',
    color: 'hsl(var(--chart-2))',
  },
  sell: {
    label: 'Sell Signal',
    color: 'hsl(var(--destructive))',
  },
};

export default function ResultsDisplay({ result, strategyName }: ResultsDisplayProps) {
  const { backtest, suggestions, rationale } = result;
  
  const combinedChartData = useMemo(() => {
    return backtest.priceData?.map(pricePoint => {
      const pnlPoint = backtest.pnlData.find(p => p.day === pricePoint.day);
      return {
        day: pricePoint.day,
        price: pricePoint.price,
        pnl: pnlPoint ? pnlPoint.pnl : null,
      };
    }) ?? backtest.pnlData;
  }, [backtest.priceData, backtest.pnlData]);

  const buyEvents = backtest.chartEvents?.filter(e => e.type === 'BUY') ?? [];
  const sellEvents = backtest.chartEvents?.filter(e => e.type === 'SELL') ?? [];
  
  return (
    <div className="mt-6 space-y-6 animate-in fade-in-50 duration-500">
      {strategyName && (
        <div>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">
                {strategyName}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
                Detailed AI analysis and simulated backtest results.
            </p>
      </div>
      )}
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
          <CardDescription>AI-generated backtest results showing price action, trade signals, and PnL.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 text-center">
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
             <Card>
                <CardHeader><CardTitle>{backtest.sharpeRatio?.toFixed(2) ?? 'N/A'}</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Sharpe Ratio</p></CardContent>
            </Card>
          </div>
          <div className="h-[400px] w-full">
             <ChartContainer config={chartConfig} className="w-full h-full">
                <ComposedChart data={combinedChartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" tickFormatter={(tick) => `Day ${tick}`} />
                    <YAxis yAxisId="left" dataKey="price" stroke="hsl(var(--chart-1))" tickFormatter={(value) => `$${value}`} />
                    <YAxis yAxisId="right" orientation="right" dataKey="pnl" stroke="hsl(var(--chart-4))" tickFormatter={(value) => `$${value}`} />
                    
                    <Tooltip 
                        cursor={{fill: 'hsl(var(--primary) / 0.1)'}} 
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    
                    <Legend content={<ChartLegendContent />} />
                    
                    <Line yAxisId="left" type="monotone" dataKey="price" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} name="Price" />
                    <Line yAxisId="right" type="monotone" dataKey="pnl" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} name="PnL" strokeDasharray="5 5" />

                    <Scatter yAxisId="left" name="Buy Signal" data={buyEvents} fill="hsl(var(--chart-2))" shape="triangle" />
                    <Scatter yAxisId="left" name="Sell Signal" data={sellEvents} fill="hsl(var(--destructive))" shape="cross" />
                </ComposedChart>
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
                    <Badge variant={trade.type === 'BUY' ? 'default' : 'destructive'} className={cn(`${trade.type === 'BUY' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`, "hover:bg-transparent")}>
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
