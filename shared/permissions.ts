import type { StudyRole } from "./study";

export function isUnlimitedAccountCode(code: string): boolean {
  return code.trim().toUpperCase() === "111";
}

export function canManageMembers(role: StudyRole): boolean {
  return role === "Admin" || role === "Founder";
}

export function canManageLearningConfig(role: StudyRole): boolean {
  return canManageMembers(role);
}

export function canAssignRole(actor: StudyRole, target: StudyRole): boolean {
  return canManageMembers(actor) && (actor === "Founder" || target !== "Founder");
}

export function canModifyAccount(actor: StudyRole, target: StudyRole, sameAccount = false): boolean {
  if (target === "Founder") return actor === "Founder" && sameAccount;
  return canManageMembers(actor);
}

export function canDeleteAccount(actor: StudyRole, target: StudyRole, sameAccount = false, targetCode = ""): boolean {
  if (sameAccount || targetCode.trim().toUpperCase() === "999") return false;
  if (target === "Founder") return actor === "Founder";
  return canManageMembers(actor);
}
