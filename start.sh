#!/bin/sh

loading_animation() {
    local pid=$1
    local delay=0.1
    spin_chars="/ - \\ |"

    while kill -0 $pid 2>/dev/null; do
        for char in $spin_chars; do
            printf "\rLoading %s" "$char"
            sleep $delay
        done
    done
    printf "\rDone!                     \n"
}

echo "Installing required dependencies..."
npm install > /dev/null 2>&1 &
npm_pid=$!

loading_animation $npm_pid

echo "Starting Modal..."
node index.js
