import { User } from "@/types";
import { UserCircleIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserInfo({ user }: { user: User }) {
    return (
        <div className="flex items-center gap-2">
            <Avatar className="size-6" >
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback>
                    <UserCircleIcon className="size-6" />
                </AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
        </div>
    )
}
