import Parser from "rss-parser";
import ogs from "open-graph-scraper";

const parser = new Parser();
const RSS_URL = "https://news.google.com/rss/search?q=electric+vehicles";

async function getOGImage(url: string) {
  try {
    const { result } = await ogs({ url });
    return result.ogImage?.url || "";
  } catch {
    return "";
  }
}

export default async function handler(req, res) {
  try {
    const feed = await parser.parseURL(RSS_URL);
    const articles = await Promise.all(feed.items.map(async (item) => ({
      title: item.title,
      link: item.link,
      summary: item.contentSnippet || "",
      published: item.pubDate,
      image: await getOGImage(item.link), // Fetch image from metadata
    })));

    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
}