import Link from "next/link";

export default function BlogCard({
  title,
  description,
  href,
  image,
  date,
  readTime,
}: {
  title: string;
  description: string;
  href: string;
  image: string;
  date: string;
  readTime: string;
}) {
  return (
    <Link href={href} rel="noopener noreferrer">
      <div className="max-w-md bg-white rounded-xl overflow-hidden shadow-lg p-6 mb-6 mx-3">
        <img
          className="w-full h-32 object-cover mb-4"
          src={image}
          alt={title}
        />
        <div className="text-justify">
          <h2 className="text-xl text-left font-bold text-gray-800 mb-2">
            {title}
          </h2>
          <p className="text-gray-600 mb-4 text-sm">{description}</p>
          <p className="text-gray-500 text-xs">
            {date} • {readTime} min read
          </p>
        </div>
      </div>
    </Link>
  );
}
