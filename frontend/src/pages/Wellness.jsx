import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import saveIcon from "@/assets/save.png";
import savedIcon from "@/assets/saved.png";
import yogaImage from "@/assets/yoga.jpg";
import meditateImage from "@/assets/meditate.jpg";
import foodsImage from "@/assets/foods.jpg";
import careImage from "@/assets/care.jpg";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import bgVideo from "@/assets/sky1.mp4";
import { StarStill } from "@/components/StarStill";

export const allCards = [
  { title: "Prenatal Stretching for 1st Trimester", tags: ["Exercise", "1st Trimester"], time: "10 mins", category: "Exercise", trimester: "1st Trimester", fitness: "Beginner" },
  { title: "Protein-Packed Berry Smoothie Bowl", tags: ["Recipe", "2nd Trimester"], time: "15 mins", category: "Recipe", trimester: "2nd Trimester", fitness: "All" },
  { title: "Gentle Morning Yoga Flow", tags: ["Exercise", "Beginner"], time: "20 mins", category: "Exercise", trimester: "All", fitness: "Beginner" },
  { title: "5-Minute Anxiety Relief", tags: ["Meditation", "All Stages"], time: "5 mins", category: "Meditation", trimester: "All", fitness: "All" },
  { title: "DIY Relaxing Bath Ritual", tags: ["Self-Care", "Postpartum"], time: "30 mins", category: "Self-Care", trimester: "Postpartum", fitness: "All" },
  { title: "Spinach & Quinoa Power Bowl", tags: ["Recipe", "Iron-Rich"], time: "25 mins", category: "Recipe", trimester: "All", fitness: "All" },
  { title: "Water Workouts for Late Pregnancy", tags: ["Exercise", "3rd Trimester"], time: "45 mins", category: "Exercise", trimester: "3rd Trimester", fitness: "All" },
];

