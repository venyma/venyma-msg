const { randomUUID } = require('crypto');

const STORE = {};

function now(){ return Date.now(); }

function createThread(board, text, pw){
  const thread = { _id: randomUUID(), text, delete_password: pw, created_on: now(), bumped_on: now(), reported: false, replies: [] };
  STORE[board] = STORE[board] || [];
  STORE[board].unshift(thread);
  return thread;
}

function listThreads(board){
  STORE[board] = STORE[board] || [];
  return STORE[board].map(t=>({ _id: t._id, text: t.text, replies: t.replies })).slice(0, 100);
}

function findThread(board, id){
  const arr = STORE[board] || [];
  return arr.find(t=>t._id===id) || null;
}

function createReply(board, thread_id, text, pw){
  const thread = findThread(board, thread_id);
  if(!thread) return null;
  const reply = { _id: randomUUID(), text, delete_password: pw, created_on: now(), reported: false };
  thread.replies.push(reply);
  thread.bumped_on = now();
  return reply;
}

function reportThread(board, id){ const t = findThread(board,id); if(!t) return false; t.reported = true; return true; }
function reportReply(board, thread_id, reply_id){ const t=findThread(board,thread_id); if(!t) return false; const r=t.replies.find(x=>x._id===reply_id); if(!r) return false; r.reported=true; return true; }
function deleteThread(board,id,pw){ const arr=STORE[board]||[]; const idx=arr.findIndex(x=>x._id===id); if(idx===-1) return false; if(arr[idx].delete_password!==pw) return false; arr.splice(idx,1); return true; }
function deleteReply(board, thread_id, reply_id, pw){ const t=findThread(board,thread_id); if(!t) return false; const r=t.replies.find(x=>x._id===reply_id); if(!r) return false; if(r.delete_password!==pw) return false; r.text='[deleted]'; return true; }

module.exports = { createThread, listThreads, findThread, createReply, reportThread, reportReply, deleteThread, deleteReply };
