import React from "react";
import { Message as MessageType } from "ai";
import { Cat, User } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Message({ message }: { message: MessageType }) {
  const { role, content } = message;

  if (role === "assistant") {
    return (
      <div className="flex flex-col gap-3 p-6 whitespace-pre-wrap">
        <div className="flex items-center gap-2">
          <Cat />
          Polo:
        </div>
        {/* Render Markdown content */}
        <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    // Custom renderer for images
    img: ({ src, alt }) => (
      <div className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-md">
        <Image
          src={src || ""}
          alt={alt || "Image"}
          layout="responsive"
          width={300}
          height={300}
          objectFit="cover"
          className="rounded-lg shadow-md"
        />
      </div>
    ),
    // Custom renderer for paragraphs
    p: ({ children }) => {
      // Check if the children contain an image
      const hasImage = React.Children.toArray(children).some(
        (child) =>
          React.isValidElement(child) &&
          child.type === "img" // Checks if the child is an <img> element
      );

      // If an image is present, render children without wrapping in <p>
      if (hasImage) {
        return <>{children}</>;
      }

      // Otherwise, wrap content in <p>
      return <p className="text-lg text-gray-700">{children}</p>;
    },
  }}
>
  {content}
</ReactMarkdown>

      </div>
    );
  }

  // Render user messages
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
