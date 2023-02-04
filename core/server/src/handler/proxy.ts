import { isText } from "../libs/is-binary";
const dec = new TextDecoder();

export const proxy = async (to: string) => {
  const res = await fetch(to);
  const final = res.clone();
  const reader = res.body?.getReader();

  if (reader) {
    let buf = new Uint8Array();
    let shouldReplace = false;
    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }
      const nbuf = new Uint8Array(buf.length + value.length);
      nbuf.set(buf);
      nbuf.set(value, buf.length);
      buf = nbuf;

      if (isText(to, Buffer.from(value))) {
        shouldReplace = true;
      }
    }

    if (shouldReplace) {
      let text = dec.decode(buf);

      return new Response(text, {
        headers: res.headers,
        status: res.status,
        statusText: res.statusText,
      });
    }
  }
  return final;
};
