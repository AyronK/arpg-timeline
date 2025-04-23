import React from "react";
import { styles } from "@/components/Cms/TimezoneDateWidget/styles";

export const TimezoneInfo: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div style={styles.info}>
    <strong>{label}:</strong> {value}
  </div>
);

