import type { Status } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Z_Session } from "@/lib/validations";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { data } = (await req.json()) as {
    data: { title: string; image: string | null; type: Status };
  };
  const session: Z_Session | null = await getServerSession(authOptions);
  try {
    const newAgenda = await prisma.agenda.create({
      data: {
        title: data.title,
        image: data.image,
        status: data.type,
        userId: session?.user.id!,
      },
    });
    return new Response(JSON.stringify(newAgenda), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify("SomeThing went wrong"), {
      status: 500,
    });
  }
}
