import { AlertTriangle, Upload, ShieldAlert, FileCheck } from "lucide-react";

export const RECOMMENDATIONS = {
  1: {
    pill: "Momentum slipping",
    icon: AlertTriangle,
    userMessage: "I see a warning that my momentum is slipping. What should I do?",
    summary: "Your **10-Minute Walk Plan** has dropped from 5 sessions last week to 2 this week.",
    detail:
      "The biggest drop is happening on low-energy afternoons. Your plan is still workable, but the starting step is too large for tired days.\n\n**Best next move:**\n- Set a 5-minute backup version of the walk\n- Put shoes by the door before lunch\n- Keep one indoor route ready for bad weather",
    actions: [
      { label: "Shrink the Goal", message: "Help me shrink the walk goal for low-energy days" },
      { label: "Show My Pattern", message: "Show me where my movement streak started to slip" },
      { label: "Dismiss", message: "Thanks, I'll handle this manually" },
    ],
  },
  2: {
    pill: "Missing support",
    icon: Upload,
    userMessage: "I see a warning that a support resource is missing. What should I do?",
    summary: "You added a **Weekly Schedule** but there is no simple backup plan for days when your routine breaks.",
    detail:
      "Right now the plan depends on your ideal day. When timing shifts, there is nothing smaller to fall back to.\n\n**Add one backup resource** such as a short indoor walk, a 4-minute stretch, or a standing reset checklist so your momentum survives imperfect days.",
    actions: [
      { label: "Add Backup Plan", message: "I want to add a backup movement plan for busy days" },
      { label: "Build an Indoor Option", message: "Help me create an indoor backup routine" },
      { label: "Skip for Now", message: "I'll add the backup plan later" },
    ],
  },
  3: {
    pill: "Energy dip ahead",
    icon: ShieldAlert,
    userMessage: "I see an alert about an energy dip. What should I do?",
    summary: "Your **Morning Energy Routine** is most likely to break on days with less than 6 hours of sleep.",
    detail:
      "The current morning routine asks for too much before your energy is stable.\n\n**Coach suggestion:**\n- Reduce the first action to under 3 minutes\n- Put water and shoes in sight the night before\n- Delay phone checking until after the first movement cue",
    actions: [
      { label: "Create a Low-Energy Version", message: "Create a low-energy version of my morning routine" },
      { label: "Show Sleep Impact", message: "Show me how sleep is affecting my routine consistency" },
      { label: "Acknowledge", message: "I've noted this advisory, thanks" },
    ],
  },
  4: {
    pill: "Week complete",
    icon: FileCheck,
    userMessage: "I see a note that my week is complete. What should I do next?",
    summary: "Your **After-Work Mobility Streak** week is wrapped and ready for review.",
    detail:
      "You finished the cycle with 9 completed sessions and a stronger evening routine.\n\n**What worked:**\n1. Shorter sessions made it easier to start\n2. A backup flow protected the streak on busy days\n3. Consistent timing reduced decision fatigue\n\n**Next step:** Review the wins, keep the easiest anchors, and raise intensity only slightly.",
    actions: [
      { label: "Open Weekly Review", message: "Open my weekly review for the mobility streak" },
      { label: "Plan Next Week", message: "Help me plan the next week from this progress" },
      { label: "Keep It Easy", message: "I want to keep the same level for one more week" },
    ],
  },
};

export function getActiveRecommendations({ recommendationParam }) {
  if (!recommendationParam) return [];

  const ids = recommendationParam
    .split(",")
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => RECOMMENDATIONS[id]);

  return ids.map((id) => ({ id, ...RECOMMENDATIONS[id] }));
}
