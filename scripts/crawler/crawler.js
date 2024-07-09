const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
const gamesMarkdownDirectoryPath = "../../src/pages/games";

const importDependencies = async () => {
  const { promises: fsPromises } = await import("fs");
  const { default: fetch } = await import("node-fetch");
  const { default: path } = await import("path");
  const { default: remarkFrontmatter } = await import("remark-frontmatter");
  const { default: remarkStringify } = await import("remark-stringify");
  const { default: remarkParse } = await import("remark-parse");
  const { unified } = await import("unified");
  const { read } = await import("to-vfile");
  const { matter } = await import("vfile-matter");

  return {
    fsPromises,
    fetch,
    path,
    remarkFrontmatter,
    remarkStringify,
    remarkParse,
    unified,
    read,
    matter,
  };
};

(async () => {
  const {
    fsPromises,
    fetch,
    path,
    remarkFrontmatter,
    remarkStringify,
    remarkParse,
    unified,
    read,
    matter,
  } = await importDependencies();

  const loadGames = async (directoryPath) => {
    const gameFileNames = await fsPromises.readdir(directoryPath);
    const games = [];

    for (const gameFileName of gameFileNames) {
      const gameFilePath = path.join(directoryPath, gameFileName);

      const file = await unified()
        .use(remarkParse)
        .use(remarkStringify)
        .use(remarkFrontmatter)
        .use(() => (_, file) => matter(file))
        .process(await read(gameFilePath));

      games.push(file.data.matter);
    }
    return games;
  };

  (async () => {
    const games = await loadGames(gamesMarkdownDirectoryPath);
    const listOfGames = games.map((g) => `- ${g.title}`).join("\n");
    try {
      await fetch(discordWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "aRPG Timeline Crawler",
          content: `This is placeholder message for incoming crawler feature. For now it just displays the list of games. 👀\n${listOfGames}`,
        }),
      });
      console.log("✅ Posted message to Discord!");
    } catch (e) {
      console.error(e);
    }
  })();
})();
