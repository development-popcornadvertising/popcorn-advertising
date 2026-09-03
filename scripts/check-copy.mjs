/**
 * Fails the build if an em dash reaches anything the visitor can read.
 *
 * A house style rule that lives only in someone's memory gets broken by the
 * next person, so this is enforced rather than documented. Code comments
 * are exempt: they never render.
 *
 * Run by `pnpm verify`.
 */
import { readFileSync } from "node:fs";
import { globSync } from "node:fs";

const BANNED = [
  { char: "—", name: "em dash (—)", hint: "rewrite the sentence, or use a comma or full stop" },
];

/** Blanks out comments so only renderable text is inspected. */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, " "));
}

const files = globSync("src/**/*.{ts,tsx}");
const failures = [];

for (const file of files) {
  const lines = stripComments(readFileSync(file, "utf8")).split("\n");

  lines.forEach((line, index) => {
    for (const { char, name, hint } of BANNED) {
      if (line.includes(char)) {
        failures.push(`${file}:${index + 1}  ${name} — ${hint}\n    ${line.trim()}`);
      }
    }
  });
}

if (failures.length > 0) {
  console.error(`\nBanned characters found in renderable copy (${failures.length}):\n`);
  for (const failure of failures) console.error(`  ${failure}\n`);
  process.exit(1);
}

console.log(`check-copy: clean (${files.length} files)`);
