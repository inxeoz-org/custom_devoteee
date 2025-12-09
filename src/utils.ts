// export function frappe_to_dmy_date(date: string): string {
//   const [y, m, d] = date.split("-");
//   return `${d}-${m}-${y}`;
// }

// export function dmy_to_frappe_date(date: string): string {
//   const [d, m, y] = date.split("-");
//   return `${y}-${m}-${d}`;
// }

export function badgeClass(workflowState: string) {
  switch (workflowState) {
    case "Approved":
      return "green";
    case "Pending":
      return "orange";
    case "Draft":
      return "gray";
    default:
      return "gray";
  }
}
