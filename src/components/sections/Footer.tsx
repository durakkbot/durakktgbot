export interface FooterLink {
    label: string;
    href: string;
}

export interface FooterColumn {
    title: string;
    links: FooterLink[];
}

export interface FooterProps {
    brand?: string;
    tagline?: string;
    columns?: FooterColumn[];
    legal?: string;
}

const DEFAULT_COLUMNS: FooterColumn[] = [
    {
        title: "Product",
        links: [
            {label: "Features", href: "#features"},
            {label: "Pricing", href: "#pricing"},
            {label: "FAQ", href: "#faq"},
        ],
    },
    {
        title: "Company",
        links: [
            {label: "About", href: "#"},
            {label: "Blog", href: "#"},
            {label: "Contact", href: "#"},
        ],
    },
    {
        title: "Legal",
        links: [
            {label: "Privacy", href: "#"},
            {label: "Terms", href: "#"},
        ],
    },
];

const Footer = ({
                    brand = "Acme",
                    tagline = "Build something people actually want.",
                    columns = DEFAULT_COLUMNS,
                    legal,
                }: FooterProps) => {
    const year = new Date().getFullYear();
    return (
        <footer className="border-t border-border/70 bg-muted/20">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid gap-10 md:grid-cols-[1.3fr_2fr]">
                    <div>
                        <div className="text-lg font-semibold tracking-tight text-foreground">{brand}</div>
                        {tagline && (
                            <p className="mt-2 max-w-xs text-sm text-muted-foreground">{tagline}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                        {columns.map((col) => (
                            <div key={col.title}>
                                <div className="text-sm font-medium text-foreground">{col.title}</div>
                                <ul className="mt-4 space-y-3 text-sm">
                                    {col.links.map((link) => (
                                        <li key={link.label}>
                                            <a
                                                href={link.href}
                                                className="text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 border-t border-border/60 pt-6 text-xs text-muted-foreground">
                    {legal ?? `© ${year} ${brand}. All rights reserved.`}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
