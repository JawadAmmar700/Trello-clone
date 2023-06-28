import GPTSuggestion from "@/components/gpt-suggestion";
import Header from "@/components/header";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Agenda from "@/components/agenda";
import { Z_Session } from "@/lib/validations";
import prisma from "@/lib/prisma";
import { categorizedAgenda } from "@/lib/categorizedAgenda";

// const userAgendas = async (userId: string) => {
//   const agendas = await prisma.agenda.findMany({
//     where: {
//       userId: userId,
//       status: {
//         in: ["TODO", "DONE", "INPROGRESS"],
//       },
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
//   return categorizedAgenda(agendas);
// };

export default async function Home() {
  const session: Z_Session | null = await getServerSession(authOptions);
  // const agendas = await userAgendas(session?.user.id!);

  return (
    <main className="w-full flex flex-col">
      <div className="h-[350px] w-full relative">
        <div className="-z-50 absolute inset-0 w-full h-full bg-gradient-to-tl from-fuchsia-100 via-pink-200 to-indigo-300 filter blur backdrop-blur-sm" />
        <div className="absolute inset-0 z-10">
          <Header session={session} />
          <GPTSuggestion image={session?.user?.image!} />
          <section className="mt-10  w-full h-full flex justify-center ">
            <Agenda />
          </section>
        </div>
      </div>
    </main>
  );
}
