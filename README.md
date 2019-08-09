[![Build Status](https://travis-ci.com/DK-2013/project-lvl2-s491.svg?branch=master)](https://travis-ci.com/DK-2013/project-lvl2-s491)

##
# Shows a difference for two configuration files.
##

## Setup:
```sh
$ git clone https://github.com/DK-2013/project-lvl2-s491 root
$ cd root
$ npm i
$ make build
$ npm link
```
[![asciicast](https://asciinema.org/a/33NumPtuEby83gUVb8GpfOt15.svg)](https://asciinema.org/a/33NumPtuEby83gUVb8GpfOt15?speed=2&theme=monokai)

## Launch:
```sh
$ gendiff path1 path2
```
### for json
[![asciicast](https://asciinema.org/a/hXXM4xTpbNi0YaTEGeWByZnPC.svg)](https://asciinema.org/a/hXXM4xTpbNi0YaTEGeWByZnPC?speed=2&theme=monokai)
### for yaml
[![asciicast](https://asciinema.org/a/vmh9Yao9bCRpvcQydgWxD4avU.svg)](https://asciinema.org/a/vmh9Yao9bCRpvcQydgWxD4avU?speed=2&theme=monokai)
### for ini
[![asciicast](https://asciinema.org/a/IX04ezH2177B2o9V6x3ZjQdNe.svg)](https://asciinema.org/a/IX04ezH2177B2o9V6x3ZjQdNe?speed=2&theme=monokai)

NB about package ini: to got number from ini string use bug - singlequoted value, whithout comment(!)
