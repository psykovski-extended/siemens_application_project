#include "stdio.h"
#include <stdlib.h>
#include <sys/stat.h>

int main (int argc, char **argv) {
    // check if there are enough arguments
    if(argc < 2) {
        printf("To few arguments parsed. Need at least 1 to know which file needs to be read.");
        return 1;
    } else if(argc > 2) {
        printf("To many arguments parsed. Only 1 required: filepath.");
        return 1;
    }

    // get filename
    char* filename = argv[1];

    // create pointer to file, read binary
    FILE* bin_file = fopen(filename, "rb");

    // filename invalid?
    if(!bin_file) {
        printf("Error: File not found: %s", filename);
        return 1;
    }

    // stores file stats
    struct stat file_stats;

    // get file stats and check if filename was valid
    if(stat(filename, &file_stats) == -1) {
        printf("Error: File not found: %s", filename);
        return 1;
    }

    char ch; // current 8 bit buffer
    int found_index = -1; // index of first one

    int byte = 0; // tells me, at which byte we are

    while((ch = fgetc(bin_file)) != EOF) { // read each char in the file until EOF is reached
        for(short i = 0; i < 8; i++) { // shifting bit from position 0 to 7
            if((1 << i) & (ch)) { // if logical AND evaluates to true, a set bit is found
                found_index = (byte * 8) + i; // calculating the index
                fclose(bin_file); // close file

                printf("%d\n", found_index); // print the found index
                return 0; // terminate program
            }
        }
        ++ byte; // increment byte counter
    }

    printf("%d\n", found_index); // if nothing got found, print -1 to indicate that there are no 1s in the file

    fclose(bin_file); // close file

    return 0;
}
