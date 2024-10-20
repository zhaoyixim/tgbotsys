import uuid
from datetime import datetime
import logging
from uuid import uuid4
from telegram import Update, InlineQueryResultArticle, InputTextMessageContent, InputMediaPhoto, InputMediaVideo, \
    InlineKeyboardButton, InlineKeyboardMarkup, ForceReply, ReplyKeyboardMarkup
from telegram.ext import CommandHandler, ContextTypes, ApplicationBuilder, MessageHandler, filters, InlineQueryHandler
import config
from mongodb.db import DbHelper
from models.member import MemberModel
from tgbot.initaiogram import send_message_to_group

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)


class InitBot:
    def __init__(self):
        self.bot_api_token = config.bot_token
        self.member_model = MemberModel()  # 实例化 MemberModel
        self.userId = None
        self.app = None
        self.db = DbHelper()
        # 设置群组 ID
        self.group_id = -123456789  # 替换为目标群组 ID
        # Other handlers -- deal unkonwn model
        # self.unknown_handler = MessageHandler((~filters.COMMAND), self.unknown)
        # self.app.add_handler(self.unknown_handler)
        # self.app.run_polling(allowed_updates=Update.ALL_TYPES)

    def run(self):
        self.app = ApplicationBuilder().token(self.bot_api_token).build()
        self.app.add_handler(CommandHandler('start', self.start))
        # #  开启内联模式
        # self.inline_caps_handler = InlineQueryHandler(self.inline_caps)
        # self.app.add_handler(self.inline_caps_handler)
        # 处理群组成员消息
        self.app.add_handler(MessageHandler(filters.ChatType.GROUPS, self.handle_group_message))
        # 处理所有文本消息
        self.app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_message))
        # 获取频道信息
        self.app.add_handler(MessageHandler(filters.ChatType.CHANNEL, self.handle_channel_post))
        self.app.run_polling(allowed_updates=Update.ALL_TYPES)  # 启动异步轮询

    def bot_generate_unique_id(self):
        return str(uuid.uuid4())
    async def handle_channel_post(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        if update.channel_post:
            message = update.channel_post  # 这是单个消息对象
            bulk_array = []
            chat = message.chat  # 获取聊天对象
            channel_id = chat.id
            channel_info = await context.bot.get_chat(channel_id)
            channel_title = channel_info.title
            channel_description = channel_info.description  # 频道描述
            channel_username = channel_info.username if channel_info.username else ""
            self.member_model.set_collection_name("channel")
            findchannel = self.member_model.find_member({"channel_id": channel_id})
            if not findchannel:
                save_channel = {
                    "channel_id": channel_id,
                    "channel_title": channel_title,
                    "channel_username":channel_username,
                    "channel_description": channel_description,
                    "timestamp": datetime.now(),
                    "authorization_time": "",
                    "ctype": 1,  # 1 接收 2 --- 发送
                    "is_authorized": 0,  # 未授权
                    "sta": 1,  # 0---删除 1 --- 正常
                }
                self.member_model.add_member(save_channel)

            if message:
                message_text = message.caption if message.caption else (message.text if hasattr(message, 'text') else "")
                media_group_id = message.media_group_id if message.media_group_id else None
                channel_info = {
                    "channel_id": message.chat.id,
                    "channel_name": message.chat.title,
                    "message_id": message.message_id,
                    "media_group_id": media_group_id,
                    "message": message.caption if message.caption else message_text,
                    "timestamp": message.date.timestamp(),
                    "sta": 1,  # 0 未发送
                    "sendtimes": 0,  # 发送次数
                    "is_authorized": 0,  # 未授权
                    "authorization_time": "",
                    "turned_groups_id":[],
                    "is_setturned":0,
                }
                if len(findchannel["turned_groups_id"]) > 0:
                    channel_info["sendtimes"]=1
                    channel_info["last_send_time"]=datetime.now()

                if message.photo:
                    channel_info["photo"] = [photo.file_id for photo in message.photo]
                if message.video:
                    channel_info["video"] = {
                        "file_id": message.video.file_id,
                        "file_unique_id": message.video.file_unique_id,
                        "file_size": message.video.file_size,
                        "width": message.video.width,
                        "height": message.video.height,
                        "duration": message.video.duration
                    }
                if message.caption_entities:
                    channel_info["caption_entities"] = [
                        {
                            "type": entity.type.name,
                            "offset": entity.offset,
                            "length": entity.length
                        }
                        for entity in message.caption_entities
                    ]
                bulk_array.append(channel_info)
            # 确保这里是插入到数据库的地方
            if bulk_array:
                try:
                    self.db.bulk_insert_messages("channel_messages", bulk_array)
                except Exception as e:
                    print(f"批量插入失败: {e}")

            if findchannel["is_authorized"]==1 and  len(findchannel["turned_groups_id"])>0:
                for items in findchannel["turned_groups_id"]:
                    await send_message_to_group(items, channel_info)

    async def handle_group_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        # 记录群组成员发送的消息
        message = update.message
        group_id = 0
        if message.chat.id:
            group_id = message.chat.id  # 获取群组 ID
            group_name = message.chat.title  # 获取群组名称
            message_text = message.text  # 获取消息文本
            user_id = message.from_user.id  # 获取发送者 ID
            user_name = message.from_user.username  # 获取发送者用户名
            timestamp = message.date  # 获取消息发送时间
            # 重新建立一个表,关于群组管理的
            self.member_model.set_collection_name("group")
            findgroup = self.member_model.find_member({"group_id": group_id})
            if not findgroup:
                save_group = {
                    "group_id": group_id,
                    "group_name": group_name,
                    "user_id": user_id,
                    "user_name": user_name,
                    "timestamp": timestamp,
                    "authorization_time": "",
                    "is_authorized": 0,  # 未授权
                    "is_setturned":0,#是否被设置为转发频道消息
                    "turned_channel_id":[], # 被转发的频道ID
                    "sta": 1,  # 0---删除 1 --- 正常
                }
                self.member_model.add_member(save_group)
            self.member_model.set_collection_name("group_messages")
            existing_message = self.member_model.find_member({"group_id": group_id,"user_id": user_id,"message_text": message_text, "timestamp": timestamp})

            if not existing_message:
                message_data = {
                    "group_id": group_id,
                    "group_name": group_name,
                    "user_id": user_id,
                    "user_name": user_name,
                    "message_text": message_text,
                    "timestamp": timestamp,
                    "is_bot": False,
                }
                insert_result = self.db.insert_one("group_messages", message_data)
                if insert_result:
                    print(f"成功存入消息: {insert_result}")
                else:
                    print("存入消息失败。")

        message_data = self.db.find_one("channel_messages", {"sta": 0})
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

        member_info = self.check_member_data(update)
        if member_info:

            """
            先查找， "message_id": self.bot_generate_unique_id(),  # 生成唯一的消息ID，以便于管理
            有没有消息，切记，只查找主动发起的才算，
            也就是 member_info["is_forwarded"] == 1 才算
            """
            # self.member_model.set_collection_name("member_news")
            user_be_info = self.member_model.find_member({"to_user_id": update.effective_chat.id})
            # messegenews_info = self.member_model.find_member({"user_id": update.effective_chat.id})
            message_news_id = self.bot_generate_unique_id()
            if member_info["is_forwarded"] == 0:
                print("没有设置转发")
                return
            if member_info["is_forwarded"] == 1:
                # 主动拉起消息的一方
                if member_info["message_chat_id"]:
                    # 个人消息
                    message_news_id = member_info["message_chat_id"]
                else:
                    # 更新members 里面的 message_chat_id
                    update_data = {"message_chat_id": message_news_id}
                    self.member_model.set_collection_name("members")
                    self.member_model.update_member({"user_id": member_info["user_id"]}, update_data)
            if member_info["is_forwarded"] == 2:
                # 被动的一方 因为可能有一对多，所以无法直接在members里面写msgid
                self.member_model.set_collection_name("members")
                # 统一消息的msg id （这里是回复的消息）
                message_news_id = user_be_info["message_chat_id"]

            def get_content():
                if update.message.text:
                    return update.message.text, 'text'  # 返回内容和类型
                elif update.message.photo:
                    return update.message.photo[-1].file_id, 'photo'
                elif update.message.video:
                    return update.message.video.file_id, 'video'
                return None, None  # 如果没有内容，返回 None 和类型

            content, content_type = get_content()
            current_time = datetime.now()

            new_reply_data = {
                "user_id": update.effective_chat.id,  # 实际发送者的用户ID（机器人或用户）
                "to_user_id": member_info["to_user_id"],  # 消息接收者的用户ID
                "to_username": member_info["to_username"],  # 消息接收者的用户名
                "username": update.effective_chat.username,  # 发送者的用户名
                "created_at": current_time.isoformat(),  # 消息创建时间
                "content": content,  # 消息内容
                "is_forwarded": 1,  # 是否转发，0 -- 没有转发 | 1 -- 是转发而来 | 2 -- 被动转发
                "is_reply": 0,  # 是否回复，0 -- 没有回复 | 1 -- 是回复
                "message_type": "text",  # 消息类型，例如：text, image, video 等
                "chat_id": update.effective_chat.id,  # 聊天室ID，用于区分不同的聊天
                "message_id": message_news_id,  # 生成唯一的消息ID，以便于管理
                "is_bot": False,  # 标识是否为机器人发送的消息
                "impersonated_user": ""  # 记录机器人伪装的角色（A或B）
            }
            send_to_id = None

            if member_info["is_forwarded"] == 1:
                send_to_id = member_info["to_user_id"]
            if member_info["is_forwarded"] == 2:
                send_to_id = user_be_info["user_id"]
                new_reply_data["is_reply"] = 1
                new_reply_data["is_forwarded"] = 2
                new_reply_data["to_user_id"] = user_be_info["user_id"]
                new_reply_data["to_username"] = user_be_info["username"]

            self.member_model.set_collection_name("member_news")
            self.member_model.add_member(new_reply_data)

            if content_type == 'text':
                reply_markup = None  # 文本消息不需要自定义回复
                await context.bot.send_message(chat_id=send_to_id, text=content,
                                               reply_markup=reply_markup)
            elif content_type == 'photo':
                reply_markup = ReplyKeyboardMarkup([['查看照片', '发送其他照片']], resize_keyboard=True)
                await context.bot.send_photo(chat_id=send_to_id, photo=content,
                                             reply_markup=reply_markup)
            elif content_type == 'video':
                reply_markup = InlineKeyboardMarkup(
                    [[InlineKeyboardButton("观看视频", url=f"https://t.me/{context.bot.username}?start={content}")]])
                await context.bot.send_video(chat_id=send_to_id, video=content,
                                             reply_markup=reply_markup)
            else:
                await context.bot.send_message(chat_id=send_to_id, text="未检测到内容")

    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        self.userId = update.effective_chat.id  # 获取用户的 ID
        self.check_member_data(update)
        await context.bot.send_message(chat_id=self.userId, text="欢迎使用机器人!")

    def check_member_data(self, update: Update):
        user_info = self.member_model.find_member({"user_id": update.effective_chat.id})
        if user_info:
            return user_info
        else:
            current_time = datetime.now()
            new_user_data = {
                "user_id": update.effective_chat.id,
                "to_user_id": "",
                "to_username": "",
                "c_id": 0,
                "username": update.effective_chat.username,  # 或者其他你想要保存的信息
                "created_at": current_time.isoformat(),
                "update_at": "",
                "turn_at": "",
                "types": 1,  # 1 --- 普通用户   2 --- 客服--可转发 3---
                "content": "",  # 内容
                "is_forwarded": 0,  # 是否转发 0 -- 没有转发 1 -- 转发 | 2--被动转发
                "is_reply": 0,  # 是否回复，0--没有回复
                "reply_content": "",
                "sta": 1,  # 1 --- 有效  2 --- 删除
                "message_chat_id": "",  # 对话ID
                "group_msg_id": "",
                "channel_msg_id": "",

            }
            self.member_model.add_member(new_user_data)
            return new_user_data

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
