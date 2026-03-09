export const MOCK_ORGANIZATIONS = [
  { id: "org-1", name: "Move Daily Club", plan: "Coach+" },
  { id: "org-2", name: "Momentum Studio", plan: "Growth" },
  { id: "org-3", name: "Habit Lab", plan: "Starter" },
];

export const MOCK_USER = {
  name: "Jordan Silva",
  email: "jordan@movehabit.co",
  avatar: null,
};

const ACTIVITY_STATUSES = {
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  RESETTING: "Resetting",
  PLANNED: "Planned",
};

const FOCUS_LEVELS = {
  BLOCKED: "Blocked",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
  NOTE: "Note",
};

const NEXT_STEP_STATES = {
  DONE: "Done",
  PARTLY_DONE: "Partly Done",
  PLANNED: "Planned",
  NEEDS_SUPPORT: "Needs Support",
};

const WEEKLY_PLAN_STATUSES = {
  DONE: "Done",
  IN_PROGRESS: "In Progress",
  QUEUED: "Queued",
  SKIPPED: "Skipped",
};

export const MOCK_ACTIVITIES = [
  {
    id: "act-1",
    name: "Week 1 Walk Reset",
    slug: "week-1-walk-reset",
    status: ACTIVITY_STATUSES.IN_PROGRESS,
    category: "Walking Plan",
    reportName: "From Sitting to Moving - Week 1",
    createdAt: "2026-03-01T00:00:00Z",
    startDate: "2026-03-03T00:00:00Z",
    endDate: "2026-03-16T00:00:00Z",
    findingsBySeverity: { blocked: 1, high: 2, medium: 3, low: 2, note: 2 },
    leetTags: [{ title: "Walking" }, { title: "Low Friction" }, { title: "Morning" }],
  },
  {
    id: "act-2",
    name: "Morning Energy Routine",
    slug: "morning-energy-routine",
    status: ACTIVITY_STATUSES.RESETTING,
    category: "Routine Reset",
    reportName: "Morning Energy Routine Review",
    createdAt: "2026-02-20T00:00:00Z",
    startDate: "2026-02-24T00:00:00Z",
    endDate: "2026-03-20T00:00:00Z",
    findingsBySeverity: { blocked: 0, high: 2, medium: 2, low: 3, note: 1 },
    leetTags: [{ title: "Energy" }, { title: "Wake-up" }],
  },
  {
    id: "act-3",
    name: "After-Work Mobility Streak",
    slug: "after-work-mobility-streak",
    status: ACTIVITY_STATUSES.COMPLETED,
    category: "Mobility Plan",
    reportName: "After-Work Mobility Streak Summary",
    createdAt: "2026-01-05T00:00:00Z",
    startDate: "2026-01-08T00:00:00Z",
    endDate: "2026-02-18T00:00:00Z",
    findingsBySeverity: { blocked: 0, high: 1, medium: 2, low: 2, note: 3 },
    leetTags: [{ title: "Mobility" }, { title: "Recovery" }],
  },
  {
    id: "act-4",
    name: "Sleep and Steps Setup",
    slug: "sleep-and-steps-setup",
    status: ACTIVITY_STATUSES.PLANNED,
    category: "Lifestyle Setup",
    reportName: "Sleep and Steps Setup Outline",
    createdAt: "2026-03-06T00:00:00Z",
    startDate: null,
    endDate: null,
    findingsBySeverity: { blocked: 0, high: 0, medium: 0, low: 0, note: 0 },
    leetTags: [{ title: "Sleep" }, { title: "Steps" }, { title: "Setup" }],
  },
  {
    id: "act-5",
    name: "Weekend Movement Reboot",
    slug: "weekend-movement-reboot",
    status: ACTIVITY_STATUSES.IN_PROGRESS,
    category: "Weekend Plan",
    reportName: "Weekend Movement Reboot Check-In",
    createdAt: "2026-02-28T00:00:00Z",
    startDate: "2026-03-01T00:00:00Z",
    endDate: "2026-03-29T00:00:00Z",
    findingsBySeverity: { blocked: 0, high: 1, medium: 2, low: 1, note: 2 },
    leetTags: [{ title: "Weekend" }, { title: "Consistency" }],
  },
];

