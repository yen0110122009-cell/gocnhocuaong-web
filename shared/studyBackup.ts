import { normalizeProfile, type ProfileState } from "./study";

export const STUDY_BACKUP_VERSION = 1 as const;

export type StudyBackupEnvelope = {
  version: typeof STUDY_BACKUP_VERSION;
  app: "gocnhocuaong";
  exportedAt: string;
  profile: ProfileState;
};

export function createStudyBackup(profile: ProfileState, exportedAt = new Date().toISOString()): string {
  const envelope: StudyBackupEnvelope = {
    version: STUDY_BACKUP_VERSION,
    app: "gocnhocuaong",
    exportedAt,
    profile: normalizeProfile(profile),
  };
  return JSON.stringify(envelope, null, 2);
}

export function restoreStudyBackup(serialized: string): ProfileState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized);
  } catch {
    throw new Error("File backup không phải JSON hợp lệ.");
  }
  if (!parsed || typeof parsed !== "object") throw new Error("File backup không có cấu trúc hợp lệ.");
  const envelope = parsed as Partial<StudyBackupEnvelope>;
  if (envelope.app !== "gocnhocuaong" || envelope.version !== STUDY_BACKUP_VERSION || !envelope.profile || typeof envelope.profile !== "object") {
    throw new Error("File backup không thuộc Góc Học Tập Của Ong hoặc không được hỗ trợ.");
  }
  return normalizeProfile(envelope.profile);
}
