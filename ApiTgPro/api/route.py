# route.py
from bson import ObjectId
from fastapi import APIRouter, Request
from models.member import MemberModel
from .respModel import Result, read_menu_json
import jwt
import datetime
from tgbot.initaiogram import send_message, send_text_to_group, send_message_to_group

router = APIRouter()
member_model = MemberModel()

"""
机器人发送信息操作
"""


# 机器人在中间的发送
@router.post("/api/user/send2msgfake")
async def send2msgfake(request: Request):
    data = await request.json()  # 直接获取请求体的 JSON 数据
    user_id = data.get("user_id")
    touserid = data.get("to_user_id")
    current_time = datetime.datetime.now()
    presendmsg = data.get("content")

    member_model.set_collection_name("member_news")
    save_art = {
        "user_id": user_id,
        "to_user_id": touserid,
        "to_username": data.get("to_username"),
        "username": data.get("username"),
        "created_at": str(current_time),  # 直接使用 ISO 格式的时间
        "content": presendmsg,
        "is_forwarded": 1,
        "is_reply": presendmsg,
        "message_id": data.get("message_id"),
        "is_bot": True
    }
    member_model.add_member(save_art)
    await send_message(touserid, presendmsg)

    response = Result(
        code=200,
        success=True,
        msg="发送成功",
        data={}
    )
    return response


@router.post("/api/user/sendtgchannel")
async def sendtg2channel(request: Request):
    data = await request.json()  # 直接获取请求体的 JSON 数据
    member_id = data.get("_id")
    presendmsg = data.get("content")
    try:
        member_object_id = ObjectId(member_id)
    except Exception:
        return {"message": "Invalid ID format."}
    member_model.set_collection_name("channel_messages")
    members = member_model.find_member({"_id": member_object_id})

    await  send_message(members["user_id"], presendmsg)

    response = Result(
        code=200,
        success=True,
        msg="发送成功",
        data={}
    )
    return response


@router.post("/api/user/authgroup")
async def authgroupFunc(request: Request):
    data = await request.json()  # 直接获取请求体的 JSON 数据
    user_id = data.get("user_id")
    group_id = data.get("group_id")
    member_model.set_collection_name("group")
    flag = data.get("flag")
    update_data = {"is_authorized": int(flag), "authorization_time": datetime.datetime.now()}
    member_model.update_member({"user_id": user_id, "group_id": group_id}, update_data)
    response = Result(
        code=200,
        success=True,
        msg="授权成功",
        data={}
    )
    return response


@router.post("/api/user/botsendgroupmessage")
async def botsendgroupmessage(request: Request):
    data = await request.json()  # 直接获取请求体的 JSON 数据
    user_id = 0
    group_id = data.get("group_id")
    message_text = data.get("content")
    user_name = "Bot"
    member_model.set_collection_name("group_messages")
    member_model.add_member({
        "group_id": group_id,
        "user_id": user_id,
        "message_text": message_text,
        "user_name": user_name,
        "is_bot": True,
        "timestamp": datetime.datetime.now()
    })
    presendmsg = {"message": message_text}
    await send_text_to_group(group_id, presendmsg)

    response = Result(
        code=200,
        success=True,
        msg="发送成功",
        data={}
    )
    return response


@router.post("/api/user/sendtggroup")
async def sendtg2group(request: Request):
    # 暂时不用
    data = await request.json()  # 直接获取请求体的 JSON 数据
    member_id = data.get("_id")
    presendmsg = {"message": data.get("content"), "_id": member_id}
    try:
        member_object_id = ObjectId(member_id)
    except Exception:
        return {"message": "Invalid ID format."}
    member_model.set_collection_name("group_messages")
    members = member_model.find_member({"_id": member_object_id})
    await  send_text_to_group(members["group_id"], presendmsg)
    response = Result(
        code=200,
        success=True,
        msg="发送成功",
        data={}
    )
    return response


