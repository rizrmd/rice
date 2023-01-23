import cuid from "cuid";

type Item = { attr: string };
const items = new Map<string, Item>();

export const api = {
  async hello(greeting: string) {
    return greeting + " World";
  },
  // you can nest and regroup methods
  foo: {
    bar: {
      baz: {
        async create(item: Item) {
          const id = cuid();
          items.set(id, item);
          return id;
        },
        async read(id: string) {
          return items.get(id);
        },
        async update(id: string, item: Item) {
          items.set(id, item);
        },
        async delete(id: string) {
          items.delete(id);
        },
      },
    },
  },
};
