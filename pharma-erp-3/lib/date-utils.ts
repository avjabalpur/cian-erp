export function formatDate(date: Date | string | undefined): string {
  if (!date) return ""
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
