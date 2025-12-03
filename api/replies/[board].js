const store = require('./_store');

export default async function handler(req, res){
  const { board } = req.query;
  let body = {};
  if(req.method !== 'GET'){
    const raw = await new Promise(r=>{let d=''; req.on('data',c=>d+=c); req.on('end',()=>r(d));});
    body = Object.fromEntries(new URLSearchParams(raw));
  }

  if(req.method === 'POST'){
    const { thread_id, text, delete_password } = body;
    if(!thread_id || !text || !delete_password) return res.status(400).json({ error:'missing' });
    const reply = store.createReply(board, thread_id, text, delete_password);
    if(!reply) return res.status(404).json({ error:'thread not found' });
    return res.status(200).json({ message:'reply created', reply });
  }

  if(req.method === 'PUT'){
    const { thread_id, reply_id } = body;
    if(!thread_id || !reply_id) return res.status(400).json({ error:'missing' });
    const ok = store.reportReply(board, thread_id, reply_id);
    return res.status(200).json({ success: !!ok });
  }

  if(req.method === 'DELETE'){
    const { thread_id, reply_id, delete_password } = body;
    if(!thread_id || !reply_id || !delete_password) return res.status(400).json({ error:'missing' });
    const ok = store.deleteReply(board, thread_id, reply_id, delete_password);
    if(!ok) return res.status(403).json({ success:false });
    return res.status(200).json({ success:true });
  }

  return res.status(405).json({ error:'method not allowed' });
}
