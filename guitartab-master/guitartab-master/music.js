// 首先要获取到dom元素并创建ctx画笔
const audio_el = document.querySelector('audio')
const canvas = document.querySelector('canvas');
const video = document.querySelector('video');
const ctx = canvas.getContext('2d')

// 创建初始化画布函数（设置画布倍率像素）
const init_Canvas = () =>{
    canvas.width = (window.innerWidth / 2) * devicePixelRatio;
    canvas.height = (window.innerHeight / 2) * devicePixelRatio;
} 
init_Canvas();

let _default = false;
let dataArray, analayer;

// 监听音频播放器的onplay事件 
audio_el.onplay = () => {
    if (_default) return;
    const audio_context = new AudioContext();
    const source = audio_context.createMediaElementSource(audio_el);
    analayer = audio_context.createAnalyser(); analayer.fftSize = 512;
    dataArray = new Uint8Array(analayer.frequencyBinCount);
    source.connect(analayer);
    analayer.connect(audio_context.destination);
    _default = true;
}

//  设置音频条的动态颜色函数
const lineColor = (x, y, dx, dy) => {
    let linearGradient = ctx.createLinearGradient(x, 0, dx, 0)
    linearGradient.addColorStop(0, "#1b07ff")
    linearGradient.addColorStop(1,"#ff0000")
    return linearGradient
}

// 设置画布函数
const draw = () => {
    requestAnimationFrame(draw);
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    if (!_default) return;
    analayer.getByteFrequencyData(dataArray);
    const leng = dataArray.length / 2.5;
    const barwidth = width / leng;
    ctx.fillstyle = lineColor(0, height, width, -5);
    for (let i = 0; i < leng; i++) {
        const data = dataArray[i];
        const barHeight = data / 255 * height;
        const x = i * barWidth;
        const y = height - barHeight;
        const x_1 = i * barWidth + width / 2;
        const x_2 = width / 2 - (i + 1) * barWidth;
        ctx.fillRect(x_1, y, barWidth / 1.5, barHeight);
        ctx.fillRect(x_2, y, barwidth / 1.5, barHeight);
    }
}
draw()