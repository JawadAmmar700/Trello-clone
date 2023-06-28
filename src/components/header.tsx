"use client";
import { Input } from "./ui/input";
import { Avatar, AvatarImage } from "./ui/avatar";
import type { Session } from "next-auth";
import Icons from "@/lib/icons";
import { signOut } from "next-auth/react";

interface HeaderProps {
  session: Session | null;
}

const Header = ({ session }: HeaderProps) => {
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="w-full flex items-center z-50 justify-center md:justify-between px-4 py-4 md:py-0">
      <Icons.Logo className="w-[120px] h-[80px] p-0 hidden md:block" />
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="text" placeholder="Search your agenda" />
        <Avatar onClick={handleSignOut} className="cursor-pointer">
          <AvatarImage src={session?.user?.image!} alt="user-profile" />
        </Avatar>
      </div>
    </div>
  );
};

export default Header;
