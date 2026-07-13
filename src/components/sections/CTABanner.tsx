import {ArrowRight} from "lucide-react";

import {Button} from "@/components/ui/button";

export interface CTABannerProps {
    eyebrow?: string;
    title?: string;
    description?: string;
    primaryCta?: { label: string; href?: string };
    secondaryCta?: { label: string; href?: string };
}

const CTABanner = ({
                       eyebrow,
                       title = "Ready to get started?",
                       description = "Create your first project in under a minute. No credit card required.",
                       primaryCta = {label: "Get started free", href: "#"},
                       secondaryCta,
                   }: CTABannerProps) => {
    return (
        <section className="py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div
                    className="relative overflow-hidden rounded-3xl border border-border/70 bg-card px-6 py-16 text-center sm:px-12">
                    <div className="pointer-events-none absolute inset-0 -z-10 gradient-brand opacity-[0.07]"/>
                    <div
                        className="pointer-events-none absolute inset-x-0 -top-16 -z-10 h-64 gradient-brand opacity-10 blur-3xl"/>

                    <div className="mx-auto max-w-2xl">
                        {eyebrow && (
                            <p className="text-sm font-medium uppercase tracking-wider text-primary">
                                {eyebrow}
                            </p>
                        )}
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                            {title}
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">{description}</p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <Button asChild size="lg" className="gap-2">
                                <a href={primaryCta.href ?? "#"}>
                                    {primaryCta.label}
                                    <ArrowRight className="h-4 w-4"/>
                                </a>
                            </Button>
                            {secondaryCta && (
                                <Button asChild variant="outline" size="lg">
                                    <a href={secondaryCta.href ?? "#"}>{secondaryCta.label}</a>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTABanner;
