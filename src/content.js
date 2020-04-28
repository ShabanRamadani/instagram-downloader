const buttonText = 'Download';
const buttonLoadingText = 'Downloading...';

window.onload = () => {
    setInterval(scanForVideos, 500);
};

const scanForVideos = () => {
    const videos = document.querySelectorAll('video:not([cal-appended])');

    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        let source = video.src;
        if (!source) {
            source = video.children[0] ? video.children[0].src : '';
        }
        video.setAttribute('cal-appended', true);
        if (source) {
            const parentHeight = video.parentElement.offsetHeight;
            const parentParentHeight = video.parentElement.parentElement.offsetHeight;
            const bottom = ((parentHeight - parentParentHeight) / 2) + 10;
            const button = document.createElement('button');
            button.textContent = buttonText;
            button.style.width = '120px';
            button.style.position = 'absolute';
            button.style.bottom = `${bottom}px`;
            button.style.zIndex = '100';
            button.style.left = '10px';
            button.style.backgroundColor = 'black';
            button.style.color = 'white';
            button.style.cursor = 'pointer';
            button.style.boxShadow = '0px 3px 3px #444';
            video.parentElement.prepend(button);
            button.addEventListener('click', () => downloadVideo(button, source));
        }
    }
};

const downloadVideo = async (el, url) => {
    el.disabled = 'disabled';
    el.textContent = buttonLoadingText;
    const data = await fetch(url).then(r => r.blob());
    el.disabled = false;
    el.textContent = buttonText;
    const blob = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = blob;
    link.setAttribute('download', retrieveNameFromVideoUrl(url));
    document.body.appendChild(link);
    link.click();
};

const retrieveNameFromVideoUrl = (url) => {
    url = url.split('?')[0].split('/');
    return url[url.length - 1];
};
