"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, X, Send, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export function ContactDropdown({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setEmail("");
        setPhone("");
        setMessage("");
        setErrors({});
        setSubmitted(false);
      }, 300);
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: { email?: string; message?: string } = {};
  
    // Basic email validation (format check)
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email is invalid";
    }
  
    if (!message.trim()) {
      newErrors.message = "Message is required";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, message }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
        toast({ title: "Message sent!", description: "We'll get back to you as soon as possible." });

        setEmail("");
        setPhone("");
        setMessage("");

        setTimeout(() => onOpenChange(false), 2000);
      } else {
        throw new Error(result.error || "Something went wrong.");
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div ref={dropdownRef} className="absolute right-0 top-12 w-80 bg-background border border-zinc-800 rounded-lg shadow-lg z-50 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-logo-blue">Contact Us</h3>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {submitted ? (
            <div className="py-6 text-center space-y-3">
              <div className="flex justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h4 className="text-white font-medium">Thank You!</h4>
              <p className="text-sm text-zinc-400">Your message has been sent. We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
                  <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={`pl-10 bg-background/50 border-zinc-800/50 ${errors.email ? "border-red-500" : ""}`} required />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-white">Phone (optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
                  <Input id="phone" type="tel" placeholder="(123) 456-7890" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 bg-background/50 border-zinc-800/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-white">
                  Message <span className="text-red-500">*</span>
                </label>
                <Textarea id="message" placeholder="How can we help you?" value={message} onChange={(e) => setMessage(e.target.value)} className={`bg-background/50 border-zinc-800/50 min-h-[80px] ${errors.message ? "border-red-500" : ""}`} required />
                {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
              </div>

              <Button type="submit" className="w-full bg-logo-blue hover:bg-logo-blue/90 text-white" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Send className="mr-2 h-4 w-4" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
      <Toaster />
    </>
  );
}