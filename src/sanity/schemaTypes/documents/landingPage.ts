import { defineField, defineType } from "sanity";

export const landingPageType = defineType({
    name: "landingPage",
    title: "Landing Page",
    type: "document",
    fields: [
        defineField({ name: "heroBadge", title: "Hero badge", type: "string", initialValue: "Nuevo: Soporte nativo para Llama 3 & GPT-4o" }),
        defineField({ name: "heroTitleLine1", title: "Título línea 1", type: "string", initialValue: "El Sistema Operativo para" }),
        defineField({ name: "heroTitleLine2", title: "Título línea 2", type: "string", initialValue: "Sistemas Multi-Agente." }),
        defineField({
            name: "heroDescription",
            title: "Descripción Hero",
            type: "text",
            rows: 3,
            initialValue: "Diseñe, orqueste y escale flujos de IA complejos con una arquitectura basada en grafos. Del prototipo a producción, sin cajas negras.",
        }),
        defineField({
            name: "heroCtas",
            title: "Botones Hero",
            type: "array",
            of: [{ type: "ctaButton" }],
            initialValue: [
                { _type: "ctaButton", label: "Crear primer flujo", href: "#", variant: "primary" },
                { _type: "ctaButton", label: "Instalar SDK", href: "#", variant: "secondary" },
            ],
        }),
        defineField({
            name: "trustTitle",
            title: "Título trust",
            type: "string",
            initialValue: "Utilizado por equipos de ingeniería en",
        }),
        defineField({
            name: "trustLogos",
            title: "Logos trust",
            type: "array",
            of: [{ type: "logoItem" }],
            initialValue: [
                { _type: "logoItem", label: "ACME Corp" },
                { _type: "logoItem", label: "Nebula AI" },
                { _type: "logoItem", label: "Quantum" },
                { _type: "logoItem", label: "Starlight" },
                { _type: "logoItem", label: "Vortex" },
            ],
        }),
        defineField({ name: "featuresTitle", title: "Título features", type: "string", initialValue: "Construido para producción." }),
        defineField({
            name: "featuresDescription",
            title: "Descripción features",
            type: "text",
            rows: 3,
            initialValue: "Deje atrás los scripts en Python difíciles de mantener. GIMO le ofrece una infraestructura visual robusta para gestionar la complejidad de los agentes.",
        }),
        defineField({
            name: "features",
            title: "Cards features",
            type: "array",
            of: [{ type: "featureItem" }],
            initialValue: [
                {
                    _type: "featureItem",
                    title: "Lógica Condicional Compleja",
                    description: "Ramifique conversaciones basándose en análisis de sentimiento, clasificación de intenciones o respuestas de API externas.",
                    icon: "GitMerge",
                    accent: "indigo",
                },
                {
                    _type: "featureItem",
                    title: "Observabilidad Full-Stack",
                    description: "Rastree cada token, latencia y costo. Reproduzca sesiones paso a paso para depurar comportamientos inesperados en sus agentes.",
                    icon: "Activity",
                    accent: "purple",
                },
                {
                    _type: "featureItem",
                    title: "Human-in-the-Loop",
                    description: "Integre puntos de aprobación manual para acciones sensibles. Sus agentes trabajan, usted supervisa cuando es necesario.",
                    icon: "Users",
                    accent: "emerald",
                },
            ],
        }),
        defineField({
            name: "codeSectionTitle1",
            title: "Título código línea 1",
            type: "string",
            initialValue: "Visual para diseñar.",
        }),
        defineField({
            name: "codeSectionTitle2",
            title: "Título código línea 2",
            type: "string",
            initialValue: "Código para escalar.",
        }),
        defineField({
            name: "codeSectionDescription",
            title: "Descripción código",
            type: "text",
            rows: 3,
            initialValue: "Todo lo que construye en el editor visual se compila a un archivo JSON o YAML limpio, integrable en su CI/CD. Sin \"vendor lock-in\" oculto.",
        }),
        defineField({ name: "finalCtaTitle", title: "Título CTA final", type: "string", initialValue: "Empiece a construir hoy." }),
        defineField({
            name: "finalCtas",
            title: "Botones CTA final",
            type: "array",
            of: [{ type: "ctaButton" }],
            initialValue: [
                { _type: "ctaButton", label: "Solicitar Demo", href: "#", variant: "primary" },
                { _type: "ctaButton", label: "Ver Precios", href: "#", variant: "secondary" },
            ],
        }),
    ],
    preview: {
        prepare: () => ({ title: "Landing principal" }),
    },
});
