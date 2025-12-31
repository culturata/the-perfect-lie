"use server";

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateArticleTitle(topic: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: `Generate a compelling, SEO-friendly article title for a golf simulator build guide about: ${topic}

The title should:
- Be clear and descriptive
- Include relevant keywords
- Be between 40-60 characters
- Appeal to golf simulator enthusiasts

Return ONLY the title, nothing else.`,
      },
    ],
  });

  const content = message.content[0];
  return content.type === "text" ? content.text.trim() : "";
}

export async function generateArticleExcerpt(title: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `Generate a compelling 2-3 sentence excerpt for an article with this title: "${title}"

The excerpt should:
- Summarize what the article covers
- Be engaging and informative
- Be around 150-200 characters
- Appeal to golf simulator enthusiasts

Return ONLY the excerpt, nothing else.`,
      },
    ],
  });

  const content = message.content[0];
  return content.type === "text" ? content.text.trim() : "";
}

export async function generateArticleContent(params: {
  title: string;
  category: string;
  excerpt?: string;
  outline?: string;
}): Promise<string> {
  const { title, category, excerpt, outline } = params;

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are writing a comprehensive golf simulator build guide article for GSPro enthusiasts.

Article Title: ${title}
Category: ${category}
${excerpt ? `Brief Description: ${excerpt}` : ""}
${outline ? `Outline/Structure: ${outline}` : ""}

Write a complete, detailed article following this structure:

1. **Introduction** (2-3 paragraphs)
   - Hook the reader with why this topic matters
   - Preview what they'll learn
   - Set expectations

2. **Who This Guide Is For** (1 paragraph)
   - Describe the target audience

3. **Key Concepts** (2-3 sections)
   - Explain important terms and concepts
   - Break down technical details

4. **Framework/Approach** (3-5 sections)
   - Step-by-step guidance
   - Best practices
   - Specific recommendations for GSPro setups

5. **Common Scenarios** (2-3 examples)
   - Real-world applications
   - Specific use cases

6. **Mistakes to Avoid** (5-10 items)
   - Common pitfalls
   - How to avoid them

7. **Quick Reference Checklist** (bulleted list)
   - Key takeaways
   - Action items

Write in HTML format using semantic tags:
- <h2> for main sections
- <h3> for subsections
- <p> for paragraphs
- <ul> and <li> for lists
- <strong> for emphasis
- <a> for links (when relevant)

Keep the tone:
- Expert but approachable
- Practical and actionable
- Focused on GSPro golf simulator builds
- Enthusiastic about the hobby

Return ONLY the HTML content (no markdown, no wrapper tags like <html> or <body>).`,
      },
    ],
  });

  const content = message.content[0];
  return content.type === "text" ? content.text.trim() : "";
}

export async function improveContent(
  currentContent: string,
  instruction: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are editing a golf simulator build guide article.

Current content:
${currentContent}

Instruction: ${instruction}

Improve the content based on the instruction. Maintain the HTML formatting and keep the tone expert but approachable.

Return ONLY the improved HTML content.`,
      },
    ],
  });

  const content = message.content[0];
  return content.type === "text" ? content.text.trim() : "";
}

export async function generateImagePrompt(context: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `Based on this article context, generate a detailed image prompt for a hero/featured image:

Context: ${context}

The image should be suitable for a golf simulator build guide. Describe what should be in the image in detail (good for AI image generation or as guidance for photography).

Return ONLY the image prompt, nothing else.`,
      },
    ],
  });

  const content = message.content[0];
  return content.type === "text" ? content.text.trim() : "";
}

export async function expandSection(
  sectionTitle: string,
  currentContent: string,
  articleContext: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `You are expanding a section of a golf simulator build guide article.

Article context: ${articleContext}

Section title: ${sectionTitle}
Current section content:
${currentContent}

Expand this section with more detail, examples, and practical advice. Keep the HTML formatting and maintain an expert but approachable tone focused on GSPro golf simulator builds.

Return ONLY the expanded HTML content for this section.`,
      },
    ],
  });

  const content = message.content[0];
  return content.type === "text" ? content.text.trim() : "";
}
