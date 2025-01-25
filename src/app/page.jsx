import Header from "./components/Header";
import VideoBackground from "./components/VideoBackground";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <VideoBackground />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 flex flex-col items-center justify-center min-h-screen text-center text-white">
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Discover Your Next Favorite Movie
          </h1>
          <p className="mb-8 text-xl sm:text-2xl">
            Personalized recommendations tailored just for you
          </p>
          <Link href="/recommend">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Get Started
            </Button>
          </Link>
        </main>
      </div>
    </div>
  );
}
