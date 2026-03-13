import React from 'react'

export default function DebugPublishButton(){
  const onClick = async () => {
    try{
      const resp = await fetch('/imports/debug-publish', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({job_id:'ui-debug', status:'queued'})})
      const j = await resp.json()
      alert('published: ' + JSON.stringify(j))
    }catch(e){
      alert('publish failed: '+e.message)
    }
  }
  return (<button onClick={onClick} className="px-3 py-1 bg-yellow-400 text-black rounded">Publish test event</button>)
}
