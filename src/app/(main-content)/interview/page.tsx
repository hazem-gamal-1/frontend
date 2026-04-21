import InterviewPageClient from "./interview-page-client";
type PageProps = {
  searchParams: Promise<{
    sessionId: string;
    lang: string;
  }>;
};

export default async function InterviewPage({ searchParams }: PageProps) {
  const { sessionId, lang } = await searchParams;

  return <InterviewPageClient lang={lang} sessionId={sessionId} />;
}
