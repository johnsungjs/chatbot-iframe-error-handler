#!/bin/bash

npm run build &&
scp -r dist root@10.190.9.2:/data/mila-2024-dev/chat-iframe-mobile &&
echo "deploy success"
