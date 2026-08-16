import { PortfolioShell } from "@/components/portfolio-shell";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const publishedProjects = await prisma.portfolioVideo.findMany({
    where: { published: true },
    orderBy: { displayOrder: "asc" },
  });

  return <PortfolioShell dbProjects={publishedProjects} />;
}
