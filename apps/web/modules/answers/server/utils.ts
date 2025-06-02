type ImageNode = {
  id: string;
  src: string;
  alt?: string;
  title?: string;
  [key: string]: any;
};

/**
 *
 * Extracts all image attributes from a Tiptap JSON document.
 *
 * @param doc - Tiptap JSON document
 * @returns
 */

export const extractImageAttrsFromTiptapJSON = (doc: Object): ImageNode[] => {
  const images: ImageNode[] = [];

  function traverse(node: any) {
    if (!node) return;
    if (node.type === "image" && node.attrs?.src) {
      images.push(node.attrs);
    }
    if (Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  }

  traverse(doc);
  return images;
};
