import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex"
import remarkMath from 'remark-math'
import remarkGfm from "remark-gfm"
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const computedFields = <T extends { slug: string }>(data: T) => ({
  ...data,
  slugAsParams: data.slug.split("/").slice(1).join("/"),
});

export const blogs = defineCollection({
  name: "Blog",
  pattern: "blog/**/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      date: s.isodate(),
      published: s.boolean().default(true),
      tags: s.array(s.string()).optional(),
      body: s.mdx(),
      image: s.image().optional(),
      author: s.string(),
    })
    .transform(computedFields),
});

export const pages = defineCollection({
  name: "Page",
  pattern: "pages/**/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      body: s.mdx(),
    })
    .transform(computedFields),
});

export const tils = defineCollection({
  name: "TIL",
  pattern: "tils/**/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      date: s.isodate(),
      body: s.mdx(),
    })
    .transform(computedFields),
  });

export const authors = defineCollection({
  name: "Author",
  pattern: "author/**/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      name: s.string(),
      image: s.image(),
      link: s.string().optional(),
    })
    .transform(computedFields),
})

export const projects = defineCollection({
  name: "Project",
  pattern: "projects/**/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      title: s.string(),
      description: s.string(),
      date: s.isodate(),
      tags: s.array(s.string()),
      body: s.mdx(),
      image: s.image(),
      imageDark: s.image().optional(),
      links: s.array(
        s.object({
          name: s.string(),
          url: s.string().url(),
        })
      ),
    })
    .transform(computedFields),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { blogs, authors, pages, tils, projects },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      rehypeKatex,
      [rehypePrettyCode, { theme: "github-dark" }],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
    remarkPlugins: [remarkMath, remarkGfm],
  },
});