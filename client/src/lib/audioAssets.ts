/** Audio assets tự host trong public/audio, không phụ thuộc host ngoài. */
export const localAudio = (fileName: string) => `${import.meta.env.BASE_URL}audio/${fileName}`;

export const LOCAL_AMBIENT_AUDIO = {
  rain: localAudio("rain-and-thunder.mp3"),
  bookPages: localAudio("turning-a-page.mp3"),
  morning: localAudio("bird-singing.mp3"),
  storm: localAudio("rain-and-thunder.mp3"),
  bell: localAudio("synthetic-bell.mp3"),
} as const;
