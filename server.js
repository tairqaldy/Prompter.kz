// server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Разрешенные источники для CORS
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

// Настройка CORS
app.use(cors({
  origin: function(origin, callback){
    // Разрешить запросы без Origin (например, серверные запросы)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Маршрут для генерации идеального промпта
app.post('/generate-prompt', async (req, res) => {
  const userData = req.body;

  console.log('Получены данные для генерации промпта:', userData);

  // Проверка наличия данных
  if (!userData || Object.keys(userData).length === 0) {
    console.error('Данные не предоставлены.');
    return res.status(400).json({ error: 'Данные не предоставлены.' });
  }

  // Формирование идеального промпта согласно стандартам Prompt Engineering
  const promptMessage = `
    Ты — опытный специалист по созданию промптов для ChatGPT. На основе предоставленной информации сформируй максимально эффективный промпт, который пользователь сможет отправить в ChatGPT для получения наилучшего результата.

    Информация:
    Цель: ${userData.Цель}
    Тема: ${userData.Тема}
    Аудитория: ${userData.Аудитория}
    Стиль: ${userData.Стиль}
    Формат: ${userData.Формат}
    Ключевые слова: ${userData.Ключевые_слова}
    Ограничения: ${userData.Ограничения}
    Цитаты: ${userData.Цитаты}
    Визуальные Элементы: ${userData.Визуальные_Элементы}
    Ссылки: ${userData.Ссылки}
    Дополнительные Инструкции: ${userData.Дополнительные_Инструкции}

    Сформируй промпт, который включает все эти аспекты, структурированный для ChatGPT, с чёткими указаниями и необходимыми деталями.
    Если тебе не предоставли никакой информации напиши что человеку нужно рассписать подребрнее и что он хочет получить в результате.
  `;

  console.log('Отправляем запрос к OpenAI API:', promptMessage);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // Измените на 'gpt-4', если ваш API ключ поддерживает
        messages: [{ role: 'user', content: promptMessage }],
        max_tokens: 500, // Можно увеличить при необходимости
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    console.log('Ответ от OpenAI API:', response.data);

    const generatedPrompt = response.data.choices[0].message.content.trim();
    res.json({ prompt: generatedPrompt });
  } catch (error) {
    console.error('Ошибка при обращении к OpenAI API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Не удалось сгенерировать промпт' });
  }
});