# Dockerfile for the testing docker instance
#
# @author hunterbrodie

FROM node:current-alpine3.19
RUN apk update
RUN apk add bash
RUN apk add mysql
RUN apk add mysql-client
RUN apk add mariadb-connector-c
