import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion";

export interface FaqItem {
    question: string;
    answer: string;
}

export interface FAQProps {
    eyebrow?: string;
    title?: string;
    description?: string;
    items?: FaqItem[];
}

const DEFAULTS: FaqItem[] = [
    {
        question: "Is there a free plan?",
        answer: "Yes — the Starter plan is free forever for individuals and small projects.",
    },
    {
        question: "Can I cancel any time?",
        answer: "Absolutely. You can cancel or downgrade at any time, no phone calls required.",
    },
    {
        question: "Do you offer a team plan?",
        answer: "Yes. The Team plan adds shared workspaces, roles, and an audit log.",
    },
    {
        question: "How is my data handled?",
        answer: "Your data is encrypted in transit and at rest. We never sell or share it.",
    },
];

const FAQ = ({
                 eyebrow = "FAQ",
                 title = "Frequently asked questions",
                 description,
                 items = DEFAULTS,
             }: FAQProps) => {
    return (
        <section id="faq" className="py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    {eyebrow && <p className="text-sm font-medium text-primary">{eyebrow}</p>}
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
                    {description && <p className="mt-4 text-lg text-muted-foreground">{description}</p>}
                </div>

                <div className="mx-auto mt-12 max-w-2xl">
                    <Accordion type="single" collapsible className="w-full">
                        {items.map((item, index) => (
                            <AccordionItem key={item.question} value={`item-${index}`}>
                                <AccordionTrigger className="text-left text-base">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
