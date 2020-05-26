#!/bin/bash
ROOT_PATH=$(dirname "$0")

# verify api status
if curl http://192.168.1.19:3000/api-status | grep -c "1"; then
    
    # run the tests
    newman run ${ROOT_PATH}/teste.collection.json -e ${ROOT_PATH}/pr.environment.json --suppress-exit-code 1
else
    printf "Sem teste"
fi