import { Wrench } from "lucide-react";

export default function Loading() {
    return (
    <div className="grid min-h-[60vh] place-items-center" role="status" aria-label="Loading workshop">
        <div className="flex items-center gap-3 rounded-2xl border bg-card px-5 py-4 shadow-sm">
            <span className="grid size-9 place-items-center rounded-xl bg-accent text-primary"><Wrench className="size-4 animate-pulse" /></span>
            <span className="text-sm font-medium text-muted-foreground">Loading workshop…</span>
        </div>
    </div>
    )
}
