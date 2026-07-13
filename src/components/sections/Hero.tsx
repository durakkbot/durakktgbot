import {ArrowRight} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

export interface HeroProps {
    eyebrow?: string;
    title?: string;
    highlight?: string;
    description?: string;
    primaryCta?: { label: string; href?: string };
    secondaryCta?: { label: string; href?: string };
}

const Hero = ({
                  eyebrow = "New",
                  title = "Build something people actually want",
                  highlight,
                  description = "A focused, conversion-ready surface — clear message, strong proof, one primary action.",
                  primaryCta = {label: "Get started", href: "#pricing"},
                  secondaryCta = {label: "See how it works", href: "#features"},
              }: HeroProps) => {
    return (
        <section className="relative overflow-hidden py-20 md:py-28">
            <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
                <div
                    className="absolute left-1/2 top-0 h-[480px] w-[860px] -translate-x-1/2 rounded-full gradient-brand opacity-15 blur-3xl"/>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="animate-fade-in-safe mx-auto flex max-w-3xl flex-col items-center text-center">
                    {eyebrow && (
                        <Badge variant="secondary" className="mb-6 px-3 py-1 text-xs tracking-wide">
                            {eyebrow}
                        </Badge>
                    )}

                    <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        {title}
                        {highlight && (
                            <>
                                <br/>
                                <span className="text-gradient">{highlight}</span>
                            </>
                        )}
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                        {description}
                    </p>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
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
        </section>
    );
};

export default Hero;
