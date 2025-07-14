
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'framer-motion';
import { BarChart, CandlestickChart, ChevronDown, ChevronUp, Clock, Zap } from 'lucide-react';
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltipContent, Candlestick } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data generation
const generateCandlestickData = (numPoints = 50) => {
    let lastClose = Math.random() * 100 + 40000;
    return Array.from({ length: numPoints }, (_, i) => {
        const open = lastClose;
        const close = open + (Math.random() - 0.5) * 2000;
        const high = Math.max(open, close) + Math.random() * 500;
        const low = Math.min(open, close) - Math.random() * 500;
        lastClose = close;
        return {
            time: `T-${numPoints - i}`,
            ohlc: [open, high, low, close],
            volume: Math.random() * 1000 + 500
        };
    }).reverse();
};

const assets = [
    { id: 'BTC/USD', name: 'Bitcoin / USD' },
    { id: 'ETH/USD', name: 'Ethereum / USD' },
    { id: 'SOL/USD', name: 'Solana / USD' },
];

const chartConfig = {
    price: {
        label: 'Price',
    },
    volume: {
        label: 'Volume',
        color: 'hsl(var(--chart-2))',
    },
};

export function MarketView() {
    const [selectedAsset, setSelectedAsset] = useState(assets[0].id);
    const [data, setData] = useState(generateCandlestickData());

    const marketStats = useMemo(() => {
        const firstPrice = data[0].ohlc[3];
        const lastPrice = data[data.length - 1].ohlc[3];
        const change = lastPrice - firstPrice;
        const changePercent = (change / firstPrice) * 100;
        const volume = data.reduce((acc, d) => acc + d.volume, 0);
        return {
            price: lastPrice,
            change,
            changePercent,
            volume,
        };
    }, [data]);

    const handleAssetChange = (assetId: string) => {
        setSelectedAsset(assetId);
        setData(generateCandlestickData());
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-8"
        >
            <div>
                <h1 className="font-headline text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">Market Data Stream</h1>
                <p className="text-muted-foreground max-w-2xl">
                    Live simulated market data. Analyze trends and monitor assets in real-time.
                </p>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-2xl flex items-center gap-2">
                            <CandlestickChart className="text-primary"/>
                            <span>{selectedAsset}</span>
                        </CardTitle>
                        <CardDescription>
                            1H Candlestick Chart (Simulated)
                        </CardDescription>
                    </div>
                     <Select defaultValue={selectedAsset} onValueChange={handleAssetChange}>
                        <SelectTrigger className="w-[180px] bg-background/50">
                            <SelectValue placeholder="Select Asset" />
                        </SelectTrigger>
                        <SelectContent>
                            {assets.map(asset => (
                                <SelectItem key={asset.id} value={asset.id}>{asset.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                        <Card className='bg-background/30'>
                            <CardHeader className='pb-2'><CardTitle>${marketStats.price.toFixed(2)}</CardTitle></CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Last Price</p></CardContent>
                        </Card>
                        <Card className='bg-background/30'>
                            <CardHeader className='pb-2'>
                                <CardTitle className={cn(marketStats.change >= 0 ? 'text-green-400' : 'text-red-400', "flex items-center justify-center gap-1")}>
                                    {marketStats.change >= 0 ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
                                    ${Math.abs(marketStats.change).toFixed(2)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Change (24h)</p></CardContent>
                        </Card>
                        <Card className='bg-background/30'>
                             <CardHeader className='pb-2'>
                                <CardTitle className={cn(marketStats.changePercent >= 0 ? 'text-green-400' : 'text-red-400')}>
                                    {marketStats.changePercent.toFixed(2)}%
                                </CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">% Change (24h)</p></CardContent>
                        </Card>
                         <Card className='bg-background/30'>
                            <CardHeader className='pb-2'><CardTitle>{(marketStats.volume / 1000).toFixed(1)}k</CardTitle></CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Volume</p></CardContent>
                        </Card>
                    </div>

                    <div className="h-[450px] w-full">
                        <ChartContainer config={chartConfig} className="w-full h-full">
                            <ComposedChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                                <YAxis 
                                    yAxisId="left" 
                                    orientation="left" 
                                    stroke="hsl(var(--chart-1))" 
                                    domain={['dataMin - 1000', 'dataMax + 1000']}
                                    tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                                />
                                <YAxis 
                                    yAxisId="right" 
                                    orientation="right" 
                                    stroke="hsl(var(--chart-2))"
                                    dataKey="volume"
                                    tickFormatter={(value) => `${Number(value) / 1000}k`}
                                />
                                <Tooltip
                                    cursor={{fill: 'hsl(var(--primary) / 0.1)'}}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const ohlc = payload[0].payload.ohlc;
                                            const volume = payload[0].payload.volume;
                                            return (
                                                <div className="p-2 bg-background/80 border border-border rounded-md shadow-lg">
                                                    <p className="font-bold">{payload[0].payload.time}</p>
                                                    <p className="text-green-400">O: ${ohlc[0].toFixed(2)} H: ${ohlc[1].toFixed(2)}</p>
                                                    <p className="text-red-400">L: ${ohlc[2].toFixed(2)} C: ${ohlc[3].toFixed(2)}</p>
                                                    <p className="text-blue-400">Vol: {volume.toFixed(2)}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar yAxisId="right" name="Volume" dataKey="volume" fill="hsl(var(--chart-2) / 0.5)" />
                                <Line
                                  yAxisId="left"
                                  type="linear"
                                  dataKey="ohlc"
                                  stroke="hsl(var(--primary))"
                                  strokeWidth={1}
                                  shape={<Candlestick />}
                                  dot={false}
                                />
                            </ComposedChart>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><Zap className="text-primary"/> Asset Watchlist</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Asset</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="text-right">Change</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assets.map(asset => {
                                    const isUp = Math.random() > 0.5;
                                    return (
                                        <TableRow key={asset.id} className="hover:bg-primary/10 cursor-pointer" onClick={() => handleAssetChange(asset.id)}>
                                            <TableCell>{asset.name}</TableCell>
                                            <TableCell>${(Math.random() * 50000 + 20000).toFixed(2)}</TableCell>
                                            <TableCell className={cn("text-right", isUp ? 'text-green-400' : 'text-red-400')}>
                                                {isUp ? '+' : '-'}{(Math.random() * 5).toFixed(2)}%
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                 <Card className="bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><Clock className="text-primary"/> Order Book</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-10 text-muted-foreground">
                            <BarChart className="w-12 h-12 mx-auto" />
                            <p className="mt-2">Live order book data coming soon.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
