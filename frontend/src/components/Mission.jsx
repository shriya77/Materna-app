import { useState } from "react";
import { cn } from "@/lib/utils";

const skills = [
  // Frontend
  { name: "HTML/CSS", level: 95, category: "frontend" },
  { name: "JavaScript", level: 90, category: "frontend" },
  { name: "React", level: 90, category: "frontend" },
  { name: "TypeScript", level: 85, category: "frontend" },
  { name: "Tailwind CSS", level: 90, category: "frontend" },
  { name: "Next.js", level: 80, category: "frontend" },

  // Backend
  { name: "Node.js", level: 80, category: "backend" },
  { name: "Express", level: 75, category: "backend" },
  { name: "MongoDB", level: 70, category: "backend" },
  { name: "PostgreSQL", level: 65, category: "backend" },
  { name: "GraphQL", level: 60, category: "backend" },

  // Tools
  { name: "Git/GitHub", level: 90, category: "tools" },
  { name: "Docker", level: 70, category: "tools" },
  { name: "Figma", level: 85, category: "tools" },
  { name: "VS Code", level: 95, category: "tools" },
];

const categories = ["all", "frontend", "backend", "tools"];

export const SkillsSection = () => {
  return (
    <section id="mission" className="py-24 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Our <span className="text-[#234451]">Mission</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Support In Every Stage",
              text: "From pregnancy to postpartum, Materna provides personalized tools and resources to guide mothers every step of the way.",
            },
            {
              title: "Empowerment using Knowledge",
              text: "We believe education is power. Materna connects moms to expert-backed content and symptom tracking tools to stay informed and confident.",
            },
            {
              title: "Community & Compassion",
              text: "A moderated forum and shared experiences from other moms create a safe, supportive space where no one feels alone.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="rounded-xl bg-[rgba(247,241,235,0.6)] backdrop-blur-lg shadow-lg border border-white/30 p-6 transition hover:shadow-2xl hover:bg-[rgba(247,241,235,0.8)]"
            >
              <h3 className="font-semibold text-xl mb-2 text-[#234451]">{item.title}</h3>
              <p className="text-[#234451]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
