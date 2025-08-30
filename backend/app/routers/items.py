from fastapi import APIRouter, Depends
from typing import Annotated
from ..models.user import User
from ..auth.dependencies import get_current_active_user

router = APIRouter(prefix="/items", tags=["items"])

@router.get("/")
async def read_own_items(
    current_user: Annotated[User, Depends(get_current_active_user)],
):
    return [{"item_id": "Foo", "owner": current_user.username}]