/** Audio assets tự host trong public/audio, không phụ thuộc host ngoài. */
export const localAudio = (fileName: string) => `${import.meta.env.BASE_URL}audio/${fileName}`;

export const LOCAL_AMBIENT_AUDIO = {
  rain: localAudio("rain-and-thunder.ogg"),
  bookPages: localAudio("turning-a-page.ogg"),
  morning: localAudio("bird-singing.ogg"),
  storm: localAudio("rain-and-thunder.ogg"),
  bell: localAudio("synthetic-bell.ogg"),
} as const;
