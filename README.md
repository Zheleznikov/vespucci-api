# vespucci-api
Бэкенд для поисковика новостей - дипломная работа в Яндекс.Практикуме
 
 ### Стек
 - express;
 - mongoDB;
 
### Запуск
Для запуска проекта с хотрелоудом нужно ввести в командной строке `npm run dev`, без - `npm run start`.

### Описание
Одна из задач диплома в Яндекс.Практикуме - создать бэкенд для проекта по поиску новостей.
Ниже описаны критерии по которым проект будут оценивать. Перед этим я опишу некоторые вещи, которые добавлены мной. Некоторые будут полезны при разработке фронтенда, некоторые помогают уже сейчас.
Эту часть у меня приняли. Я набрал 89 баллов. После ревью большинство исправлено, но оценки уже не изменить :) 

#### Вот эти добавленния

1. Создан роут, который позволяет разлогиниться. Для этого в базе данные есть еще одна коллекция tokens, которая представляет собой блеклист, ключи хранятся неделю.
Работает так: после срабатывания /logout токен пользователя отправляется в эту коллекцию. Потом мидлвара auth проверяет есть ли токен в коллекции. Если есть, то авторизация не проходит.

2. Ограничение запросов пользователя реализовано на уровне nginx.

3. В зависимости от того, продакшн-версия или нет, пользователь получает разные сообщения об ошибках.

4. В моделе пользователя есть массив articles , куда помещаются и удаляются id статей, которые пользователь добавил. 

### Пройдемся по критериям диплома

#### Критерии, влияющие на работоспособность

1. В репозитории есть все необходимые инфраструктурные файлы: / 5.3
  - в проекте есть `package.json`;
  - `.editorconfig`;
  - `.eslintrc`, расширяющий конфигурацию airbnb-base, а также необходимые для работы линтера dev-зависимости;
  - `.gitignore`;
  - В `.eslintrc` добавлено исключение для _id. Директивы eslint-disable, eslint-disable-line и eslint-disable-next-line запрещены.

2. Нет ошибок линтера. / 5.3 - `исправил после ревью насколько это возможно`

3. В разделе scripts файла `package.json` /5.3: 
- есть команда npm run start, которая запускает сервер на localhost:3000;
- и npm run dev, которая запускает сервер на localhost:3000 с хот релоудом.

4. Когда все зависимости установлены, приложение запускается командой `npm run dev` без ошибок. / 10.7

5. Описанные роуты работают корректно /5.3:
- запрос на `GET /users/me` возвращает информацию о пользователе (email и имя);
- `GET /articles` — все сохранённые пользователем статьи;
- `POST /articles` создаёт статью с переданными в теле данными;
- `DELETE /articles/articleId` удаляет сохранённую статью по _id
- `POST /signup` создаёт пользователя с переданными в теле данными;
- `POST /signin` возвращает JWT, если в теле запроса переданы правильные почта и пароль.

6. Все роуты, кроме /signin и /signup, защищены авторизацией. / 5.3 / 5.3

7. Роуты пользователей и роуты статей описаны в отдельных файлах. / 5.3

8. Ошибки API обрабатываются /5.3:
- если в запросе что-то не так, сервер возвращает ответ с ошибкой и её статусом;
- асинхронные обработчики завершены блоком catch;
- API не возвращает стандартных ошибок базы данных или Node.js. `исправил после ревью насколько это возможно`

9. В production-режиме адрес базы данных берётся из process.env. / 5.3

10. Реализовано бережное хранение пароля /5.3
- пароль хранится в зашифрованном виде;
- API не возвращает хеш пароля клиенту.

11. Данные валидируются перед добавлением в базу. / 5.3

12. Пользователь не может удалить сохранённую карточку из профиля другого пользователя. / 5.3

13. К серверу можно обратиться по http по адресу домена, указанному в README.md. / 5.3

14. Правильно реализовано хранение секретного ключа для создания JWT /5.3

#### Хорошие практики

1. Все роуты подключены в файле index.js, который находится в папке routes. Оттуда единый роут подключается в файле app.js / 1.5

2. Асинхронные операции реализованы промисами или async/await. / 1.5 - нет

3. Запрос валидируется перед передачей контроллеру. Тело и, где необходимо, заголовки и параметры, проверяются по соответствующим схемам. Если запрос не соответствует схеме, обработка не передаётся контроллеру, и клиент получает ошибку валидации. / 1.5 `исправил после ревью насколько это возможно`

4. Валидация описана в отдельном модуле. / 1.5 - нет

5. Настроено логгирование / 1.5
- запросы и ответы записываются в файл request.log;
- ошибки записываются в файл error.log;
- файлы логов не добавляются в репозиторий.

6. Ошибки обрабатываются централизованным обработчиком. / 1.5 `исправил после ревью насколько это возможно`

7. Централизованный обработчик ошибок описан в отдельном модуле. / 1.5

8. В случае ошибки API возвращает статус ответа, который соответствует типу ошибки. / 1.5

9. К серверу можно обратиться по https по адресу домена, указанному в README.md. / 1.5

10. API приложения располагается на домене вида: name.zone/api, а не просто name.zone. / 1.5: 

#### Рекомендации

1. Для ошибок API созданы классы, расширяющие конструктор Error. / 0.8

2. Используется модуль Helmet для установки заголовков, связанных с безопасностью. / 0.8

3. Конфигурация и константы в отдельных файлах / 0.8:
- адрес Mongo-сервера, секретный ключ для JWT в режиме разработки, вынесены в отдельный конфигурационный файл; 
- константы приложения — сообщения ответов и ошибок — вынесены в отдельный файл с константами - НЕТ

4. Настроен rate limiter: число запросов с одного IP в единицу времени ограничено. / 0.8

5. rate limiter сконфигурирован в отдельном файле и импортируется в app.js. / 0.8

6. API размещено на отдельном поддомене, например: api.news-explorer.tk. / 0.8

## Общая важная информация
### Что с этим делать?
На сервер можно посылать запросы, например, через программу postman. Способ авторизации - bearer token. Отправьте заголовок 
Во избежание недоразумений лучше делать все запросы с заголовками:

       Content-Type: application/json


#### Обязательные запросы
Чтобы отправка запросов имела смысл и приносила удовольствие нужно сделать два обязательных запроса.
- Первый - на создание пользователя:

`/signup` метод POST
В теле запроса нужно отправить объект вида:

    {
      "name": "My name",
      "email": "mymail@domain.ru",
      "password": "1234!@#$"
    }

- Второй запрос для того чтобы залогиниться:

`/signin` метод POST
В теле запроса нужно отправить объект вида:

    {
      "email": "mymail@domain.ru",
      "password": "1234!@#$"
    }

Дальше можно отправлять такие .

#### другие запросы
##### GET
- `/articles` - получить список всех статей;
- `/users/me` - получить своего пользователя;


##### POST
- `/articles` - добавить статью;

В теле запроса нужно отправить объект вида:

    {
        "keyword": "key and world",
        "title": "Important news",
        "text": "O... it's a very intresting thing, but",
        "date": "Today",
        "source": "Кто придумал",
        "link": "https://yandex.ru/",
        "image": "https://yandex.ru/"
}

##### DELETE
- `/cards/:articleId` - удалить карточку (можно удалить только карточку, которую добавил текущий пользователь);

##### POST
- `/users/logout` - разлогиниться; Токен добавиться в черный список и перестент действовать.

