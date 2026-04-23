export function getActiveOnCalls(data: any[]) {
  const now = new Date();

  return data.filter((item) => {
    const start = new Date(item.startTime);
    const end = new Date(item.endTime);

    return now >= start && now <= end;
  });
}