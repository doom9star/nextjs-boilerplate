#!/bin/bash

if command -v psql &> /dev/null; then
    echo "✔ postgreSQL"

    if command -v redis-server &> /dev/null; then
        echo "✔ redis"
        echo

        echo "project name: "
        read project

        while true; do
            echo "Do you want to create database? (Y/N): "
            read answer

            if [[ "$answer" == "y" ]]; then
                echo "database name: "
                read database
                createdb "$database"
                echo "✔ database"
                break
            elif [[ "$answer" == "n" ]]; then
                echo "✔ database"
                break
            else
                echo "Please enter 'Y' or 'N'."
            fi
        done

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

        echo "✔ setup completed successfully!"
    else
        echo "redis is not installed, please install it before proceeding."
    fi
else
    echo "postgreSQL is not installed, please install it before proceeding."
fi