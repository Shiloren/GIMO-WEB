import { defineField, defineType } from "sanity";

export const featureItemType = defineType({
    name: "featureItem",
    title: "Feature",
    type: "object",
    fields: [
        defineField({ name: "title", title: "Título", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "description", title: "Descripción", type: "text", rows: 3, validation: (rule) => rule.required() }),
        defineField({
            name: "icon",
            title: "Icono",
            type: "string",
            options: {
                list: [
                    { title: "GitMerge", value: "GitMerge" },
                    { title: "Activity", value: "Activity" },
                    { title: "Users", value: "Users" },
                ],
            },
            initialValue: "GitMerge",
        }),
        defineField({
            name: "accent",
            title: "Acento de color",
            type: "string",
            options: {
                list: [
                    { title: "Indigo", value: "indigo" },
                    { title: "Purple", value: "purple" },
                    { title: "Emerald", value: "emerald" },
                ],
            },
            initialValue: "indigo",
        }),
    ],
});
