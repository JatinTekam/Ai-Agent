import  { GoogleGenAI}  from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({apiKey:`${process.env.API_KEY}`});


function addTwoNumber({num1,num2}){
  return num1+num2;
}


const addTwoNumberDeclaration={
  name:"addTwoNumber",
  description:"Get Sum Of Two Number",
  parameters:{
    type:"object",
    properties:{
      num1:{
        type:"number",
        description:"it will be first number for example 10"
      },
      num2:{
        type:"number",
        description:"it will be second number for example 30"
      }
    },
    required:["num1","num2"]
  }
}


const history=[];
async function main(request) {

    history.push({role:"user", parts: [{ text: request}]})


    while(true){
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: history,
     config: {
      systemInstruction: "You are a Problem Slover. Your name is Neko and and you need to anwser the all mathmatical problem if user ask about anything else then replay politly",
      tools: [{
      functionDeclarations: [addTwoNumberDeclaration]
    }],
    },
  });

  if (response.functionCalls && response.functionCalls.length > 0) {
  const {name,args} = response.functionCalls[0];
    if(name==="addTwoNumber"){
        const res=await addTwoNumber(args)

        const functionResPart={
          name: name,
          response:{
            result: res,
          }
        }

        history.push({role:"model",parts:[{functionCall: response.functionCalls[0]}]})

        history.push({role:"user",parts:[{functionResponse: functionResPart}]})


    }
} else {
  history.push({role:"model", parts: [{ text: response.text}]})
  return response.text;
}  
}
}


async function callChat(request){
   const res=await main(request);
   return res;
   //callChat();

}

export default callChat;