@router.post("/api/user/gettggroupmsgs")
async def gettggroupmsgs(request: Request):
    data = await request.json()  # 直接获取请求体的 JSON 数据
    group_id = data.get("group_id")
    user_id = data.get("user_id")
    member_model.set_collection_name("group")
    groupinfo = member_model.find_member({"user_id": user_id, "group_id": group_id})
    if groupinfo["is_authorized"] == 0:
        response = Result(
            code=200,
            success=True,
            msg="未授权",
            data={}
        )
        return response

    member_model.set_collection_name("group_messages")
    groupmessages = member_model.find_members({"group_id": group_id})
    formatted_messages = []
    for message in groupmessages:
        if message["is_bot"] == True:
            message["user_name"] = message["user_name"] + "(Bot)"
        formatted_messages.append({
            "id": str(message["_id"]),  # 转换 ObjectId 为字符串
            "group_id": message["group_id"],
            "user_id": message["user_id"],
            "user_name": message["user_name"],
            "message_text": message["message_text"],  # 直接使用 ISO 格式的时间
            "is_bot": message["is_bot"]
        })

    response = Result(
        code=200,
        success=True,
        msg="发送成功",
        data=formatted_messages
    )

    return response


@router.post("/api/user/getchatmessage")
async def get_chatmessage(request: Request):
    data = await request.json()  # 直接获取请求体的 JSON 数据
    member_id = data.get("_id")
    try:
        member_object_id = ObjectId(member_id)
    except Exception:
        return {"message": "Invalid ID format."}
    member_model.set_collection_name("members")
    members = member_model.find_member({"_id": member_object_id})
    member_model.set_collection_name("member_news")
    message_news = member_model.find_members(({"message_id": members["message_chat_id"]}))
    # 格式化 message_news 数据，前端需要的结构
    formatted_messages = []
    for message in message_news:
        if message["is_bot"] == True:
            message["username"] = message["username"] + "(Bot)"
        formatted_messages.append({
            "id": str(message["_id"]),  # 转换 ObjectId 为字符串
            "user_id": message["user_id"],
            "to_user_id": message["to_user_id"],
            "to_username": message["to_username"],
            "username": message["username"],
            "created_at": message["created_at"],  # 直接使用 ISO 格式的时间
            "content": message["content"],
            "is_forwarded": message["is_forwarded"],
            "message_id": message["message_id"],
            "is_bot": message["is_bot"],
            "is_reply": message["is_reply"]
        })
    response = Result(
        code=200,
        success=True,
        msg="发送成功",
        data=formatted_messages
    )
    return response


# 单个的发送
@router.post("/api/user/sendtgmsg")
async def send2bot(request: Request):
    data = await request.json()  # 直接获取请求体的 JSON 数据
    member_id = data.get("_id")
    presendmsg = data.get("content")
    try:
        member_object_id = ObjectId(member_id)
    except Exception:
        return {"message": "Invalid ID format."}
    member_model.set_collection_name("members")
    members = member_model.find_member({"_id": member_object_id})

    await  send_message(members["user_id"], presendmsg)

    response = Result(
        code=200,
        success=True,
        msg="发送成功",
        data={}
    )
    return response



@router.post("/api/user/sendfinaly")
async def sendfinaly(request: Request):
    data = await request.json()  # 直接获取请求体的 JSON 数据
    channel_id = data.get("channer_id")
    group_id = data.get("group_id")
    media_group_id = data.get("media_group_id")
    member_model.set_collection_name("channel_messages")
    channalnewslists = member_model.find_members({"media_group_id": media_group_id})
    # 组合媒体消息
    # 初始化合并的消息和媒体
    combined_message = ''
    combined_photos = []
    combined_videos = []
    for item in channalnewslists:
        if isinstance(item, dict):  # 确保 item 是字典
            # 合并文本内容
            if item.get("message"):
                combined_message += item["message"] + "\n"
            # 合并照片
            photos = item.get("photo", [])
            if len(photos)>0:
                combined_photos.append(photos[0])
            videos = item.get("video", [])
            if len(videos) > 0:
                combined_videos.append(videos[0])

    # 准备发送的消息数据
    message_data = {
        'message': combined_message.strip(),
        'photo':combined_photos,
        'video':combined_videos[0] if combined_videos else None
    }

    await send_message_to_group(group_id, message_data)
    update_data = {
            "sta": 1,  # 标记为已发送
            "last_send_time": datetime.datetime.now(),
            "sendtimes":channalnewslists[0]["sendtimes"]+1
    }
    member_model.update_members(
        query={"media_group_id": media_group_id},
        update_data=update_data
    )
    response = Result(
        code=200,
        success=True,
        msg="发送成功",
        data={}
    )
    return response
"""
数据操作
"""

