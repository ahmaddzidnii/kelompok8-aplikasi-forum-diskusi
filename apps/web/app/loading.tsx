import Image from "next/image"
import { Loader2Icon } from "lucide-react"

import { config } from "@/config"

const GlobalLoading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col gap-4">
                <div className="relative aspect-square size-14 overflow-hidden rounded-full transition-opacity duration-200 hover:opacity-80">
                    <Image
                        src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png"
                        alt="logo"
                        fill
                    />
                </div>
                <span className="text-primary/80 text-lg">Aplikasi {config.appName} sedang dimuat.</span>
                <Loader2Icon className="animate-spin size-9 stroke-primary/80" />
            </div>
        </div>
    )
}

export default GlobalLoading
