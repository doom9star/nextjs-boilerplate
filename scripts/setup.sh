#!/bin/bash

if command -v psql &> /dev/null; then
    echo "✔ postgreSQL"

    if command -v redis-server &> /dev/null; then
        echo "✔ redis"
        echo

        echo "database setup"
        read -p "user: " user
        read -p "password: " password
        read -p "database: " database

        createdb "$database" 2>/dev/null

        /bin/sed -e "s#\[user\]#$user#g" -e "s#\[password\]#$password#g" -e "s#\[database\]#$database#g" scripts/vsc.sh

        echo
        echo "✔ database"
        echo

        cd zeus 
        cp -f .env.template .env
        rm .env.template
        /bin/sed -e "s#\[user\]#$user#g" -e "s#\[password\]#$password#g" -e "s#\[database\]#$database#g" .env
        npm install
        echo
        echo "✔ zeus modules installed successfully!"
        echo

        cd ../apollo
        cp -f .env.template .env
        rm .env.template
        /bin/sed -e "s#\[user\]#$user#g" -e "s#\[password\]#$password#g" -e "s#\[database\]#$database#g" .env
        npm install
        echo
        echo "✔ apollo modules installed successfully!"
        echo

        cd ../
        source scripts/migrate.sh
        echo
        echo "✔ database migrated successfully!"
        echo

        rm -rf .git
        git init
        git add .
        git commit -m "inital commit!"

        echo "✔ repository initialized successfully!"
        echo "✔ setup completed successfully!"
    else
        echo "redis is not installed, please install it before proceeding."
    fi
else
    echo "postgreSQL is not installed, please install it before proceeding."
fi

echo