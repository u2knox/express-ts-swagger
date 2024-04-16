# Инструкция по установке.

## 1 Этап

Для начала если у Вас нет проекта, необходимо выполнить команду в консоле
`git clone https://github.com/u2knox/express-ts-swagger.git`
Если у Вас уже имеется проект, откройте его и напишите:

1. git reset --hard
2. git fetch
3. git pull

## 2 Этап

`npm i `

`npx prisma migrate dev --name init`

`npx prisma generate`
`npm run dev`

## 3 Этап

Для того чтобы работать с базой данных можете выполнить в консоле команду npx prisma studio
Сервер разворачивается на адресе http://localhost:8000
Также в корне проекта есть коллекция из postman, в которой находится актуальный список endpoint-ов
