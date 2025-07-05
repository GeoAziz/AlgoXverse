'use server';

/**
 * @fileOverview A service for calculating advanced trading metrics.
 *
 * This file provides functions that can be used by AI tools to perform
 * quantitative analysis on trading strategies.
 */

interface PnlData {
    day: number;
    pnl: number;
}

/**
 * Calculates a plausible Sharpe Ratio based on PnL data.
 * NOTE: This is a simplified simulation for demonstration purposes.
 * A real implementation would require risk-free rate and more complex calculations.
 * @param pnlData An array of profit and loss data points.
 * @returns A simulated Sharpe Ratio.
 */
export async function calculateSharpeRatio(pnlData: PnlData[]): Promise<number> {
    if (pnlData.length < 2) {
        return 0;
    }

    const returns = pnlData.map((data, i) => {
        if (i === 0) return 0;
        const previousPnl = pnlData[i - 1].pnl;
        // Avoid division by zero if starting PnL is 0
        return previousPnl === 0 ? data.pnl : (data.pnl - previousPnl) / Math.abs(previousPnl);
    }).slice(1); // Remove the first entry which is always 0

    const avgReturn = returns.reduce((acc, val) => acc + val, 0) / returns.length;
    const stdDev = Math.sqrt(
        returns.map(x => Math.pow(x - avgReturn, 2)).reduce((a, b) => a + b) / returns.length
    );

    if (stdDev === 0) {
        return avgReturn > 0 ? Infinity : 0;
    }

    const simulatedAnnualizedSharpe = (avgReturn / stdDev) * Math.sqrt(252); // Assuming daily-like data

    // Return a plausible, rounded value
    return parseFloat(simulatedAnnualizedSharpe.toFixed(2));
}
