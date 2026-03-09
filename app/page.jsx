import { Suspense } from "react";
import { PortalContainer } from "../ui/portal/PortalContainer";

export default function HomePage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-navBackground">
      <Suspense fallback={null}>
        <PortalContainer />
      </Suspense>
    </main>
  );
}
