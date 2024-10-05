# main.py
from telegram import Update  # 获取消息队列的
from telegram.ext import filters, MessageHandler, ApplicationBuilder, CommandHandler

import config
# 从 tgbotBehavior.py 导入定义机器人动作的函数

from tgbot.initbot import InitBot

def main():

 bot = InitBot()



# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    main()

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
