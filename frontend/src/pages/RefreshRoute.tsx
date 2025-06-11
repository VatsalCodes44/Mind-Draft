import { useCallback, useEffect } from "react";
import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";

interface RefreshRouteProps {
  component: ReactElement;
  redirectionPath: string;
  showPopup: boolean;
}

export const RefreshRoute = ({ component: Component, redirectionPath, showPopup }: RefreshRouteProps) => {
  const perf = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
  const reloadType = perf.type !== "reload";

  const handler = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = '';
    return true;
  }, []);

  useEffect(() => {
    if (reloadType) {
        if (showPopup){
            window.addEventListener("beforeunload", handler);
            return () => {
              window.removeEventListener("beforeunload", handler);
            };
        }
    } else {
      window.location.href = redirectionPath;
    }
  }, [handler, reloadType, redirectionPath]);

  return (
    <>
      {reloadType ? (
        Component
      ) : (
        <Navigate to={redirectionPath} replace />
      )}
    </>
  );
};
