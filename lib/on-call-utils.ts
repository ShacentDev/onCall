export function groupOnCalls(data: any[]) {
  const now = new Date();

  const active: any[] = [];
  const standby: any[] = [];

  data.forEach((item) => {
    const start = new Date(item.startTime);
    const end = new Date(item.endTime);

    if (start >= end || now > end) return;

    if (now >= start && now <= end) {
      active.push({ ...item, status: "oncall" });
    } else if (now < start) {
      standby.push({ ...item, status: "standby" });
    }
  });

  // optional: sort biar rapi
  active.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  standby.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return { active, standby };
}