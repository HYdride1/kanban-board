git仓库地址：[HYdride1/kanban-board (github.com)](https://github.com/HYdride1/kanban-board/tree/master)

#### 如何构建应用

将github中的内容clone到本地,默认此时在kanban-board文件夹下,开启一个终端:

前端启动:

````
cd app
npm i
npm run dev
````

在该终端中可以找到网页地址,比如http://localhost:5173/,打开之后,再开启一个终端:

后端项目启动

```` 
cd express-sqlite
npm i
npm start
````

启动之后打开网页进入登录界面,后端内置了五个用户,用户名类似`user1`,密码均为`password123`,登录之后进入看板

### 技术栈

react,vite,node构建前端

express,sqlite,node构建后端以及初始化后端数据