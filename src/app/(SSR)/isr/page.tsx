import { UnsplashImage } from "@/models/unsplash-image";
import Image from "next/image";
import Link from "next/link";
import { Alert } from "react-bootstrap";

export const metadata = {
  title: "Incremental Static Regeneration - NextJS Image Gallery",
};

// export const revalidate = 0;

export default async function Page() {
  // cache: "no-cache"/"no-store"
  // next: { revalidate: 0 }

  const res = await fetch(
    "https://api.unsplash.com/photos/random?client_id=" +
      process.env.UNSPLASH_ACCESS_KEY,
    {
      next: { revalidate: 15 },
    }
  );

  const image: UnsplashImage = await res.json();

  const width = Math.min(500, image.width);
  const height = (width / image.width) * image.height;

  return (
    <div className="d-flex flex-column align-items-center">
      <Alert>
        This page uses <strong>incremental static regeneration </strong>. A new
        image is fetched every 15 seconds (after refreshing the page) and then
        served from the cache for that duration.
      </Alert>
      <Image
        src={image.urls.raw}
        width={width}
        height={height}
        alt={image.alt_description}
        className="rounded shadow mw-100 h-100"
      />
      by{" "}
      <Link href={"/user/" + image.user.username}>{image.user.username}</Link>
    </div>
  );
}
