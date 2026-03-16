import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { ItemType } from "../../backend";
import { useCreateOrder } from "../../hooks/useQueries";

interface PurchaseInquiryFormProps {
  itemId: string;
  itemType: ItemType;
  itemName: string;
}

export default function PurchaseInquiryForm({
  itemId,
  itemType,
  itemName,
}: PurchaseInquiryFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [submitted, setSubmitted] = useState(false);

  const createOrderMutation = useCreateOrder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const quantityNum = Number.parseInt(quantity);
    if (Number.isNaN(quantityNum) || quantityNum < 1) {
      toast.error("Please enter a valid quantity");
      return;
    }

    try {
      await createOrderMutation.mutateAsync({
        itemId,
        itemType,
        name: name.trim(),
        email: email.trim(),
        message: message.trim() || null,
        quantity: BigInt(quantityNum),
      });

      setSubmitted(true);
      toast.success("Inquiry submitted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit inquiry");
    }
  };

  if (submitted) {
    return (
      <Card className="shimmer-border shimmer-overlay">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle2 className="mb-4 h-12 w-12 text-shimmer" />
          <h3 className="mb-2 font-display text-xl font-semibold">
            Thank You!
          </h3>
          <p className="text-muted-foreground">
            Your purchase inquiry for "{itemName}" has been received. We'll get
            back to you soon!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shimmer-border shimmer-overlay">
      <CardHeader>
        <CardTitle>Purchase Inquiry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="shimmer-border"
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="shimmer-border"
            />
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="shimmer-border"
            />
          </div>

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any questions or special requests..."
              rows={4}
              className="shimmer-border"
            />
          </div>

          <Button
            type="submit"
            className="w-full shimmer-glow"
            disabled={createOrderMutation.isPending}
          >
            {createOrderMutation.isPending ? "Submitting..." : "Submit Inquiry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
