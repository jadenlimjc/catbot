import { Message as MessageType } from "ai";
import { Cat, User } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";

export default function Message({ message }: { message: MessageType }) {
    const { role, content } = message;
    if (role === 'assistant') {

        const parser = new DOMParser();
        const parsedContent = parser.parseFromString(content, "text/html");
        const images = Array.from(parsedContent.querySelectorAll("img")).map((img) => ({
            src: img.src,
            width: parseInt(img.getAttribute("width") || "300"),
            height: parseInt(img.getAttribute("height") || "300")

        }));
        return (
            <div className="flex flex-col gap-3 p-6 whitespace-pre-wrap">
                <div className="flex items-center gap-2">
                    <Cat />
                    Polo:
                </div>
                {/* Render text content */}
                <div className="text-lg text-gray-700">
                    {parsedContent.body.textContent}
                </div>
                {/* Render images */}
                <div className="flex flex-col gap-4 mt-4 items-center">
                    {images.map(({ src, width, height }, index) => (
                        <div
                        key={index}
                        className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-md"
                        style={{ height: `${(height / width) * 100}%` }}
                      >
                            <Image
                                src={src}
                                alt={`Cat ${index + 1}`}
                                layout="responsive"
                                width={width}
                                height={height}
                                objectFit="cover"
                                className="rounded-lg shadow-md"
                            />
                        </div>
                    ))}

                </div>
            </div>
        )
    }
    return (
        <Card className="whitespace-pre-wrap">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <User size={36} />
                    {content}
                </div>
            </CardHeader>
        </Card>
    );
}