import { PortfolioShell } from "@/components/portfolio-shell";
import { prisma } from "@/lib/prisma";

// Cache homepage statically with 60s revalidation to minimize database hits and bandwidth
export const revalidate = 60;

export default async function Home() {
  const publishedProjects = await prisma.portfolioVideo.findMany({
    where: { published: true },
    orderBy: { displayOrder: "asc" },
  });

  return <PortfolioShell dbProjects={publishedProjects} />;
}
