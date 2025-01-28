import { auth } from "auth";
import Image from "next/image";
import MyBackground from "@/my-background.webp";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function Index() {
  const session = await auth();
  const prisma = new PrismaClient();
  let currentStatus: "NOT STARTED" | "QUEUEING" | "PROCESSING" | "COMPLETED" =
    "NOT STARTED";

  if (!session) redirect("/");

  const status = await prisma.user.findFirst({
    where: {
      github_id: session.user?.name as string,
    },
  });

  if (!status?.text) redirect("/welcome");
  else if (status.isNotStarted) {
    await fetch(
      `${process.env.REDIS_BULL_URL}?name=${status.github_id}&email=${status.email}&accessToken=${status.access_token}&repoName=generated-1&text=${status.text}`,
      {
        method: "GET",
      }
    );
    await prisma.user.update({
      where: {
        id: status.id,
      },
      data: {
        isNotStarted: false,
        isQueue: true,
      },
    });
    currentStatus = "QUEUEING";
  } else if (status.isQueue) {
    currentStatus = "QUEUEING";
  } else if (status.isProcessing) {
    currentStatus = "PROCESSING";
  } else if (status.isCompleted) {
    currentStatus = "COMPLETED";
  }

  return (
    <div className="flex items-center justify-center relative min-h-screen min-w-full overflow-hidden text-white">
      <Image
        src={MyBackground}
        alt="Background Image"
        className="absolute top-0 left-0 h-full object-cover w-full"
      />
      <div className="z-10 bg-[#0009] absolute top-0 left-0 h-full object-cover w-full " />
      <div className="z-20 text-center">
        <p
          className="text-lg capitalize shadow-2xl"
          style={{ fontFamily: "Geist" }}
        >
          {currentStatus === "NOT STARTED"
            ? "Your Generator hasnt yet started"
            : currentStatus === "QUEUEING"
            ? "Your Generator is currently in the queue, this could take some time"
            : currentStatus === "PROCESSING"
            ? "Your Generator is currently being processed, this would take 5 mins"
            : "Check out your profile for your Generated Heatmap "}
        </p>
        <h1
          className="text-[7rem] leading-[7.5rem] capitalize shadow-2xl"
          style={{
            fontFamily: "Big Shoulders Display",
            background: "radial-gradient(circle, #FFFFFF 25%, #999999 75%)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          {currentStatus}
        </h1>
      </div>
    </div>
  );
}
