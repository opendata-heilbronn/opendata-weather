#!/bin/bash

for file in lastdays/*.png 
do

filename=$(basename "$file")

convert $file -transparent '#BDBDBD' -transparent '#FFF' -  | composite rainradar_shape.png - $filename
done
