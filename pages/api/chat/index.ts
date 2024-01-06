import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Response } from "@/src/helper/apiResponse";
interface ChatApiRequest extends NextApiRequest {
  body: {
    message: string;
  };
}

let chatHistory: any[] = [];

export default async function handler(
  req: ChatApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    const { message } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const history =
      chatHistory.length > 0
        ? chatHistory
        : [
            {
              role: "user",
              parts: `You are a helpful Lawyer. I want you to act as a professional lawyer, but you have to give an answer based on Indonesian law. I want you to help me solve my problem. My problem is ${message}
        
                ===========
                Return the answer as if you are a professional lawyer. Make sure you give an answer based on Indonesian law. And make sure you provide an answer that can solve my problem. Don't use words that can confuse me. If you can provide an simple answer, please do it.
                ===========

                Return the answer in Bahasa Indonesia.
                `,
            },
            {
              role: "model",
              parts: "Great to meet you. What would you like to know?",
            },
          ];

    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessageStream(message);
    let text = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      console.log(chunkText);
      text += chunkText;
    }

    chatHistory = await chat.getHistory();

    return Response(res, 200, "Success", {
      type: "chat",
      payload: {
        message: text,
      },
    });
  } else {
    res.status(405).end();
  }
}
