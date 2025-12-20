"use client"

import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "../ui/spinner";
import { LogOut } from "lucide-react";
import { User } from "better-auth";

interface UserMenuProps {
    user: User;
}

export default function UserMenu({ user }: UserMenuProps) {

    const { isLoggingOut, logout } = useAuth();
    const userInitials = user.name.split(" ").map(w => w[0]).join("").slice(0, 2);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 p-2 px-3 rounded-lg hover:bg-accent transition cursor-pointer">
                    <div className="flex justify-center items-center size-9 rounded-full overflow-hidden">
                        {
                            user.image ?
                                <Image src={user.image} alt="User image" width={40} height={40} className="size-full" />
                                :
                                <Avatar className="size-full rounded-full">
                                    <AvatarImage src={user.image ?? undefined} alt="User image" />
                                    <AvatarFallback>{userInitials}</AvatarFallback>
                                </Avatar>
                        }
                    </div>
                    {user.name}
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44">
                <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-8 group">
                    <div className="flex items-center gap-2 group-hover:text-destructive">
                        <LogOut className="size-4 group-hover:text-destructive" />
                        {isLoggingOut ? <Spinner /> : "Log out"}
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
