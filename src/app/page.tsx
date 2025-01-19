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
import { PawPrint } from "lucide-react";
import { CircleHelp } from 'lucide-react';
import { useEffect, useRef, useState } from "react";


export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    console.log("Updated messages:", messages);
  }, [messages]);

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: MessageType = {
      role: "user", content: input,
      id: ""
    };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput(""); // Clear input field

    try {
      // Send the updated messages to the backend
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        console.error("Failed to fetch response from backend");
        return;
      }

      const data = await response.json();
      console.log("Backend response:", data);

      // Update messages with the backend response
      setMessages(data.messages);
    } catch (error) {
      console.error("Error during message submission:", error);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  return (
    <main className="fixed h-full w-full bg-muted">
      <div className = "absolute top-4 right-4">
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
        </div>
        <form
          ref={formRef}
          onSubmit={handleSubmit} className="mt-auto relative">
          <div className="w-full max-w-4xl">
            <Textarea
              className="w-full text-lg"
              placeholder="chat with polo :3"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <Button
              type="submit"
              size='icon'
              disabled={!input}
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