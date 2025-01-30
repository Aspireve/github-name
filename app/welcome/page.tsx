import { auth } from "auth";
import Image from "next/image";
import MyBackground from "@/my-background.webp";
import { PrismaClient } from "@prisma/client";
import CustomLink from "@/components/custom-link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Label } from "@/components/ui/label";

function roundToNearestSunday(date: Date): string {
  if (isNaN(date.getTime())) throw new Error("Invalid date"); // Handle invalid dates

  const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
  const diff = dayOfWeek < 4 ? -dayOfWeek : 7 - dayOfWeek; // Round based on mid-week

  const nearestSunday = new Date(date);
  nearestSunday.setDate(date.getDate() + diff);

  return nearestSunday.toISOString().split("T")[0]; // Format YYYY-MM-DD
}

export default async function Index() {
  const session = await auth();
  const prisma = new PrismaClient();

  if (!session) redirect("/");

  if (session?.user) {
    const doesExists = await prisma.user.findFirst({
      where: {
        github_id: session.user.name as string,
      },
    });
    if (doesExists?.text) redirect("/generate-repo");
    if (!doesExists) {
      await prisma.user.create({
        data: {
          github_id: `${session.user?.name}` as string,
          username: session.user?.name as string,
          email: session.user?.email as string,
          access_token: session.accessToken as string,
          image: session.user?.image as string,
        },
      });
      try {
        const response = await fetch("https://api.github.com/user/repos", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: "application/vnd.github.v3+json", // Make sure to set the proper Accept header
          },
          body: JSON.stringify({
            name: "generated-1", // Repository name
            description: "Repository created via OAuth",
            private: false, // Set to true for a private repo
          }),
        });
      } catch (error) {
        console.error("Error creating repository:", error);
      }
    }
  }

  // Add this outside the component
  async function handleFormSubmission(formData: FormData) {
    "use server";

    const prisma = new PrismaClient();
    const githubId = session?.user?.name as string;
    const name = formData.get("name") as string;
    const dateString = formData.get("date") as string;
    const date = roundToNearestSunday(new Date(dateString));

    const user = await prisma.user.findFirst({
      where: {
        github_id: githubId,
      },
    });

    if (user) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          text: name,
          date: date,
        },
      });
      redirect("/generate-repo");
    } else {
      throw new Error("User not found");
    }
  }

  return (
    <div className="flex items-center justify-center relative min-h-screen min-w-full overflow-hidden text-white">
      <Image
        src={MyBackground}
        alt="Background Image"
        className="absolute top-0 left-0 h-full object-cover w-full"
      />
      <div className="z-10 bg-[#0009] absolute top-0 left-0 h-full object-cover w-full " />
      <div className="z-20 text-center max-w-[80%] m-auto">
        <p
          className="text-sm md:text-lg capitalize shadow-2xl"
          style={{ fontFamily: "Geist" }}
        >
          Welcome to the heatmap{" "}
          <CustomLink href={`https://github.com/${session?.user?.name}`}>
            @{session?.user?.name}
          </CustomLink>
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
          TYPE YOUR NAME
        </h1>
        <form action={handleFormSubmission}>
          <div className=" mt-10 md:mt-20 border-b-2 border-gray-600 focus-within:border-gray-400 transition-all duration-300">
            <Label htmlFor="picture">Enter your name (only aplhabets)</Label>
            <Input
              name="name"
              required
              placeholder="Enter your name (only aplhabets)"
              defaultValue={session?.user?.name as string}
              pattern={"^[A-Za-z]+$"}
              className=" bg-transparent outline-none border-none focus-within:ring-0 ring-transparent !focus:outline-none text-lg md:text-2xl"
              style={{
                outline: "none",
                boxShadow: "none",
                fontFamily: "Geist",
                background: "radial-gradient(circle, #FFFFFF 25%, #999999 75%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            />
          </div>
          <div className="mt-5 md:mt-10 border-b-2 border-gray-600 focus-within:border-gray-400 transition-all duration-300">
            <div className="w-full">
              <Label
                htmlFor="date"
                className="w-full text-left"
                style={{
                  width: "100%",
                  textAlign: "left",
                }}
              >
                Enter start date
              </Label>
            </div>
            <Input
              type="date"
              name="date"
              required
              defaultValue="2024-01-07"
              className="bg-transparent outline-none border-none focus-within:ring-0 ring-transparent !focus:outline-none text-lg md:text-2xl"
              style={{
                outline: "none",
                boxShadow: "none",
                fontFamily: "Geist",
                background: "radial-gradient(circle, #FFFFFF 25%, #999999 75%)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            />
          </div>

          <Button
            type="submit"
            variant="outline"
            className="mt-6 md:mt-10 text-black w-full text-sm md:text-lg hover:bg-transparent hover:text-white transition-all duration-300"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
