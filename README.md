# MERN-приложение TODO LIST

- [ ]  Установить Node.js
- [ ]  Создать новый проектный каталог
- [ ]  Инициализировать проект с помощью `npm init`
- [ ]  Установить и настроить пакет Node.js, `config`
    - Информация о пакете `config`
        - `config` - это пакет Node.js, который облегчает управление конфигурационными данными в приложении. Он позволяет определять значения по умолчанию для конфигурации, а также переопределять их в зависимости от окружения (например, разработка, тестирование, продакшн). `config` также обеспечивает поддержку YAML-файлов конфигурации.
            
            Пример установки и использования `config`:
            
            1. Установите `config` с помощью команды npm:
            
            ```
            npm install config
            
            ```
            
            1. Создайте файл `default.json` в папке `config` вашего проекта и определите значения конфигурации по умолчанию:
                
                ```
                {
                  "server": {
                    "port": 3000,
                    "host": "localhost"
                  },
                  "database": {
                    "url": "mongodb://localhost/myapp"
                  }
                }
                
                ```
                
            2. Определите конфигурацию для других окружений, например, `development.json`:
            
            ```
            {
              "server": {
                "port": 3000,
                "host": "localhost"
              },
              "database": {
                "url": "mongodb://localhost/myapp-dev"
              }
            }
            
            ```
            
            1. Используйте модуль `config` в своем приложении, чтобы получить значения конфигурации:
            
            ```
            const config = require('config');
            
            // получаем значение порта сервера из конфигурации
            const port = config.get('server.port');
            
            // получаем URL базы данных из конфигурации
            const dbUrl = config.get('database.url');
            
            ```
            
