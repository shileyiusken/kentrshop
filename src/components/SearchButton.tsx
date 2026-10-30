'use client'

import { LoaderCircle, Search } from "lucide-react"
import { useFormStatus } from "react-dom"
import { Button } from "./ui/button"

export default function SearchButton() {
    const status = useFormStatus()

    return (
        <Button type="submit" disabled={status.pending} className="h-11 w-full rounded-xl px-5 shadow-sm sm:w-auto">
            {status.pending ? (
                <LoaderCircle className="animate-spin" />
        ) : <><Search className="size-4" /> Search</>}
        </Button>
    )
}