const Wellness = () => {
  const navigate = useNavigate();

  const [filteredCards, setFilteredCards] = useState(allCards);
  const [visibleCount, setVisibleCount] = useState(3);
  const [filters, setFilters] = useState({ trimester: "All", category: "All", fitness: "All" });
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const applyFilters = () => {
    let cards = allCards;
    if (filters.trimester !== "All") {
      cards = cards.filter(c => c.trimester === filters.trimester || c.trimester === "All");
    }
    if (filters.category !== "All") {
      cards = cards.filter(c => c.category === filters.category);
    }
    if (filters.fitness !== "All") {
      cards = cards.filter(c => c.fitness === filters.fitness || c.fitness === "All");
    }
    setFilteredCards(cards);
    setVisibleCount(3);
  };

  const toggleFavorite = (title) => {
    setFavorites((prev) =>
      prev.includes(title) ? prev.filter(f => f !== title) : [...prev, title]
    );
  };

  const getImageForCategory = (category) => {
    switch (category) {
      case "Recipe":
        return foodsImage;
      case "Exercise":
        return yogaImage;
      case "Meditation":
        return meditateImage;
      case "Self-Care":
        return careImage;
      default:
        return yogaImage;
    }
  };

  return (
    <>
      <Navbar />
      <StarStill />
      <main className="min-h-screen pt-32 px-8 relative overflow-hidden">
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
        <div className="fixed top-0 left-0 w-full h-screen bg-white/50 backdrop-blur-sm -z-10"></div>
        <div className="max-w-7xl mx-auto">
          <section className="bg-white/40 backdrop-blur-md rounded-lg shadow p-6 text-center">
            <h1 className="text-3xl font-bold text-[#234451]">A healthy baby starts with you.</h1>
            <p className="mt-2 text-lg text-[#234451]">
              From pregnancy safe recipes to gentle exercises, we've got you covered.
            </p>
            <div className="mt-4 flex justify-center gap-2 flex-wrap">
              <span className="bg-[#DFA69F] text-[#234451] text-xs px-2 py-1 rounded-full">Personalized for you</span>
            </div>
          </section>

          <div className="flex flex-col lg:flex-row mt-8 gap-8">
            <aside className="lg:w-1/4 space-y-6">
              <div className="bg-white/40 backdrop-blur-md rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold text-[#234451]">Quick Categories</h2>
                <ul className="mt-2 space-y-1 text-[#234451] text-sm">
                  {["Recipe", "Exercise", "Meditation", "Self-Care"].map((cat, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        setFilters({ ...filters, category: cat });
                        applyFilters();
                      }}
                      className={`cursor-pointer hover:underline ${filters.category === cat ? 'font-semibold' : ''}`}
                    >
                      {cat} <span className="text-xs text-[#234451]">({allCards.filter(c => c.category === cat).length})</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/40 backdrop-blur-md rounded-lg shadow p-4">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowFavorites(!showFavorites)}>
                  <h2 className="text-lg font-semibold text-[#234451]">Your Favorites</h2>
                  <span className="text-[#234451] text-xl">{showFavorites ? "–" : "+"}</span>
                </div>
                {showFavorites && (
                  <ul className="mt-2 space-y-1 text-[#234451] text-sm">
                    {favorites.length === 0 ? (
                      <li>No favorites yet.</li>
                    ) : (
                      favorites.map((fav, i) => <li key={i}>♡ {fav}</li>)
                    )}
                  </ul>
                )}
              </div>
            </aside>

            <div className="flex-1 space-y-6">
              <div className="flex gap-2 flex-wrap">
                <select onChange={(e) => setFilters({ ...filters, trimester: e.target.value })} className="border border-[#EAE3CA] rounded px-2 py-1 text-sm text-[#234451] bg-white/20 backdrop-blur-md">
                  <option>All</option>
                  <option>1st Trimester</option>
                  <option>2nd Trimester</option>
                  <option>3rd Trimester</option>
                  <option>Postpartum</option>
                </select>
                <select onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="border border-[#EAE3CA] rounded px-2 py-1 text-sm text-[#234451] bg-white/20 backdrop-blur-md">
                  <option>All</option>
                  <option>Recipe</option>
                  <option>Exercise</option>
                  <option>Meditation</option>
                  <option>Self-Care</option>
                </select>
                <select onChange={(e) => setFilters({ ...filters, fitness: e.target.value })} className="border border-[#EAE3CA] rounded px-2 py-1 text-sm text-[#234451] bg-white/20 backdrop-blur-md">
                  <option>All</option>
                  <option>Beginner</option>
                </select>
                <button onClick={applyFilters} className="bg-[#DFA69F] text-[#234451] px-4 py-1 rounded text-sm font-bold hover:bg-[#e8bbb5] transition">Apply</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCards.slice(0, visibleCount).map((card, i) => (
                  <div
                    key={i}
                    className="bg-white/40 backdrop-blur-md rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition"
                    onClick={() => navigate(`/wellness/${i}`)}
                  >
                    <div className="w-full h-40 overflow-hidden">
                      <img src={getImageForCategory(card.category)} alt={card.category} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex gap-2 flex-wrap text-xs text-[#fff]">
                        {card.tags.map((t, j) => (
                          <span key={j} className="bg-[#99C8C1] text-[#234451] px-2 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                      <h3 className="font-semibold text-[#234451] min-h-[3rem]">{card.title}</h3>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-[#234451]">{card.time}</div>
                        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(card.title); }}>
                          <img
                            src={favorites.includes(card.title) ? savedIcon : saveIcon}
                            alt="Save Icon"
                            className="w-5 h-5"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {visibleCount < filteredCards.length && (
                <div className="flex justify-center">
                  <button onClick={() => setVisibleCount(visibleCount + 3)} className="bg-[#DFA69F] text-[#234451] px-6 py-2 rounded text-sm font-bold hover:bg-[#e8bbb5] transition">Load More</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export const WellnessDetail = () => {
  const { id } = useParams();
  const card = allCards[parseInt(id)];

  const getImageForCategory = (category) => {
    switch (category) {
      case "Recipe":
        return foodsImage;
      case "Exercise":
        return yogaImage;
      case "Meditation":
        return meditateImage;
      case "Self-Care":
        return careImage;
      default:
        return yogaImage;
    }
  };

  if (!card) {
    return <div className="text-[#234451] p-8">Post not found.</div>;
  }

  return (
    <div className="min-h-screen pt-32 px-8 bg-white/40 backdrop-blur-md WellnessDetail">
      <div className="max-w-3xl mx-auto bg-white/40 backdrop-blur-md shadow rounded-lg overflow-hidden">
        <img src={getImageForCategory(card.category)} alt={card.category} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-[#234451]">{card.title}</h1>
          <div className="mt-2 text-sm text-[#234451] space-x-2">
            <span className="bg-[#99C8C1] px-2 py-0.5 rounded">{card.category}</span>
            <span className="bg-[#99C8C1] px-2 py-0.5 rounded">{card.trimester}</span>
            <span className="bg-[#99C8C1] px-2 py-0.5 rounded">{card.fitness}</span>
            <span className="text-xs">{card.time}</span>
          </div>
          <p className="mt-4 text-[#234451]">Detailed content for this post will go here. You can add instructions, ingredients, routines, etc.</p>
        </div>
      </div>
    </div>
  );
};

export default Wellness;