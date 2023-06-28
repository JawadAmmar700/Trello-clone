import prisma from "@/lib/prisma";
import type { Agenda } from "@prisma/client";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Z_Session } from "@/lib/validations";

const convert: {
  [key: string]: "TODO" | "INPROGRESS" | "DONE";
} = {
  todos: "TODO",
  inProgress: "INPROGRESS",
  done: "DONE",
};

export async function POST(req: Request) {
  const { data, newStatus } = (await req.json()) as {
    data: Agenda;
    newStatus: string;
  };
  try {
    await prisma.agenda.update({
      where: { id: data.id },
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
  if (!session) {
    return new Response(JSON.stringify("Unauthorized"), {
      status: 401,
    });
  }

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
