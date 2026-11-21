import ProjectsSection from "../components/ProjectsSection";
import { getLatestReels } from "../lib/instagram";

export const metadata = {
  title: "Free Music Tools & Projects",
  description:
    "Free music tools and projects by Cooper Mapes: an interactive diatonic chord tuning trainer, a DCI historical scores graph, drum corps transcription videos, and Theoretically, a daily music theory game.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const reels = await getLatestReels(2);
  return <ProjectsSection reels={reels} />;
}
