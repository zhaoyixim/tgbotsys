from pymongo import MongoClient, errors, InsertOne


class DbHelper:
    def __init__(self, db_name=None, uri='mongodb://localhost:27017/'):
        if db_name is None:
            return
        self.client = None
        self.db = None
        try:
            self.client = MongoClient(uri)
            self.db = self.client[db_name]
        except errors.ConnectionError as e:
            print(f"连接数据库失败: {e}")

    def insert_one(self, collection_name, data):
        collection = self.db[collection_name]
        try:
            result = collection.insert_one(data)
            return result.inserted_id
        except Exception as e:
            print(f"插入失败: {e}")
            return None

    def bulk_insert_messages(self, collection_name="channel_messages", batch_data=None):
        collection = self.db[collection_name]
        if batch_data:
            try:
                # 将批量数据插入数据库
                operations = [InsertOne(data) for data in batch_data]  # 使用 InsertOne
                result = collection.bulk_write(operations)
                print(f"批量插入完成，插入了 {result.inserted_count} 条消息")
            except Exception as e:
                print(f"批量插入失败: {e}")
    def find_one(self, collection_name, query):
        collection = self.db[collection_name]
        try:
            result = collection.find_one(query)
            return result
        except Exception as e:
            print(f"查询失败: {e}")
            return None

    def update_one(self, collection_name, query, update_data):
        collection = self.db[collection_name]
        try:
            result = collection.update_one(query, {'$set': update_data})
            return result.modified_count
        except Exception as e:
            print(f"更新失败: {e}")
            return None

    def delete_one(self, collection_name, query):
        collection = self.db[collection_name]
        try:
            result = collection.delete_one(query)
            return result.deleted_count
        except Exception as e:
            print(f"删除失败: {e}")
            return None

    def close(self):
        if self.client:
            self.client.close()
