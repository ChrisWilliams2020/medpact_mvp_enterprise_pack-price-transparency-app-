from fastapi import APIRouter, HTTPException
from ..db import list_todos, create_todo, update_todo, delete_todo

router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("")
def get_todos():
    return list_todos()


@router.post("")
def post_todo(payload: dict):
    text = payload.get('text')
    if not text:
        raise HTTPException(status_code=400, detail='text is required')
    return create_todo(text)


@router.patch('/{todo_id}')
def patch_todo(todo_id: int, payload: dict):
    fields = {}
    if 'text' in payload:
        fields['text'] = payload['text']
    if 'done' in payload:
        fields['done'] = bool(payload['done'])
    if not fields:
        raise HTTPException(status_code=400, detail='no fields to update')
    res = update_todo(todo_id, **fields)
    if res is None:
        raise HTTPException(status_code=404, detail='not found')
    return res


@router.delete('/{todo_id}')
def del_todo(todo_id: int):
    delete_todo(todo_id)
    return {'deleted': True}
