import OpenAI from 'openai';

export const  test=async(req,res)=>{
    const{number,topic}=req.body
    const client = new OpenAI({
  apiKey: process.env['OPEN_AI'], // This is the default and can be omitted
});

const response = await client.responses.create({
  model: 'gpt-4o',
  instructions: `You have to create Mutliple choice Question in json format have Question and its Options and Answer .create ${number} question and only return array of json.Don't want anything more . And use varible Question ,Answer ,Options`,
  input: topic,
});

console.log(response.output_text);
const data=response.output_text
 const jsonString = data.substring(data.indexOf('['), data.lastIndexOf(']') + 1);
const arr=JSON.parse(jsonString)

return res.status(200).json(arr)
}