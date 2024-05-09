FROM postgres:12
# Очистка кеша и обновление пакетов внутри контейнера
RUN apt-get clean && apt-get update
# Копирует все SQL-файлы из текущего контекста сборки (возможно, извне) в каталог
ADD *.sql /docker-entrypoint-initdb.d/
