import {Quote} from "lucide-react";

import {Card, CardContent} from "@/components/ui/card";

export interface Testimonial {
    quote: string;
    author: string;
    role?: string;
    avatar?: string;
}

export interface TestimonialsProps {
    eyebrow?: string;
    title?: string;
    description?: string;
    items?: Testimonial[];
}

const DEFAULTS: Testimonial[] = [
    {
        quote: "We replaced three tools with this in a week. The team moves noticeably faster now.",
        author: "Priya Shah",
        role: "Head of Product, Northwind",
    },
    {
        quote: "Genuinely the first tool my whole team actually uses on day one. No training required.",
        author: "Marcus Lee",
        role: "Engineering Lead, Lumen",
    },
    {
        quote: "It nails the boring parts so we can focus on the interesting ones. That's rare.",
        author: "Ava Rodriguez",
        role: "Founder, Halcyon",
    },
];

const Testimonials = ({
                          eyebrow = "Loved by builders",
                          title = "Teams ship better, faster",
                          description,
                          items = DEFAULTS,
                      }: TestimonialsProps) => {
    return (
        <section className="bg-muted/30 py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    {eyebrow && <p className="text-sm font-medium text-primary">{eyebrow}</p>}
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
                    {description && <p className="mt-4 text-lg text-muted-foreground">{description}</p>}
                </div>

                <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <Card key={item.author} className="panel-surface flex flex-col">
                            <CardContent className="flex flex-1 flex-col p-6">
                                <Quote className="h-5 w-5 text-primary/60" aria-hidden/>
                                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-foreground/90">
                                    "{item.quote}"
                                </blockquote>
                                <div className="mt-6 flex items-center gap-3">
                                    {item.avatar ? (
                                        <img
                                            src={item.avatar}
                                            alt=""
                                            className="h-9 w-9 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                            {item.author.charAt(0)}
                                        </div>
                                    )}
                                    <div className="text-sm">
                                        <div className="font-medium text-foreground">{item.author}</div>
                                        {item.role && <div className="text-muted-foreground">{item.role}</div>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
