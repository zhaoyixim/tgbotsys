# main.py
import asyncio
from concurrent.futures import ThreadPoolExecutor

import config
from tgbot.initbot import InitBot
import uvicorn
from api.initApi import InitApi
import multiprocessing


# FastAPI 运行部分
async def fastapi_app():
    api = InitApi()  # 初始化 InitApi 类
    apiConfig = uvicorn.Config(app=api.apiApp, host="0.0.0.0", port=8088)  # 使用封装的 FastAPI 实例
    apiServer = uvicorn.Server(apiConfig)
    await apiServer.serve()


# FastAPI 运行部分
def run_fastapi():
    asyncio.run(fastapi_app())  # 在新事件循环中运行 FastAPI 应用


# Telegram Bot 运行部分
def run_telegram_bot():
    bot = InitBot()  # 初始化并设置 Telegram 机器人
    bot.run()  # 启动 Telegram 机器人（异步方式）


def main():
    fastapi_process = multiprocessing.Process(target=run_fastapi)
    fastapi_process.start()
    telegram_task = asyncio.create_task(run_telegram_bot())
    asyncio.run(telegram_task)

if __name__ == '__main__':
    main()  # 启动主函数
