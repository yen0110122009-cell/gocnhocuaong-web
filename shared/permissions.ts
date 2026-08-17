import type { StudyRole } from "./study";

export function canManageMembers(role: StudyRole): boolean {
  return role === "Admin" || role === "Founder";
}

export function canAssignRole(actor: StudyRole, target: StudyRole): boolean {
  return canManageMembers(actor) && (actor === "Founder" || target !== "Founder");
}

export function canModifyAccount(actor: StudyRole, target: StudyRole, sameAccount = false): boolean {
  if (target === "Founder") return actor === "Founder" && sameAccount;
  return canManageMembers(actor);
}
