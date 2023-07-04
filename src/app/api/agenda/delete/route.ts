import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { id } = (await req.json()) as {
    id: string;
  };

  try {
    await prisma.agenda.delete({
      where: {
        id,
      },
    });
    return new Response(JSON.stringify("Agenda Deleted Successfully"), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify("SomeThing went wrong"), {
      status: 500,
    });
  }
}
