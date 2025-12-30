type TimeHM = {
    hour: number;
    minute: number;
};

export const parseTime = (time: string): TimeHM => {
    const [hourStr, minuteStr] = time.split(":");

    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
        throw new Error(`Invalid time format: ${time}`);
    }

    return { hour, minute };
};
