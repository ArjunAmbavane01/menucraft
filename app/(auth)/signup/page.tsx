import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import AuthForm from "@/components/forms/AuthForm";

export default async function page() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (session) redirect("/hub")
    return <AuthForm mode="signup" />
}
