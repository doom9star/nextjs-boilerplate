import { useCtx } from "@/context";
import { setAlert } from "@/context/actionCreators";
import { Alert as AntAlert } from "antd";
import { useEffect, useRef } from "react";

export default function Alert() {
  const {
    state: { alert },
    dispatch,
  } = useCtx();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (alert) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        dispatch(setAlert(null));
        timeoutRef.current = null;
      }, 20 * 1000);
    } else if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [alert]);

  if (!alert) {
    return null;
  }

  return (
    <AntAlert
      showIcon
      closable
      message={alert.message}
      description={alert.description}
      type={alert.type}
      className="text-xs"
      onClose={() => dispatch(setAlert(null))}
    />
  );
}
