import React from "react";
import { Message as MessageType } from "ai";
import { Cat, User } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * A React component that renders a message from either the assistant or the user.
 *
 * @param {Object} props - The component props.
 * @param {MessageType} props.message - The message object containing the role and content.
 * @returns {JSX.Element} A rendered message component.
 */
export default function Message({ message }: { message: MessageType }) {
  const { role, content } = message;

  /**
   * Renders the assistant's message with a specific design.
   * The assistant's name "Polo" is displayed in bold and large font, with Markdown content rendered below.
   */
  if (role === "assistant") {
    return (
      <div className="flex flex-col gap-3 p-6 whitespace-pre-wrap">
        <div className="flex items-center gap-2">
          <Cat />
          <strong className="text-xl font-bold">Polo:</strong>
        </div>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            /**
             * Custom rendering for images in Markdown.
             *
             * @param {Object} props - The image properties.
             * @param {string} props.src - The source URL of the image.
             * @param {string} props.alt - The alt text for the image.
             * @returns {JSX.Element} A styled image component.
             */
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
            /**
             * Custom rendering for paragraphs in Markdown.
             *
             * @param {Object} props - The paragraph properties.
             * @param {React.ReactNode} props.children - The content inside the paragraph.
             * @returns {JSX.Element} A styled paragraph component.
             */
            p: ({ children }) => (
              <div className="text-lg text-gray-700">{children}</div>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  /**
   * Renders the user's message with a specific design.
   * The user's message is displayed within a card component.
   */
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
