import logging
from uuid import uuid4
from datetime import datetime
from telegram import Update, InlineQueryResultArticle, InputTextMessageContent, InputMediaPhoto, InputMediaVideo, \
    InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import CommandHandler, ContextTypes, ApplicationBuilder, MessageHandler, filters, InlineQueryHandler
import config
from models.member import MemberModel

bot_api_token = config.bot_token
member_model = MemberModel()
app = ApplicationBuilder().token(bot_api_token).build()


async def send_message(chat_id: str, text: str, parse_mode=None):
    try:
        await app.bot.send_message(chat_id=chat_id, text=text, parse_mode=parse_mode)
        logging.info(f"消息已发送到 {chat_id}: {text}")
    except Exception as e:
        logging.error(f"发送消息到 {chat_id} 失败: {e}")


def prepare_media(message_data):
    media = []
    # 处理照片
    if isinstance(message_data.get("photo"), list):  # 确保是列表
        for index, photo in enumerate(message_data['photo']):
            if isinstance(photo, str):  # 确保 photo 是字符串
                if index == 0:
                    # 第一张照片附带标题
                    media.append(InputMediaPhoto(media=photo, caption=message_data.get("message", "")))
                else:
                    media.append(InputMediaPhoto(media=photo))

    # 处理视频
    video_file_id = message_data.get("video")
    if video_file_id:  # 确保 video_file_id 存在
        media.append(InputMediaVideo(media=video_file_id))
    return media



async def send_message_to_group(group_id,message_data):
    try:
        # 检查是否有文本消息
        if message_data.get("photo") or message_data.get("video"):
            media = prepare_media(message_data)
            print(media)
            await app.bot.send_media_group(chat_id=group_id, media=media)
        elif message_data.get("message"):
            # 如果有文本消息，发送文本消息
            await app.bot.send_message(chat_id=group_id, text=message_data["message"])
        # 检查是否有媒体


    except Exception as e:
        logging.error(f"消息发送失败: {e}")
async def send_text_to_group(group_id, message_data):
    try:
        # 检查是否有文本消息
        if message_data.get("message"):
            # 如果有文本消息，发送文本消息
            await app.bot.send_message(chat_id=group_id, text=message_data["message"])
    except Exception as e:
        logging.error(f"消息发送失败: {e}")





def extract_message_data(message):
    return {
        "channel_id": message.chat.id,
        "channel_name": message.chat.title,
        "message_id": message.message_id,
        "media_group_id": message.media_group_id,
        "message": message.caption or message.text,
        "timestamp": message.date.timestamp(),
        "sta": 0,
        "sendtimes": 0,
        "photo": [photo.file_id for photo in message.photo] if message.photo else [],
        "video": extract_video_data(message.video) if message.video else None
    }


def extract_video_data(video):
    return {
        "file_id": video.file_id,
        "file_unique_id": video.file_unique_id,
        "file_size": video.file_size,
        "width": video.width,
        "height": video.height,
        "duration": video.duration
    }
