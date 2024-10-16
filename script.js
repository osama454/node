import pkg from 'crunker';
const { mergeAudio, sliceAudio } = pkg;

// Assuming you have audio buffers 'buffer1' and 'buffer2'
const mergedAudio = mergeAudio([buffer1, buffer2]);

// Slice 'mergedAudio' from seconds 2 to 5
const slicedAudio = sliceAudio(mergedAudio, 2, 5);

