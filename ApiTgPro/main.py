# main.py
import asyncio
import datetime
import random
import time
from models.member import MemberModel
from tgbot.initaiogram import send_message_to_group
from tgbot.initbot import InitBot
import uvicorn
from api.initApi import InitApi
import multiprocessing
from apscheduler.schedulers.asyncio import AsyncIOScheduler


async def start_auto_sendMsg():
    member_model = MemberModel()
    member_model.set_collection_name("settings")
    findsetting = member_model.find_member({})
    member_model.set_collection_name("channel_messages")
    chanelLists = member_model.find_first_documents_by_media_group_id()
    newslistlen = len(chanelLists)
    if newslistlen <= 0 or not findsetting.get("channelId"):
        return
    if not findsetting.get("taskrule"):
        ctype = 1
    else:
        ctype = findsetting.get("taskrule")

    if ctype == 1:
        random_number = random.randint(0, newslistlen)
        presendmsg = chanelLists[random_number]
        media_group_id = presendmsg.get("media_group_id")
        channalnews = member_model.find_members({"media_group_id": media_group_id})
        if not media_group_id or not channalnews:
            return
    else:
        channalnews = member_model.find_min_autosendtimes()

    combined_message = ''
    combined_photos = []
    combined_videos = []
    for item in channalnews:
        if isinstance(item, dict):  # 确保 item 是字典
            # 合并文本内容
            if item.get("message"):
                combined_message += item["message"] + "\n"
            # 合并照片
            photos = item.get("photo", [])
            if len(photos) > 0:
                combined_photos.append(photos[0])
            videos = item.get("video", [])
            if len(videos) > 0:
                combined_videos.append(videos[0])
    # 准备发送的消息数据
    message_data = {
        'message': combined_message.strip(),
        'photo': combined_photos,
        'video': combined_videos[0] if combined_videos else None
    }
    if findsetting.get("ctype") == 1:
        await send_message_to_group(findsetting.get("groupId"), message_data)
    else:
        await send_message_to_group(findsetting.get("channelId"), message_data)

    update_data = {
        "sta": 1,  # 标记为已发送
        "last_send_time": datetime.datetime.now(),
        "sendtimes": channalnews[0]["sendtimes"] + 1,
        "autosendtimes": channalnews[0]["autosendtimes"] + 1
    }
    member_model.update_members(
        query={"media_group_id": media_group_id},
        update_data=update_data
    )

def get_schedule_time_from_db():
    member_model = MemberModel()
    member_model.set_collection_name("settings")
    findsetting = member_model.find_member({})

    if not findsetting or findsetting.get("findsetting") == 0:
        if findsetting.get("tastrule"):
            return 21, 30, 25, findsetting.get("taskrule")  # 返回默认时间
        return 21, 30, 25, 1  # 默认时间和默认 taskrule

    tasktime = findsetting.get("tasktime", "21:30:25")  # 设置默认为 "21:30:25"
    hour, minute, second = map(int, tasktime.split(':'))
    return hour, minute, second, findsetting.get("taskrule")


# 更新任务时间
def update_job(scheduler, job_id):
    hour, minute, second, ctype = get_schedule_time_from_db()  # 从数据库提取时间
    # 检查是否都是默认值
    if hour == 21 and minute == 30 and second == 25:
        return
    scheduler.reschedule_job(job_id, trigger='cron', hour=hour, minute=minute, second=second)


# 任务进程
def run_task_process():
    scheduler = AsyncIOScheduler()
    scheduler.start()
    job = scheduler.add_job(start_auto_sendMsg, 'cron', id='print_job',
                            hour='21', minute='30', second='25')
    try:
        while True:
            update_job(scheduler, job.id)
            time.sleep(60)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()


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
    # 启动任务进程
    task_process = multiprocessing.Process(target=run_task_process)
    task_process.start()

    telegram_task = asyncio.create_task(run_telegram_bot())
    asyncio.run(telegram_task)


if __name__ == '__main__':
    main()  # 启动主函数
