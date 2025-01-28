import { auth } from "auth";
import Image from "next/image";
import MyBackground from "@/app/_assets/my-background.png";
import { SignIn } from "@/components/auth-components";
import { redirect } from "next/navigation";
import { Metadata } from "next";

// app/page.tsx
export const metadata: Metadata = {
  title: "Write Your Name on the GitHub Heatmap",
  description:
    "Turn your GitHub heatmap into a masterpiece! Create personalized patterns, write your name, or craft stunning designs directly on your GitHub contribution graph. Let's make your profile shine!",
  openGraph: {
    title: "Write Your Name on GitHub's Heatmap",
    description:
      "Transform your GitHub contribution graph into art. Write your name, draw patterns, or just show off your creativity with Heatmap Wizard!",
    url: "https://github-name.csteve40.com",
    images: [
      {
        url: "https://github-name.csteve40.com/logo.png",
        width: 800,
        height: 600,
        alt: "Screenshot of a GitHub heatmap with a name written on it",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Write Your Name on GitHub's Heatmap",
    description:
      "Unleash your creativity on GitHub! Design your heatmap, write your name, or create patterns to impress your followers.",
    images: ["https://github-name.csteve40.com/logo.png"],
  },
  keywords: [
    "GitHub heatmap",
    "GitHub contribution graph",
    "write name on GitHub heatmap",
    "heatmap art",
    "GitHub profile customization",
    "GitHub hacks",
    "GitHub tips",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  authors: [{ name: "Steve Fernandes", url: "https://github.com/Aspireve" }],
};

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
