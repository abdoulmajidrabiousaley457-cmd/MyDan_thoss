import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import JSZip from 'jszip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Determine port: command line --port flag takes priority, then process.env.PORT, default 3000
let PORT = 3000;
const portIdx = process.argv.indexOf('--port');
if (portIdx !== -1 && process.argv[portIdx + 1]) {
  PORT = parseInt(process.argv[portIdx + 1], 10);
} else if (process.env.PORT) {
  PORT = parseInt(process.env.PORT, 10);
}

app.use(express.json());

// Initialize GoogleGenAI SDK safely
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('GoogleGenAI initialization warning:', err);
  }
}

// Endpoint for AI Agent (Majid IA & Omni Studio Agent Integration)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, language = 'fr' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstruction = `Tu es Majid IA, l'agent d'Intelligence Artificielle d'élite du Cabinet Rabiou Saley.
Fondateur & Consultant Référent : Abdoul Majid Rabiou Saley (Senior Data Scientist & Concepteur d'Agents IA Autonomes).
- Portfolio Officiel en direct : https://mon-portfolio-fin-ten.vercel.app/
- Agent Hébergé Omni Studio : https://omni-studio-abdoul.ai.studio
- Téléphone & WhatsApp direct : +227 96 49 99 06
- Email : abdoulmajidrabiousaley457@gmail.com
- Localisation : Niamey, Niger / Disponible à 100% en Télétravail International (Full Remote - Fuseaux UTC, CET, EST).
- Expertises clés : Systèmes Multi-Agents (LangGraph, CrewAI, AutoGen), RAG vectoriel, Modélisation prédictive & Machine Learning (XGBoost, Scikit-Learn), Computer Vision, FastAPI, Docker, MLOps.

DIRECTIVE ESSENTIELLE : L'utilisateur a expressément demandé que l'agent "réponde à tout".
Tu dois donc répondre avec rigueur, intelligence et bienveillance à TOUTES les questions posées par l'utilisateur :
1. Questions techniques (programmation Python, TypeScript, React, SQL, architectures IA, LLMs, algorithmes).
2. Questions sur le Cabinet Rabiou Saley, son portfolio en direct (https://mon-portfolio-fin-ten.vercel.app/), ses prestations en télétravail et ses devis.
3. Questions générales de culture, de mathématiques, de carrière, de conseil ou d'analyse.
Réponds dans la langue demandée par l'utilisateur (Langue active: ${language === 'ar' ? 'Arabe' : language === 'en' ? 'Anglais' : 'Français'}). Formate tes réponses avec un style soigné, clair et professionnel en Markdown.`;

    if (ai) {
      try {
        const contents: any[] = [];
        if (Array.isArray(history) && history.length > 0) {
          for (const h of history.slice(-6)) {
            contents.push({
              role: h.sender === 'user' ? 'user' : 'model',
              parts: [{ text: h.text }],
            });
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI generation timeout')), 8000)
        );

        const response: any = await Promise.race([
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
              systemInstruction,
            },
          }),
          timeoutPromise
        ]);

        const replyText = response.text || "Je suis à votre écoute pour toute question relative au cabinet, au code ou à l'intelligence artificielle.";
        return res.json({ reply: replyText });
      } catch (genError: any) {
        console.warn('Gemini generation error, utilizing fallback:', genError?.message || genError);
      }
    }

    // Graceful fallback response when key is unset, quota is reached, or network issue
    const lower = message.toLowerCase();
    let fallbackReply = `Bonjour ! Je suis Majid IA, l'assistant officiel du Cabinet Rabiou Saley.\n\n`;

    if (lower.includes('portfolio') || lower.includes('projet') || lower.includes('lien')) {
      fallbackReply += `Vous pouvez explorer le **Portfolio Officiel en direct** de Rabiou Saley à cette adresse : [https://mon-portfolio-fin-ten.vercel.app/](https://mon-portfolio-fin-ten.vercel.app/)\n\nVous y découvrirez l'ensemble des projets d'agents IA autonomes, démonstrations interactives et réalisations en télétravail international.`;
    } else if (lower.includes('agent') || lower.includes('omni')) {
      fallbackReply += `Mon agent IA hébergé est également accessible sur Omni Studio : [https://omni-studio-abdoul.ai.studio](https://omni-studio-abdoul.ai.studio). N'hésitez pas à vous y connecter !`;
    } else if (lower.includes('contact') || lower.includes('whatsapp') || lower.includes('téléphone') || lower.includes('devis')) {
      fallbackReply += `Pour toute mission ou devis, vous pouvez contacter directement Rabiou Saley par WhatsApp au **+227 96 49 99 06** ou par email à **abdoulmajidrabiousaley457@gmail.com**. Le cabinet est disponible immédiatement en Full Remote.`;
    } else {
      fallbackReply += `Concernant votre demande : *" ${message} "*\n\nLe Cabinet Rabiou Saley et notre agent Omni Studio (https://omni-studio-abdoul.ai.studio) sont pleinement opérationnels. Nous accompagnons les entreprises dans la création de systèmes d'agents autonomes, de pipelines Data Science et de solutions cloud sur mesure.\n\nN'hésitez pas à consulter notre portfolio en direct sur [https://mon-portfolio-fin-ten.vercel.app/](https://mon-portfolio-fin-ten.vercel.app/) ou à nous contacter sur WhatsApp au **+227 96 49 99 06** !`;
    }

    return res.json({ reply: fallbackReply });
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    return res.status(500).json({ error: 'Erreur lors du traitement de la requête IA.' });
  }
});

// Endpoint to download the entire application as a clean ZIP file using JSZip
app.get('/api/download-zip', async (req, res) => {
  try {
    const zip = new JSZip();
    const projectRoot = __dirname;

    const ignoreList = new Set([
      'node_modules',
      '.git',
      'dist',
      'dev-dist',
      '.cache',
      'my-danthoss-app.zip',
    ]);

    function addDirToZip(currentDir: string, zipFolder: JSZip) {
      const items = fs.readdirSync(currentDir);
      for (const item of items) {
        if (ignoreList.has(item)) continue;
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          const subFolder = zipFolder.folder(item);
          if (subFolder) {
            addDirToZip(fullPath, subFolder);
          }
        } else if (stat.isFile()) {
          const content = fs.readFileSync(fullPath);
          zipFolder.file(item, content);
        }
      }
    }

    addDirToZip(projectRoot, zip);

    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="my-danthoss-app.zip"');
    res.setHeader('Content-Length', zipBuffer.length.toString());
    res.send(zipBuffer);
  } catch (err) {
    console.error('ZIP generation error:', err);
    res.status(500).send('Erreur lors de la génération de l\'archive ZIP.');
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    // In Express 5 / modern router, use middleware fallback instead of app.get('*')
    app.use((req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
