.PHONY: build

# variables
BIN=./node_modules/.bin

# tasks
all: build

build: clean
	$(BIN)/webpack

clean:
	@rm -rf build/

server:
	$(BIN)/webpack-dev-server
