const store = require('./_store');

export default async function handler(req, res){
  const { board } = req.query;
  let body = {};
  if(req.method !== 'GET'){
    const raw = await new Promise(r=>{let d=''; req.on('data',c=>d+=c); req.on('end',()=>r(d));});
    body = Object.fromEntries(new URLSearchParams(raw));
  }

  if(req.method === 'POST'){
    const { text, delete_password } = body;
    if(!text || !delete_password) return res.status(400).json({ error:'missing' });
    const t = store.createThread(board, text, delete_password);
    return res.status(200).json({ message:'created', thread: t });
  }

  if(req.method === 'GET'){
    const threads = store.listThreads(board);
    return res.status(200).json(threads);
  }

  if(req.method === 'PUT'){
    const { thread_id } = body;
    if(!thread_id) return res.status(400).json({ error:'missing thread_id' });
    const ok = store.reportThread(board, thread_id);
    return res.status(200).json({ success: !!ok });
  }

  if(req.method === 'DELETE'){
    const { thread_id, delete_password } = body;
    if(!thread_id || !delete_password) return res.status(400).json({ error:'missing' });
    const ok = store.deleteThread(board, thread_id, delete_password);
    if(!ok) return res.status(403).json({ success:false });
    return res.status(200).json({ success:true });
  }

  return res.status(405).json({ error:'method not allowed' });
}
