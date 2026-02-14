// services/libraryService.ts

import { withCache, getLanguageInstruction } from "./common";
import { BookStructure, ChapterContent } from "../types";

/**
 * Fetch the structure of a book by title and author
 */
export const fetchBookStructure = async (
  title: string,
  author: string
): Promise<BookStructure> => {
  const key = `bookStructure:${title}:${author}`;
  return withCache(key, async () => {
    const prompt = `
      Given the book "${title}" by ${author}, provide a JSON object describing:
      - chapters (list of chapter names)
      - total pages per chapter
    `;
    const response = await generateBookData(prompt);
    return response as BookStructure;
  });
};

/**
 * Stream the content of a specific chapter
 */
export const streamChapterContent = async (
  bookTitle: string,
  chapterName: string
): Promise<ChapterContent> => {
  const key = `chapterContent:${bookTitle}:${chapterName}`;
  return withCache(key, async () => {
    const prompt = `
      Stream the full content of chapter "${chapterName}" from book "${bookTitle}".
      Return as a JSON object with fields: text (string), wordCount (number)
    `;
    const response = await generateBookData(prompt);
    return response as ChapterContent;
  });
};

/**
 * Ask a question about the book content and get an answer
 */
export const askReaderQuestion = async (
  bookTitle: string,
  chapterName: string,
  question: string
): Promise<string> => {
  const prompt = `
    Based on chapter "${chapterName}" of book "${bookTitle}", answer the question:
    "${question}"
  `;
  const response = await generateBookData(prompt);
  return (response as { text: string }).text;
};

/**
 * Internal helper to call API
 */
const generateBookData = async (contents: string): Promise<any> => {
  const model = "claude-v1"; // or your preferred model
  const instruction = getLanguageInstruction();
  const body = {
    model,
    max_tokens: 2048,
    messages: [
      { role: "system", content: instruction },
      { role: "user", content: contents },
    ],
  };

  const apiKey = import.meta.env.VITE_API_KEY || "";
  if (!apiKey) throw new Error("VITE_API_KEY not found in environment");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data?.content?.[0]?.text || "";
};