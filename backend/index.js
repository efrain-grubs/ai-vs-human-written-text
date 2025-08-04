const express = require('express')
const cors = require('cors')
const axios = require('axios')
const {OpenAI} = require('openai')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 5050

app.listen(PORT, () => { 
    console.log(`app is running on port ${PORT}`)
})

app.post('/predict',async(req,res) => { 
const {text,prediction} = req.body



if(!text) { 
    return res.status(400).json({message: "something went wrong"})
}

const openai = new OpenAI({
    apiKey:  process.env.API_KEY

}


)

try { 

const response = await openai.chat.completions.create({
    model : 'gpt-3.5-turbo',
    messages: [{role:'system',content: `try to humanize the users text, also begin the paragraph with a humanized version of your text is...`},
     {role:'user',content: text}
    ]   

})

const aiReply = response.choices[0].message.content

res.status(200).json({aiReply})




}catch(err) { 

    console.log("error",err)

    return res.status(500).json({message: 'something went wrong'})
}



})

app.post('/chat',async (req,res) => { 

const{userText,aiReply} = req.body

console.log("route has been reached")

const openai = new OpenAI({
    apiKey:  process.env.API_KEY

})


try { 

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
            role: "system", content: `continute the conversation with the user, this is some your previous responses ${aiReply}`
        },
    {role: 'user',content: userText}]
    })


    const aiResponse = response.choices[0].message.content
    

    return res.status(200).json({aiReply: aiResponse})


} catch(err) { 
    console.log("error: ",err)

    return res.status(500).json({message: "something went wrong"})
}





})




