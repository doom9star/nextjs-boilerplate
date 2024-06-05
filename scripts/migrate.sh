#!/bin/bash

cd zeus
npm run sync

cd ../
cp -f ./zeus/prisma/schema.prisma ./apollo/prisma/

cd apollo
npm run gen