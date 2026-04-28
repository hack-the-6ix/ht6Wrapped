import WrappedSlideshow from "./WrappedSlideshow";

// Temporary mock data — replace with real fetch once backend /wrapped/:shareId is wired
const MOCK_DATA = {
  shareId: "demo",
  displayName: "Team Alpha",
  project: { name: "Cool Project", repoUrl: "https://github.com/owner/repo" },
  stats: {
    linesAdded: 4521,
    linesDeleted: 1230,
    totalCommits: 142,
    peakCommitHourEst: 14,
    nightOwlScore: 0.35,
    earlyBirdScore: 0.08,
    firstCommitAt: "2025-01-18T02:34:00Z",
    commitPercentile: 0.85,
    languages: { TypeScript: 45000, CSS: 12000 },
    repoSizeKb: 2340,
    activitiesParticipated: [
      "Opening Ceremony",
      "AI Builder Workshop",
      "Midnight Minigames",
    ],
  },
};

export default async function WrappedPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;

  // TODO: replace with real fetch
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wrapped/${shareId}`)
  // const data = await res.json()
  const data = { ...MOCK_DATA, shareId };

  return <WrappedSlideshow data={data} />;
}
