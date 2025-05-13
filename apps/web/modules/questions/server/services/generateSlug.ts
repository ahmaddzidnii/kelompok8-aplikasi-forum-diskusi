import slugify from "slugify";

import { nanoid } from "@/lib/nanoid";

export const generateSlug = (questionContent: string) => {
  return slugify(questionContent + "-" + nanoid(6), {
    lower: true,
    strict: true,
    locale: "id",
    replacement: "-",
    trim: true,
    remove: /[*+~.()'"!:@]/g,
  });
};
