import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
    name: "siteSettings",
    title: "Ajustes del sitio",
    type: "document",
    fields: [
        defineField({ name: "siteName", title: "Nombre del sitio", type: "string", initialValue: "GIMO" }),
        defineField({ name: "logoIcon", title: "Icono del logo", type: "string", initialValue: "Layers" }),
        defineField({
            name: "navItems",
            title: "Navegación",
            type: "array",
            of: [{ type: "navItem" }],
            initialValue: [
                { _type: "navItem", label: "Producto", href: "#" },
                { _type: "navItem", label: "Soluciones", href: "#" },
                { _type: "navItem", label: "Precios", href: "#" },
                { _type: "navItem", label: "Docs", href: "#" },
            ],
        }),
        defineField({ name: "signInLabel", title: "Texto Sign In", type: "string", initialValue: "Sign In" }),
        defineField({ name: "footerCopyright", title: "Copyright footer", type: "string", initialValue: "© 2024 GIMO Inc. Todos los derechos reservados." }),
    ],
    preview: {
        select: { title: "siteName" },
    },
});
