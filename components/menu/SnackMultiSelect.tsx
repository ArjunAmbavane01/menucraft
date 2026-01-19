"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Dish, LastUsedMap } from "@/types/dishes";

interface SnackMultiSelectProps {
  value: number[];
  onChange: (ids: number[]) => void;
  dishes: Dish[];
  lastUsedMap: LastUsedMap;
}

export function SnackMultiSelect({
  value,
  onChange,
  dishes,
  lastUsedMap,
}: SnackMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [truncatedDishes, setTruncatedDishes] = useState<Set<number>>(new Set());

  const selectedDishes = dishes.filter((d) => value.includes(d.id));
  const maxSnacks = 5;

  const filteredDishes = useMemo(() => {
    if (!search) return dishes;
    return dishes.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [dishes, search]);

  const handleSelect = (dishId: number) => {
    if (value.includes(dishId)) {
      onChange(value.filter((id) => id !== dishId));
    } else if (value.length < maxSnacks) {
      onChange([...value, dishId]);
    }
  };

  const handleRemove = (dishId: number) => {
    onChange(value.filter((id) => id !== dishId));
  };

  useEffect(() => {
    const newTruncated = new Set<number>();
    selectedDishes.forEach((dish) => {
      const el = document.getElementById(`snack-${dish.id}`);
      if (el && el.scrollWidth > el.clientWidth) {
        newTruncated.add(dish.id);
      }
    });

    setTruncatedDishes(newTruncated);
  }, [value]);

  return (
    <TooltipProvider>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2.5">
          {selectedDishes.map((dish) => (
            <Tooltip key={dish.id}>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="flex items-center pl-2.5 pr-1 py-1 text-sm font-normal shadow-xs rounded-sm max-w-48"
                >
                  <span
                    id={`snack-${dish.id}`}
                    className="truncate flex-1 pr-1">
                    {dish.name}
                  </span>
                  <Button
                    variant={"ghost"}
                    size={"icon-sm"}
                    onClick={() => handleRemove(dish.id)}
                    className="size-5 rounded-sm group"
                  >
                    <X className="size-4 opacity-50 group-hover:opacity-80" />
                  </Button>
                </Badge>
              </TooltipTrigger>
              {truncatedDishes.has(dish.id) && (
                <TooltipContent side="top">
                  <p>{dish.name}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}

          {value.length < maxSnacks && (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-between w-48 bg-blue-50 border-blue-800 border-dashed hover:bg-blue-50 font-normal"
                >
                  <span className="flex-1 pr-3.5">
                    Select snacks
                  </span>
                  <ChevronsUpDown className="shrink-0 opacity-70" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-75 p-0" align="start">
                <div className="flex flex-col">
                  {/* Search Input */}
                  <div className="flex items-center border-b px-3">
                    <Search className="mr-2 size-4 shrink-0 opacity-50" />
                    <Input
                      placeholder="Search snacks..."
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
                          No snack found.
                        </div>
                      ) : (
                        filteredDishes.map((dish) => {
                          const isSelected = value.includes(dish.id);
                          return (
                            <div
                              key={dish.id}
                              onClick={() => {
                                handleSelect(dish.id);
                                setSearch("");
                              }}
                              className={cn(
                                "relative flex cursor-pointer select-none flex-col items-start rounded-sm px-2 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                                isSelected && "bg-accent/50"
                              )}
                            >
                              <div className="flex w-full items-center justify-between">
                                <div className="flex items-center">
                                  <Check
                                    className={cn(
                                      "mr-2 size-4",
                                      isSelected ? "opacity-100" : "opacity-0"
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
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {value.length >= maxSnacks && (
          <p className="text-xs text-muted-foreground">
            Maximum {maxSnacks} snacks per day
          </p>
        )}
      </div>
    </TooltipProvider>
  );
}