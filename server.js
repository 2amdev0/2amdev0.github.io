const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch'); // Для работы с Telegram API
const app = express();
const PORT = 3000;

// Middleware для обработки JSON
app.use(express.json());

// Настройки Telegram
const BOT_TOKEN = '7832604102:AAGiATy8sMstAiEjRCaTVM2o0ei3EIQx4nM';
const CHANNEL_ID = '@wbmo1nstar';

// Эндпоинт для получения данных
app.post('/submit', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.json({ success: false, error: 'Username is required' });
    }

    try {
        // Проверяем подписку на канал через Telegram API
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${CHANNEL_ID}&user_id=${username}`;
        const telegramResponse = await fetch(url);
        const data = await telegramResponse.json();

        if (!data || data.status !== 'member') {
            return res.json({ success: false, error: 'User is not subscribed to the channel' });
        }

        // Сохраняем в файл
        const contestEntry = `Конкурс: Название_конкурса, Пользователь: ${username}\n`;
        fs.appendFileSync('config.txt', contestEntry);

        return res.json({ success: true });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, error: 'Something went wrong' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
