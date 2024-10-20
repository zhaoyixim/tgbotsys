from mongodb.db import DbHelper  # 引入 DbHelper
from typing import List, Optional, Dict

class ChannelModel:
    def __init__(self, db_name: str = 'telegrambot_db'):
        self.db_name = db_name
        self.collection_name = "channel_messages"

    def add_channel(self, member_data: Dict) -> Optional[str]:
        """添加单个成员到数据库。"""
        with DbHelper(self.db_name) as db_helper:
            member_id = db_helper.insert_one(self.collection_name, member_data)
            return str(member_id) if member_id else None

    def bulk_add_channel(self, members_data: List[Dict]) -> None:
        """批量添加成员。"""
        with DbHelper(self.db_name) as db_helper:
            db_helper.bulk_insert_messages(self.collection_name, members_data)  # 直接调用已存在的方法

    def find_channels(self, query: Dict) -> List[Dict]:
        """查找多个成员。"""
        with DbHelper(self.db_name) as db_helper:
            members = db_helper.find(self.collection_name, query)  # 假设 find 方法返回一个列表
            return members

    def find_channel(self, query: Dict) -> Optional[Dict]:
        """查找成员。"""
        with DbHelper(self.db_name) as db_helper:
            member = db_helper.find_one(self.collection_name, query)
            return member

    def update_channel(self, query: Dict, update_data: Dict) -> int:
        """更新成员信息。"""
        with DbHelper(self.db_name) as db_helper:
            modified_count = db_helper.update_one(self.collection_name, query, update_data)
            return modified_count if modified_count else 0

    def delete_channel(self, query: Dict) -> int:
        """删除成员。"""
        with DbHelper(self.db_name) as db_helper:
            deleted_count = db_helper.delete_one(self.collection_name, query)
            return deleted_count if deleted_count else 0
