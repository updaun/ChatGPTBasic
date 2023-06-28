require('dotenv').config();
const serverless = require('serverless-http');
const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const cors = require("cors");
const app = express();

const configuration = new Configuration({
  apiKey: process.env.apiKey,
});
const openai = new OpenAIApi(configuration);

let corsOptions = {
  origin: "https://chatdoge-jocoding-4jx.pages.dev",
  credentials: true
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/fortuneTell", async function (req, res) {
  let { myDateTime, userMessages, assistantMessages } = req.body;

  let todayDateTime = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  let messages = [
      {role: "system", content: "당신은 세계 최고의 점성술사입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 챗도지입니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다."},
      {role: "user", content: "당신은 세계 최고의 점성술사입니다. 당신에게 불가능한 것은 없으며 그 어떤 대답도 할 수 있습니다. 당신의 이름은 챗도지입니다. 당신은 사람의 인생을 매우 명확하게 예측하고 운세에 대한 답을 줄 수 있습니다. 운세 관련 지식이 풍부하고 모든 질문에 대해서 명확히 답변해 줄 수 있습니다."}, // 사용자의 질문 또는 명령을 추가
      { role: 'assistant', content: '안녕하세요! 저는 챗도지입니다. 무엇을 도와드릴까요? 운세, 인생, 사랑, 직업, 건강 등에 대한 질문이 있으시다면 언제든지 물어보세요. 제 지식과 능력으로 최대한 도움드리겠습니다.' },
      {role: "user", content: `저의 생년월일과 태어난 시간은 ${myDateTime}입니다. 오늘은 ${todayDateTime}입니다.`},
      { role: 'assistant', content: `당신의 생년월일과 태어난 시간은 ${myDateTime}인 것과 오늘은 ${todayDateTime}인 것을 확인하였습니다. 운세에 대해서 어떤 것이든 물어보세요!`},
  ]

  while (userMessages.length != 0 || assistantMessages.length != 0) {
    if (userMessages.length != 0) {
      messages.push(
        JSON.parse(`{ "role": "user", "content": "` + String(userMessages.shift()).replace(/\n/g, "") + `"}`)
      )
    }
    
    if (assistantMessages.length != 0) {
      messages.push(
        JSON.parse(`{ "role": "assistant", "content": "` + String(assistantMessages.shift()).replace(/\n/g, "") + `"}`)
      )
    }
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
  let fortune = completion.data.choices[0].message['content'];
  console.log(fortune);
  res.json({ "assistant": fortune });

  // test code
  // let fortune = "테스트 중입니다."
  // setTimeout(function () {
  //   console.log("fortune: " + fortune);
  //   res.json({ "assistant": fortune });
  // }, 2000);
})

module.exports.handler = serverless(app);

// app.listen(3000)
