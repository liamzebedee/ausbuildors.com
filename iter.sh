set -ex
./v3/build.sh
git add -A && git commit -m . && git push
