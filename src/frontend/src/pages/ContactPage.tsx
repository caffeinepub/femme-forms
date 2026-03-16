import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSendContactMessage } from "../hooks/useQueries";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const sendMessage = useSendContactMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await sendMessage.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    }
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight">
            Get in Touch
          </h1>
          <p className="mt-2 text-muted-foreground">
            Have a question or want to discuss a custom piece? Send us a
            message.
          </p>
        </div>

        {submitted && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
                <h3 className="mt-4 font-display text-xl font-semibold">
                  Message Sent!
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Thank you for reaching out. We'll get back to you soon.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Form
            </CardTitle>
            <CardDescription>
              Fill out the form below and we'll respond as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">
                  Message <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  rows={6}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={sendMessage.isPending}
              >
                {sendMessage.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
