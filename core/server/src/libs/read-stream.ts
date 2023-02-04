const dec = new TextDecoder();
export const readStream = (
  reader: ReadableStreamDefaultReader,
  fn: (text: string) => void
) => {
  new Promise(async () => {
    while (true) {
      const { done, value } = await reader.read();
      const text = dec.decode(value);
      fn(text);
      if (done) {
        break;
      }
    }
  });
};
