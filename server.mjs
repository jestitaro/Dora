import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { Configuration, OpenAIApi } from 'openai';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno desde el archivo .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configura tu API key de OpenAI desde las variables de entorno
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Se obtiene la clave desde las variables de entorno
});
const openai = new OpenAIApi(configuration);

// Configurar CORS
app.use(cors({
    origin: 'https://tu-dominio-quartzsales.com', // Reemplaza con tu dominio real
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4', // Asegúrate de usar un modelo válido como 'gpt-4' o 'gpt-3.5-turbo'
      messages: [
        {
          role: 'system',
          content: 'Eres Dora, la asistente experta de QuartzSales que creará captions atractivos para Instagram y LinkedIn. Solicita al usuario la red social y el mensaje sobre el que desea trabajar. Adapta el caption según la plataforma: profesional y breve para LinkedIn de hasta 300 caracteres, dinámico y visual para Instagram de hasta 1000 caracteres, incluye hashtags sugeridos.',
        },
        { role: 'user', content: userMessage },
      ],
    });

    const assistantReply = response.data.choices[0].message.content.trim();
    res.json({ reply: assistantReply });
  } catch (error) {
    console.error('Error al llamar a la API de OpenAI:', error.response?.data || error.message);
    res.status(500).json({ reply: 'Lo siento, soy más corta que cortina y no puedo procesar tu solicitud.' });
  }
});

// Usar el puerto asignado por Vercel
const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor iniciado en puerto ${port}`);
});
