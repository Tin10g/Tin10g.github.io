# 杂记 · Git与Github对项目进行相关操作


# 使用Git与Github对项目进行相关操作
## 上传本地项目
1. 在本地项目文件夹中初始化一个.git文件
   ```
   git init
   ```
   之后就得到一个.git的隐藏文件
2. 在远程仓库里面加入我要上传的仓库[相当于连接远程仓库]
   ```
   git remote add origin https://github.com/你的github名字/仓库名.git
   ```
3. 查看当前本地仓库状态
   ```
   git status
   ```
   被标红色的文件就是修改的文件
4. 提交本地代码到本地git的缓存区
   ```
   git add xxx
   git add . //全部提交
   ```
5. 推送代码到本地的git库
   ```
   git commit -m &#34;注释&#34;
   ```
6. 把本地的代码提交到远程仓库
   ```
   /* 如果仓库为空 */
   git push -u 远程主机名orign 远程分支名main/master
   /* 如果仓库不为空 */
   git push 远程主机名orign 远程分支名main/master
   ```

## 其它指令
```
git pull // 把远程仓库同步到本地仓库=&gt;谨防覆盖自己的本地
```
```
git remote -v // 查看远程仓库详细信息，可以看到仓库名称，关联地址
```
```
git remote remove orign // 删除orign仓库（比如名称错误）
```
```
git remote add origin 仓库地址// 重新添加远程仓库地址
```

---

> Author: [Ting](Tin10g.github.io)  
> URL: http://localhost:1313/posts/git%E4%B8%8A%E4%BC%A0%E9%A1%B9%E7%9B%AE/  

