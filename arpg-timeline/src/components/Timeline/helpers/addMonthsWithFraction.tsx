export const addMonthsWithFraction = (date: Date, months: number): Date => {
    const whole = Math.trunc(months);
    const fraction = months - whole;
    const result = new Date(date);

    result.setMonth(result.getMonth() + whole);

    if (fraction !== 0) {
        const daysInMonth = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
        const addDays = Math.round(daysInMonth * fraction);
        result.setDate(result.getDate() + addDays);
    }

    return result;
};
