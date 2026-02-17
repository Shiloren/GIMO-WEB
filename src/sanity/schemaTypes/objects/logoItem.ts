import { defineField, defineType } from "sanity";

export const logoItemType = defineType({
    name: "logoItem",
    title: "Logo de confianza",
    type: "object",
    fields: [defineField({ name: "label", title: "Texto", type: "string", validation: (rule) => rule.required() })],
});
