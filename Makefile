

clean:
	@ rm lib/*.js

compile:
	@exec coffee --compile --bare -o lib/ lib/coffee/*.coffee

watch:
	@exec coffee --compile --bare --watch -o lib/ lib/coffee/*.coffee &

