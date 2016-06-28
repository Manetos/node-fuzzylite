#!/bin/bash

set -e
set -u

mkdir -p fuzzylite/fuzzylite/release
cd fuzzylite/fuzzylite/release

# We require GLIBCXX >= 3.4.20, which is something you get with g++-4.8 and
# newer. Keep in mind that for example ubuntu 14.04 has a version of g++ that
# is too old.
cmake .. -G"Unix Makefiles" -DCMAKE_BUILD_TYPE=Release -DFL_BACKTRACE=ON -DFL_USE_FLOAT=OFF -DFL_CPP11=OFF
make
