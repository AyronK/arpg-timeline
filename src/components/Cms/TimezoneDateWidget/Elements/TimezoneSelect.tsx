import React from "react";
import { styles } from "@/components/Cms/TimezoneDateWidget/styles";
import { timeZoneMappings } from "@/components/Cms/TimezoneDateWidget/timeZoneMappings";

export const TimezoneSelect: React.FC<{
  selectedAbbr: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ selectedAbbr, onChange }) => (
  <select value={selectedAbbr} onChange={onChange} style={styles.select}>
    {timeZoneMappings.map(({ abbr, description }) => (
      <option key={abbr} value={abbr}>
        {abbr} – {description}
      </option>
    ))}
  </select>
);
