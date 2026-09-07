import { PortfolioShell } from "@/components/portfolio-shell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const publishedProjects = await prisma.portfolioVideo.findMany({
    where: { published: true },
    orderBy: { displayOrder: "asc" },
  });

  return <PortfolioShell dbProjects={publishedProjects} />;
}
