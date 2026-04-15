import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, Shield, ClipboardCheck, GraduationCap, User as UserIcon, Search } from "lucide-react";
import { startJourney, getJourneyPath, type JourneyId } from "@/lib/tour";

const journeyMeta: { id: JourneyId; icon: React.ComponentType<{ className?: string }>; loginAs?: string }[] = [
  { id: "admin",    icon: Shield,         loginAs: "1" },
  { id: "approver", icon: ClipboardCheck, loginAs: "2" },
  { id: "trainer",  icon: GraduationCap,  loginAs: "3" },
  { id: "holder",   icon: UserIcon,       loginAs: "4" },
  { id: "verify",   icon: Search },
];

export function DemoTourLauncher() {
  const { t } = useTranslation();
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const launch = (id: JourneyId, loginAs?: string) => {
    if (loginAs) {
      const user = state.users.find((u) => u.id === loginAs);
      if (user) {
        dispatch({
          type: "LOGIN",
          payload: { userId: user.id, name: user.name, email: user.email, role: user.role },
        });
      }
    }
    const path = getJourneyPath(id);
    if (path) navigate(path);
    setOpen(false);
    startJourney(id, t);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        data-tour="tour-launcher"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-secondary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-105 transition-all"
      >
        <Sparkles className="h-4 w-4" />
        {t("demo.startTour")}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> {t("demo.chooseJourney")}
            </DialogTitle>
            <DialogDescription>{t("demo.chooseJourneyDesc")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 mt-2">
            {journeyMeta.map((j) => {
              const Icon = j.icon;
              return (
                <Button
                  key={j.id}
                  variant="outline"
                  className="justify-start h-auto py-3 px-4"
                  onClick={() => launch(j.id, j.loginAs)}
                >
                  <Icon className="h-5 w-5 mr-3 text-primary shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold text-sm">{t(`demo.journey.${j.id}.title`)}</p>
                    <p className="text-xs text-muted-foreground font-normal">{t(`demo.journey.${j.id}.desc`)}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
