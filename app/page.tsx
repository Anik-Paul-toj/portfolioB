import { PortfolioShell } from "@/components/portfolio-shell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [publishedProjects, publishedCovers] = await Promise.all([
    prisma.portfolioVideo.findMany({
      where: { published: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.thumbnailCover.findMany({
      where: { published: true },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  return <PortfolioShell dbProjects={publishedProjects} dbCovers={publishedCovers} />;
}

