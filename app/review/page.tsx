import React from "react";
import AchievementCards from "../components/AchievementCards";
import { Trophy } from "lucide-react";

const page = () => {
  return (
    <main className="px-6">
      <section aria-label="achievements">
        <h2 className="text-text text-xl font-bold mb-2">
          <Trophy size={20} aria-hidden="true" className="inline-block mr-2" />
          Achievements
        </h2>
        <AchievementCards />
      </section>
      <section>{/** bar graphs with breakdowns */}</section>
    </main>
  );
};

export default page;
