import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolveTurn} from './lib/battle';
export default defineConfig({plugins:[react(),{name:'node-battle-api',configureServer(server){server.middlewares.use('/api/battle',async(req,res)=>{res.setHeader('Content-Type','application/json; charset=utf-8');if(req.method!=='POST'){res.statusCode=405;res.end(JSON.stringify({error:'POST required'}));return;}try{let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>4096)throw new Error('요청이 너무 큽니다.');}const {state,action}=JSON.parse(raw);res.end(JSON.stringify(resolveTurn(state,action)));}catch(e){res.statusCode=400;res.end(JSON.stringify({error:e instanceof Error?e.message:'Invalid request'}));}});}}],server:{host:'127.0.0.1',port:5174,strictPort:true}});
