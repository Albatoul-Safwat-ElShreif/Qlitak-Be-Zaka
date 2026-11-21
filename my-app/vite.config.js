import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-data-plugin',
      configureServer(server) {
        // 1. حفظ التجارب
        server.middlewares.use('/api/save-experience', (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const newExp = JSON.parse(body);
                const filePath = path.resolve(process.cwd(), 'src/experiencesData.json');
                const currentData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                currentData.unshift(newExp);
                fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), 'utf-8');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, data: currentData }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
          }
        });

        // 2. حفظ المنح الجديدة
        server.middlewares.use('/api/save-scholarship', (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
              try {
                const newSch = JSON.parse(body);
                const filePath = path.resolve(process.cwd(), 'src/scholarshipsData.json');
                const currentData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                currentData.unshift(newSch);
                fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), 'utf-8');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, data: currentData }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
          }
        });
      }
    }
  ],
})
