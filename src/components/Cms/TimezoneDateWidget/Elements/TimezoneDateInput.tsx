import React from "react";
import { styles } from "@/components/Cms/TimezoneDateWidget/styles";

export const TimezoneDateInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => (
  <input
    type="datetime-local"
    value={value}
    onChange={onChange}
    style={styles.input}
  />
);

