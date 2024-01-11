import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import RootLayout from "../layout";

export default function BlogPost(props: { frontMatter: any; mdxSource: any }) {
  return (
    <RootLayout>
      <title>{props.frontMatter.title}</title>

      <div className="max-w-2xl mx-auto">
        <h1 className="mb-3 text-4xl font-bold">{props.frontMatter.title}</h1>
        <p className="mb-6 text-sm opacity-50">{props.frontMatter.date}</p>
        <MDXRemote {...props.mdxSource} />
      </div>
    </RootLayout>
  );
}
export async function getStaticPaths() {
  let files = fs.readdirSync(path.resolve(process.cwd(), "pages/blog/data"));

  const paths = files.map((file) => {
    return {
      params: {
        slug: file.replace(".mdx", ""),
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const fileData = fs.readFileSync(
    path.resolve(process.cwd(), "pages/blog/data", `${params.slug}.mdx`)
  );

  const { data, content } = matter(fileData);

  const mdxSource = await serialize(content);

  return {
    props: {
      frontMatter: data,
      mdxSource,
    },
  };
}
