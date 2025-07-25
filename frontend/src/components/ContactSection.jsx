import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitch,
  Twitter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxC4tznrq8k0NJAC3IIhsOtgVPE0ChiTwV-eoVks0RpSDqu2kCRphdjSa2YQrKvB8g0oA/exec",
        {
          method: "POST",
          body: new URLSearchParams({ name, email, message }),
        }
      );

      const result = await response.json();

      if (result.result === "success") {
        toast({
          title: "Message sent!",
          description:
            "Thank you for your message. We'll get back to you within 2 business days.",
        });
      } else {
        throw new Error(result.message || "Unknown error");
      }
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };
  return (
    <section id="contact" className="py-24 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Get In <span className="text-[#234451]"> Touch</span>
        </h2>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Have a question, idea, or just want to say hi? Whether you're a mom, a developer or a healthcare partner, we’d love to hear from you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6 text-left">
              {" "}
              Contact Information
            </h3>

            <div className="space-y-6 justify-left">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-[#234451]/10">
                  <Mail className="h-6 w-6 text-[#234451]" />{" "}
                </div>
                <div>
                  <a
                    href="mailto:shriyakkx@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors pt-1"
                  >
                    materna.for.moms@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-[#234451]/10">
                  <Phone className="h-6 w-6 text-[#234451]" />{" "}
                </div>
                <div>
                  <a
                    href="tel:+11234567890"
                    className="text-muted-foreground hover:text-primary transition-colors pt-1"
                  >
                    +1 (945) 335-4766
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-[#234451]/10">
                  <MapPin className="h-6 w-6 text-[#234451]" />{" "}
                </div>
                <div>
                  <a className="text-muted-foreground hover:text-primary transition-colors pt-1">
                    Richardson, Texas, United States
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h4 className="font-medium mb-4 text-left"> Connect With Us</h4>
              <div className="flex space-x-4 justify-left">
                <a href="https://www.linkedin.com/company/materna-women" target="_blank">
                  <Linkedin />
                </a>
                <a href="tel:+19453354766" target="_blank">
                  <Phone/>
                </a>
                <a href="https://www.instagram.com/materna.health/" target="_blank">
                  <Instagram />
                </a>
                <a href="mailto:shriyakkx@gmail.com" target="_blank">
                  <Mail/>
                </a>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-8 rounded-lg shadow-xs"
            onSubmit={handleSubmit}
          >
            <h3 className="text-2xl font-semibold mb-6 text-[hsl(var(--primary))]"> Send a Message</h3>

            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-[hsl(var(--foreground))]"
                >
                  {" "}
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden foucs:ring-2 focus:ring-primary"
                  placeholder="Ryan Trahan..."
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-[hsl(var(--foreground))]"
                >
                  {" "}
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden foucs:ring-2 focus:ring-primary"
                  placeholder="john@gmail.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2 text-[hsl(var(--foreground))]"
                >
                  {" "}
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden foucs:ring-2 focus:ring-primary resize-none"
                  placeholder="Hi, I'd like to ask about..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "cosmic-button w-full flex items-center justify-center gap-2"
                )}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
