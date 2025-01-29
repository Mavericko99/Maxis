import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SecurityTest() {
    return (<div className="h-screen text-white/80 w-full flex flex-col justify-center items-center text-4xl relative">
        <Link href="/">
            <Button variant="outline" className='absolute top-6 z-10 left-10 pl-3  rounded-full bg-transparent'>
                <ArrowLeft />
                Home</Button>
        </Link>
        Coming Soon!
    </div>)
}