# config.py
import platform
import os
import sys

# 将参数值赋给变量
bot_token = "7639219320:AAGG-XEi8bdQl17fIMDDl6AcpVPO6yEtbzs"

# 下面跟机器人没什么关系，主要作用方便开发，比如在 Windows 开发，配置代理和修改一些变量的值，如果是国外 Linux 作为生产环境，就不需要代理了

system = platform.system()  # 获取操作系统名字
if system == 'Windows':
    # 处于开发环境
    os.environ["http_proxy"] = "http://127.0.0.1:7890"
    os.environ["https_proxy"] = "http://127.0.0.1:7890"
elif system == 'Linux':
    # 处于生产环境
    pass
else:
    sys.exit('Unknown system.')