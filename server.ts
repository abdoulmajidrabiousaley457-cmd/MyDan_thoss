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

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Ensure persistent Client Vault uploads directory
const VAULT_STORAGE_DIR = path.resolve(__dirname, 'uploads', 'vault');
if (!fs.existsSync(VAULT_STORAGE_DIR)) {
  fs.mkdirSync(VAULT_STORAGE_DIR, { recursive: true });
}

// ========================
// CLIENT VAULT STORAGE API
// ========================

// 1. Upload file to local server storage
app.post('/api/vault/upload', (req, res) => {
  try {
    const { userId, fileId, fileName, fileType, dataBase64 } = req.body;

    if (!userId || !fileId || !fileName || !dataBase64) {
      return res.status(400).json({ error: 'Champs requis manquants pour le téléversement.' });
    }

    const safeUserId = String(userId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFileId = String(fileId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFileName = path.basename(String(fileName));

    const userVaultDir = path.join(VAULT_STORAGE_DIR, safeUserId, safeFileId);
    if (!fs.existsSync(userVaultDir)) {
      fs.mkdirSync(userVaultDir, { recursive: true });
    }

    // Extract base64 payload if it includes data URL header (e.g. data:image/png;base64,...)
    const base64Index = dataBase64.indexOf(';base64,');
    const cleanBase64 = base64Index !== -1 ? dataBase64.substring(base64Index + 8) : dataBase64;
    const fileBuffer = Buffer.from(cleanBase64, 'base64');

    const filePath = path.join(userVaultDir, safeFileName);
    fs.writeFileSync(filePath, fileBuffer);

    // Write metadata for audit and reliability
    const metaPath = path.join(userVaultDir, 'metadata.json');
    fs.writeFileSync(metaPath, JSON.stringify({
      userId: safeUserId,
      fileId: safeFileId,
      fileName: safeFileName,
      fileType: fileType || 'application/octet-stream',
      size: fileBuffer.length,
      uploadedAt: new Date().toISOString()
    }, null, 2));

    const fileUrl = `/api/vault/files/${safeUserId}/${safeFileId}/${encodeURIComponent(safeFileName)}`;

    return res.json({
      success: true,
      fileId: safeFileId,
      fileName: safeFileName,
      size: fileBuffer.length,
      fileUrl
    });
  } catch (err: any) {
    console.error('Server vault upload error:', err);
    return res.status(500).json({ error: 'Erreur serveur lors de la sauvegarde du fichier.' });
  }
});

// Helper to generate certified deliverable files on the fly for seamless downloads
async function generateCertifiedBuffer(fileName: string, clientName = 'Client Général'): Promise<{ buffer: Buffer; contentType: string }> {
  const ext = path.extname(fileName).toLowerCase();

  if (ext === '.zip') {
    const zip = new JSZip();
    zip.file('README.md', `# ${fileName}\n\nLivrable certifié du Cabinet Rabiou Saley.\nClient : ${clientName}\nExpert Référent : Abdoul Majid Rabiou Saley\nWhatsApp : +227 96 49 99 06\nPortfolio : https://mon-portfolio-fin-ten.vercel.app/`);
    zip.file('main.py', `"""\nPipeline d'Agents IA Autonomes & MLOps\nCabinet Rabiou Saley\n"""\nimport sys\n\ndef main():\n    print("Pipeline IA & Agents Autonomes initialisé avec succès.")\n\nif __name__ == '__main__':\n    main()\n`);
    zip.file('docker-compose.yml', `version: '3.8'\nservices:\n  ia-agent:\n    image: python:3.11-slim\n    restart: always\n    environment:\n      - ENV=production\n`);
    zip.file('requirements.txt', `fastapi>=0.110.0\nuvicorn>=0.28.0\nlangchain>=0.1.12\nlanggraph>=0.0.30\npydantic>=2.6.4\n`);
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
    return { buffer: zipBuffer, contentType: 'application/zip' };
  }

  if (ext === '.txt' || ext === '.csv' || ext === '.json') {
    const textData = `=====================================================
DANTHOSS - LIVRABLE DU CABINET RABIOU SALEY
DOCUMENT : ${fileName}
DESTINATAIRE : ${clientName}
DATE DE CERTIFICATION : ${new Date().toISOString()}
=====================================================
Expert Référent : Abdoul Majid Rabiou Saley
Senior Data Scientist & Architecte Solutions IA
WhatsApp : +227 96 49 99 06 | Email : abdoulmajidrabiousaley457@gmail.com
Portfolio : https://mon-portfolio-fin-ten.vercel.app/
=====================================================`;
    return { buffer: Buffer.from(textData, 'utf-8'), contentType: ext === '.json' ? 'application/json' : 'text/plain; charset=utf-8' };
  }

  // Standard valid PDF buffer (RFC compliant minimal PDF 1.4)
  const safeTitle = fileName.replace(/[()]/g, '');
  const pdfString = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 380 >> stream
BT
/F1 18 Tf
50 720 Td
(CABINET RABIOU SALEY - LIVRABLE OFFICIEL) Tj
/F1 12 Tf
0 -35 Td
(Fichier Certifie : ${safeTitle}) Tj
0 -24 Td
(Destinataire : ${clientName.replace(/[()]/g, '')}) Tj
0 -24 Td
(Date d'emission : ${new Date().toLocaleDateString('fr-FR')}) Tj
0 -28 Td
(Consultant : Abdoul Majid Rabiou Saley - Senior Data Scientist) Tj
0 -20 Td
(WhatsApp : +227 96 49 99 06 | Email : abdoulmajidrabiousaley457@gmail.com) Tj
0 -20 Td
(Portfolio : https://mon-portfolio-fin-ten.vercel.app/) Tj
ET
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000675 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
753
%%EOF`;
  return { buffer: Buffer.from(pdfString, 'binary'), contentType: 'application/pdf' };
}

// 2. Download / stream file from local server storage (with automatic fallback generation)
const handleVaultDownload = async (req: express.Request, res: express.Response) => {
  try {
    const safeUserId = String(req.params.userId || 'general').replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFileId = String(req.params.fileId || 'file').replace(/[^a-zA-Z0-9_-]/g, '_');
    const userVaultDir = path.join(VAULT_STORAGE_DIR, safeUserId, safeFileId);

    let targetFileName = req.params.filename ? decodeURIComponent(req.params.filename) : 'livrable_securise.pdf';

    // If directory exists, check for stored file
    if (fs.existsSync(userVaultDir)) {
      const filesInDir = fs.readdirSync(userVaultDir).filter(f => f !== 'metadata.json');
      if (filesInDir.length > 0) {
        if (!req.params.filename) {
          targetFileName = filesInDir[0];
        } else {
          const match = filesInDir.find(f => f.toLowerCase() === targetFileName.toLowerCase()) || filesInDir[0];
          targetFileName = match;
        }
        const filePath = path.join(userVaultDir, targetFileName);
        if (fs.existsSync(filePath)) {
          const ext = path.extname(targetFileName).toLowerCase();
          const mimeTypes: Record<string, string> = {
            '.pdf': 'application/pdf',
            '.zip': 'application/zip',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.webp': 'image/webp',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.txt': 'text/plain; charset=utf-8',
            '.csv': 'text/csv; charset=utf-8',
            '.json': 'application/json',
            '.py': 'text/x-python; charset=utf-8',
            '.ts': 'text/plain; charset=utf-8',
            '.js': 'text/javascript; charset=utf-8',
          };
          const contentType = mimeTypes[ext] || 'application/octet-stream';
          const stat = fs.statSync(filePath);

          res.setHeader('Content-Type', contentType);
          res.setHeader('Content-Length', stat.size);
          res.setHeader('Access-Control-Allow-Origin', '*');

          const safeAsciiName = targetFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
          const encodedUtf8Name = encodeURIComponent(targetFileName);
          const isPreview = req.query.preview === '1';

          if (!isPreview) {
            res.setHeader('Content-Disposition', `attachment; filename="${safeAsciiName}"; filename*=UTF-8''${encodedUtf8Name}`);
          } else {
            res.setHeader('Content-Disposition', `inline; filename="${safeAsciiName}"; filename*=UTF-8''${encodedUtf8Name}`);
          }

          const fileStream = fs.createReadStream(filePath);
          return fileStream.pipe(res);
        }
      }
    }

    // Dynamic generation if not found on disk (e.g., sample file or pre-synced file)
    if (!fs.existsSync(userVaultDir)) {
      fs.mkdirSync(userVaultDir, { recursive: true });
    }

    const { buffer, contentType } = await generateCertifiedBuffer(targetFileName);
    const savePath = path.join(userVaultDir, targetFileName);
    try {
      fs.writeFileSync(savePath, buffer);
    } catch {}

    const safeAsciiName = targetFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const encodedUtf8Name = encodeURIComponent(targetFileName);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Disposition', `attachment; filename="${safeAsciiName}"; filename*=UTF-8''${encodedUtf8Name}`);
    return res.end(buffer);
  } catch (err: any) {
    console.error('Server vault download error:', err);
    return res.status(500).json({ error: 'Erreur lors de la récupération du fichier.' });
  }
};

app.get('/api/vault/files/:userId/:fileId', handleVaultDownload);
app.get('/api/vault/files/:userId/:fileId/:filename', handleVaultDownload);

// 3. Delete file from local server storage
app.delete('/api/vault/files/:userId/:fileId', (req, res) => {
  try {
    const safeUserId = String(req.params.userId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFileId = String(req.params.fileId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const userVaultDir = path.join(VAULT_STORAGE_DIR, safeUserId, safeFileId);

    if (fs.existsSync(userVaultDir)) {
      fs.rmSync(userVaultDir, { recursive: true, force: true });
    }

    return res.json({ success: true, message: 'Fichier supprimé du stockage serveur.' });
  } catch (err: any) {
    console.error('Server vault delete error:', err);
    return res.status(500).json({ error: 'Erreur lors de la suppression.' });
  }
});

// 4. Health check for Client Vault
app.get('/api/vault/health', (_req, res) => {
  res.json({
    status: 'ok',
    storage: 'ready',
    timestamp: new Date().toISOString()
  });
});

// 5. Admin overview endpoint: lists all user file directories stored on server
app.get('/api/vault/admin/overview', (_req, res) => {
  try {
    if (!fs.existsSync(VAULT_STORAGE_DIR)) {
      return res.json({ users: [], totalFiles: 0, totalBytes: 0 });
    }

    const userDirs = fs.readdirSync(VAULT_STORAGE_DIR);
    const usersData: Array<{ userId: string; filesCount: number; files: any[] }> = [];
    let grandTotalFiles = 0;
    let grandTotalBytes = 0;

    for (const userId of userDirs) {
      const userDirPath = path.join(VAULT_STORAGE_DIR, userId);
      if (!fs.statSync(userDirPath).isDirectory()) continue;

      const fileDirs = fs.readdirSync(userDirPath);
      const userFiles: any[] = [];

      for (const fileId of fileDirs) {
        const fileDirPath = path.join(userDirPath, fileId);
        if (!fs.statSync(fileDirPath).isDirectory()) continue;

        const metaPath = path.join(fileDirPath, 'metadata.json');
        if (fs.existsSync(metaPath)) {
          try {
            const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
            userFiles.push(meta);
            grandTotalBytes += (meta.size || 0);
          } catch {
            // ignore
          }
        }
      }

      grandTotalFiles += userFiles.length;
      usersData.push({
        userId,
        filesCount: userFiles.length,
        files: userFiles
      });
    }

    return res.json({
      users: usersData,
      totalFiles: grandTotalFiles,
      totalBytes: grandTotalBytes
    });
  } catch (err: any) {
    console.error('Admin overview error:', err);
    return res.status(500).json({ error: 'Erreur lors de la lecture des données administrateur.' });
  }
});

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

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
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
