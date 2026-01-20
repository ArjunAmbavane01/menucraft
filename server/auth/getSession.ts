import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const getAuthenticatedSession = async () => {
    const userSession = await auth.api.getSession({
        headers:await headers()
    })
    if (!userSession) redirect("/signin")
    return userSession;
}
