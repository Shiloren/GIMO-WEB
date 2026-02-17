export type NavItem = { label: string; href: string };
export type CtaButton = { label: string; href: string; variant: "primary" | "secondary" };
export type LogoItem = { label: string };
export type FeatureItem = {
    title: string;
    description: string;
    icon: "GitMerge" | "Activity" | "Users";
    accent: "indigo" | "purple" | "emerald";
};

export type SiteSettings = {
    siteName: string;
    navItems: NavItem[];
    signInLabel: string;
    footerCopyright: string;
};

export type LandingPageContent = {
    heroBadge: string;
    heroTitleLine1: string;
    heroTitleLine2: string;
    heroDescription: string;
    heroCtas: CtaButton[];
    trustTitle: string;
    trustLogos: LogoItem[];
    featuresTitle: string;
    featuresDescription: string;
    features: FeatureItem[];
    codeSectionTitle1: string;
    codeSectionTitle2: string;
    codeSectionDescription: string;
    finalCtaTitle: string;
    finalCtas: CtaButton[];
};

export type LandingData = {
    siteSettings: SiteSettings;
    landingPage: LandingPageContent;
};

export const defaultLandingData: LandingData = {
    siteSettings: {
        siteName: "GIMO",
        navItems: [
            { label: "Producto", href: "#" },
            { label: "Soluciones", href: "#" },
            { label: "Precios", href: "#" },
            { label: "Docs", href: "#" },
        ],
        signInLabel: "Sign In",
        footerCopyright: "© 2024 GIMO Inc. Todos los derechos reservados.",
    },
    landingPage: {
        heroBadge: "Nuevo: Soporte nativo para Llama 3 & GPT-4o",
        heroTitleLine1: "El Sistema Operativo para",
        heroTitleLine2: "Sistemas Multi-Agente.",
        heroDescription:
            "Diseñe, orqueste y escale flujos de IA complejos con una arquitectura basada en grafos. Del prototipo a producción, sin cajas negras.",
        heroCtas: [
            { label: "Crear primer flujo", href: "#", variant: "primary" },
            { label: "Instalar SDK", href: "#", variant: "secondary" },
        ],
        trustTitle: "Utilizado por equipos de ingeniería en",
        trustLogos: [{ label: "ACME Corp" }, { label: "Nebula AI" }, { label: "Quantum" }, { label: "Starlight" }, { label: "Vortex" }],
        featuresTitle: "Construido para producción.",
        featuresDescription:
            "Deje atrás los scripts en Python difíciles de mantener. GIMO le ofrece una infraestructura visual robusta para gestionar la complejidad de los agentes.",
        features: [
            {
                title: "Lógica Condicional Compleja",
                description:
                    "Ramifique conversaciones basándose en análisis de sentimiento, clasificación de intenciones o respuestas de API externas.",
                icon: "GitMerge",
                accent: "indigo",
            },
            {
                title: "Observabilidad Full-Stack",
                description:
                    "Rastree cada token, latencia y costo. Reproduzca sesiones paso a paso para depurar comportamientos inesperados en sus agentes.",
                icon: "Activity",
                accent: "purple",
            },
            {
                title: "Human-in-the-Loop",
                description:
                    "Integre puntos de aprobación manual para acciones sensibles. Sus agentes trabajan, usted supervisa cuando es necesario.",
                icon: "Users",
                accent: "emerald",
            },
        ],
        codeSectionTitle1: "Visual para diseñar.",
        codeSectionTitle2: "Código para escalar.",
        codeSectionDescription:
            'Todo lo que construye en el editor visual se compila a un archivo JSON o YAML limpio, integrable en su CI/CD. Sin "vendor lock-in" oculto.',
        finalCtaTitle: "Empiece a construir hoy.",
        finalCtas: [
            { label: "Solicitar Demo", href: "#", variant: "primary" },
            { label: "Ver Precios", href: "#", variant: "secondary" },
        ],
    },
};

export function mergeLandingData(input?: Partial<LandingData> | null): LandingData {
    if (!input) return defaultLandingData;

    return {
        siteSettings: {
            ...defaultLandingData.siteSettings,
            ...input.siteSettings,
            navItems: input.siteSettings?.navItems?.length ? input.siteSettings.navItems : defaultLandingData.siteSettings.navItems,
        },
        landingPage: {
            ...defaultLandingData.landingPage,
            ...input.landingPage,
            heroCtas: input.landingPage?.heroCtas?.length ? input.landingPage.heroCtas : defaultLandingData.landingPage.heroCtas,
            trustLogos: input.landingPage?.trustLogos?.length ? input.landingPage.trustLogos : defaultLandingData.landingPage.trustLogos,
            features: input.landingPage?.features?.length ? input.landingPage.features : defaultLandingData.landingPage.features,
            finalCtas: input.landingPage?.finalCtas?.length ? input.landingPage.finalCtas : defaultLandingData.landingPage.finalCtas,
        },
    };
}
