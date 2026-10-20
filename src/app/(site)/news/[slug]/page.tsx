import View, { postMetadata, postSlugs } from "@/views/news-post";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return postSlugs();
}

export async function generateMetadata({ params }: Props) {
  return postMetadata((await params).slug);
}

export default async function Page({ params }: Props) {
  return <View locale="el" slug={(await params).slug} />;
}
