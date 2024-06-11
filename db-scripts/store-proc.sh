#!/bin/bash
# A script to set up the testing docker instance
#
# @owner hunterbrodie

cd /app

############################
# Store procedure on MySQL #
############################
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_DB < ./db-scripts/reset-proc.sql

#######################
# Run Jest Test Suite #
#######################
npm install --prefix ./server
npm install && npm run test
