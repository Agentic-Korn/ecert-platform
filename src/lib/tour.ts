import { driver, type Config, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import type { TFunction } from "i18next";

export type JourneyId = "admin" | "approver" | "trainer" | "holder" | "verify";

interface Journey {
  id: JourneyId;
  /** Path the user should navigate to before starting */
  path: string;
  /** Builds the step list with i18n */
  steps: (t: TFunction) => DriveStep[];
}

const k = (key: string) => `tour.${key}`;

export const journeys: Journey[] = [
  {
    id: "admin",
    path: "/",
    steps: (t) => [
      { element: '[data-tour="role-badge"]',  popover: { title: t(k("admin.title")),     description: t(k("admin.s1")) } },
      { element: '[data-tour="nav-certificates"]', popover: { title: t(k("admin.s2t")),  description: t(k("admin.s2")) } },
      { popover: { title: t(k("admin.s3t")), description: t(k("admin.s3")) } },
    ],
  },
  {
    id: "approver",
    path: "/approvals",
    steps: (t) => [
      { popover: { title: t(k("approver.title")), description: t(k("approver.s1")) } },
      { element: '[data-tour="bulk-approve"]', popover: { title: t(k("approver.s2t")), description: t(k("approver.s2")) } },
      { popover: { title: t(k("approver.s3t")), description: t(k("approver.s3")) } },
    ],
  },
  {
    id: "trainer",
    path: "/training",
    steps: (t) => [
      { popover: { title: t(k("trainer.title")), description: t(k("trainer.s1")) } },
      { popover: { title: t(k("trainer.s2t")), description: t(k("trainer.s2")) } },
      { popover: { title: t(k("trainer.s3t")), description: t(k("trainer.s3")) } },
    ],
  },
  {
    id: "holder",
    path: "/portal",
    steps: (t) => [
      { popover: { title: t(k("holder.title")), description: t(k("holder.s1")) } },
      { popover: { title: t(k("holder.s2t")), description: t(k("holder.s2")) } },
      { popover: { title: t(k("holder.s3t")), description: t(k("holder.s3")) } },
    ],
  },
  {
    id: "verify",
    path: "/verify",
    steps: (t) => [
      { popover: { title: t(k("verify.title")), description: t(k("verify.s1")) } },
      { element: '[data-tour="scan-qr"]', popover: { title: t(k("verify.s2t")), description: t(k("verify.s2")) } },
      { popover: { title: t(k("verify.s3t")), description: t(k("verify.s3")) } },
    ],
  },
];

export function startJourney(id: JourneyId, t: TFunction) {
  const journey = journeys.find((j) => j.id === id);
  if (!journey) return;

  const config: Config = {
    showProgress: true,
    animate: true,
    smoothScroll: true,
    nextBtnText: t("common.next"),
    prevBtnText: t("common.back"),
    doneBtnText: t("common.close"),
    steps: journey.steps(t),
    progressText: "{{current}} / {{total}}",
  };

  // Defer slightly so route changes settle before driver attaches
  setTimeout(() => {
    const d = driver(config);
    d.drive();
  }, 200);
}

export function getJourneyPath(id: JourneyId): string | undefined {
  return journeys.find((j) => j.id === id)?.path;
}
