import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { trackBySlug, tracks } from "@/content/academy";
import { TrackView } from "@/components/pages/TrackView";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tracks.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const track = trackBySlug((await params).slug);
  return track ? { title: track.title, description: track.short } : {};
}

export default async function Page({ params }: Props) {
  const track = trackBySlug((await params).slug);
  if (!track) notFound();
  return <TrackView track={track} />;
}
