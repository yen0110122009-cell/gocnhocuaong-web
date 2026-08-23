import type { AppConfig, ProfileState } from "../../../shared/study";

type ProfileTitleSelectorProps = {
  profile: ProfileState;
  config: AppConfig;
  onProfile: (profile: ProfileState, message?: string) => void;
};

/** @deprecated Danh hiệu đã bị gỡ khỏi sản phẩm; giữ export rỗng để tương thích tuyến cũ. */
export default function ProfileTitleSelector(_props: ProfileTitleSelectorProps) {
  return null;
}

export { ProfileTitleSelector };
