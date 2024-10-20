from fastapi import FastAPI, Request, Depends
from .route import router  # 直接导入 router 对象
from fastapi.middleware.cors import CORSMiddleware


class InitApi:
    def __init__(self):
        self.apiApp = FastAPI()
        # 添加从 route.py 导入的路由
        self.apiApp.include_router(router)
        # 添加 CORS 中间件
        self.apiApp.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],  # 允许所有来源，或者你可以指定特定的源 ['http://example.com']
            allow_credentials=True,  # 允许携带认证信息（如 Cookies）
            allow_methods=["*"],  # 允许所有 HTTP 方法，或指定 ['GET', 'POST', 'PUT', 'DELETE']
            allow_headers=["*"],  # 允许所有 HTTP 头信息，或指定 ['Authorization', 'Content-Type']
        )
