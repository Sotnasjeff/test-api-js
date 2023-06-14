FROM postgres:14.5-alpine

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=root

RUN apk update && apk add --no-cache postgresql-client

EXPOSE 5432

COPY init-db.sh /docker-entrypoint-initdb.d/

CMD ["postgres"]

HEALTHCHECK CMD ["pg_isready", "-U", "root"]