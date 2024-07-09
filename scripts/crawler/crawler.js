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

    const notifications = [];

    const fetchAndProcess = async (game) => {
      const { sources = [], keywords = [] } = game.crawlerSettings || {};

      if (sources.length > 0 && keywords.length > 0) {
        const fetchPromises = sources.map(async (source) => {
          try {
            const result = await fetch(source);
            if (result.ok) {
              const text = await result.text();
              const normalized = text.toLowerCase();

              const keywordMatch = keywords.find((k) =>
                normalized.includes(k.toLowerCase()),
              );

              if (keywordMatch) {
                notifications.push(
                  `🔍 **${game.title}**: '${keywordMatch}' keyword on ${source}`,
                );
              }
            } else {
              notifications.push(
                `❌ **${game.title}**: Failed to fetch data from ${source}: ${result.status} - ${result.statusText}`,
              );
            }
          } catch (error) {
            notifications.push(
              `❌ **${game.title}**: Error fetching data from ${source}: ${error.message}`,
            );
          }
        });

        await Promise.all(fetchPromises);
      }
    };

    await Promise.all(games.map(fetchAndProcess));

    if (!notifications.length) {
      return;
    }

    const parsedNotifications = notifications.map((g) => `- ${g}`).join("\n");

    try {
      await fetch(discordWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "aRPG Timeline Crawler",
          content: `⚠️ **Crawler got ${notifications.length} alert(s)**\n\n${parsedNotifications}`,
        }),
      });
      console.log("✅ Posted message to Discord!");
    } catch (e) {
      console.error(e);
    }
  })();
})();
