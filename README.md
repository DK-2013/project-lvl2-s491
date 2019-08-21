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
$ gendiff -h
```
[![asciicast](https://asciinema.org/a/fkp6eo9HCLh4SxRc6oPFrG8In.svg)](https://asciinema.org/a/fkp6eo9HCLh4SxRc6oPFrG8In?speed=2&theme=monokai)

## Launch:
```sh
$ gendiff path1 path2
```
### for json
[![asciicast](https://asciinema.org/a/NyYJFNVOIaPxrafjRLpne2sNq.svg)](https://asciinema.org/a/NyYJFNVOIaPxrafjRLpne2sNq?speed=2&theme=monokai)
### for yaml
[![asciicast](https://asciinema.org/a/1JrH7MFkMkC8juQwVJZdI9Ifc.svg)](https://asciinema.org/a/1JrH7MFkMkC8juQwVJZdI9Ifc?speed=2&theme=monokai)
### for ini
[![asciicast](https://asciinema.org/a/s4gwPtJoH9u1scS40p8afwK3y.svg)](https://asciinema.org/a/s4gwPtJoH9u1scS40p8afwK3y?speed=2&theme=monokai)

NB about package ini: to got number from ini string use bug - singlequoted value, whithout comment(!)

## Output format
### plain
```sh
$ gendiff path1 path2 -f plain
```
[![asciicast](https://asciinema.org/a/aCUpmz3c3D4cYedgRR0CRkDKi.svg)](https://asciinema.org/a/aCUpmz3c3D4cYedgRR0CRkDKi?speed=2&theme=monokai)
### json
```sh
$ gendiff path1 path2 -f json
```
[![asciicast](https://asciinema.org/a/QvZNQbl1a5gnmXsCxmB5jqQN1.svg)](https://asciinema.org/a/QvZNQbl1a5gnmXsCxmB5jqQN1?speed=2&theme=monokai)

## Tests:
```sh
$ make test
```
[![asciicast](https://asciinema.org/a/ky9zjieSzGtcPpsvhurj49J7i.svg)](https://asciinema.org/a/ky9zjieSzGtcPpsvhurj49J7i?speed=2&theme=monokai)
