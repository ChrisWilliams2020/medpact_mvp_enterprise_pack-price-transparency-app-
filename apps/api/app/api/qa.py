from fastapi import APIRouter, Request, Body
from fastapi.responses import HTMLResponse
import os, json
from redis import Redis

router = APIRouter(prefix="/qa", tags=["qa"])


@router.post('/publish')
def qa_publish(payload: dict = Body(...)):
    try:
        r = Redis.from_url(os.getenv('REDIS_URL', 'redis://redis:6379'))
        r.publish('import_jobs', json.dumps(payload))
        return {"ok": True, "published": payload}
    except Exception as e:
        return {"ok": False, "error": str(e)}


@router.get('/ui', response_class=HTMLResponse)
def qa_ui(request: Request):
    html = '''
    <!doctype html>
    <html>
    <head><meta charset="utf-8"><title>QA — SSE test</title></head>
    <body>
    <h3>QA — SSE test</h3>
    <button id="connect">Connect SSE</button>
    <button id="publish">Publish test event</button>
    <pre id="log"></pre>
    <script>
    let es;
    document.getElementById('connect').onclick = ()=>{
      es = new EventSource('/imports/events');
      es.addEventListener('job', e=>{
        const p = document.getElementById('log');
        p.textContent += '\n' + e.data;
      })
    }
    document.getElementById('publish').onclick = async ()=>{
      const res = await fetch('/qa/publish',{method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify({job_id:'qa-ui', status:'queued'})});
      const j = await res.json();
      document.getElementById('log').textContent += '\npublished: '+JSON.stringify(j);
    }
    </script>
    </body>
    </html>
    '''
    return HTMLResponse(content=html)
