import Link from "next/link"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
    return (
        <Link href="/" className={cn("flex items-center gap-2", className)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
            </svg>
            <h1 className="text-xl font-bold font-headline text-foreground">CampusConnect</h1>
        </Link>
    )
}
