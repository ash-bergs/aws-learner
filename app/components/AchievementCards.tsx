"use client";

import React from "react";
import { useAchievementStore } from "@/lib/store/achievements";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, Trophy } from "lucide-react";

const AchievementCards = () => {
  const { achievements, unlockedAchievements } = useAchievementStore();
  const allAchievements = Object.values(achievements);
  const unlockedIds = new Set(Object.keys(unlockedAchievements));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {allAchievements.map((achv) => {
        const isUnlocked = unlockedIds.has(achv.id);
        const progressValue = achv.progress ?? 0;
        const percent = Math.min((progressValue / achv.threshold) * 100, 100);
        return (
          <Card
            key={achv.id}
            className={`relative p-4 transition-all ${
              isUnlocked ? "border-green-500 shadow-md" : "border-muted"
            }`}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                {isUnlocked ? (
                  <BadgeCheck className="text-green-600 w-4 h-4" />
                ) : (
                  <Trophy className="w-4 h-4 text-muted-foreground" />
                )}
                {achv.name}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {achv.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2">
              <Progress value={percent} className="h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {progressValue} / {achv.threshold} completed
              </p>
            </CardContent>

            {isUnlocked && (
              <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-semibold">
                Earned
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default AchievementCards;
