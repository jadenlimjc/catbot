"use client"
import Image from "next/image";
import Message from "./components/Messages";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import { PawPrint } from "lucide-react";
import { useChat } from "ai/react";
import { useRef } from "react";


export default function Home() {
  const {messages, handleSubmit, input, handleInputChange} = useChat();
  const formRef = useRef<HTMLFormElement>(null)
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key ==="Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  }
  return (
    <main className="fixed h-full w-full bg-muted">
      <div className = "container h-full w-full flex flex-col py-8">
        <div className = "flex-1 overflow-y-auto">
          {messages.map((message, index)=> (
            <Message key={message.id} message={message} />
          ))}
        </div>
        <form 
        ref = {formRef}
        onSubmit = {handleSubmit} className="mt-auto relative">
        <Textarea 
          className="w-full text-lg"
          placeholder="chat with polo :3"
          value = {input}
          onChange = {handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <Button 
          type="submit"
          size = 'icon'
          disabled={!input}
          className = "absolute top-1/2 transform -translate-y-1/2 right-4 rounded-full"
        >
          <PawPrint size ={24}/>
        </Button>
        </form>
      </div>
    </main>
  );
}
