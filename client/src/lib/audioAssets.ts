/** Audio assets tự host trong public/audio, không phụ thuộc host ngoài. */
export const localAudio = (fileName: string) => `${import.meta.env.BASE_URL}audio/${fileName}`;

export const LOCAL_AMBIENT_AUDIO = {
  rain: localAudio("rain-and-thunder.mp3"),
  bookPages: localAudio("turning-a-page.mp3"),
  morning: localAudio("bird-singing.mp3"),
  storm: localAudio("rain-and-thunder.mp3"),
  bell: localAudio("synthetic-bell.mp3"),
} as const;

/** Mỗi festive theme có một track instrumental riêng, tự host và không dùng YouTube watch URL. */
export const LOCAL_FESTIVE_AUDIO = {
  "tet-nguyen-dan": localAudio("festive-tet-nguyen-dan.mp3"),
  "gio-to-hung-vuong": localAudio("festive-gio-to-hung-vuong.mp3"),
  "ngay-thanh-nien-26-3": localAudio("festive-ngay-thanh-nien-26-3.mp3"),
  "giai-phong-30-4": localAudio("festive-giai-phong-30-4.mp3"),
  "thuong-binh-liet-si-27-7": localAudio("festive-thuong-binh-liet-si-27-7.mp3"),
  "cach-mang-19-8": localAudio("festive-cach-mang-19-8.mp3"),
  "quoc-khanh-2-9": localAudio("festive-quoc-khanh-2-9.mp3"),
  "tet-trung-thu": localAudio("festive-tet-trung-thu.mp3"),
  "nha-giao-viet-nam-20-11": localAudio("festive-nha-giao-viet-nam-20-11.mp3"),
  "quoc-te-phu-nu-8-3": localAudio("festive-quoc-te-phu-nu-8-3.mp3"),
  "tet-doan-ngo-5-5": localAudio("festive-tet-doan-ngo-5-5.mp3"),
  "vu-lan-bao-hieu": localAudio("festive-vu-lan-bao-hieu.mp3"),
  "phu-nu-viet-nam-20-10": localAudio("festive-phu-nu-viet-nam-20-10.mp3"),
  "quan-doi-nhan-dan-22-12": localAudio("festive-quan-doi-nhan-dan-22-12.mp3"),
} as const;
