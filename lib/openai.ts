import OpenAI from "openai";

console.log("OPENAI KEY:", process.env.OPENAI_API_KEY?.slice(0, 15));
console.log("KEY LENGTH:", process.env.OPENAI_API_KEY?.length);

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});