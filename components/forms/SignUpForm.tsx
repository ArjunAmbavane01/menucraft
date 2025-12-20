"use client";

import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { signUpFormSchema } from "@/validators/auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { toast } from "sonner";

interface SignUpFormProps {
    authLoading: boolean;
    signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
}

export default function SignUpForm({ authLoading, signUpWithEmail }: SignUpFormProps) {

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
        validators: {
            onSubmit: signUpFormSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                await signUpWithEmail(value.name, value.email, value.password);
            } catch (err: unknown) {
                toast.error(err instanceof Error ? err.message : "Something went wrong");
            }
        },
    })

    return (
        <div className="w-[80%]">
            <form
                id="signup-form"
                onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}
            >
                <FieldGroup className="gap-y-4">
                    <form.Field
                        name="name"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="Name"
                                        autoComplete="name"
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />
                    <form.Field
                        name="email"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="Email"
                                        autoComplete="email"
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors} />
                                    )}
                                </Field>
                            )
                        }}
                    />
                    <form.Field
                        name="password"
                        children={(field) => {
                            const isInvalid =
                                field.state.meta.isTouched && !field.state.meta.isValid
                            return (
                                <Field data-invalid={isInvalid}>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        aria-invalid={isInvalid}
                                        placeholder="Password"
                                        autoComplete="new-password"
                                    />
                                    {isInvalid && (
                                        <FieldError errors={field.state.meta.errors.slice(0, 1)} />
                                    )}
                                </Field>
                            )
                        }}
                    />
                    <Field className="space-y-1">
                        <Button
                            disabled={authLoading}
                            className="w-full"
                            type="submit"
                            form="signup-form"
                        >
                            {authLoading ? <Spinner /> : "Continue"}
                        </Button>
                        <p className="text-center">
                            <span>Already have an account? </span>
                            <Link href={"/signin"} className="font-medium text-primary cursor-pointer hover:underline">Log in</Link>
                        </p>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    )
}