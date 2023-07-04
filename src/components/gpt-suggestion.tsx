"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";

interface GPTSuggestionProps {
  image: string;
}

const GPTSuggestion = ({ image }: GPTSuggestionProps) => {
  const { data, isFetching } = useQuery({
    queryKey: ["gpt-suggestion"],
    queryFn: async () =>
      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/completions`).then(
        (res) => res.json()
      ),
  });

  // const isFetching = false;
  // const data = "This is a suggestion";

  return (
    <div
      className={`${
        isFetching && "animate-pulse"
      }  md:w-3/4 w-11/12 mx-auto mt-5  space-x-5 rounded-lg bg-white shadow-md shadow-slate-700 flex items-center py-2 px-8`}
    >
      <Avatar>
        <AvatarImage src={image} alt="user-profile" />
        <AvatarFallback>
          <Skeleton className="h-12 w-12 rounded-full" />
        </AvatarFallback>
      </Avatar>
      {isFetching ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      ) : (
        <div className="text-sm font-semibold">{data}</div>
      )}
    </div>
  );
};

export default GPTSuggestion;
