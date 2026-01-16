"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Dish {
    id: number;
    name: string;
    category: string;
}

interface DishSelectProps {
    category: string;
    value?: number;
    onChange: (id: number) => void;
    dishes: Dish[];
    lastUsedMap: Record<number, string | null>;
    placeholder?: string;
}

export function DishSelect({
    category,
    value,
    onChange,
    dishes,
    lastUsedMap,
    placeholder = "Select dish...",
}: DishSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const selectedDish = dishes.find((d) => d.id === value);

    // Filter dishes based on search
    const filteredDishes = React.useMemo(() => {
        if (!search) return dishes;
        return dishes.filter((dish) =>
            dish.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [dishes, search]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between font-normal",
                        !value && "text-muted-foreground"
                    )}
                >
                    <span className="truncate">
                        {selectedDish ? selectedDish.name : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <div className="flex flex-col">
                    {/* Search Input */}
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Input
                            placeholder="Search dishes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-11 border-0 bg-transparent px-0 py-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>

                    {/* Dishes List */}
                    <ScrollArea className="h-[300px]">
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
    );
}