@router.post("/api/user/setchanelturned")
async def setchanelturned(request: Request):
    data = await request.json()  # 直接获取请求体的 JSON 数据
    channel_id = data.get("channer_id")
    group_id = data.get("group_id")
    member_model.set_collection_name("group")
    findgroup = member_model.find_member({"group_id":group_id})
    save_channel_id = []
    if findgroup and findgroup.get("turned_channel_id") is not None:
        turned_channel_id = findgroup["turned_channel_id"]
        for channelised in turned_channel_id:
            save_channel_id.append(channelised)
    save_channel_id.append(channel_id)
    update_data = {"is_setturned": 1,"turned_channel_id":save_channel_id}
    member_model.update_member({"group_id": group_id}, update_data)

    member_model.set_collection_name("channel")
    findchannels = member_model.find_member({"channel_id":channel_id})
    save_groups_id = []
    if findchannels and findchannels.get("turned_groups_id") is not None:
        turned_groups_id = findchannels["turned_groups_id"]
        for groupedid in turned_groups_id:
            save_groups_id.append(groupedid)
    save_groups_id.append(group_id)

    update_data = {"is_setturned": 1, "turned_groups_id": save_groups_id}
    member_model.update_member({"channel_id": channel_id}, update_data)
    response = Result(
        code=200,
        success=True,
        msg="设置成功",
        data={}
    )
    return response



@router.get("/api/user/getchannelnewslists")
async def getchannelnewslists():
    member_model.set_collection_name("channel_messages")
    chanelLists = member_model.find_first_documents_by_media_group_id()
    formatted_messages = []
    for message in chanelLists:
        formatted_messages.append({
            "id": str(message["_id"]),  # 转换 ObjectId 为字符串
            "channel_id": message["channel_id"],
            "channel_name": message["channel_name"],
            "message_id": message["message_id"],
            "media_group_id": message["media_group_id"],
            "message": message["message"],  # 直接使用 ISO 格式的时间
            "sta": message["sta"]
        })
    response = Result(
        code=200,
        success=True,
        msg="发送成功",
        data=formatted_messages
    )
    return response

@router.post("/api/user/operatechannel")
async def operatechannel(request: Request):
    data = await request.json()  # 直接获取请求体的 JSON 数据
    channel_id = data.get("_id")
    ctype = data.get("ctype")
    try:
        channel_obj_id = ObjectId(channel_id)
    except Exception:
        return {"message": "Invalid ID format."}
    member_model.set_collection_name("channel")
    update_data = {"is_authorized": ctype}
    member_model.update_member({"_id": channel_obj_id}, update_data)
    response = Result(
        code=200,
        success=True,
        msg="操作成功",
        data={}
    )
    return response


@router.post("/api/user/startfirwarded")
async def start_forwarded(request: Request):
    data = await request.json()  # 直接获取请求体的 JSON 数据
    member_id = data.get("_id")
    to_user_id = data.get("to_user_id")
    to_username = data.get("to_username")
    to_id = data.get("to_id")
    c_id = int(data.get("c_id"))
    try:
        member_object_id = ObjectId(member_id)
    except Exception:
        return {"message": "Invalid ID format."}
    member_model.set_collection_name("members")
    members = member_model.find_members({"_id": member_object_id})
    if members:
        # 更新状态
        update_data = {"is_forwarded": 1, "to_id": to_id, "to_user_id": to_user_id, "to_username": to_username,
                       "c_id": c_id}  # 更新 is_forwarded 字段
        member_model.update_member({"_id": member_object_id}, update_data)
        update_data2 = {"is_forwarded": 2}  # 设置被动转发 -- 无法再被主动转发
        member_model.update_member({"_id": ObjectId(to_id)}, update_data2)

    response = Result(
        code=200,
        success=True,
        msg="删除成功",
        data={}
    )
    return response


@router.post("/api/user/stopforwarded")
async def stop_forwarded(request: Request):
    data = await request.json()  # 直接获取请求体的 JSON 数据
    member_id = data.get("_id")
    try:
        member_object_id = ObjectId(member_id)
    except Exception:
        return {"message": "Invalid ID format."}
    member_model.set_collection_name("members")
    members = member_model.find_members({"_id": member_object_id})
    to_id_pre = members[0].get("to_id")
    to_id = ObjectId(to_id_pre)
    if members:
        # 更新状态
        update_data = {"is_forwarded": 0}  # 更新 is_forwarded 字段
        member_model.update_member({"_id": member_object_id}, update_data)
        member_model.update_member({"_id": to_id}, update_data)
    response = Result(
        code=200,
        success=True,
        msg="删除成功",
        data={}
    )
    return response


