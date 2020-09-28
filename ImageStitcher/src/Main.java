import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;

public class Main {
    public static void main(String args[]) throws IOException {
        new UserInteraction();
    }

    // combines chooseDirectory() and fileArray()
    public static void stitchFolder() throws IOException{
        stitch(fileArray(chooseDirectory()));
    }
    // chooses directory
    public static File chooseDirectory() {
        JFileChooser chooser = new JFileChooser();
        chooser.setFileSelectionMode(JFileChooser.FILES_AND_DIRECTORIES);
        chooser.setAcceptAllFileFilterUsed(false);
        if (chooser.showOpenDialog(null) == JFileChooser.APPROVE_OPTION) {
            return chooser.getSelectedFile();
        } else {
            return null;
        }
    }
    // returns list of files in directory as file objects in array
    public static File[] fileArray(File f) {
        String[] stringFiles = f.list();
        File[] listFiles = new File[stringFiles.length];
        Arrays.sort(stringFiles);
        for(int i = 0; i < listFiles.length; i++) {
            listFiles[i] = new File(f.toString() + File.separator + stringFiles[i]);
        }
        return listFiles;
    }

    // stitches array image files and saves it
    public static void stitch(File[] f) throws IOException {
        // sets height and width of stitched image
        int yOffSet = 0, width = ImageIO.read(f[0]).getWidth(), height = 0;
        for(int c = 0; c < f.length;c++) {
            height += ImageIO.read(f[c]).getHeight();
        }
        BufferedImage newImage = new BufferedImage (width, height, BufferedImage.TYPE_INT_ARGB);
        int totalNumImages = f.length;
        for(int a = 0; a < totalNumImages; a++){
            BufferedImage sourceImage = ImageIO.read(f[a]);
            int heightCur = sourceImage.getHeight();
            if(a > 0) {
                yOffSet += ImageIO.read(f[a-1]).getHeight();
            }
            if(a == 0){
                yOffSet = 0;
            }
            // copies image colours for current image onto newImage
            for(int y = 0; y < heightCur; y++) {
                for(int x = 0; x < width; x++) {
                    int p = sourceImage.getRGB(x, y);

                    newImage.setRGB(x, y + yOffSet, p);
                }
            }
        }
        // saves image in folder created
        String savePath = System.getProperty("user.home") +  File.separator + "StitchedImages";
        File saveDirectory = new File(savePath);

        DateTimeFormatter date = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss");
        LocalDateTime currentDate = LocalDateTime.now();

        if(!saveDirectory.exists()){
            saveDirectory.mkdir();
        }
        try{
            File u = new File(savePath + File.separator + "stitched" + currentDate.format(date) + ".png");
            ImageIO.write(newImage,"png",u);
        }catch(IOException e){
            System.out.println("Error: " + e);
        }
    }
    public static File chooseFile() {
        JFileChooser chooser = new JFileChooser();
        FileNameExtensionFilter filter = new FileNameExtensionFilter("Image File", "jpg", "png");
        chooser.setFileFilter(filter);
        int returnVal = chooser.showOpenDialog(null);
        if(returnVal == JFileChooser.APPROVE_OPTION) {
            return chooser.getSelectedFile();
        }
        else{
            return null;
        }
    }

    public static void imgCrop(int xPosOne, int yPosOne, int xPosTwo, int yPosTwo, BufferedImage buffImage, String saveName){
        if(xPosOne > xPosTwo) {
            int temp = xPosOne;
            xPosTwo = xPosOne;
            xPosOne = temp;
        }
        if(yPosOne > yPosTwo) {
            int temp = yPosOne;
            yPosTwo = yPosOne;
            yPosOne = temp;
        }
        BufferedImage cropImage = new BufferedImage((xPosTwo-xPosOne), (yPosTwo-yPosOne), BufferedImage.TYPE_INT_ARGB);
        for(int y = yPosOne, yt = 0; y < yPosTwo; y++, yt++) {
            for(int x = xPosOne, xt = 0; x < xPosTwo; x++, xt++) {
                int curColour = buffImage.getRGB(x, y);
                cropImage.setRGB(xt, yt, curColour);
            }
        }
        String savePath = System.getProperty("user.home") +  File.separator + "CroppedImages";
        File saveDirectory = new File(savePath);

        if(!saveDirectory.exists()){
            saveDirectory.mkdir();
        }

        //DateTimeFormatter date = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss");
        //LocalDateTime currentDate = LocalDateTime.now();
        try{
            File u = new File(savePath + File.separator + saveName + ".png");
            ImageIO.write(cropImage,"png",u);
        }catch(IOException e){
            System.out.println("Error: " + e);
        }
    }
}