export const MOCK_SOURCES = {
  "act-1": [
    { id: "src-1", type: "file", name: "Current step count notes", files: ["steps-week-0.txt"] },
    { id: "src-2", type: "url", name: "Neighborhood walking route", url: "https://maps.example.com/walk-loop" },
    { id: "src-3", type: "file", name: "Morning schedule snapshot", files: ["calendar-screenshot.png"] },
  ],
  "act-2": [
    { id: "src-4", type: "file", name: "Wake-up checklist", files: ["wake-checklist.md"] },
    { id: "src-5", type: "url", name: "Stretch follow-along", url: "https://video.example.com/stretch-8min" },
  ],
  "act-3": [
    { id: "src-6", type: "file", name: "Mobility tracker", files: ["mobility-streak.csv"] },
    { id: "src-7", type: "url", name: "Desk break timer", url: "https://timer.example.com/desk-breaks" },
  ],
  "act-4": [],
  "act-5": [
    { id: "src-8", type: "file", name: "Weekend plan draft", files: ["weekend-plan.md"] },
    { id: "src-9", type: "url", name: "Indoor walk playlist", url: "https://music.example.com/indoor-walk" },
  ],
};

export const MOCK_TEST_CASES = {
  "act-1": [
    { id: "plan-1", halIndex: "PLAN-001", title: "Walk for 10 minutes after breakfast", status: WEEKLY_PLAN_STATUSES.DONE },
    { id: "plan-2", halIndex: "PLAN-002", title: "Lay out shoes before bed", status: WEEKLY_PLAN_STATUSES.DONE },
    { id: "plan-3", halIndex: "PLAN-003", title: "Hit 4,000 steps on three weekdays", status: WEEKLY_PLAN_STATUSES.IN_PROGRESS },
    { id: "plan-4", halIndex: "PLAN-004", title: "Replace one extra sitting block with a 5-minute loop", status: WEEKLY_PLAN_STATUSES.QUEUED },
  ],
  "act-2": [
    { id: "plan-5", halIndex: "PLAN-005", title: "Drink water within 10 minutes of waking", status: WEEKLY_PLAN_STATUSES.DONE },
    { id: "plan-6", halIndex: "PLAN-006", title: "Do a 6-minute stretch before checking the phone", status: WEEKLY_PLAN_STATUSES.IN_PROGRESS },
    { id: "plan-7", halIndex: "PLAN-007", title: "Prepare breakfast the night before", status: WEEKLY_PLAN_STATUSES.SKIPPED },
  ],
  "act-3": [
    { id: "plan-8", halIndex: "PLAN-008", title: "Complete three short mobility sessions each week", status: WEEKLY_PLAN_STATUSES.DONE },
    { id: "plan-9", halIndex: "PLAN-009", title: "Stand up every 60 minutes during work", status: WEEKLY_PLAN_STATUSES.DONE },
    { id: "plan-10", halIndex: "PLAN-010", title: "Finish a 12-minute recovery flow on Fridays", status: WEEKLY_PLAN_STATUSES.DONE },
  ],
  "act-4": [],
  "act-5": [
    { id: "plan-11", halIndex: "PLAN-011", title: "Book one outdoor block each Saturday morning", status: WEEKLY_PLAN_STATUSES.IN_PROGRESS },
    { id: "plan-12", halIndex: "PLAN-012", title: "Keep one no-couch hour on Sunday afternoon", status: WEEKLY_PLAN_STATUSES.QUEUED },
    { id: "plan-13", halIndex: "PLAN-013", title: "Prepare a backup indoor movement option", status: WEEKLY_PLAN_STATUSES.QUEUED },
  ],
};

