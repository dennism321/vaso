import View, { areaMetadata, areaSlugs } from "@/views/practice-area";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return areaSlugs();
}

export async function generateMetadata({ params }: Props) {
  return areaMetadata((await params).slug);
}

export default async function Page({ params }: Props) {
  return <View locale="en" slug={(await params).slug} />;
}
