"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const Page = () => {
  return (
    <div className="relative w-full h-screen">
      <div className="-z-50  w-full h-full bg-gradient-to-tl from-fuchsia-100 via-pink-200 to-indigo-300 filter blur backdrop-blur-sm" />
      <div className="absolute p-5 inset-0 w-full h-full flex flex-col space-y-4 items-center justify-center z-50">
        <h1 className="text-4xl md:text-4xl lg:text-6xl text-transparent py-2 bg-clip-text bg-gradient-to-r from-green-400 via-cyan-900 to-blue-500">
          Sign in into trello clone
        </h1>
        <h3 className="text-2xl text-center md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-900 to-green-500">
          Trello brings all your tasks, teammates, and tools together
        </h3>
        <Button onClick={() => signIn("google")}>SignIn with Google</Button>
      </div>
    </div>
  );
};

export default Page;
