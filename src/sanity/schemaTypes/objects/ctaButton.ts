import { defineField, defineType } from "sanity";

export const ctaButtonType = defineType({
    name: "ctaButton",
    title: "Botón CTA",
    type: "object",
    fields: [
        defineField({ name: "label", title: "Texto", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "href", title: "Enlace", type: "string", initialValue: "#" }),
        defineField({
            name: "variant",
            title: "Variante",
            type: "string",
            options: { list: [{ title: "Primary", value: "primary" }, { title: "Secondary", value: "secondary" }] },
            initialValue: "primary",
        }),
    ],
});
