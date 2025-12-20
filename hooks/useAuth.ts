import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const useAuth = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

    const router = useRouter();

    const signInWithEmail = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
                rememberMe: true,
                callbackURL: "/dashboard",
            })
            if (error) throw new Error(error.message);
            if (data) router.push("/dashboard");
        } finally {
            setLoading(false);
        }
    }

    const signUpWithEmail = async (name: string, email: string, password: string) => {
        setLoading(true);
        try {
            const { data, error } = await authClient.signUp.email({
                name,
                email,
                password,
                callbackURL: "/dashboard",
            })
            if (error) throw new Error(error.message);
            if (data) router.push("/dashboard");
        } finally {
            setLoading(false);
        }
    }

    const logout = async () => {
        setIsLoggingOut(true);
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/");
                    },
                },
            });
        } finally {
            setIsLoggingOut(false);
        }
    }

    return {
        loading,
        isLoggingOut,
        signInWithEmail,
        signUpWithEmail,
        logout,
    }
}

export default useAuth;