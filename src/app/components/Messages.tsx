import { Message as MessageType } from "ai";
import { Cat, User } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";

export default function Message({ message }: { message: MessageType }) {
    const { role, content } = message;
    if (role === 'assistant') {
        return (
            <div className="flex flex-col gap-3 p-6 whitespace-pre-wrap">
                <div className="flex items-center gap-2">
                    <Cat />
                    Polo:
                </div>
                {content}
            </div>
        )
    }
    return (
        <Card className = "whitespace-pre-wrap">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <User size = {36} />
                    {content}
                </div>
            </CardHeader>
        </Card>
    );
}