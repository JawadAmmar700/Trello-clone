import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Z_Session } from "@/lib/validations";
import prisma from "@/lib/prisma";
import openai from "@/lib/openai";
import { categorizedAgenda } from "@/lib/categorizedAgenda";

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

    const categories = await categorizedAgenda(agendas);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate a two line paragraph that describes the user's today agenda which contains a ${
            categories.get("todos")?.length
          } Todo's,  ${categories.get("inProgress")?.length} inProgress and ${
            categories.get("done")?.length
          } done agendas, start the paragraph with greeting to ${
            session?.user.name
          } include the number of todos, inProgress and done agendas. without describing the agenda's content.`,
        },
      ],
    });

    if (response.status !== 200) {
      return new Response(JSON.stringify("ChatGpt cannot generate now"), {
        status: 505,
      });
    }

    const text = response.data.choices[0].message?.content;

    return new Response(JSON.stringify(text), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify("SomeThing went wrong"), {
      status: 500,
    });
  }
}
