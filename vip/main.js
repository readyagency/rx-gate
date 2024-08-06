document.addEventListener('DOMContentLoaded', (event) => {
    // Tạo đối tượng Audio
    const audioWellcome = new Audio('../voice-wellcome-vip.mp3');
    const audioFalse = new Audio('../voice-false.mp3');
    const audioNotVIP = new Audio('../voice-not-vip.mp3');
    // Đặt tốc độ phát của voice-1 nhanh hơn
    audioWellcome.playbackRate = 1.25;

    // Lấy phần tử input
    const inputElement = document.getElementById('inputData');

    // Lắng nghe sự kiện 'input'
    inputElement.addEventListener('input', (event) => {
        // Phát âm thanh
        audioWellcome.play();
    });

    async function sendData(event) {
        event.preventDefault(); // Ngăn form submit mặc định

        // Lấy giá trị từ ô input
        const inputData = document.getElementById('inputData').value;

        // Tạo payload để gửi đến API
        const payload = {
            "EmperiaCode": inputData
        };

        try {
            // Gửi dữ liệu đến API
            const response = await fetch('https://gate.rx-vietnamshows.com/vip-check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log('Kết quả trả về từ API:', result.data.result);
            const enData = result.data.result;

            if (enData && enData !== 0) {
                audioNotVIP.play();
            }

            if (response.ok) {
                // Nếu phản hồi thành công, hiển thị popup với ảnh
                openPopup(textValue);
            } else {
                console.error('Phản hồi không thành công:', response.statusText);
                audioFalse.play();
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
            audioNotVIP.play();
        }
    }

    function openPopup(textValue) {
        const imageUrl = `https://port.rx-vietnamshows.com/barcode/?bcid=code39&text=${encodeURIComponent(textValue)}&includetext&guardwhitespace`;
        document.getElementById('popupImage').src = imageUrl;
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('popup').style.display = 'block';

        // Đặt timeout để tự đóng popup sau 1 giây
        setTimeout(closePopup, 1000);

        // Xóa dữ liệu trong ô input
        document.getElementById('inputData').value = '';
    }

    function closePopup() {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('popup').style.display = 'none';
    }

    document.getElementById('dataForm').addEventListener('submit', sendData);
    document.getElementById('closePopupBtn').addEventListener('click', closePopup);
});