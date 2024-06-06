#!/bin/bash

############################
# Store procedure on MySQL #
############################
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_DB < /reset-proc.sql

#######################
# Run Jest Test Suite #
#######################
npm install --prefix /server
npm install --prefix /test && npm run test --prefix /test
