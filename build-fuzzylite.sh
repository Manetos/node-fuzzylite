#!/bin/bash

set -e
set -u

mkdir -p fuzzylite/fuzzylite/release
cd fuzzylite/fuzzylite/release

# We use g++-4.8 as >4.8 requires >= GLIBCXX 3.4.20, but only 3.4.19 is
# available on ubuntu 14.04
cmake .. -G"Unix Makefiles" -DCMAKE_CXX_COMPILER=$(which g++-4.8) -DCMAKE_BUILD_TYPE=Release -DFL_BACKTRACE=ON -DFL_USE_FLOAT=OFF -DFL_CPP11=OFF
make
