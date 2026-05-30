const NOTION_TOKEN = process.env.NOTION_TOKEN!;
const NOTION_PAGE_ID = process.env.NOTION_TAEGLICHER_PLANER_ID!;

const headers = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  "Notion-Version": "2022-06-28",
  "Content-Type": "application/json",
};

export interface NotionGoal {
  text: string;
}

export async function getGoalsFromNotion(): Promise<NotionGoal[]> {
  const res = await fetch(
    `https://api.notion.com/v1/blocks/${NOTION_PAGE_ID}/children?page_size=100`,
    { headers, next: { revalidate: 3600 } }
  );

  if (!res.ok) return [];

  const data = await res.json();
  const goals: NotionGoal[] = [];

  for (const block of data.results ?? []) {
    await extractGoals(block, goals);
  }

  return goals;
}

async function extractGoals(block: Record<string, unknown>, goals: NotionGoal[]) {
  // Rekursiv durch Column-Blöcke
  if (block.type === "column_list" || block.type === "column") {
    const res = await fetch(
      `https://api.notion.com/v1/blocks/${block.id}/children`,
      { headers, next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const data = await res.json();
      for (const child of data.results ?? []) {
        await extractGoals(child, goals);
      }
    }
    return;
  }

  // Callout-Blöcke im Ziele-Bereich
  if (block.type === "callout") {
    const callout = (block as Record<string, Record<string, unknown>>).callout;
    const richText = (callout?.rich_text as Array<Record<string, Record<string, string>>>) ?? [];
    const text = richText.map((t) => t.plain_text ?? "").join("").trim();
    if (text) goals.push({ text });
  }
}
