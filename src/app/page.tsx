"use client"
import { Message as MessageType } from "ai";
import Message from "./components/Messages";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PawPrint, CircleHelp, Loader } from "lucide-react";
import { useRef, useState } from "react";

/**
 * Home component for the Catbot application.
 * Allows users to chat with Polo, a helpful cat assistant.
 */
export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([]); // Stores chat messages
  const [isProcessing, setIsProcessing] = useState(false); // Tracks processing state
  const [input, setInput] = useState(""); // Tracks user input
  const formRef = useRef<HTMLFormElement>(null);
  

  /**
   * Updates the input state when the user types in the textarea.
   * @param e - The textarea change event.
   */
  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
  }

  /**
   * Handles form submission and sends the user's message to the backend.
   * Prevents multiple submissions while a run is in progress.
   * @param e - The form submission event.
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (isProcessing) return; // Prevent submission during processing
    setIsProcessing(true); // Set processing state

    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: MessageType = {
      role: "user",
      content: input,
      id: "",
    };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages); // Update messages with user input
    setInput(""); // Clear input field

    try {
      // Send the updated messages to the backend
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages); // Update messages with backend response
      } else {
        throw new Error("Failed to fetch response from backend");
      }
    } catch (error) {
      console.error("Error during message submission:", error);
    } finally {
      setIsProcessing(false); // Reset processing state
    }
  }

  /**
   * Handles the Enter key press for submission.
   * Prevents default behavior and submits the form if Shift is not pressed.
   * @param e - The keyboard event.
   */
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  return (
    <main className="fixed h-full w-full bg-muted">
      <div className="absolute top-4 right-4">
        <Dialog>
          <DialogTrigger>
            <CircleHelp size={24} />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Catbot Help</DialogTitle>
              <DialogDescription>
                This application is designed to allow users to chat with Polo, a helpful cat assistant. Ask questions, interact, and fetch images by specifying different cat breeds :3
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="container h-full w-full flex flex-col py-8 px-4 mx-auto">
        <div className="flex-1 overflow-y-auto">
          {messages.map((message, index) => (
            <Message key={message.id || index} message={message} />
          ))}
          {isProcessing && (
            <div className="my-4 flex items-center justify-center">
              <Loader className="animate-spin" />
            </div>
          )}
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="mt-auto relative">
          <div className="w-full max-w-4xl">
            <Textarea
              className="w-full text-lg"
              placeholder="chat with polo :3"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isProcessing} // Disable input while processing
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input || isProcessing} // Disable button while processing or input is empty
              className="absolute top-1/2 transform -translate-y-1/2 right-4 rounded-full"
            >
              <PawPrint size={24} />
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