export const MOCK_FINDINGS = {
  "act-1": [
    { id: "fr-1", halIndex: "FR-01", title: "Shoes are not visible in the morning", severity: FOCUS_LEVELS.BLOCKED, remediationState: NEXT_STEP_STATES.PLANNED },
    { id: "fr-2", halIndex: "FR-02", title: "Breakfast runs long and crowds out the walk", severity: FOCUS_LEVELS.HIGH, remediationState: NEXT_STEP_STATES.PARTLY_DONE },
    { id: "fr-3", halIndex: "FR-03", title: "Step target feels too big on low-energy days", severity: FOCUS_LEVELS.MEDIUM, remediationState: NEXT_STEP_STATES.PLANNED },
    { id: "fr-4", halIndex: "FR-04", title: "Music playlist makes starting easier", severity: FOCUS_LEVELS.NOTE, remediationState: null },
  ],
  "act-2": [
    { id: "fr-5", halIndex: "FR-05", title: "Phone checking starts before the routine", severity: FOCUS_LEVELS.HIGH, remediationState: NEXT_STEP_STATES.NEEDS_SUPPORT },
    { id: "fr-6", halIndex: "FR-06", title: "Morning stretch mat is stored too far away", severity: FOCUS_LEVELS.MEDIUM, remediationState: NEXT_STEP_STATES.PLANNED },
    { id: "fr-7", halIndex: "FR-07", title: "Water bottle placement is already working", severity: FOCUS_LEVELS.NOTE, remediationState: null },
  ],
  "act-3": [
    { id: "fr-8", halIndex: "FR-08", title: "Late meetings occasionally break the streak", severity: FOCUS_LEVELS.MEDIUM, remediationState: NEXT_STEP_STATES.DONE },
    { id: "fr-9", halIndex: "FR-09", title: "A shorter backup flow improved consistency", severity: FOCUS_LEVELS.NOTE, remediationState: null },
  ],
  "act-4": [],
  "act-5": [
    { id: "fr-10", halIndex: "FR-10", title: "Weekend plans are too vague to protect movement time", severity: FOCUS_LEVELS.HIGH, remediationState: NEXT_STEP_STATES.PLANNED },
    { id: "fr-11", halIndex: "FR-11", title: "Rainy days remove the default option", severity: FOCUS_LEVELS.MEDIUM, remediationState: NEXT_STEP_STATES.NEEDS_SUPPORT },
    { id: "fr-12", halIndex: "FR-12", title: "A standing errand loop is a strong backup habit", severity: FOCUS_LEVELS.NOTE, remediationState: null },
  ],
};

export const MOCK_ANALYSIS = {
  "act-1": {
    status: "completed",
    updatedAt: "2026-03-08T00:00:00Z",
    insights: [
      { id: "ins-1", title: "Your mornings need one simpler starting cue", description: "The walk is most likely to happen when shoes, socks, and route are decided the night before.", severity: "high" },
      { id: "ins-2", title: "You already respond well to tiny wins", description: "Short walks are being completed. That means the right next step is more frequency, not more intensity.", severity: "positive" },
      { id: "ins-3", title: "Energy dips need a smaller fallback target", description: "A 5-minute minimum walk can keep the identity of an active person intact on rough days.", severity: "info" },
    ],
    provisionalFindings: 2,
  },
  "act-2": {
    status: "completed",
    updatedAt: "2026-03-05T00:00:00Z",
    insights: [
      { id: "ins-4", title: "Phone friction is overpowering the routine", description: "The first five minutes after waking are deciding the entire flow. Move the phone away from the bed.", severity: "high" },
      { id: "ins-5", title: "The hydration cue is stable", description: "One easy action is already sticking, which makes it a good anchor for the rest of the morning routine.", severity: "positive" },
    ],
    provisionalFindings: 1,
  },
  "act-3": {
    status: "completed",
    updatedAt: "2026-02-18T00:00:00Z",
    insights: [
      { id: "ins-6", title: "Short sessions fit your real schedule", description: "Consistency improved once the plan stopped competing with the end of the workday.", severity: "positive" },
      { id: "ins-7", title: "The streak is vulnerable on overloaded days", description: "Keeping a 4-minute recovery option will protect the habit when work runs late.", severity: "medium" },
    ],
    provisionalFindings: 0,
  },
  "act-4": null,
  "act-5": {
    status: "in_progress",
    updatedAt: "2026-03-09T00:00:00Z",
    insights: [],
    provisionalFindings: 0,
  },
};
