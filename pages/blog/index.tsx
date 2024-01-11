import BlogCard from "@/components/Card.blog";
import fs from "fs";
import matter from "gray-matter";

export default function Blog(props: { blogs: any[] }) {
  return (
    <div className="flex">
      {props.blogs.map((blog) => {
        return (
          <BlogCard
            key={blog.slug}
            title={blog.frontMatter.title}
            description={blog.frontMatter.description}
            href={`/blog/${blog.slug}`}
            image={blog.frontMatter.image}
            readTime={blog.frontMatter.readTime}
            date={blog.frontMatter.date}
          />
        );
      })}
    </div>
  );
}

export async function getStaticProps() {
  let files = fs.readdirSync("pages/blog/data");
  files = files.filter((file) => file.endsWith(".mdx"));

  const blogs = files.map((file) => {
    const fileData = fs.readFileSync(`pages/blog/data/${file}`);

    const { data } = matter(fileData);

    return {
      frontMatter: data,
      slug: file.split(".")[0],
    };
  });

  return {
    props: {
      blogs,
    },
  };
}
