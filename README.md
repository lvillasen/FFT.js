# FFT

Compact Fast Fourier transform function in JavaScript based on the Cooley–Tukey algorithm with a demo page that illustrates the use of window functions and a simple spectrogram.


## Demo

- Clone the repository
- Open the file index.html with any web browser


This demo also illustrates the use of window functions and a simple spectrogram.

## Live Demo

https://ciiec.buap.mx/FFT.js/

## Usage

   Assuming x is the time domain array of size N with the sampled data, where N is a power of 2, then


     fft = FFT(x);
  
     X_real = new Array(my_x.length / 2).fill(0);
  
     X_imag = new Array(my_x.length / 2).fill(0);
  
     X_abs = new Array(my_x.length / 2).fill(0);
  
     for (var i = 0; i < N / 2; i += 1) {
  
         X_real[i] = fft[i].re;
      
         X_imag[i] = fft[i].im;
      
         X_abs[i] = Math.sqrt(fft[i].re * fft[i].re + fft[i].im * fft[i].im);
  
     }

where 

  fft is FFT{x} and X_real, X_imag and X_abs  are the frequency domain arrays containing the real, imaginary and absolute values, respectively. The size of fft is N and the size of the other arrays is N/2.


## Credits

- The FFT function was adapted from https://rosettacode.org/wiki/Fast_Fourier_transform#JavaScript

## License

[MIT](LICENSE)
