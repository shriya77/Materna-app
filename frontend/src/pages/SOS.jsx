import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import bgVideo from "@/assets/sky1.mp4";
import { StarStill } from "@/components/StarStill.jsx"

const Normal = () => {
  return (
    <>
      <Navbar />
      <video autoPlay muted loop playsInline className="fixed top-0 left-0 w-full h-screen object-cover -z-20">
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <StarStill />
      <div className="fixed top-0 left-0 w-full h-screen bg-white/50 backdrop-blur-sm -z-10"></div>
      <main className="min-h-screen p-8 pt-32">
        <h1 className="text-3xl font-bold">Coming Soon</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your maternal health companion for every stage of the journey.
        </p>
      </main>
      <Footer />
    </>
  );
};

export default Normal;