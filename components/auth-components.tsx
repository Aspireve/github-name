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
        await signIn(provider)
      }}
    >
      <button
        type="submit"
        className="bg-[#24292d] mt-6 flex w-fit px-4 gap-3 py-3 cursor-pointer mx-auto hover:bg-[#222] shadow-2xl transition-all duration-300"
      >
        <Image
          src={GitHubLogo}
          alt="Background Image"
          height={24}
          width={24}
          className=" bg-white rounded-full"
        />
        Sign in with GitHub
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
