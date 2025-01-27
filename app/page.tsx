import { auth } from "auth";
import Image from "next/image";
import MyBackground from "@/app/_assets/my-background.png";
import { SignIn } from "@/components/auth-components";
import { redirect } from "next/navigation";

export default async function Index() {
  const session = await auth();

  if (session?.user) {
    redirect("/welcome");
  }

  return (
    <div className="flex items-center justify-center relative min-h-screen min-w-full overflow-hidden text-white">
      <Image
        src={MyBackground}
        alt="Background Image"
        className="absolute top-0 left-0 h-full object-cover w-full"
      />
      <div className="z-10 bg-[#0009] absolute top-0 left-0 h-full object-cover w-full " />
      <div className="z-20 text-center w-[80%] m-auto">
        <p
          className="text-sm md:text-lg capitalize shadow-2xl"
          style={{ fontFamily: "Geist" }}
        >
          Personalize your GitHub heatmap by adding your name or a custom
          pattern, making it truly unique.
        </p>
        <h1
          className="text-[4rem] leading-[4.5rem] md:text-[7rem] md:leading-[7.5rem] capitalize shadow-2xl"
          style={{
            fontFamily: "Big Shoulders Display",
            background: "radial-gradient(circle, #FFFFFF 25%, #999999 75%)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          HEATMAP YOUR NAME
        </h1>
        {!session?.user && <SignIn />}
      </div>
    </div>
  );
}
