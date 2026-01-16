import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Menu Not Found</h1>
                    <p className="text-muted-foreground mb-6">
                        The menu you're looking for doesn't exist or hasn't been published yet.
                    </p>
                    <Button asChild variant="outline">
                        <Link href="/">Go Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

