type MenuHelpGuideProps = {
  currentView: string;
  isAdmin: boolean;
  isUnlimitedAccount: boolean;
  onNavigate?: (view: any) => void;
};

/**
 * Khu vực trợ giúp nổi đã được loại bỏ theo yêu cầu người dùng.
 * Giữ export rỗng tạm thời để Home không còn gắn UI dấu hỏi, đồng thời
 * không tạo lại trigger, tooltip hoặc lớp phủ hướng dẫn trên màn hình.
 */
export function MenuHelpGuide(_: MenuHelpGuideProps) {
  return null;
}
