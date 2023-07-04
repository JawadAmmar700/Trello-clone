import GPTSuggestion from "@/components/gpt-suggestion";
import Header from "@/components/header";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Agenda from "@/components/agenda";
import { Z_Session } from "@/lib/validations";

export default async function Home() {
  const session: Z_Session | null = await getServerSession(authOptions);
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
