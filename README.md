#Image Stitcher

##How to run

1. Download jar file at https://github.com/hpnrep6/ImageStitcher/raw/master/ImageStitcher/out/artifacts/ImageStitcherV2_jar/ImageStitcherV2.jar
2. Run the jar file

##Known bugs and issues
- Breaks if a directory is located within the selected folder containing the images for stitching
- Breaks if a file does not contain a "." in its name
- Uses Java's Arrays.sort() method to sort the files, so every file must have the same number of leading zeros for them to be stitched in order
