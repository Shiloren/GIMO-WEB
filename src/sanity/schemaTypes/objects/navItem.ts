import { defineField, defineType } from "sanity";

export const navItemType = defineType({
    name: "navItem",
    title: "Ítem de navegación",
    type: "object",
    fields: [
        defineField({ name: "label", title: "Etiqueta", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "href", title: "Enlace", type: "string", initialValue: "#" }),
    ],
});
