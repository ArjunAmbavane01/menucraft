"use client";

import useAuth from "@/hooks/useAuth";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import Logo from "@/components/Logo";

interface AuthFormProps {
    mode: "signin" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {

    const {
        loading: authLoading,
        signInWithEmail,
        signUpWithEmail
    } = useAuth();

    return (
        <div className='flex justify-center items-center h-screen w-full bg-background'>
            <div className="rounded-lg border w-full max-w-lg mx-auto">
                <div className="flex flex-col justify-center items-center gap-5 p-10 h-137.5 w-full rounded-lg">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <Logo />
                        <h2>
                            {
                                mode === "signup" ?
                                    "Create your MenuCraft account" :
                                    "Welcome back to MenuCraft"
                            }
                        </h2>
                    </div>
                    {mode === "signup" ?
                        <SignUpForm authLoading={authLoading} signUpWithEmail={signUpWithEmail} /> :
                        <SignInForm authLoading={authLoading} signInWithEmail={signInWithEmail} />
                    }

                </div>
            </div>
        </div>
    )
}
