import { copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { parse, relative } from "node:path";
import minify from "@minify-html/node";
import { watch } from "chokidar";
import { context } from "esbuild";

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

// Watch static files
const watcher = watch(cwd + staticDir);
watcher.on("all", async (type, absPath) => {
	const relPath = relative(cwd + staticDir, absPath);
	if (!relPath) return;

	switch (type) {
		case "add":
		case "change":
			await copyFile(absPath, cwd + destDir + "/" + relPath);
			await builder(cwd + destDir + "/" + relPath);
			break;
		case "addDir":
			await mkdir(cwd + destDir + "/" + relPath);
			break;
		case "unlink":
		case "unlinkDir":
			await rm(cwd + destDir + "/" + relPath, { recursive: true })
				.catch(() => Promise.resolve());
			break;
	}
});

// Build and Watch by esbuild
const ctx = await context({
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
});
await ctx.watch();

// Serve
const result = await ctx.serve({ servedir: cwd + destDir });
console.log("Server has been started: " + result.port);
