const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
const gamesMarkdownPath = "../../src/pages/games";

(async () => {
    const { promises: fsPromises } = await import('fs');
    const { default: fetch } = await import('node-fetch');
    const { default: path } = await import('path');

    const gameFiles = await fsPromises.readdir(gamesMarkdownPath);

    for (const file of gameFiles) {
        const filePath = path.join(gamesMarkdownPath, file);
        const fileContent = await fsPromises.readFile(filePath, 'utf-8');
        console.log(fileContent);
    }

    return;
    try {
        await fetch(discordWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "aRPG Timeline Crawler",
                content: "Test 👀"
            })
        })
        console.log("✅ Posted message to Discord!");
    } catch (e) {
        console.error(e);
    }
})()

