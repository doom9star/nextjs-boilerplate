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

        /bin/sed -i "s#\[user\]#$user#g" scripts/vsc.sh
        /bin/sed -i "s#\[password\]#$password#g" scripts/vsc.sh
        /bin/sed -i "s#\[database\]#$database#g" scripts/vsc.sh

        echo
        echo "✔ database"
        echo

        cd zeus 
        cp -f .env.template .env
        rm .env.template
        /bin/sed -i "s#\[user\]#$user#g" .env
        /bin/sed -i "s#\[password\]#$password#g" .env
        /bin/sed -i "s#\[database\]#$database#g" .env
        npm install
        echo
        echo "✔ zeus modules installed successfully!"
        echo

        cd ../apollo
        cp -f .env.template .env
        rm .env.template
        /bin/sed -i "s#\[user\]#$user#g" .env
        /bin/sed -i "s#\[password\]#$password#g" .env
        /bin/sed -i "s#\[database\]#$database#g" .env
        npm install
        echo
        echo "✔ apollo modules installed successfully!"
        echo

        cd ../
        source scripts/migrate.sh

        echo "repository setup"
        read -p "url: " url
        rm -rf .git
        git init
        git remote add origin url
        git add .
        git commit -m "inital commit!"

        echo
        echo "✔ repository initialized successfully!"
        echo
        echo "✔ setup completed successfully!"
    else
        echo "redis is not installed, please install it before proceeding."
    fi
else
    echo "postgreSQL is not installed, please install it before proceeding."
fi

echo