document.addEventListener('DOMContentLoaded', (event) => {
    // Tạo đối tượng Audio
    const audioWellcome = new Audio('../voice-1.mp3');
    const audioSuccess = new Audio('../voice-2.mp3');
    const audioFalse = new Audio('../voice-3.mp3');

    // Đặt tốc độ phát của voice-1 nhanh hơn
    audioWellcome.playbackRate = 1.25; // Ví dụ: phát nhanh hơn 1.5 lần

    // Lấy phần tử input
    const inputElement = document.getElementById('inputData');

    // Lắng nghe sự kiện 'input'
    inputElement.addEventListener('input', (event) => {
        // Phát âm thanh
        audioWellcome.play();
    });

    // Hàm phát âm thanh và trả về một Promise
    const playAudio = (audio) => {
        return new Promise((resolve) => {
            audio.play();
            audio.onended = resolve;
        });
    };

    document.getElementById('conForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Ngăn không cho form submit mặc định

        // Lấy giá trị từ ô input
        const inputData = document.getElementById('inputData').value;

        // Tạo payload để gửi đến API
        const payload = {
            "EmperiaCode": inputData
        };

        console.log(payload);

        // Gửi dữ liệu đến API
        fetch('https://gate.rx-vietnamshows.com/cof-check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Hiện trạng thái data
            document.getElementById('checkErr').textContent = '<----------- Data Success ----------->';

            // Mở link với dữ liệu nhận được từ API
            const receivedData = data.data.result;

            if (receivedData !== 0 && receivedData !== "") {
                console.log(receivedData);
                // Chờ đợi audioWellcome phát xong rồi mới phát audioSuccess
                playAudio(audioWellcome).then(() => {
                    audioSuccess.play();
                    const popup = window.open(`https://port.rx-vietnamshows.com/barcode/?bcid=code39&text=${receivedData}&includetext&guardwhitespace&backgroundcolor=FFFFFF&padding=5&scale=2`, '_blank', 'width=600,height=400');

                    // Tự động đóng cửa sổ popup sau 3 giây
                    setTimeout(() => {
                        popup.close();
                    }, 1000);

                    // Xóa dữ liệu trong ô input
                    document.getElementById('inputData').value = '';
                });
            } else {
                document.getElementById('checkErr').textContent = '<----------- Data Fail ----------->';

                // Chờ đợi audioWellcome phát xong rồi mới phát audioFalse
                playAudio(audioWellcome).then(() => {
                    audioFalse.play();
                    // Xóa dữ liệu trong ô input
                    document.getElementById('inputData').value = '';
                });
            }
        })
        .catch((error) => {
            document.getElementById('checkErr').textContent = '<----------- Data Fail ----------->';

            // Chờ đợi audioWellcome phát xong rồi mới phát audioFalse
            playAudio(audioWellcome).then(() => {
                audioFalse.play();
                // Xóa dữ liệu trong ô input
                document.getElementById('inputData').value = '';
            });

            console.error('Error:', error);
        });
    });
});
