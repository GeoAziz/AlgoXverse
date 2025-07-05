// src/components/layout/command-console.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSound } from '@/hooks/use-sound';

type HistoryItem = {
    id: number;
    command: string;
    output: React.ReactNode;
};

const CommandResponse = ({ children }: { children: React.ReactNode }) => (
    <div className="text-accent">{children}</div>
);

const commands: Record<string, (args: string[]) => React.ReactNode> = {
    help: () => (
        <CommandResponse>
            <p>Available commands:</p>
            <ul className="list-inside list-disc pl-2">
                <li><span className="text-primary">help</span> - Show this help message.</li>
                <li><span className="text-primary">status</span> - Check system status.</li>
                <li><span className="text-primary">start-all</span> - [SIM] Start all approved strategies.</li>
                <li><span className="text-primary">clear</span> - Clear the console history.</li>
                <li><span className="text-primary">theme</span> - [SIM] Change UI theme (e.g., theme cyberpunk).</li>
            </ul>
        </CommandResponse>
    ),
    status: () => (
        <CommandResponse>
            <p>System Status: <span className="text-green-400">All systems operational.</span></p>
            <p>AI Oracle: <span className="text-green-400">Online</span></p>
            <p>Active Bots: <span className="text-yellow-400">[SIM] 4/10</span></p>
        </CommandResponse>
    ),
    "start-all": () => <CommandResponse>Executing command: <span className="text-primary">start-all</span>... [SIMULATION]</CommandResponse>,
    theme: (args) => <CommandResponse>Switching theme to <span className="text-primary">{args[0] || 'default'}</span>... [SIMULATION]</CommandResponse>,
    default: (command) => <CommandResponse>Command not found: <span className="text-red-400">{command}</span>. Type 'help' for a list of commands.</CommandResponse>
};


export const CommandConsole = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [inputValue, setInputValue] = useState('');
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { playClickSound } = useAppSound();

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [history]);

    const handleCommand = (command: string) => {
        const [cmd, ...args] = command.trim().split(' ');
        let output: React.ReactNode;
        if (cmd === 'clear') {
            setHistory([]);
            return;
        }

        const commandFn = commands[cmd] || (() => commands.default(cmd));
        output = commandFn(args);

        setHistory(prev => [...prev, { id: Date.now(), command, output }]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            playClickSound();
            handleCommand(inputValue);
            setInputValue('');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 h-1/2 z-50 p-2 lg:left-auto lg:w-[calc(100vw-var(--sidebar-width))] group-data-[collapsible=icon]:lg:w-[calc(100vw-var(--sidebar-width-icon))]"
                >
                    <div className="relative h-full w-full bg-black/80 backdrop-blur-md rounded-t-lg border border-primary/50 shadow-2xl shadow-primary/20 font-code text-sm scanline-effect overflow-hidden">
                        <header className="flex items-center justify-between p-2 bg-black/50 border-b border-primary/30">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-primary" />
                                <h2 className="font-headline">Command Console</h2>
                            </div>
                            <button onClick={onClose} className="p-1 rounded-md hover:bg-primary/20">
                                <X className="w-5 h-5" />
                            </button>
                        </header>
                        <div ref={scrollRef} className="p-4 h-[calc(100%-80px)] overflow-y-auto">
                            <div className="text-green-400">Welcome to AlgoXverse Mission Control. Type 'help' for commands.</div>
                            <div className="h-4"></div>
                            {history.map(item => (
                                <div key={item.id} className="mb-2">
                                    <div className="flex items-center">
                                        <span className="text-primary"><ChevronRight className="inline w-4 h-4"/></span>
                                        <span>{item.command}</span>
                                    </div>
                                    <div>{item.output}</div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSubmit} className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 border-t border-primary/30">
                            <div className="flex items-center gap-2">
                                <label htmlFor="command-input" className="text-primary flex-shrink-0">
                                    <ChevronRight className="inline w-4 h-4"/>
                                </label>
                                <input
                                    ref={inputRef}
                                    id="command-input"
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="w-full bg-transparent outline-none focus:ring-0 border-0 p-0"
                                    autoComplete="off"
                                    spellCheck="false"
                                />
                                <span className="w-2 h-4 bg-accent animate-blink-cursor"></span>
                            </div>
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
