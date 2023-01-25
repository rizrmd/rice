import { isText } from "../libs/is-binary";
import { state } from "../state";
const dec = new TextDecoder();

export const frontEndProxy = async (url: URL) => {
  const pathname = url.pathname;

  let beurl = url.toString();
  beurl = beurl.substring(0, beurl.length - pathname.length + 1);

  if (state.frontend.url) {
    url.hostname = state.frontend.url.hostname;
    url.port = state.frontend.url.port;
    const requrl = url.toString();

    url.pathname = "";
    const feurl = url.toString();

    url.port = "12340";
    const ofeurl = url.toString();

    const res = await fetch(requrl);
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

        if (isText(pathname, Buffer.from(value))) {
          shouldReplace = true;
        }
      }

      if (shouldReplace) {
        let text = dec.decode(buf);
        text = text.replaceAll(feurl, beurl);
        text = text.replaceAll(ofeurl, beurl);
        return new Response(text, {
          headers: res.headers,
          status: res.status,
          statusText: res.statusText,
        });
      }
    }
    return final;
  }
};

export const proxy = async (
  to: string,
  base: string,
  alternateTo: string[]
) => {
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
      text = text.replaceAll(`href="/`, `href="${base}`);
      text = text.replaceAll(`src="/`, `src="${base}`);

      const tourl = new URL(to);
      tourl.pathname = "";
      text = text.replaceAll(tourl.toString(), base);

      console.log(tourl.toString(), base, alternateTo);
      if (alternateTo) {
        for (const url of alternateTo) {
          text = text.replaceAll(url, base);
        } 
      }

      return new Response(text, {
        headers: res.headers,
        status: res.status,
        statusText: res.statusText,
      });
    }
  }
  return final;
};
