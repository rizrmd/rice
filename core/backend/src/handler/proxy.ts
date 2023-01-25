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

        if (pathname === "/bun:wrap") {
          text = text.replace(
            'new URL(location.origin+"/bun:_api.hmr")',
            `new URL("${feurl}bun:_api.hmr")`
          );
          text = text.replace(
            `L.log("Live reload connected in",e(S-Q),"ms");`,
            `console.clear();L.log("Live reload connected in",e(S-Q),"ms");`
          );
        } else {
          text = text.replaceAll(feurl, beurl);
          text = text.replaceAll(ofeurl, beurl);
        }

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
