import {Bolt, Feather, LineChart, type LucideIcon, Shield, Sparkles, Workflow} from "lucide-react";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export interface FeatureItem {
    icon?: LucideIcon;
    title: string;
    description: string;
}

export interface FeaturesProps {
    eyebrow?: string;
    title?: string;
    description?: string;
    items?: FeatureItem[];
}

const DEFAULTS: FeatureItem[] = [
    {icon: Bolt, title: "Fast by default", description: "Tuned for real-world speed on first paint and interaction."},
    {icon: Feather, title: "Lightweight", description: "Ships only what you need — no bloated defaults."},
    {icon: Shield, title: "Secure", description: "Sensible baselines so you can ship without second-guessing."},
    {icon: Workflow, title: "Composable", description: "Small pieces that snap together for your specific flow."},
    {icon: LineChart, title: "Measurable", description: "First-class analytics hooks without vendor lock-in."},
    {icon: Sparkles, title: "Delightful", description: "Small moments of polish that make it feel considered."},
];

const Features = ({
                      eyebrow = "Why it works",
                      title = "Everything you need, nothing you don't",
                      description = "A carefully chosen set of building blocks that cover the 80% case and stay out of your way.",
                      items = DEFAULTS,
                  }: FeaturesProps) => {
    return (
        <section id="features" className="bg-muted/30 py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    {eyebrow && <p className="text-sm font-medium text-primary">{eyebrow}</p>}
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">{description}</p>
                </div>

                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => {
                        const Icon = item.icon ?? Sparkles;
                        return (
                            <Card
                                key={item.title}
                                className="panel-surface group transition-colors hover:border-primary/30"
                            >
                                <CardHeader>
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                                        <Icon className="h-5 w-5"/>
                                    </div>
                                    <CardTitle className="mt-5 text-lg">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Features;
