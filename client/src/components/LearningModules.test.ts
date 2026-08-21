import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const source = (file: string) => readFileSync(resolve(process.cwd(), file), "utf8");

describe("bốn module học tập mới", () => {
  it("có bốn component độc lập và được nối vào Home", () => {
    const home = source("client/src/pages/Home.tsx");
    expect(home).toContain('import { MistakeBook } from "@/components/MistakeBook"');
    expect(home).toContain('import { EnergyStudyMode } from "@/components/EnergyStudyMode"');
    expect(home).toContain('import { StudyHealthDashboard } from "@/components/StudyHealthDashboard"');
    expect(home).toContain('import { KnowledgeLab } from "@/components/KnowledgeLab"');
    expect(home).not.toContain('label: "Sổ lỗi thông minh"');
    expect(home).not.toContain('label: "Học theo năng lượng"');
    expect(home).not.toContain('label: "Sức khỏe học tập"');
    expect(home).not.toContain('label: "Thí nghiệm kiến thức"');
    expect(home).toContain('id: "pomodoro"');
  });

  it("sổ lỗi có trạng thái, lọc, lịch ôn và thao tác xóa", () => {
    const file = source("client/src/components/MistakeBook.tsx");
    expect(file).toContain('status: "open" | "reviewed"');
    expect(file).toContain("reviewAt");
    expect(file).toContain("Tìm kiếm");
    expect(file).toContain("Xóa lỗi");
  });

  it("chế độ năng lượng có ba mức và lưu lựa chọn", () => {
    const file = source("client/src/components/EnergyStudyMode.tsx");
    expect(file).toContain('type Energy = "low" | "steady" | "high"');
    expect(file).toContain("localStorage.setItem(STORAGE_KEY, next)");
    expect(file).toContain("aria-pressed");
  });

  it("sức khỏe học tập hiển thị bảy ngày và xử lý trạng thái chưa có dữ liệu", () => {
    const file = source("client/src/components/StudyHealthDashboard.tsx");
    expect(file).toContain("bảy ngày");
    expect(file).toContain("Chưa có dữ liệu bảy ngày");
    expect(file).toContain("durationSeconds");
  });

  it("khu thí nghiệm hỗ trợ kéo thả, đặt lại và kiểm tra phản hồi", () => {
    const file = source("client/src/components/KnowledgeLab.tsx");
    expect(file).toContain("draggable");
    expect(file).toContain("Đặt lại");
    expect(file).toContain("Kiểm tra sắp xếp");
    expect(file).toContain("localStorage");
  });
});
