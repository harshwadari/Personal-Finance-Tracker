"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Header() {
    const { user, isSignedIn } = useUser();
    const router = useRouter();

    React.useEffect(() => {
        if (isSignedIn) {
            router.push("/dashboard");
        }
    }, [isSignedIn, router]);

    return (
        <div
            className="p-5 flex justify-between items-center border shadow-md"
            style={{
                backgroundImage: "url('/money.jpg')", // Path to your money.jpg in the public folder
                backgroundSize: "cover", // Ensures the image covers the entire div
                backgroundPosition: "center", // Centers the image
                backgroundRepeat: "no-repeat" ,
                minHeight: "150px", // Prevents the image from repeating
            }}
        >
            <Image src={"./logo.svg"} alt="logo" width={160} height={100} />
            {isSignedIn ? (
                <UserButton />
            ) : (
                <Link href={"/sign-up"}>
                    <Button>Get Started</Button>
                </Link>
            )}
        </div>
    );
}

export default Header;