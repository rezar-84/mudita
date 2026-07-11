#!/usr/bin/env node

/**
 * Makes bundled club SVGs safe to inline repeatedly in the designer.
 *
 * It deliberately preserves artwork and colours. The designer creates the
 * single-colour neon outline at render time, so flattening paths or gradients
 * here would be destructive. Files reported for manual review should be
 * opened in Inkscape and have their text converted to paths.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve, basename } from "node:path";

const assetDirectory = resolve("src/assets/objects/sport_emblems/soccer/turkey");
const dryRun = process.argv.includes("--dry-run");
const manualReview = [];
let changed = 0;

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match?.[2];
}

function number(value) {
  const match = value?.match(/[-+]?(?:\d*\.)?\d+/);
  return match ? Number(match[0]) : undefined;
}

function prefixFor(filename) {
  return basename(filename, ".svg")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normaliseSvg(source, filename) {
  const rootMatch = source.match(/<svg\b[^>]*>/i);
  if (!rootMatch) throw new Error("missing <svg> root");

  const root = rootMatch[0];
  let replacement = root;
  const existingViewBox = attribute(root, "viewBox");
  if (!existingViewBox) {
    const width = number(attribute(root, "width"));
    const height = number(attribute(root, "height"));
    if (!width || !height) throw new Error("missing viewBox and usable width/height");
    replacement = replacement.replace(/\s(?:width|height)\s*=\s*(["']).*?\1/gi, "");
    replacement = replacement.replace(/<svg\b/i, `<svg viewBox="0 0 ${width} ${height}"`);
  } else {
    replacement = replacement.replace(/\s(?:width|height)\s*=\s*(["']).*?\1/gi, "");
  }
  source = source.replace(root, replacement);

  // Fragment IDs are document-global when SVG is injected inline. Prefixing
  // avoids collisions between picker previews and the two hybrid render layers.
  const prefix = prefixFor(filename);
  const ids = [...source.matchAll(/\sid\s*=\s*(["'])([^"']+)\1/gi)].map((match) => match[2]);
  for (const id of new Set(ids.filter((id) => !id.startsWith(`${prefix}-`)))) {
    const nextId = `${prefix}-${id}`;
    source = source.replace(
      new RegExp(`(\\sid\\s*=\\s*["'])${escapeRegExp(id)}(?=["'])`, "g"),
      `$1${nextId}`,
    );
    source = source.replaceAll(`url(#${id})`, `url(#${nextId})`);
    source = source.replace(
      new RegExp(`((?:xlink:)?href\\s*=\\s*["'])#${escapeRegExp(id)}(?=["'])`, "gi"),
      `$1#${nextId}`,
    );
  }

  const flags = [];
  if (/<(?:text|tspan)\b/i.test(source))
    flags.push("contains text; convert text to paths in Inkscape");
  if (/<(?:image|use|foreignObject)\b/i.test(source))
    flags.push("contains unsupported external/reused content");
  if (/<(?:mask|filter)\b/i.test(source))
    flags.push("contains mask/filter; visually inspect after normalization");
  return { source, flags };
}

const files = (await readdir(assetDirectory)).filter((file) => file.endsWith(".svg")).sort();
for (const file of files) {
  const path = resolve(assetDirectory, file);
  const original = await readFile(path, "utf8");
  try {
    const result = normaliseSvg(original, file);
    if (result.source !== original) {
      changed += 1;
      if (!dryRun) await writeFile(path, result.source);
    }
    if (result.flags.length) manualReview.push({ file, flags: result.flags });
  } catch (error) {
    manualReview.push({ file, flags: [`could not normalize: ${error.message}`] });
  }
}

console.log(
  `${dryRun ? "Would normalize" : "Normalized"} ${changed}/${files.length} sport emblem SVGs.`,
);
if (manualReview.length) {
  console.log("Manual review:");
  for (const item of manualReview) console.log(`- ${item.file}: ${item.flags.join("; ")}`);
}
