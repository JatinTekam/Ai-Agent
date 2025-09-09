import express, { urlencoded } from "express";
import cors from "cors";
import callChat from "./AIService.js";
import dotenv from "dotenv";

dotenv.config();


const app=express();

app.use(cors({
    origin:"*",
}))

app.use(express.urlencoded({extended:true}))
app.use(express.json())


// async function main(request) {
//     history.push({
//         "role":"user",
//          parts: [{ text: request }],
//     })
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: request,
//   });
//    history.push({
//         "role":"model",
//          parts: [{ text: response.text }],
//     })
//   return response.text;
// }


app.post("/ai",async (req,res)=>{
    const {userMessage}=req.body;
    const response=await callChat(userMessage);
     res.json({"messeage":response})
})


app.listen(3000,()=>{
    console.log("server running  on port 3000");
    
})

