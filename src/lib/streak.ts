import { prisma } from "@/lib/prisma";

const BADGE_THRESHOLDS = [
  { days: 3, type: "STREAK_3" },
  { days: 7, type: "STREAK_7" },
  { days: 14, type: "STREAK_14" },
  { days: 30, type: "STREAK_30" },
  { days: 60, type: "STREAK_60" },
  { days: 100, type: "STREAK_100" },
];

export async function updateStreak(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = await prisma.streak.findUnique({ where: { userId } });

  if (!streak) {
    streak = await prisma.streak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
      },
    });
  } else {
    const lastActive = streak.lastActiveDate
      ? new Date(streak.lastActiveDate)
      : null;

    if (lastActive) {
      lastActive.setHours(0, 0, 0, 0);
      const diffDays = Math.floor(
        (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) {
        return streak;
      } else if (diffDays === 1) {
        const newCurrent = streak.currentStreak + 1;
        streak = await prisma.streak.update({
          where: { userId },
          data: {
            currentStreak: newCurrent,
            longestStreak: Math.max(newCurrent, streak.longestStreak),
            lastActiveDate: today,
          },
        });
      } else {
        streak = await prisma.streak.update({
          where: { userId },
          data: {
            currentStreak: 1,
            lastActiveDate: today,
          },
        });
      }
    } else {
      streak = await prisma.streak.update({
        where: { userId },
        data: {
          currentStreak: 1,
          longestStreak: Math.max(1, streak.longestStreak),
          lastActiveDate: today,
        },
      });
    }
  }

  for (const threshold of BADGE_THRESHOLDS) {
    if (streak.currentStreak >= threshold.days) {
      await prisma.badge.upsert({
        where: { userId_type: { userId, type: threshold.type } },
        create: { userId, type: threshold.type },
        update: {},
      });
    }
  }

  return streak;
}

export async function getStreak(userId: string) {
  const streak = await prisma.streak.findUnique({ where: { userId } });
  if (!streak) return { currentStreak: 0, longestStreak: 0, lastActiveDate: null };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastActive = streak.lastActiveDate
    ? new Date(streak.lastActiveDate)
    : null;

  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0);
    const diffDays = Math.floor(
      (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays > 1) {
      return { currentStreak: 0, longestStreak: streak.longestStreak, lastActiveDate: streak.lastActiveDate };
    }
  }

  return streak;
}
