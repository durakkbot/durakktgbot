import {Check} from "lucide-react";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";

export interface PricingTier {
    name: string;
    price: string;
    period?: string;
    description?: string;
    features: string[];
    cta?: { label: string; href?: string };
    highlighted?: boolean;
}

export interface PricingProps {
    eyebrow?: string;
    title?: string;
    description?: string;
    tiers?: PricingTier[];
}

const DEFAULTS: PricingTier[] = [
    {
        name: "Starter",
        price: "$0",
        period: "/mo",
        description: "For exploring the basics.",
        features: ["Core features", "Community support", "Up to 3 projects"],
        cta: {label: "Start free"},
    },
    {
        name: "Pro",
        price: "$19",
        period: "/mo",
        description: "For shipping serious work.",
        features: ["Everything in Starter", "Unlimited projects", "Priority support", "Advanced analytics"],
        cta: {label: "Start Pro"},
        highlighted: true,
    },
    {
        name: "Team",
        price: "$49",
        period: "/mo",
        description: "For collaborative teams.",
        features: ["Everything in Pro", "Team workspaces", "Role-based access", "Audit log"],
        cta: {label: "Contact sales"},
    },
];

const Pricing = ({
                     eyebrow = "Pricing",
                     title = "Simple pricing that scales with you",
                     description = "Start free. Upgrade when it matters. No hidden fees, no surprises.",
                     tiers = DEFAULTS,
                 }: PricingProps) => {
    return (
        <section id="pricing" className="py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    {eyebrow && <p className="text-sm font-medium text-primary">{eyebrow}</p>}
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
                    <p className="mt-4 text-lg text-muted-foreground">{description}</p>
                </div>

                <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tiers.map((tier) => (
                        <Card
                            key={tier.name}
                            className={cn(
                                "panel-surface relative flex flex-col",
                                tier.highlighted && "border-primary/40 shadow-lg shadow-primary/5 ring-1 ring-primary/10",
                            )}
                        >
                            {tier.highlighted && (
                                <span
                                    className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                                    Most popular
                                </span>
                            )}

                            <CardHeader>
                                <CardTitle className="text-lg">{tier.name}</CardTitle>
                                {tier.description && <CardDescription>{tier.description}</CardDescription>}
                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-semibold tracking-tight">{tier.price}</span>
                                    {tier.period && (
                                        <span className="text-sm text-muted-foreground">{tier.period}</span>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="flex flex-1 flex-col">
                                <ul className="space-y-3 text-sm">
                                    {tier.features.map((f) => (
                                        <li key={f} className="flex items-start gap-2.5">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary"/>
                                            <span className="text-foreground/90">{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                {tier.cta && (
                                    <Button
                                        asChild
                                        variant={tier.highlighted ? "default" : "outline"}
                                        className="mt-8 w-full"
                                    >
                                        <a href={tier.cta.href ?? "#"}>{tier.cta.label}</a>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
