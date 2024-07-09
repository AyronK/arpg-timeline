const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
const gamesMarkdownDirectoryPath = "../../src/pages/games";

(async () => {
  const { promises: fsPromises } = await import("fs");
  const { default: fetch } = await import("node-fetch");
  const { default: path } = await import("path");
  const { default: remarkFrontmatter } = await import("remark-frontmatter");
  const { default: remarkStringify } = await import("remark-stringify");
  const { default: remarkParse } = await import("remark-parse");
  const { unified } = await import("unified");
  const { read } = await import("to-vfile");
  const { matter } = await import("vfile-matter");

  const gameFileNames = await fsPromises.readdir(gamesMarkdownDirectoryPath);

  const games = [];

  for (const gameFileName of gameFileNames) {
    const gameFilePath = path.join(gamesMarkdownDirectoryPath, gameFileName);

    const file = await unified()
      .use(remarkParse)
      .use(remarkStringify)
      .use(remarkFrontmatter)
      .use(() => (_, file) => matter(file))
      .process(await read(gameFilePath));

    games.push(file.data.matter);
  }

  const listOfGames = games.map((g) => `- ${g.title}`).join("\n");

  try {
    await fetch(discordWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "aRPG Timeline Crawler",
        content: `Test 👀\n${listOfGames}`,
      }),
    });
    console.log("✅ Posted message to Discord!");
  } catch (e) {
    console.error(e);
  }
})();
