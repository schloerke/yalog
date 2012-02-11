

clean:
	@ rm lib/*.js

compile:
	@exec coffee --compile --bare -o lib/ lib/coffee/*.coffee

watch:
	@exec coffee --compile --bare --watch -o lib/ lib/coffee/*.coffee &

run-examples:
	@ echo '';echo '-- Simple';node examples/simple.js; echo '';echo '-- Medium'; node examples/medium.js; echo '';echo '-- File'; node examples/file_utilization.js; echo '';echo '-- Max'; node examples/max_utilization.js

