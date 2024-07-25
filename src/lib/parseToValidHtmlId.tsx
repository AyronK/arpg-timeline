export const parseToValidHtmlId = (str: string) => {
  let id = str.replace(/[^a-zA-Z0-9-_]/g, "-");

  id = id.replace(/^-+|-+$/g, "");

  if (/^[^a-zA-Z]/.test(id)) {
    id = "id-" + id;
  }

  return id;
};
