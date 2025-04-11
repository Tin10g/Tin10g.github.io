# 常用工具指令


## flaskSeesion 

解密：python flask_session_cookie_manager3.py decode -s “secret_key” -c “需要解密的session值”

加密：python flask_session_cookie_manager3.py encode -s “secret_key” -t “需要加密的session值”

## jwt tool

### 基本用法：

运行jwt_tool并查看用法信息：

$ python3 jwt_tool.py -h

处理令牌并启动交互式菜单：

$ python3 jwt_tool.py eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbiI6InRpY2FycGkifQ.bsSwqj2c2uI9n7-ajmi3ixVGhPUiY7jO9SUn9dm15Po

启动阅读器/解码器：

$ python3 jwt_tool.py JWT_HERE -R

启动eXplorer（确定潜在的弱项）：

$ python3 jwt_tool.py JWT_HERE -X

根据公钥验证令牌：

$ python3 jwt_tool.py JWT_HERE -V -pk my_public.pem

开始以交互方式篡改标头，有效负载和签名：

$ python3 jwt_tool.py JWT_HERE -T

常见攻击
尝试破解密钥（HMAC算法）：

$ python3 jwt_tool.py JWT_HERE -C -d dictionary.txt

尝试使用已知的公钥对不对称密码（RS-，EC-，PS-）进行“密钥混淆”攻击：

$ python3 jwt_tool.py JWT_HERE -K -pk my_public.pem

尝试使用“无”算法来创建未验证的令牌：

$ python3 jwt_tool.py JWT_HERE -A

处理JSON Web密钥存储文件，重建公共密钥，然后测试密钥以查看验证令牌的密钥：

$ python3 jwt_tool.py JWT_HERE -J -jw jwks.json

生成一个新的RSA密钥对，将公钥作为JSON Web密钥存储对象注入令牌，并使用私钥对令牌签名：

$ python3 jwt_tool.py JWT_HERE -I

欺骗远程JWKS：生成新的RSA密钥对，将提供的URL注入令牌，将公共密钥导出为JSON Web密钥存储对象（以提供的URL进行服务），并使用私钥对令牌签名：

$ python3 jwt_tool.py JWT_HERE -S -u http://example.com/jwks.json





file_content_input()



---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/2024web-%E5%B8%B8%E7%94%A8%E5%B7%A5%E5%85%B7%E6%8C%87%E4%BB%A4/  

