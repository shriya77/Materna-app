import bgVideo from "@/assets/sky1.mp4";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StarStill } from "@/components/StarStill.jsx";

const Community = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen relative overflow-hidden pt-32 p-8">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed top-0 left-0 w-full h-screen object-cover -z-10"
        >
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <StarStill />
        <div className="fixed top-0 left-0 w-full h-screen bg-white/50 backdrop-blur-sm -z-10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Coming Soon</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Your maternal health companion for every stage of the journey.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Community;