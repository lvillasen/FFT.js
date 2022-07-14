function FFT(signal) {
    if (signal.length == 1)
        return signal;
    var halfLength = signal.length / 2;
    var even = [];
    var odd = [];
    even.length = halfLength;
    odd.length = halfLength;
    for (var i = 0; i < halfLength; ++i) {
        even[i] = signal[i * 2];
        odd[i] = signal[i * 2 + 1];
    }
    even = FFT(even);
    odd = FFT(odd);
    for (var k = 0; k < halfLength; ++k) {
        if (!(even[k] instanceof Complex))
            even[k] = new Complex(even[k], 0);
        if (!(odd[k] instanceof Complex))
            odd[k] = new Complex(odd[k], 0);
        var a = Math.cos(2 * Math.PI * k / signal.length);
        var b = Math.sin(-2 * Math.PI * k / signal.length);
        //var sigma_k = new Complex(Math.cos(2 * Math.PI * k / signal.length), Math.sin(-2 * Math.PI * k / signal.length));
        var temp_k_real = odd[k].re * a - odd[k].im * b;
        var temp_k_imag = odd[k].re * b + odd[k].im * a;
        var A_k = new Complex(even[k].re + temp_k_real, even[k].im + temp_k_imag);
        var B_k = new Complex(even[k].re - temp_k_real, even[k].im - temp_k_imag);
        signal[k] = A_k;
        signal[k + halfLength] = B_k;
    }
    return signal;
}



function Complex(re, im) {
    this.re = re;
    this.im = im || 0.0;
}