#!/bin/bash

set -e
set -u

mkdir -p fuzzylite/fuzzylite/release
cd fuzzylite/fuzzylite/release

# Usinga newer version than g++-4.8 will make this not run on ubuntu 14.04, as
# that only has GLIBCXX 3.4.19 available, and g++4.8 requires GLIBCXX >= 3.4.20
export CXX=${CXX:-$(which g++-4.8)}
cmake .. -G"Unix Makefiles" -DCMAKE_BUILD_TYPE=Release -DFL_BACKTRACE=ON -DFL_USE_FLOAT=OFF -DFL_CPP11=OFF
make
