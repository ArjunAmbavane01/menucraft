"use client";

import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useMemo, useRef, useState } from "react";

interface Dish {
    id: number;
    name: string;
    category: string;
}

interface DishSelectProps {
    category: string;
    value?: number | null;
    onChange: (id: number | null) => void;
    dishes: Dish[];
    lastUsedMap: Record<number, string | null>;
    placeholder?: string;
}

export function DishSelect({
    value,
    onChange,
    dishes,
    lastUsedMap,
    placeholder = "Select dish...",
}: DishSelectProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [isTruncated, setIsTruncated] = useState(false);

    const textRef = useRef<HTMLSpanElement>(null);

    const selectedDish = dishes.find((d) => d.id === value);

    // Filter dishes based on search
    const filteredDishes = useMemo(() => {
        if (!search) return dishes;
        return dishes.filter((dish) =>
            dish.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [dishes, search]);

    useEffect(() => {
        const el = textRef.current;
        if (!el) return;
        setIsTruncated(el.scrollWidth > el.clientWidth);
    }, [selectedDish?.name]);

    return (
        <TooltipProvider>
            <Popover open={open} onOpenChange={setOpen}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="relative flex items-center">
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className={cn(
                                        "w-48 justify-between font-normal",
                                        !value && " bg-blue-50 border-blue-800 border-dashed hover:bg-blue-50",
                                    )}
                                >
                                    <span ref={textRef} className="truncate flex-1 pr-6">
                                        {selectedDish ? selectedDish.name : placeholder}
                                    </span>
                                    <ChevronsUpDown className="shrink-0 opacity-70" />
                                </Button>
                            </PopoverTrigger>
                            {value && (
                                <Button
                                    variant={"ghost"}
                                    size={"icon"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onChange(null);
                                    }}
                                    className="absolute right-8 z-10 size-5 group rounded-sm"
                                >
                                    <X className="size-4 opacity-50 group-hover:opacity-80" />
                                </Button>
                            )}
                        </div>
                    </TooltipTrigger>
                    {selectedDish && isTruncated && (
                        <TooltipContent side="top">
                            <p>{selectedDish.name}</p>
                        </TooltipContent>
                    )}
                </Tooltip>
                <PopoverContent className="w-75 p-0" align="start">
                    <div className="flex flex-col">
                        {/* Search Input */}
                        <div className="flex items-center border-b px-3">
                            <Search className="mr-2 size-4 shrink-0 opacity-50" />
                            <Input
                                placeholder="Search dishes..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-11 border-0 bg-transparent px-0 py-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>

                        {/* Dishes List */}
                        <ScrollArea className="max-h-75 overflow-y-auto">
                            <div className="p-1">
                                {filteredDishes.length === 0 ? (
                                    <div className="py-6 text-center text-sm text-muted-foreground">
                                        No dish found.
                                    </div>
                                ) : (
                                    filteredDishes.map((dish) => (
                                        <div
                                            key={dish.id}
                                            onClick={() => {
                                                onChange(dish.id);
                                                setOpen(false);
                                                setSearch("");
                                            }}
                                            className={cn(
                                                "relative flex cursor-pointer select-none flex-col items-start rounded-sm px-2 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                                                value === dish.id && "bg-accent/50"
                                            )}
                                        >
                                            <div className="flex w-full items-center justify-between">
                                                <div className="flex items-center">
                                                    <Check
                                                        className={cn(
                                                            "mr-2 size-4",
                                                            value === dish.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    <span className="font-medium">{dish.name}</span>
                                                </div>
                                            </div>
                                            <span className="ml-6 text-xs text-muted-foreground">
                                                {lastUsedMap[dish.id]
                                                    ? `Last used: ${lastUsedMap[dish.id]}`
                                                    : "Never used"}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </PopoverContent>
            </Popover>
        </TooltipProvider>
    );
}