@router.post("/api/user/deletemember")
async def delete_member(request: Request):
    data = await request.json()  # 直接获取请求体的 JSON 数据
    member_id = data.get("_id")
    try:
        member_object_id = ObjectId(member_id)
    except Exception:
        return {"message": "Invalid ID format."}
    member_model.set_collection_name("members")
    members = member_model.find_members({"_id": member_object_id})
    if members:
        # 更新状态
        update_data = {"sta": 0}  # 更新 sta 字段
        member_model.update_member({"_id": member_object_id}, update_data)

    response = Result(
        code=200,
        success=True,
        msg="删除成功",
        data={}
    )
    return response


@router.post("/api/user/login")
async def login():
    SECRET_KEY = "a7y9aw45y98a7w4anhoed98ay09e587ashd"  # 请确保将其替换为强随机的密钥
    payload = {
        "userId": "admin",  # 用户ID
        "userName": "admin",  # 用户名
        "orgCode": "350000",  # 组织代码
        "deptCode": "350000",  # 部门代码
        "aud": "admin",  # 受众
        "iss": "admin",  # 签发者
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # 过期时间（1小时后）
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS512")
    response = Result(
        code=200,
        success=True,
        msg="登陆成功",
        data={"userId": "35002", 'token': token}
    )
    return response


@router.get("/api/user/menu")
async def menu():
    menu_data = read_menu_json()
    response = Result(
        code=200,
        success=True,
        msg="get menu success",
        data=menu_data
    )
    return response


@router.get("/api/user/permission")
async def permission():
    return_data = ['sys:user:add', 'sys:user:edit', 'sys:user:delete', 'sys:user:import', 'sys:user:export']
    response = Result(
        code=200,
        success=True,
        msg="get permission successful",
        data=return_data
    )
    return response


@router.get("/api/user/getmembers")
async def get_members():
    member_model.set_collection_name("members")
    members = member_model.find_members({"sta": 1})
    try:
        if len(members) > 0:
            for index, member in enumerate(members):
                member["id"] = index + 1
                member['_id'] = str(member['_id'])
                if member["types"] == 1:
                    member["types"] = "普通用户"
                elif member["types"] == 2:
                    member["types"] = "客服"
                if member["is_forwarded"] == 0:
                    member["forwarded"] = "未转发"
                elif member["is_forwarded"] == 1:
                    member["forwarded"] = "已转发"

        response = Result(
            code=200,
            success=True,
            msg="get member listss success",
            data=members
        )
        return response
    except Exception as e:
        print(f"发生错误: {e}")  # 记录错误
        return Result(
            code=500,
            success=False,
            msg="Internal Server Error",
            data=None
        )


@router.get("/api/user/getchannels")
async def get_channels():
    # 假设这是你的查找逻辑
    member_model.set_collection_name("channel")
    members = member_model.find_members({"sta": 1})
    try:
        if len(members) > 0:
            for member in members:
                member['_id'] = str(member['_id'])
                if member["ctype"] == 1:
                    member["ctype_txt"] = "接收类型"
                elif member["ctype"] == 2:
                    member["ctype_txt"] = "可发送"

                if member["sta"] == 0:
                    member["sta_txt"] = "删除"
                elif member["sta"] == 1:
                    member["sta_txt"] = "接收"

                if member["is_authorized"] == 0:
                    member["authorized"] = "未授权"
                elif member["is_authorized"] == 1:
                    member["authorized"] = "已授权"
        response = Result(
            code=200,
            success=True,
            msg="get channels listss success",
            data=members
        )
        return response
    except Exception as e:
        print(f"发生错误: {e}")  # 记录错误
        return Result(
            code=500,
            success=False,
            msg="Internal Server Error",
            data=None
        )


@router.get("/api/user/getgroups")
async def get_groups():
    # 假设这是你的查找逻辑
    member_model.set_collection_name("group")
    members = member_model.find_members({"sta": 1})
    try:
        if len(members) > 0:
            for member in members:
                member['_id'] = str(member['_id'])
                if member["is_authorized"] == 0:
                    member["authorized"] = "未授权"
                elif member["is_authorized"] == 1:
                    member["authorized"] = "已授权"

                if member["sta"] == 0:
                    member["sta_txt"] = "停止"
                elif member["sta"] == 1:
                    member["sta_txt"] = "接收中"
                member["issended"] = False
        response = Result(
            code=200,
            success=True,
            msg="get groups listss success",
            data=members
        )
        return response
    except Exception as e:
        print(f"发生错误: {e}")  # 记录错误
        return Result(
            code=500,
            success=False,
            msg="Internal Server Error",
            data=None
        )
