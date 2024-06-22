#!/bin/bash

if command -v psql &> /dev/null; then
    echo "✔ postgreSQL"

    if command -v redis-server &> /dev/null; then
        echo "✔ redis"
        echo

        read -p "database name: " database
        createdb "$database"
        echo "✔ database"

        cd zeus 
        cp -f .env.template .env
        rm .env.template
        npm install

        cd ../apollo
        cp -f .env.template .env
        rm .env.template
        npm install

        cd ../
        rm -rf .git
        git init
        git add .
        git commit -m "inital commit!"

        echo
        echo "✔ modules installed successfully!"
        echo "✔ repository initialized successfully!"
        echo "✔ setup completed successfully!"
    else
        echo "redis is not installed, please install it before proceeding."
    fi
else
    echo "postgreSQL is not installed, please install it before proceeding."
fi