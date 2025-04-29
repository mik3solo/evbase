"use client"

import type React from "react"
import { useState } from "react"
import { Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function CostCalculatorPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
  
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
		method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        toast({
          title: "Success!",
          description: "You've been added to the waitlist. We'll notify you soon!",
        });
  
        setEmail(""); // Clear input field
      } else {
        throw new Error(result.error || "Something went wrong.");
      }
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
  
      toast({
        title: "Error",
        description: errMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-8">
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto bg-logo-blue/10 rounded-full flex items-center justify-center">
          <Calculator className="w-8 h-8 text-logo-blue" />
        </div>
        <h1 className="text-xl font-bold text-logo-blue">EV Ownership Estimator</h1>
        <p className="text-zinc-400">
          Our advanced EV Cost Calculator is coming soon! Be the first to know when you can calculate your potential
          savings with an electric vehicle.
        </p>
      </div>

      <div className="space-y-4 bg-logo-blue/5 p-6 rounded-xl border border-logo-blue/10">
        <h2 className="text-lg font-semibold text-white">Join the Waitlist</h2>
        <p className="text-md text-zinc-400">
          Get free early access (limited spots) and be notified when it's live.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-background/50"
          />
          <Button type="submit" className="w-full bg-logo-blue hover:bg-logo-blue/90" disabled={isSubmitting}>
            {isSubmitting ? "Joining..." : "Join Waitlist"}
          </Button>
        </form>
      </div>
      <Toaster />
    </div>
  )// Cost of Ownership Calculator,Charging Cost Estimates,Tax Incentives Calculator, maintenance costs, environmental metrics
}

