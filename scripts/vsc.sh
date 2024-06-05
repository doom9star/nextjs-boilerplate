#!/bin/bash

if [ $1 == "zeus:server" ]
then
    cd zeus/
    npm run dev
elif [ $1 == "zeus:studio" ]
then
    cd zeus/
    npm run studio
elif [ $1 == "apollo:server" ]
then
    cd apollo/
    npm run dev
elif [ $1 == "postgres" ]
then
    PGPASSWORD='karthik' psql -h localhost -U karthik -d postgres
fi