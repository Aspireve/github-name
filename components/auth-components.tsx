import { signIn, signOut } from "auth";
import { Button } from "./ui/button";
import Image from "next/image";
import GitHubLogo from "@/app/_assets/github_logo.svg";

export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
    >
      <button
        type="submit"
        className="relative bg-[#24292d] mt-6 flex w-fit p-[2px] cursor-pointer mx-auto group overflow-hidden rounded-lg"
      >
        {/* Glowing effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-md opacity-70 group-hover:opacity-100 group-hover:blur-lg transition-all duration-500"></div>

        {/* Inner button content */}

        <div className="relative z-10 flex items-center gap-3 px-4 py-3 bg-[#24292d] shadow-lg rounded-lg">
          <Image
            src={GitHubLogo}
            alt="GitHub Logo"
            height={24}
            width={24}
            className="bg-white rounded-full"
          />
          <span className="text-white font-medium">Sign in with GitHub</span>
        </div>
      </button>
    </form>
  );
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
      className="w-full"
    >
      <Button variant="ghost" className="w-full p-0" {...props}>
        Sign Out
      </Button>
    </form>
  );
}
