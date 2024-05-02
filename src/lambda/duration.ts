// Regular expression to match ISO 8601 duration format
const durationRegex = /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;

interface Duration {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function parseDuration(expression: string): Duration {
  const matches = expression.match(durationRegex);

  if (!matches) {
    throw new Error("Invalid ISO 8601 duration format");
  }

  return {
    years: parseInt(matches[1]) || 0,
    months: parseInt(matches[2]) || 0,
    days: parseInt(matches[3]) || 0,
    hours: parseInt(matches[4]) || 0,
    minutes: parseInt(matches[5]) || 0,
    seconds: parseInt(matches[6]) || 0,
  };
}

export function applyDuration(from: Date, durationExp: string) {
  const duration = parseDuration(durationExp);
  const timestamp = from.getTime();
  const result = new Date(timestamp);

  result.setFullYear(result.getFullYear() + duration.years);
  result.setMonth(result.getMonth() + duration.months);
  result.setDate(result.getDate() + duration.days);
  result.setHours(result.getHours() + duration.hours);
  result.setMinutes(result.getMinutes() + duration.minutes);
  result.setSeconds(result.getSeconds() + duration.seconds);

  return result;
}
