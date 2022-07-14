  var T = document.getElementById("time").value;
  var sampling_rate = document.getElementById("sampling").value;
  var N = parseInt(T * sampling_rate);


  var xs = new Array(N).fill(0);
  var xs_window = new Array(N).fill(0);


  // Global variables for spectrogram
  var n_bines = document.getElementById("n_bines").value;
  var f_Nyquist = sampling_rate / 2;
  var N_bin = parseInt(N / n_bines);
  var my_X_real = new Array(N).fill(0);
  var my_X_imag = new Array(N).fill(0);
  var my_X_abs = new Array(N).fill(0);
  var n_max = parseInt(N_bin / 2)
  Plot();













  function Plot() {

      var fun = document.getElementById("func");
      var f1_fun = document.getElementById("f1");
      var f2_fun = document.getElementById("f2");
      T = document.getElementById("time").value;
      sampling_rate = document.getElementById("sampling").value;


      f_Nyquist = sampling_rate / 2;
      N = parseInt(T * sampling_rate);
      if ((Math.log(N) / Math.log(2)) % 1 != 0) {
          alert("The number of samples is the product of T and Sampling Rate, in this case it is: " + N.toString() + "\n\nPlease change T and/or Sampling Rate so that their multiplication is a power of 2");
      }
      var ts = new Array(N).fill(0);
      xs = new Array(N).fill(0);
      xs_window = new Array(N).fill(0);
      var frec = new Array(N / 2).fill(0);

      for (var n = 0; n < N; n += 1) {
          ts[n] = n / N * T;
      }
      var window = document.getElementById("window").value;
      for (var n = 0; n < N; n += 1) {
          var t = n / N * T;

          with(Math) {
              var f1 = eval(f1_fun.value);
              var f2 = eval(f2_fun.value);
              xs[n] = eval(fun.value);
              if (window == "Cosine") {
                  xs_window[n] = sin(PI * n / N) * eval(fun.value);
              } else if (window == "Hanning") {
                  xs_window[n] = 0.5 * (1 - cos(2 * PI * n / (N - 1))) * eval(fun.value);
              } else if (window == "Hamming") {
                  xs_window[n] = (0.53836 - .46164 * Math.cos(2 * Math.PI * n / (N - 1))) * eval(fun.value);
              } else if (window == "Blackman") {
                  xs_window[n] = (0.42 - .5 * Math.cos(2 * Math.PI * n / (N - 1)) + .08 * Math.cos(4 * Math.PI * n / (N - 1))) * eval(fun.value);

              } else if (window == "None") {
                  xs_window[n] = eval(fun.value);
              }
          }
      }




      var my_x = [...xs_window];

      fft = FFT(my_x);
      my_X_real = new Array(my_x.length / 2).fill(0);
      my_X_imag = new Array(my_x.length / 2).fill(0);
      my_X_abs = new Array(my_x.length / 2).fill(0);
      for (var i = 0; i < N / 2; i += 1) {
          my_X_real[i] = fft[i].re;
          my_X_imag[i] = fft[i].im;
          if (document.getElementById("logscale").checked) {
              my_X_abs[i] = Math.log10(Math.sqrt(fft[i].re * fft[i].re + fft[i].im * fft[i].im));
          } else {
              my_X_abs[i] = Math.sqrt(fft[i].re * fft[i].re + fft[i].im * fft[i].im);
          }
          frec[i] = i / T;
      }


      var layout1 = {
          xaxis: {
              //   range: [0, N],
              title: "Time (s)"
          },
          yaxis: {
              //    range: [-1, 1],
              title: "x(t)"
          },
          title: "Samples in Time Domain for Selected Bin"
      };
      var data1 = [{
          x: ts,
          y: xs_window,
          mode: "lines+markers"
      }];

      var layout2 = {
          xaxis: {
              //   range: [0, N],
              title: "Frequency (Hz)"
          },
          yaxis: {
              //    range: [-1, 1],
              title: "FFT{x(t)}"
          },
          title: "FFT"
      };


      var trace1 = {
          x: frec,
          y: my_X_real,
          mode: 'lines+markers',
          marker: {
              color: 'green',
              size: 2,
              line: {
                  color: 'green',
                  width: 1
              },
              type: 'scatter',
              name: 'Real'
          }
      }
      var trace2 = {
          x: frec,
          y: my_X_imag,
          mode: 'lines+markers',
          marker: {
              color: 'red',
              size: 2,
              line: {
                  color: 'red',
                  width: 1
              },
              type: 'scatter',
              name: 'Imag'
          }
      }
      var trace3 = {
          x: frec,
          y: my_X_abs,
          mode: 'lines+markers',
          marker: {
              color: 'red',
              size: 2,
              line: {
                  color: 'red',
                  width: 1
              },
              type: 'scatter',
              name: 'Abs'
          }
      }

      if (document.getElementById('check1').checked) {
          data2 = [trace1];

      } else if (document.getElementById('check2').checked) {
          data2 = [trace2];
      } else if (document.getElementById('check3').checked) {
          data2 = [trace3];
      }


      Plotly.newPlot("plot1", data1, layout1);
      Plotly.newPlot("plot2", data2, layout2);
      Plot_Spectogram();

  }



  function onlyOne(checkbox) {
      var checkboxes = document.getElementsByName('check');
      checkboxes.forEach((item) => {
          if (item !== checkbox) item.checked = false
      })
      Plot();

  }

  function Plot_Spectogram() {

      console.log("new call to Plot_Spectogram");
      var full_x = new Array(xs.length);
      full_x = [...xs];


      n_bines = document.getElementById("n_bines").value;


      N_bin = parseInt(N / n_bines);
      if ((Math.log(N_bin) / Math.log(2)) % 1 != 0) {
          alert("Numero de muestras " + N_bin.toString() + " debe ser potencia de 2");
      }
      var x_bin = new Array(N_bin).fill(0);
      X_abs_bin = new Array(N_bin).fill(0);
      var bin_muestra = document.getElementById("bin_muestra").value;

      if (bin_muestra > (n_bines - 1) || bin_muestra < 0) {
          alert("Bin de muestra fuera de rango");
      }
      var window = document.getElementById("window").value;
      for (var i = 0; i < N_bin; i += 1) {
          if (window == "Cosine") {
              x_bin[i] = full_x[bin_muestra * N_bin + i] * Math.sin(Math.PI * i / (N_bin - 1));
          } else if (window == "Hanning") {
              x_bin[i] = full_x[bin_muestra * N_bin + i] * 0.5 * (1 - Math.cos(2 * Math.PI * i / (N_bin - 1)));
          } else if (window == "Hamming") {
              x_bin[i] = full_x[bin_muestra * N_bin + i] * (0.53836 - .46164 * Math.cos(2 * Math.PI * i / (N_bin - 1)));
          } else if (window == "Blackman") {
              x_bin[i] = full_x[bin_muestra * N_bin + i] * (0.42 - .5 * Math.cos(2 * Math.PI * i / (N_bin - 1)) + .08 * Math.cos(4 * Math.PI * i / (N_bin - 1)));

          } else if (window == "None") {
              x_bin[i] = full_x[bin_muestra * N_bin + i];
          }
      }


      var ts_bin = new Array(N_bin).fill(0);

      for (var i = 0; i < N_bin; i += 1) {
          ts_bin[i] = bin_muestra / n_bines * T + i / N_bin * T /
              n_bines;
      }
      var layout_bin = {
          xaxis: {
              //   range: [0, N],
              title: "Time (s)"
          },
          yaxis: {
              //    range: [-1, 1],
              title: "x(t)"
          },
          title: "Samples in Time Domain for the Bin Selected"
      };
      var trace_bin = {
          x: ts_bin,
          y: x_bin,
          mode: 'lines+markers',
          marker: {
              color: 'blue',
              size: 4,
              line: {
                  color: 'green',
                  width: 1
              },
              type: 'scatter',
              name: 'my_X_abs'
          }
      }
      data_bin = [trace_bin];
      Plotly.newPlot("plot3", data_bin, layout_bin);



      var imageSpectrogram = new Array(n_bines).fill(0);
      var window = document.getElementById("window").value;
      for (var bin = 0; bin < n_bines; bin += 1) {
          var x_bin = new Array(N_bin).fill(0);


          for (var i = 0; i < N_bin; i += 1) {
              if (window == "Cosine") {
                  x_bin[i] = full_x[bin * N_bin + i] * Math.sin(Math.PI * i / N_bin);
              } else if (window == "Hanning") {
                  x_bin[i] = full_x[bin * N_bin + i] * 0.5 * (1 - Math.cos(2 * Math.PI * i / (N_bin - 1)));
              } else if (window == "Hamming") {
                  x_bin[i] = full_x[bin * N_bin + i] * (0.53836 - .46164 * Math.cos(2 * Math.PI * i / (N_bin - 1)));
              } else if (window == "Blackman") {
                  x_bin[i] = full_x[bin * N_bin + i] * (0.42 - .5 * Math.cos(2 * Math.PI * i / (N_bin - 1)) + .08 * Math.cos(4 * Math.PI * i / (N_bin - 1)));

              } else if (window == "None") {
                  x_bin[i] = full_x[bin * N_bin + i];
              }
          }



          fft = FFT(x_bin);

          frec = new Array(N_bin / 2).fill(0);
          var tiempo = new Array(n_bines).fill(0);
          my_X_abs = new Array(x_bin.length / 2).fill(0);
          for (var i = 0; i < N_bin / 2; i += 1) {
              if (document.getElementById("logscale").checked) {
                  my_X_abs[i] = Math.log10(Math.sqrt(fft[i].re * fft[i].re + fft[i].im * fft[i].im));
              } else {
                  my_X_abs[i] = Math.sqrt(fft[i].re * fft[i].re + fft[i].im * fft[i].im);
              }
              frec[i] = i / (T / n_bines);

          }
          imageSpectrogram[bin] = my_X_abs;



      }
      var tiempo = new Array(n_bines).fill(0);
      for (var n = 0; n < n_bines; n += 1) {
          tiempo[n] = n / n_bines * T;
      }
      var data = [{
          z: imageSpectrogram,
          type: 'heatmap',
          xtype: "array",
          x: tiempo,
          ytype: "array",
          y: frec

      }];

      var layout_bin = {
          xaxis: {
              //   range: [0, N],
              title: "Time (s)"
          },
          yaxis: {
              //    range: [-1, 1],
              title: "Frequency (Hz)"
          },
          title: "Spectrogram"
      }
      Plotly.newPlot('plot4', data, layout_bin);
      var update = {
          "transpose": true
      };

      Plotly.restyle('plot4', update, 0);

  }