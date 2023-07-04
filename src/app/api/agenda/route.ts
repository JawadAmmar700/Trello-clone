import prisma from "@/lib/prisma";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Z_Session, updateAgendaAPI } from "@/lib/validations";

const convert: {
  [key: string]: "TODO" | "INPROGRESS" | "DONE";
} = {
  todos: "TODO",
  inProgress: "INPROGRESS",
  done: "DONE",
};

export async function POST(req: Request) {
  const data = await req.json();
  try {
    const { id, newStatus } = updateAgendaAPI.parse(data);
    await prisma.agenda.update({
      where: { id },
      data: {
        status: convert[newStatus],
      },
    });
    return new Response(JSON.stringify("success"), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify("SomeThing went wrong"), {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  const session: Z_Session | null = await getServerSession(authOptions);
  try {
    const agendas = await prisma.agenda.findMany({
      where: {
        userId: session?.user.id,
        status: {
          in: ["TODO", "DONE", "INPROGRESS"],
        },
      },
    });

    return new Response(JSON.stringify(agendas), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify("SomeThing went wrong"), {
      status: 500,
    });
  }
}
