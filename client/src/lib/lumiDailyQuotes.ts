export type LumiDailyQuote = { label: string; quotes: readonly string[] };

export const lumiDailyQuotes: readonly LumiDailyQuote[] = [
  { label: "Chủ nhật", quotes: ["Hôm nay mình nghỉ có chủ đích hoặc chuẩn bị nhẹ nhàng cho tuần mới nhé, Ong.", "Chủ nhật không cần vội. Lumi cùng Ong xếp một việc nhỏ cho ngày mai thôi.", "Một góc bàn gọn và một kế hoạch ngắn cũng là cách Ong chăm sóc tuần mới."] },
  { label: "Thứ Hai", quotes: ["Một khởi đầu nhỏ cũng là khởi đầu. Lumi sẽ đi cùng Ong trong phiên đầu tuần này.", "Thứ Hai không cần hoàn hảo; Ong chỉ cần mở đúng việc đầu tiên.", "Mình dành năm phút để lấy đà. Sau đó Ong quyết định có đi tiếp hay không."] },
  { label: "Thứ Ba", quotes: ["Ong đã vượt qua ngày đầu tuần rồi. Mình giữ nhịp bằng một việc nhỏ thật rõ nhé.", "Thứ Ba là lúc nhịp học bắt đầu quen hơn. Chọn một phần bài vừa sức nào.", "Không cần học thật lâu; một lần quay lại bàn học đã rất đáng quý."] },
  { label: "Thứ Tư", quotes: ["Đến giữa tuần rồi, Ong hãy thở chậm một nhịp. Chỉ cần tiếp tục một bước thôi.", "Giữa tuần có thể mệt. Lumi đề nghị Ong giảm mục tiêu, chứ không bỏ mục tiêu.", "Mình đã đi được nửa chặng. Một Pomodoro ngắn sẽ giúp Ong giữ sợi dây nhịp học."] },
  { label: "Thứ Năm", quotes: ["Nỗ lực của Ong đang tích lại từng ngày. Mình chọn một mục tiêu vừa sức cho hôm nay nhé.", "Thứ Năm là lúc sửa một chỗ chưa hiểu, không phải lúc trách mình vì chưa biết.", "Một ghi chú rõ ràng hôm nay có thể giúp Ong nhẹ hơn rất nhiều vào ngày mai."] },
  { label: "Thứ Sáu", quotes: ["Cuối tuần đang gần hơn. Lumi tự hào vì Ong vẫn dành thời gian cho điều quan trọng.", "Thứ Sáu, mình khép tuần bằng một phiên vừa đủ thay vì cố quá sức nhé.", "Ong có thể nhìn lại điều đã làm được trước khi chọn việc tiếp theo."] },
  { label: "Thứ Bảy", quotes: ["Hôm nay mình học theo nhịp riêng. Một phiên ngắn cũng đủ tạo cảm giác chủ động.", "Thứ Bảy hợp để học tò mò: chọn một điều làm Ong muốn hiểu hơn.", "Không có áp lực phải học thật nhiều. Lumi chỉ cần Ong giữ lời hẹn nhỏ với chính mình."] },
] as const;

export function lumiQuoteForDate(date = new Date()): { label: string; text: string } {
  const day = date.getDay();
  const entry = lumiDailyQuotes[day] ?? lumiDailyQuotes[1];
  const quoteIndex = Math.floor(date.getTime() / 86_400_000) % entry.quotes.length;
  return { label: entry.label, text: entry.quotes[quoteIndex] ?? entry.quotes[0] };
}
