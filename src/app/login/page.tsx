import { Button } from "@/components/ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";


export default function LoginPage() {
    return (
        <main className="h-dvh flex flex-col items-center gap-6 text-4xl p-4">
            <h1>Repair Shop</h1>
            <Button variant='default' asChild>
                <LoginLink>Sign In</LoginLink>
            </Button>
            <Button variant='default' asChild>
                <RegisterLink>Sign Up</RegisterLink>
            </Button>
        </main>
    )
}