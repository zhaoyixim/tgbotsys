from pymongo import MongoClient, errors, InsertOne


class DbHelper:
    def __init__(self, db_name="telegrambot_db", uri='mongodb://localhost:27017/'):
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

    def find(self, collection_name, query):
        collection = self.db[collection_name]
        try:
            return list(collection.find(query))  # 返回列表形式的结果
        except Exception as e:
            print(f"查询失败: {e}")
            return []

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

    def update_many(self, collection_name, query, update_data):
        collection = self.db[collection_name]
        try:
            result = collection.update_many(query, {'$set': update_data})
            return result.modified_count
        except Exception as e:
            print(f"更新失败: {e}")
            return None

    def find_unique_media_group_ids(self, collection_name,disStr="media_group_id"):
        collection = self.db[collection_name]
        try:
            unique_ids = collection.distinct(disStr)
            return unique_ids
        except Exception as e:
            print(f"查询唯一 media_group_id 失败: {e}")
            return []

    def find_first_documents_by_media_group_id(self, collection_name, group_field="media_group_id"):
        collection = self.db[collection_name]
        try:
            pipeline = [
                {
                    '$group': {
                        '_id': f'${group_field}',  # 使用传入的变量
                        'firstDocument': {'$first': '$$ROOT'}
                    }
                }
            ]
            results = list(collection.aggregate(pipeline))
            return [doc['firstDocument'] for doc in results]
        except Exception as e:
            print(f"查询每个 {group_field} 的第一条数据失败: {e}")
            return []

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

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
