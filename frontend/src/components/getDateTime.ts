function getDateTime(): string {
  const now: Date = new Date();

  const pad = (n: number): string => String(n).padStart(2, '0');
  const yyyy = now.getFullYear();
  const MM = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  const ms = String(now.getMilliseconds()).padStart(3, '0');

  return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}.${ms}Z`; // 👈 ISO format
}

export default getDateTime;
