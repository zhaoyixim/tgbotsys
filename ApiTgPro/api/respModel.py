import json
from pydantic import BaseModel
from typing import Any, Optional


# 统一返回格式的 Result 类
class Result(BaseModel):
    code: int
    success: bool
    msg: str
    data: Optional[Any] = None


# 读取 menu.json 文件
def read_menu_json():
    try:
        # 假设 menu.json 文件在当前目录下
        with open("api/menu.json", "r", encoding="utf-8") as file:
            data = json.load(file)
        return data
    except FileNotFoundError:
        return {"error": "menu.json file not found"}
    except json.JSONDecodeError:
        return {"error": "Failed to decode JSON"}

