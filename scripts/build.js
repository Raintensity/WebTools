import { copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { parse, relative } from "node:path";
import minify from "@minify-html/node";
import { watch } from "chokidar";
import { build } from "esbuild";

const srcDir = "/src";
const destDir = "/dest";

const appDir = srcDir + "/app";
const staticDir = srcDir + "/static";

const cwd = process.cwd();

const builder = async pathStr => {
	const path = parse(pathStr);
	switch (path.ext) {
		case ".html":
			await writeFile(pathStr, minify.minify(await readFile(pathStr), {
				do_not_minify_doctype: true,
				ensure_spec_compliant_unquoted_attribute_values: true,
				keep_closing_tags: true,
				keep_spaces_between_attributes: true,
				minify_css: true
			}));
			break;
	}
};

// Create or Clean dest dir
try {
	const dirent = await readdir("." + destDir);
	for (const item of dirent) {
		await rm("." + destDir + "/" + item, { recursive: true });
	}
} catch {
	await mkdir("." + destDir);
}

// Build by esbuild
await build({
	entryPoints: [
		cwd + srcDir + "/main.tsx",
		cwd + appDir + "/*.tsx",
		cwd + appDir + "/*.css"
	],
	outdir: cwd + destDir,
	bundle: true,
	minify: true,
	splitting: true,
	format: "esm",
	target: "esnext",
	external: ["/assets/*"],
});

// Copy static files
const copyEntry = async (from, dest) => {
	const dirents = await readdir(from, { withFileTypes: true });
	for (const dirent of dirents) {
		if (dirent.isDirectory()) {
			await mkdir(dest + "/" + dirent.name);
			await copyEntry(from + "/" + dirent.name, dest + "/" + dirent.name);
		} else {
			await copyFile(from + "/" + dirent.name, dest + "/" + dirent.name);
			await builder(dest + "/" + dirent.name);
		}
	}
};
await copyEntry(cwd + staticDir, cwd + destDir);

console.log("Build done.");
