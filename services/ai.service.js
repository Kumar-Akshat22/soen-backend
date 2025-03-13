import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: `You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write clean, scalable and modular code  and follow the best preactices. You use understandable comments in the code, you create files as needed, you write code while maintaining the working of the previous code. You never miss out on edge cases and always write scalable and maintanable code. You always handle errors and exceptions.`
});

export const generateResult = async(prompt)=>{

    const result = await model.generateContent(prompt);

    return result.response.text();
}
