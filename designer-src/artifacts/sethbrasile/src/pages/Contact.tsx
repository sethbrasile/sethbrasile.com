import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Send, ArrowRight } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  function onSubmit(data: ContactFormValues) {
    const body = `Name: ${data.name}%0D%0AEmail: ${data.email}%0D%0A%0D%0A${data.message.replace(/\n/g, '%0D%0A')}`;
    const mailto = `mailto:seth@tenorcreative.com?subject=${encodeURIComponent(data.subject)}&body=${body}`;
    window.location.href = mailto;
  }

  return (
    <>
      <Helmet>
        <title>Contact Seth Brasile</title>
        <meta name="description" content="Get in touch with Seth Brasile for software engineering, automation, or IT/Security consulting." />
        <link rel="canonical" href="https://sethbrasile.com/contact" />
        <meta property="og:title" content="Contact Seth Brasile" />
        <meta property="og:description" content="Get in touch with Seth Brasile for software engineering, automation, or IT/Security consulting." />
        <meta property="og:url" content="https://sethbrasile.com/contact" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-2xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6 tracking-tight">Contact</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Let's build something.
          </p>
        </header>

        <div className="grid gap-12">
          <div className="bg-secondary/50 p-8 rounded-xl border border-border">
            <h2 className="text-2xl font-bold font-display mb-2">Marketing or SEO?</h2>
            <p className="text-muted-foreground mb-6">
              If you're looking for web design, technical SEO, or marketing automation for your business, reach out to my agency.
            </p>
            <a 
              href="https://pricklypearmarketing.co" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 rounded-md font-medium transition-transform hover:-translate-y-0.5"
            >
              Visit Prickly Pear Marketing Co <ArrowRight size={18} />
            </a>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-display mb-6">Need something built or automated?</h2>
            <p className="text-muted-foreground mb-8">
              For direct software engineering, custom automation, or IT/Security consulting, use the form below to email me directly.
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card border border-border p-6 md:p-8 rounded-xl">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" {...field} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="jane@example.com" type="email" {...field} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="What do you need built?" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Details about your project, scale, and timeline..." 
                          className="min-h-[150px] bg-background" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button 
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-3 rounded-md font-medium transition-transform hover:-translate-y-0.5"
                >
                  <Send size={18} /> Send Email
                </button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
