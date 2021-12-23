rm -rf dist
parcel build html/*.html html/*.scss react/*.tsx chrome/*.ts
cp -r images dist/
cp manifest.json dist/
cp rules.json dist/