import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import NavigationRoutes from "./Navigation-routes"


export default function ToggleContainer() {
    return (
        <Sheet>
            <SheetTrigger className="block md:hidden"><Menu className="cursor-pointer" /></SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <SheetDescription />
                        <NavigationRoutes isMobile />
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}
