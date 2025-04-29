import Parser from "rss-parser";
import ogs from "open-graph-scraper";
import fs from "fs";
import axios from "axios";
import * as cheerio from "cheerio";

const parser = new Parser();
const RSS_URL = "https://news.google.com/rss/search?q=electric+vehicles&hl=en-US&gl=US&ceid=US:en";

/**
 * Extracts the source name from the title.
 * Example: "Trump’s Plan to Repeal Climate Policy Could Upend Shift - The New York Times"
 * → Title: "Trump’s Plan to Repeal Climate Policy Could Upend Shift"
 * → Source Name: "The New York Times"
 */
function extractSourceName(title: string): { title: string; sourceName: string } {
  const splitTitle = title.split(" - ");
  return {
    title: splitTitle[0]?.trim() || title,
    sourceName: splitTitle[1]?.trim() || "Unknown Source",
  };
}

/**
 * Fetches Open Graph Image for the article URL
 */
async function getOGImage(url: string): Promise<string> {
  try {
    const { result } = await ogs({ url });
    return result.ogImage?.url || "";
  } catch (error) {
    console.error("❌ Error fetching image for:", url);
    return "";
  }
}

/**
 * Fetches full article content from the news website
 */
async function scrapeArticleContent(url: string): Promise<string> {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Try to extract meaningful content (adjust selectors as needed)
    const paragraphs = $("p").map((_, el) => $(el).text().trim()).get();

    return paragraphs.slice(0, 5).join("\n"); // Return first 5 paragraphs
  } catch (error) {
    console.error("❌ Error scraping content for:", url);
    return "Content unavailable. Read full article at source.";
  }
}

/**
 * Cleans up non-standard characters and escapes quotes
 */
function sanitizeText(text: string): string {
  return text
    .replace(/[\u2018\u2019]/g, "'") // Fix single quotes (‘ → ')
    .replace(/[\u201C\u201D]/g, '"') // Fix double quotes (“ → ")
    .replace(/[\u2013\u2014]/g, "-") // Fix en-dash/em-dash (– → -)
    .replace(/[^\x00-\x7F]/g, "")  // Remove non-ASCII characters
    .replace(/"/g, `\\"`); // Escape double quotes for TypeScript formatting
}

/**
 * Fetches news from RSS, extracts metadata, and updates news-articles.ts
 */
async function fetchNews() {
  try {
    console.log("🔄 Fetching latest news...");

    // Fetch RSS Feed
    const feed = await parser.parseURL(RSS_URL);

    // Process the first 10 articles
    const articles = await Promise.all(
      feed.items.slice(0, 10).map(async (item) => {
        const { title, sourceName } = extractSourceName(item.title || "");
        return {
          title: sanitizeText(title),
          sourceName: sanitizeText(sourceName),
          date: new Date(item.pubDate || "").toISOString().split("T")[0],
          excerpt: sanitizeText(item.contentSnippet || ""),
          image: await getOGImage(item.link),
          content: sanitizeText(await scrapeArticleContent(item.link)), // Scrape actual content
          source: item.link,
        };
      })
    );

    // **Manually format the TypeScript export to avoid JSON formatting issues**
    const formattedArticles = articles
      .map((article) => {
        return `  {
    title: "${article.title}",
    sourceName: "${article.sourceName}",
    date: "${article.date}",
    excerpt: "${article.excerpt}",
    image: "${article.image}",
    content: "${article.content}",
    source: "${article.source}"
  }`;
      })
      .join(",\n");

    const newsTSContent = `import type { NewsArticle } from "@/types/news";\n\nexport const newsArticles: NewsArticle[] = [\n${formattedArticles}\n];`;

    // Write to `news-articles.ts`
    fs.writeFileSync("./data/news-articles.ts", newsTSContent, "utf-8");

    console.log("✅ News updated successfully in news-articles.ts!");

  } catch (error) {
    console.error("❌ Error fetching news:", error);
  }
}

// Run the function
fetchNews();