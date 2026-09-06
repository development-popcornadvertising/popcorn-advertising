/**
 * Escapes a string for interpolation into HTML email markup.
 *
 * NOT COSMETIC. Name, company and message all come from a public form and
 * land inside an HTML document that a member of the team opens. Unescaped,
 * anyone can post an `<a href>` into the email you read, which is a
 * phishing vector aimed at your own inbox, and a stray `<` or `</td>` can
 * tear the table layout apart.
 *
 * Every interpolation in every template goes through this. The templates
 * are the only place raw input meets markup, so this is the one boundary
 * that has to hold.
 *
 * Ampersand is replaced first. Doing it later would double-escape the
 * entities introduced by the other replacements ("&lt;" becoming
 * "&amp;lt;").
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escapes and converts newlines to <br>, for a multi-line message body.
 *
 * Escaping happens first, so a `<br>` typed by the sender is shown as text
 * rather than becoming a real line break.
 */
export function escapeParagraph(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}