- [ ]  Установить необходимые зависимости (`express`, `mongoose`, `body-parser` и т.д.)
    - Подробно о (`express`, `mongoose`, `body-parser` и т.д.)
        - **Express** - это популярный веб-фреймворк для Node.js, который облегчает создание серверных приложений в JavaScript. Он предоставляет простой и понятный интерфейс для создания маршрутов, обработки запросов и управления HTTP-заголовками. Express также обладает большой экосистемой плагинов и дополнительных модулей, которые облегчают интеграцию с другими технологиями и расширяют его функциональность.
            
            Описание по express
            [https://my-js.org/docs/cheatsheet/express-api/#appusepath-callback-callback](https://my-js.org/docs/cheatsheet/express-api/#appusepath-callback-callback)
            
            Пример подключения `express` к app.js
            
            ```jsx
            const express = require('express')
            const app = express()
            ```
            
            ```jsx
            app.use(express.json( {extended: true} ))
            ```
            
            Эта строка кода нужна для того, чтобы распарсить JSON-запросы, приходящие на сервер в формате, отличном от простого объекта. Опция `extended` включает расширенный парсинг, который может принимать более сложные объекты.
            
        - `body-parser` - это middleware для обработки тела запроса в Express. Он позволяет анализировать данные формы в запросе и преобразовывать их в объект JavaScript, который легко обрабатывать в вашем коде. Это особенно полезно при создании API, которые принимают данные формы или JSON в качестве входных данных.
            
            Пример использования `body-parser` в Express:
            
            ```
            const express = require('express');
            const bodyParser = require('body-parser');
            
            const app = express();
            
            // подключаем middleware для обработки тела запроса
            app.use(bodyParser.urlencoded({ extended: false }));
            app.use(bodyParser.json());
            
            // обрабатываем POST-запрос на /login
            app.post('/login', (req, res) => {
              const { username, password } = req.body;
              // проверяем, что пользователь ввел правильный логин и пароль
              if (username === 'admin' && password === 'password') {
                res.send('Login successful');
              } else {
                res.send('Invalid login');
              }
            });
            
            app.listen(3000, () => {
              console.log('Server started on port 3000');
            });
            
            ```
            
        - пример использования `mongoose`
            
            Mongoose - это библиотека, которая облегчает работу с MongoDB в Node.js. Он предоставляет простой и интуитивно понятный интерфейс для создания моделей и схем данных, а также для выполнения запросов к базе данных.
            
            Пример использования Mongoose в Node.js:
            
            ```
            const mongoose = require('mongoose');
            
            // подключаемся к базе данных MongoDB
            mongoose.connect('mongodb://localhost/myapp', { useNewUrlParser: true });
            
            // создаем схему данных для коллекции 'users'
            const userSchema = new mongoose.Schema({
              name: { type: String, required: true },
              email: { type: String, required: true, unique: true },
              password: { type: String, required: true }
            });
            
            // создаем модель для коллекции 'users'
            const User = mongoose.model('User', userSchema);
            
            // создаем нового пользователя и сохраняем его в базе данных
            const user = new User({
              name: 'John Doe',
              email: 'john@example.com',
              password: 'secret'
            });
            
            user.save((err) => {
              if (err) {
                console.error(err);
              } else {
                console.log('User saved successfully');
              }
            });
            
            ```
            
        
- [ ]  Создать базу MongoDB (на облаке, в `Docker`, на виртуальной или локальной машине)
- [ ]  Настроить приложение Express и подключить его к базе данных MongoDB
    - Пример приложения (файл app.js) c подключением к базе
        
        ```jsx
        const express = require('express')
        const config = require('config')
        const mongoose = require('mongoose')
        
        const app = express()
        const PORT = config.get('port') || 5000
        
        async function start() {
            try{
        
                //ожидание пока произойдет подключение (завершится промис)
                const mongoUri = config.get("mongoUri")
                console.log('Connect to mongoUri:', mongoUri)
                
                await mongoose.connect(mongoUri, {
                    useNewUrlParser: true,
                   // useCreateIndex: true,
                    useUnifiedTopology: true
                    
                })
        
                app.listen(PORT, () => console.log(`app has been started on port ${PORT}...`))
        
                 
            } catch (e) {
                console.log('Server error: ', e.message)
                process.exit(1) //выход из процесса  node js
            }
        
        }
        
        start()
        ```
        
- [ ]  Создать модуль авторизации
    - Подробно о модуле авторизации
        1. Создать Middleware для авторизации и подключить его к серверному app.js
            - Примечание
                - Middleware в случае с HTTP-сервером в Node. JS — это промежуточный код, который выполняется до того, как начнёт выполняться ваш основной код.
                По сути это обычная функция, которая перехватывает данные до начала выполнения основного кода.
                - Пример подключения Middleware
                
                Конструкция app.use перенаправляет запрос по адресу '/api/auth' на Middleware './routes/auth.routes.js'
                
                ```jsx
                app.use('/api/auth', require('./routes/auth.routes'))
                ```
                
            1. Middleware отрабатывает логику авторизации и создания нового пользователя
            2. Проверку полей формы авторизации (валидацию)
            3. Хеширование пароля из формы
            4. К нему подключается модель для mongoDB (для создания пользователя в базе, проверки пользователя, поиска пользователя)
            5. Создается токен для авторизации
            6. Возвращает response (ответ сервера) с token и userId, или с сообщением об ошибке, а также статус (код ответа http - 400/500/200)
            
        
- [ ]  Создать маршруты API для обработки CRUD-операций
    - Примечание
        
        CRUD - это аббревиатура, которая обозначает четыре основных функции, которые выполняет приложение базы данных: Create (Создание), Read (Чтение), Update (Обновление) и Delete (Удаление). Эти операции позволяют создавать, читать, обновлять и удалять данные в базе данных. В контексте приложений MERN, CRUD-операции обычно относятся к маршрутам API, которые обрабатывают запросы на создание, чтение, обновление и удаление данных в базе данных.
        
        ```jsx
        app.use('/api/auth', require('./routes/auth.routes'))
        app.use('/api/link', require('./routes/link.routes'))
        app.use('/t', require('./routes/redirect.routes'))
        ```
        
- [ ]  Создать компоненты React для фронтенда
    - Примечание
        
        Создание клиентского приложения React
        
        ```bash
        npx create-react-app client
        ```
        
        Настройка одновременного запуска в скриптах файла package.json
        
        Подключение библиотеки компонентов и/или библиотеки css, например, Materialize
        
        Добавление библиотеки для роутинга React приложения
        
        ```bash
        npm i react-router-dom
        ```
        
        Создание файла для роутов авторизованного пользователя и не авторизованного client/src/routes.js
        
        Создать компоненты React в виде отдельных файлов для клиентской логики приложения, создать файлы, которые подключаются к приложению
        
        Подключение компонент React к файлу с роутами
        
        Подключение модуля с роутами к клиентскому приложению
        
- [ ]  Подключить фронтенд к API бэкэнда
    - Примечание
        
        Для взаимодействия с сервером создаются кастомные хуки
        
        Для того, чтобы перенаправить запросы на сервер в клиентском client/package.json создается перенаправление "proxy": "[http://localhost:5050](http://localhost:5050/)",
        
- [ ]  Протестировать приложение и отладить при необходимости
- [ ]  Развернуть приложение на хостинге