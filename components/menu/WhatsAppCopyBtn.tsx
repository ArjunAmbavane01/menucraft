"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MessageCircle, Check } from "lucide-react";
import { MenuData } from "@/types/menu";
import { copyMenuToClipboard } from "@/lib/menu-copy";

interface WhatsAppCopyButtonProps {
    menuData: MenuData;
    dishesByCategory: Record<string, {
        id: number;
        name: string;
        category: string;
    }[]>;
    disabled?: boolean;
}

export function WhatsAppCopyButton({
    menuData,
    dishesByCategory,
    disabled = false,
}: WhatsAppCopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await copyMenuToClipboard(menuData, dishesByCategory);
            setCopied(true);
            toast.success("Menu copied!", {
                description: "Ready to share on WhatsApp",
                duration: 2000,
            });

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error: any) {
            toast.error("Failed to copy menu", {
                description: "Please try again",
            });
        }
    };

    return (
        <Button
            variant="outline"
            onClick={handleCopy}
            disabled={disabled}
            className="gap-2 relative overflow-hidden transition-all duration-200 hover:border-green-500 hover:text-green-700 hover:bg-white"
        >
            <div
                className={`absolute inset-0 bg-green-50 transition-transform duration-300 ${copied ? "translate-x-0" : "-translate-x-full"
                    }`}
            />
            <div className="relative flex items-center gap-2">
                {copied
                    ? <Check className="animate-in zoom-in duration-200" />
                    : <MessageCircle />
                }
                <span>Copy for WhatsApp</span>
            </div>
        </Button>
    );
}