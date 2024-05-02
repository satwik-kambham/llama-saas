import prisma from "../../../db";

export async function GET(request: Request) {
  return Response.json({
    // paths: await prisma.paths.findMany()
    test: "Hello"
  });
}
