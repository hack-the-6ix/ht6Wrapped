import { notFound, redirect } from "next/navigation";
import WrappedSlideshow from "./WrappedSlideshow";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default async function WrappedPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;

  const res = await fetch(`${API_URL}/wrapped/${shareId}`, { cache: "no-store" });

  if (!res.ok) return notFound();

  const data = await res.json();

  if (data.status === "pending") {
    // Still generating — bounce back and let the landing page polling handle it
    redirect("/");
  }

  if (data.status === "not_found" || data.status === "error") {
    return notFound();
  }

  return <WrappedSlideshow data={data} />;
}
