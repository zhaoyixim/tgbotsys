import datetime
import logging
from uuid import uuid4
from telegram import Update, InlineQueryResultArticle, InputTextMessageContent, InputMediaPhoto, InputMediaVideo, \
    InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import CommandHandler, ContextTypes, ApplicationBuilder, MessageHandler, filters, InlineQueryHandler
import config
from mongodb.db import DbHelper

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)


class InitBot:
    def __init__(self):
        self.bot_api_token = config.bot_token
        self.db = DbHelper(db_name="telegrambot_db")  # 使用数据库
        self.userId = None
        self.batch_data = []
        self.app = ApplicationBuilder().token(self.bot_api_token).build()
        # 设置群组 ID
        self.group_id = -123456789  # 替换为目标群组 ID

        start_handler = CommandHandler('start', self.start)
        self.app.add_handler(start_handler)
        # #  开启内联模式
        # self.inline_caps_handler = InlineQueryHandler(self.inline_caps)
        # self.app.add_handler(self.inline_caps_handler)
        # 处理群组成员消息
        self.app.add_handler(MessageHandler(filters.ChatType.GROUPS, self.handle_group_message))

        # 处理所有文本消息
        self.message_handler = MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_message)
        self.app.add_handler(self.message_handler)

        # 获取频道信息
        self.app.add_handler(MessageHandler(filters.ChatType.CHANNEL, self.handle_channel_post))

        # Other handlers -- deal unkonwn model
        # self.unknown_handler = MessageHandler((~filters.COMMAND), self.unknown)
        # self.app.add_handler(self.unknown_handler)
        self.app.run_polling(allowed_updates=Update.ALL_TYPES)

    async def handle_channel_post(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        message = update.channel_post
        print(message)
        if message and message.text:  # 直接访问 message.text
            message_text = message.caption if message.caption else message.text
            timestamp = message.date.isoformat()  # 获取消息的时间戳
            media_group_id = message.media_group_id if message.media_group_id else None
            # 构造 JSON 数据
            channel_info = {
                "channel_id": message.chat.id,
                "channel_name": message.chat.title,
                "message_id": message.message_id,
                "media_group_id": message.media_group_id if message.media_group_id else None,
                "message": message.caption if message.caption else message_text,  # 包含文本或说明
                "timestamp": message.date.timestamp(),
                "sta": 0,  # 0 未发送
                "sendtimes": 0,  # 发送次数
                "photo": [photo.file_id for photo in message.photo] if message.photo else [],
                "video": {
                    "file_id": message.video.file_id,
                    "file_unique_id": message.video.file_unique_id,
                    "file_size": message.video.file_size,
                    "width": message.video.width,
                    "height": message.video.height,
                    "duration": message.video.duration
                } if message.video else None,
                "caption_entities": [
                    {
                        "type": entity.type.name,
                        "offset": entity.offset,
                        "length": entity.length
                    }
                    for entity in message.caption_entities
                ] if message.caption_entities else []
            }

            # 添加到批量数据中
            self.batch_data.append(channel_info)

            self.db.bulk_insert_messages("channel_messages", channel_info)
            print(f"频道消息: {channel_info}")
        # await context.bot.send_message(chat_id=self.group_id, text=f"频道 {message.chat.title} 的新消息: {message_text}")

    async def handle_group_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        # 记录群组成员发送的消息
        message = update.message
        group_id = 0
        if message:
            group_id = message.chat.id  # 获取群组 ID
            group_name = message.chat.title  # 获取群组名称
            message_text = message.text  # 获取消息文本
            user_id = message.from_user.id  # 获取发送者 ID
            user_name = message.from_user.username  # 获取发送者用户名
            timestamp = message.date  # 获取消息发送时间

            print(
                f"群组 ID: {group_id}, 群组名称: {group_name}, 用户 ID: {user_id}, 用户名: {user_name}, 消息: {message_text}")

            # 检查消息是否已存在
            existing_message = self.db.find_one("group_messages", {
                "group_id": group_id,
                "user_id": user_id,
                "message_text": message_text,
                "timestamp": timestamp
            })

            if existing_message:
                print("消息已存在，未重复存入。")
            else:
                # 构造要插入的数据
                message_data = {
                    "group_id": group_id,
                    "group_name": group_name,
                    "user_id": user_id,
                    "user_name": user_name,
                    "message_text": message_text,
                    "timestamp": timestamp,
                    "sta": 0,  # 未处理状态
                }

                # 插入数据到数据库
                insert_result = self.db.insert_one("group_messages", message_data)
                if insert_result:
                    print(f"成功存入消息: {insert_result}")
                else:
                    print("存入消息失败。")

        message_data = self.db.find_one("channel_messages", {"sta": 0})
        print("发送频道信息")
        print(message_data)


        if group_id != 0 and message_data is not None:
            try:
                message_text = message_data.get("message")
                photos = message_data.get("photo")
                video = message_data.get("video")

                # 根据消息内容选择发送照片或视频
                if photos:
                    media = [InputMediaPhoto(photo) for photo in photos]
                    context.bot.send_media_group(chat_id=group_id, media=media)
                elif video:
                    context.bot.send_video(chat_id=group_id, video=video["file_id"])
                else:
                    context.bot.send_message(chat_id=group_id, text=message_text)

                print(f"消息已发送到群组 {group_id}")

                # 3. 更新发送次数和最后发送时间
                # 更新发送次数和最后发送时间
                self.db.update_one(
                    "channel_messages",
                    {"_id": message_data["_id"]},
                    {
                        "$set": {
                            "sta": 1,  # 标记为已发送
                            "last_send_time": datetime.datetime.utcnow()
                        },
                        "$inc": {"sendtimes": 1}  # 发送次数加 1
                    }
                )

                print(f"消息 ID {message_data['_id']} 已更新")

            except Exception as e:
                print(f"消息发送失败: {e}")

    async def get_channel_info(self, context: ContextTypes.DEFAULT_TYPE, channel_username: str):
        try:
            chat = await context.bot.get_chat(channel_username)
            return f"频道名称: {chat.title}\n频道描述: {chat.description}"
        except Exception as e:
            return f"获取频道信息时出错: {e}"

    async def get_channel_history(self, context: ContextTypes.DEFAULT_TYPE, channel_username: str, limit=10):
        try:
            messages = await context.bot.get_chat_history(channel_username, limit=limit)
            return [msg.text for msg in messages if msg.text]  # 仅返回文本消息
        except Exception as e:
            return f"获取历史消息时出错: {e}"

    async def get_recent_channel_messages(self, context, channel_username, limit=10):
        # 使用 get_updates 来获取最近的消息
        updates = await context.bot.get_updates(limit=limit)
        messages = []
        for update in updates:
            if update.message and update.message.chat.username == channel_username.lstrip('@'):
                messages.append(update.message.text)
        return messages

    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        self.userId = update.effective_chat.id  # 获取用户的 ID
        # 在需要的地方调用
        # await self.get_channel_info(context, self.channel_name)

        photo_message = {
            'message_id': 154,
            'sender_chat': {
                'id': -1002236185577,
                'title': '北京',
                'username': 'beijing1478',
                'type': 'channel'
            },
            'chat': {
                'id': -1002236185577,
                'title': '北京',
                'username': 'beijing1478',
                'type': 'channel'
            },
            'date': 1727532132,
            'media_group_id': '13820257058219493',
            'photo': [
                {
                    'file_id': 'AgACAgUAAyEFAASFSXvpAAOaZvgMZEjyj1rHD5l94Nbv1ZeMtSQAAmrDMRtoMMBXqFa9se3LnnIBAAMCAANzAAM2BA',
                    'file_unique_id': 'AQADasMxG2gwwFd4',
                    'file_size': 1320,
                    'width': 62,
                    'height': 90
                },
                {
                    'file_id': 'AgACAgUAAyEFAASFSXvpAAOaZvgMZEjyj1rHD5l94Nbv1ZeMtSQAAmrDMRtoMMBXqFa9se3LnnIBAAMCAANtAAM2BA',
                    'file_unique_id': 'AQADasMxG2gwwFdy',
                    'file_size': 17181,
                    'width': 221,
                    'height': 320
                },
                {
                    'file_id': 'AgACAgUAAyEFAASFSXvpAAOaZvgMZEjyj1rHD5l94Nbv1ZeMtSQAAmrDMRtoMMBXqFa9se3LnnIBAAMCAAN4AAM2BA',
                    'file_unique_id': 'AQADasMxG2gwwFd9',
                    'file_size': 77451,
                    'width': 552,
                    'height': 800
                },
                {
                    'file_id': 'AgACAgUAAyEFAASFSXvpAAOaZvgMZEjyj1rHD5l94Nbv1ZeMtSQAAmrDMRtoMMBXqFa9se3LnnIBAAMCAAN5AAM2BA',
                    'file_unique_id': 'AQADasMxG2gwwFd-',
                    'file_size': 142441,
                    'width': 884,
                    'height': 1280
                }
            ]
        }

        video_message = {
            'message_id': 155,
            'sender_chat': {
                'id': -1002236185577,
                'title': '北京',
                'username': 'beijing1478',
                'type': 'channel'
            },
            'chat': {
                'id': -1002236185577,
                'title': '北京',
                'username': 'beijing1478',
                'type': 'channel'
            },
            'date': 1727532132,
            'media_group_id': '13820257058219493',
            'video': {
                'duration': 6,
                'width': 720,
                'height': 1280,
                'file_name': 'video_2024-09-28_22-01-29.mp4',
                'mime_type': 'video/mp4',
                'thumbnail': {
                    'file_id': 'AAMCBQADIQUABIVJe-kAA5tm-AxkI-C37s6sBSahgSvCk8T18AACXBMAAmgwwFc3fXLoTfpSvgEAB20AAzYE',
                    'file_unique_id': 'AQADXBMAAmgwwFdy',
                    'file_size': 12226,
                    'width': 180,
                    'height': 320
                },
                'thumb': {
                    'file_id': 'AAMCBQADIQUABIVJe-kAA5tm-AxkI-C37s6sBSahgSvCk8T18AACXBMAAmgwwFc3fXLoTfpSvgEAB20AAzYE',
                    'file_unique_id': 'AQADXBMAAmgwwFdy',
                    'file_size': 12226,
                    'width': 180,
                    'height': 320
                },
                'file_id': 'BAACAgUAAyEFAASFSXvpAAObZvgMZCPgt-7OrAUmoYErwpPE9fAAAlwTAAJoMMBXN31y6E36Ur42BA',
                'file_unique_id': 'AgADXBMAAmgwwFc',
                'file_size': 4097150
            }
        }
        media = []
        # 添加图片到 media 列表

        caption = '北京甜筒\n#硬5w↑桐桐\n中戏在校生纯兼职 175 96斤 A4腰筷子腿 本人零整容长相清纯气质佳 无纹身 只见素质课🫶🏻\n#北京市朝阳区'
        # 添加图片到 media 列表，并将 caption 放在第一张图片上
        for index, photo in enumerate(photo_message['photo']):
            if index == 0:  # 对于第一张图片
                media.append(InputMediaPhoto(media=photo['file_id'],
                                             caption=caption))
            else:
                media.append(InputMediaPhoto(media=photo['file_id']))
        # 添加视频到 media 列表
        video_info = video_message['video']
        media.append(InputMediaVideo(media=video_info['file_id']))
        # 创建按钮
        button1 = InlineKeyboardButton(text="跳转到 Telegram", url="https://t.me/")
        button2 = InlineKeyboardButton(text="访问网站", url="https://www.baidu.com/")

        # 将按钮放入键盘
        keyboard = [[button1, button2]]  # 可以添加更多的按钮
        reply_markup = InlineKeyboardMarkup(keyboard)

        if media:
            await context.bot.send_media_group(chat_id=self.userId, media=media)

            # 发送 caption，如果需要
            caption = '北京甜筒\n#硬5w↑桐桐\n中戏在校生纯兼职 175 96斤 A4腰筷子腿 本人零整容长相清纯气质佳 无纹身 只见素质课🫶🏻\n#北京市朝阳区'
            # await context.bot.send_message(chat_id=self.userId, text=caption)


        await context.bot.send_message(chat_id=self.userId, text=f"你的用户 ID 是：{self.userId}",reply_markup=reply_markup)

    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        self.userId = update.effective_chat.id  # 获取用户的 ID
        await context.bot.send_message(chat_id=update.effective_chat.id, text="欢迎使用机器人!")

    async def unknown(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        await context.bot.send_message(chat_id=update.effective_chat.id,
                                       text="Sorry, I didn't understand that command.")

    async def inline_caps(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        query = update.inline_query.query
        if not query:
            return
        results = [InlineQueryResultArticle(
            id=str(uuid4()),
            title='Caps',
            input_message_content=InputTextMessageContent(query.upper())
        )]
        await context.bot.answer_inline_query(update.inline_query.id, results)
