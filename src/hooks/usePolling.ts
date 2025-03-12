import { useRouter } from "next/navigation";
import { useEffect } from "react";


export function usePolling(ms: number = 60000, searchParam: string | null) {
    const router = useRouter()

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!searchParam) {
                router.refresh()
            }
        }, ms)

        return () => clearInterval(intervalId)
    }, [searchParam, ms]) // eslint-disable-line react-hooks/exhaustive-deps
}